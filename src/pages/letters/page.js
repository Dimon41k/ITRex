import React from 'react';
import styles from './page.css';
import LettersComponent from './components/letters/letters';

function Letters() {
  return (
    <div className={styles.normal}>
      <LettersComponent />
    </div>
  );
}

export default Letters;
