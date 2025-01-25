import { useState } from 'react';
import { SkillName, Character, Attributes, Class } from '../types';
import {
  ATTRIBUTE_LIST,
  MAX_ATTRIBUTE_SUM,
  CLASS_LIST,
  SKILL_LIST,
} from '../consts';
import Card from './Card';
import {
  getAbilityModifier,
  getAttributesSum,
  meetsClassRequirements,
} from '../utils';

type CharacterCardProps = {
  character: Character;
  onAttributeChange: (
    charId: string,
    attr: keyof Attributes,
    change: number
  ) => void;
  onSkillChange: (charId: string, skill: SkillName, change: number) => void;
  onClassSelect: (cls: Class) => void;
  totalSkillPoints: number;
  spentSkillPoints: number;
};

const CharacterCard = ({
  character,
  onAttributeChange,
  onClassSelect,
  onSkillChange,
  totalSkillPoints,
  spentSkillPoints,
}: CharacterCardProps) => {
  const [skillCheck, setSkillCheck] = useState<{
    skill: SkillName;
    dc: number;
    rollResult: number | null;
    success: boolean | null;
  }>({
    skill: 'Acrobatics',
    dc: 10,
    rollResult: null,
    success: null,
  });

  const handleRollSkillCheck = () => {
    const { skill, dc } = skillCheck;
    const skillDef = SKILL_LIST.find((s) => s.name === skill);
    if (!skillDef) return;
    const skillPoints = character.skills[skill];
    const attrValue = character.attributes[skillDef.attributeModifier];
    const mod = getAbilityModifier(attrValue);

    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + skillPoints + mod;
    const success = total >= dc;

    setSkillCheck({
      ...skillCheck,
      rollResult: roll,
      success,
    });
  };

  return (
    <div className="character">
      <h2>{character.name}</h2>

      <div className="section">
        <h3>Attributes</h3>
        <section className="section__cards">
          {ATTRIBUTE_LIST.map((attr) => {
            const attrVal = character.attributes[attr];
            const modifier = getAbilityModifier(attrVal);
            return (
              <Card
                key={attr}
                type="attribute"
                onPlus={() => onAttributeChange(character.id, attr, 1)}
                onMinus={() => onAttributeChange(character.id, attr, -1)}
                attr={attr}
                attrVal={attrVal}
                modifier={modifier}
              />
            );
          })}
        </section>
        <p>
          Total Attributes: {getAttributesSum(character)} / {MAX_ATTRIBUTE_SUM}
        </p>
      </div>

      <div className="section">
        <h3>Classes</h3>
        <section className="section__cards">
          {(Object.keys(CLASS_LIST) as Class[]).map((cls) => {
            const meetsReqs = meetsClassRequirements(character, cls);
            return (
              <button
                key={cls}
                onClick={() => onClassSelect(cls)}
                className={`class-btn ${meetsReqs ? 'class-btn--met' : ''}`}
              >
                {cls}
              </button>
            );
          })}
        </section>
      </div>

      <section className="section">
        <h3>Skills (Remaining: {totalSkillPoints - spentSkillPoints})</h3>
        <section className="section__cards">
          {SKILL_LIST.map((skill) => {
            const pointsInSkill = character.skills[skill.name];
            const mod = getAbilityModifier(
              character.attributes[skill.attributeModifier]
            );
            const total = pointsInSkill + mod;
            return (
              <Card
                key={skill.name}
                type="skill"
                onPlus={() => onSkillChange(character.id, skill.name, 1)}
                onMinus={() => onSkillChange(character.id, skill.name, -1)}
                attr={skill.name}
                attrVal={pointsInSkill}
                modifier={mod}
                total={total}
              />
            );
          })}
        </section>
      </section>

      <section className="section">
        <h3>Skill Check</h3>
        <div className="section__flex">
          <div>
            <label htmlFor="Skill">Skill: </label>
            <select
              id="Skill"
              value={skillCheck.skill}
              onChange={(e) =>
                setSkillCheck({
                  ...skillCheck,
                  skill: e.target.value as SkillName,
                })
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
            <label htmlFor="DC">DC: </label>
            <input
              id="DC"
              type="number"
              value={skillCheck.dc}
              onChange={(e) => {
                const dc = parseInt(e.target.value, 10) || 0;
                setSkillCheck({
                  ...skillCheck,
                  dc,
                });
              }}
            />
          </div>
          <button onClick={handleRollSkillCheck}>Roll</button>
        </div>
        {skillCheck.rollResult !== null && (
          <div>
            <p>Roll: {skillCheck.rollResult}</p>
            <p>{skillCheck.success ? 'Success!' : 'Failure'}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default CharacterCard;
