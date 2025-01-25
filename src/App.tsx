import React, { useState } from 'react';
import './App.css';
import { Character, Attributes, Class, SkillName } from './types';
import {
  createInitialCharacter,
  getAttributesSum,
  getTotalSkillPoints,
  getSpentSkillPoints,
} from './utils';
import { ATTRIBUTE_LIST, CLASS_LIST, MAX_ATTRIBUTE_SUM } from './consts';
import CharacterCard from './components/CharacterCard';
import PartySkillCheck from './components/PartySkillCheck';
import { useCharactersApi } from './hooks';

function App() {
  const { characters, setCharacters, loading, error, saveCharacters } =
    useCharactersApi('waseemrajashaik');

  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  const handleAddCharacter = () => {
    const newChar = createInitialCharacter(
      `Character ${characters.length + 1}`
    );
    setCharacters((prev) => [...prev, newChar]);
  };

  const updateCharacter = (charId: string, updated: Partial<Character>) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === charId ? { ...c, ...updated } : c))
    );
  };

  const handleSave = () => {
    saveCharacters(characters);
  };

  const handleAttributeChange = (
    charId: string,
    attr: keyof Attributes,
    delta: number
  ) => {
    const character = characters.find((c) => c.id === charId);
    if (!character) return;

    const currentValue = character.attributes[attr];
    const newValue = currentValue + delta;
    if (newValue < 0) return;

    const oldSum = getAttributesSum(character);
    const newSum = oldSum + delta;
    if (newSum > MAX_ATTRIBUTE_SUM) return;

    updateCharacter(charId, {
      attributes: {
        ...character.attributes,
        [attr]: newValue,
      },
    });
  };

  const handleSkillChange = (
    charId: string,
    skillName: SkillName,
    delta: number
  ) => {
    const character = characters.find((c) => c.id === charId);
    if (!character) return;

    const oldValue = character.skills[skillName];
    const newValue = oldValue + delta;
    if (newValue < 0) return;

    const totalPoints = getTotalSkillPoints(character);
    const spent = getSpentSkillPoints(character);
    if (delta > 0 && spent + delta > totalPoints) {
      return;
    }

    updateCharacter(charId, {
      skills: {
        ...character.skills,
        [skillName]: newValue,
      },
    });
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Character Creator</h1>

      <div className="controls">
        <button className="btn" onClick={handleAddCharacter}>
          Add New Character
        </button>
        <button className="btn" onClick={handleSave}>
          Save Characters
        </button>
      </div>
      {loading && <p>Loading or saving data...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div className="layout">
        <section className="layout__left">
          {characters.map((char) => {
            return (
              <CharacterCard
                key={char.id}
                character={char}
                totalSkillPoints={getTotalSkillPoints(char)}
                spentSkillPoints={getSpentSkillPoints(char)}
                onAttributeChange={handleAttributeChange}
                onSkillChange={handleSkillChange}
                onClassSelect={(cls) => setSelectedClass(cls)}
              />
            );
          })}
        </section>

        <section className="layout__right">
          <PartySkillCheck characters={characters} />

          {selectedClass && (
            <div className="requirements">
              <h2>{selectedClass} Requirements</h2>
              <ul>
                {ATTRIBUTE_LIST.map((attr) => (
                  <li key={attr}>
                    {attr}: {CLASS_LIST[selectedClass][attr]}
                  </li>
                ))}
              </ul>
              <button onClick={() => setSelectedClass(null)}>Close</button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
