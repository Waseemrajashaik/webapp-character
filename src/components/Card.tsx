import React from 'react';
import { Attributes, SkillName } from '../types';

type CardProps = {
  type: 'attribute' | 'skill';
  attr: keyof Attributes | SkillName;
  attrVal: number;
  modifier: number;
  onPlus: () => void;
  onMinus: () => void;
  total?: number;
};

const Card: React.FC<CardProps> = ({
  type,
  attr,
  attrVal,
  modifier,
  onPlus,
  onMinus,
  total,
}) => {
  return (
    <div className="counter">
      <button className="counter__btn counter__btn--minus" onClick={onMinus}>
        -
      </button>
      <div className="counter__stats">
        <span className="counter__title">
          {attr} {attrVal}
        </span>
        <span className="counter__desc">
          Mod: {modifier >= 0 ? `+${modifier}` : modifier}
          {type === 'skill' && total !== undefined && ` (Total: ${total})`}
        </span>
      </div>
      <button className="counter__btn counter__btn--plus" onClick={onPlus}>
        +
      </button>
    </div>
  );
};

export default Card;
