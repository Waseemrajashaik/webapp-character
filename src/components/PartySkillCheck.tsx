import React, { useState } from 'react';
import { Character, SkillName } from '../types';
import { SKILL_LIST } from '../consts';
import { getSkillTotal } from '../utils';

type PartySkillCheckState = {
  skill: SkillName;
  dc: number;
  rollResult: number | null;
  success: boolean | null;
  bestCharacterId: string | null;
};

type PartySkillCheckProps = {
  characters: Character[];
};

const PartySkillCheck: React.FC<PartySkillCheckProps> = ({ characters }) => {
  const [partySkillCheck, setPartySkillCheck] = useState<PartySkillCheckState>({
    skill: 'Acrobatics',
    dc: 10,
    rollResult: null,
    success: null,
    bestCharacterId: null,
  });

  const handleRollPartyCheck = () => {
    const { skill, dc } = partySkillCheck;
    let bestChar: Character | null = null;
    let bestScore = -999;

    characters.forEach((ch) => {
      const s = getSkillTotal(ch, skill);
      if (s > bestScore) {
        bestScore = s;
        bestChar = ch;
      }
    });

    if (!bestChar) return;

    const randomRoll = Math.floor(Math.random() * 20) + 1;
    const total = bestScore + randomRoll;
    const success = total >= dc;

    setPartySkillCheck((prev) => ({
      ...prev,
      rollResult: randomRoll,
      success,
      bestCharacterId: bestChar?.id || null,
    }));
  };

  return (
    <div>
      <h2>Party Skill Check</h2>
      <div className="section__flex section__flex--row">
        <div>
          <label htmlFor="party-skill">Skill: </label>
          <select
            id="party-skill"
            value={partySkillCheck.skill}
            onChange={(e) =>
              setPartySkillCheck((prev) => ({
                ...prev,
                skill: e.target.value as SkillName,
              }))
            }
          >
            {SKILL_LIST.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="party-dc">DC: </label>
          <input
            id="party-dc"
            type="number"
            value={partySkillCheck.dc}
            onChange={(e) =>
              setPartySkillCheck((prev) => ({
                ...prev,
                dc: parseInt(e.target.value, 10) || 0,
              }))
            }
          />
        </div>
        <button onClick={handleRollPartyCheck}>Roll (Party)</button>
      </div>

      {partySkillCheck.rollResult !== null && (
        <div className="party-check__result">
          <p>Roll: {partySkillCheck.rollResult}</p>
          <p>{partySkillCheck.success ? 'Success!' : 'Failure'}</p>
          {partySkillCheck.bestCharacterId && (
            <p>
              Used Character:{' '}
              {
                characters.find((c) => c.id === partySkillCheck.bestCharacterId)
                  ?.name
              }
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PartySkillCheck;
