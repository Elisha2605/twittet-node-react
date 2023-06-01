import React from 'react';
import styles from './CharacterRing.module.css';

interface CharacterRingProps {
  maxCharacters: number;
  inputLength: number;
}

const CharacterRing: React.FC<CharacterRingProps> = ({ maxCharacters, inputLength }) => {
  const percentageFilled = (inputLength / maxCharacters) * 100;
  const circumference = 2 * Math.PI * 50;
  const offset = circumference - (percentageFilled / 100) * circumference;

  return (
    <svg className={styles.characterRing} viewBox="0 0 100 100">
      <circle className={styles.ringBackground} cx="50" cy="50" r="45" />
      <circle
        className={styles.ringFill}
        cx="50"
        cy="50"
        r="45"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={offset}
      />
    </svg>
  );
};

export default CharacterRing;
