import React, { useState, useEffect } from 'react';
import styles from './ToggleSwitch.module.css';

interface ToggleSwitchProps {
  onToggle: (value: boolean) => void;
  defaultChecked?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  onToggle,
  defaultChecked,
}) => {
  const [checked, setChecked] = useState(defaultChecked);

  useEffect(() => {
    setChecked(defaultChecked);
  }, [defaultChecked]);

  const handleToggle = () => {
    const newValue = !checked;
    setChecked(newValue);
    onToggle(newValue);
  };

  return (
    <div className={`${styles.toggleSwitch} ${checked ? styles.checked : ''}`}>
      <input
        type="checkbox"
        className={styles.toggleSwitchCheckbox}
        checked={checked}
        onChange={handleToggle}
        id="toggle-switch-checkbox"
      />
      <label className={styles.toggleSwitchLabel} htmlFor="toggle-switch-checkbox">
        <span className={styles.toggleSwitchInner} />
        <span className={styles.toggleSwitchSwitch} />
      </label>
    </div>
  );
};

export default ToggleSwitch;
