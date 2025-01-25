import { Attributes, Character, Class, SkillName, Skills } from '../types';
import { SKILL_LIST, ATTRIBUTE_LIST, CLASS_LIST } from '../consts';
import shortid from 'shortid';

export const createInitialCharacter = (name = 'New Character'): Character => {
  return {
    id: shortid.generate(),
    name,
    attributes: ATTRIBUTE_LIST.reduce<Attributes>((acc, attr) => {
      acc[attr] = 10;
      return acc;
    }, {} as Attributes),
    skills: SKILL_LIST.reduce<Skills>((acc, skill) => {
      acc[skill.name] = 0;
      return acc;
    }, {} as Skills),
  };
};

export const getAbilityModifier = (value: number) => {
  return Math.floor((value - 10) / 2);
};

export const getTotalSkillPoints = (character: Character) => {
  const intMod = getAbilityModifier(character.attributes.Intelligence);
  return 10 + 4 * intMod;
};

export const getSpentSkillPoints = (character: Character) => {
  return Object.values(character.skills).reduce((sum, val) => sum + val, 0);
};

export const meetsClassRequirements = (character: Character, cls: Class) => {
  const classReqs = CLASS_LIST[cls];
  for (const attr of ATTRIBUTE_LIST) {
    if (character.attributes[attr] < classReqs[attr]) {
      return false;
    }
  }
  return true;
};

export const getAttributesSum = (character: Character) => {
  return ATTRIBUTE_LIST.reduce(
    (sum, attr) => sum + character.attributes[attr],
    0
  );
};

export const getSkillTotal = (character: Character, skillName: SkillName) => {
  const skillDefinition = SKILL_LIST.find((s) => s.name === skillName);
  if (!skillDefinition) return 0;

  const abilityValue = character.attributes[skillDefinition.attributeModifier];
  const abilityMod = getAbilityModifier(abilityValue);
  return character.skills[skillName] + abilityMod;
};
