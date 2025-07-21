import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function DietForm({ diagnoses, onSubmit, value = [], onChange }) {
  const { t } = useTranslation();
  const [selectedDiagnoses, setSelectedDiagnoses] = useState(value);
  const [error, setError] = useState('');

  // Синхронизация с внешним value
  useEffect(() => {
    setSelectedDiagnoses(value);
  }, [value]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let updated;
    if (checked) {
      updated = [...selectedDiagnoses, value];
    } else {
      updated = selectedDiagnoses.filter((id) => id !== value);
    }
    setSelectedDiagnoses(updated);
    if (onChange) onChange(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (selectedDiagnoses.length === 0) {
      setError(t('pleaseSelectDiagnosis'));
      return;
    }
    onSubmit(selectedDiagnoses);
  };

  return (
    <div className="diet-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            {t('selectDiagnosis')}
          </label>
          <div className="checkbox-group">
            {diagnoses.map(d => (
              <label key={d.id} className="checkbox-label">
                <input
                  type="checkbox"
                  value={d.id}
                  checked={selectedDiagnoses.includes(d.id)}
                  onChange={handleCheckboxChange}
                />
                {t(`diagnoses.${d.id}`)}
              </label>
            ))}
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        <button 
          type="submit" 
          className="submit-button"
          disabled={selectedDiagnoses.length === 0}
        >
          {t('showRecommendations')}
        </button>
      </form>
    </div>
  );
}

export default DietForm;

