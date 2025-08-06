import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

function DietForm({ diagnoses, onSubmit, value = [], onChange }) {
  const { t } = useTranslation();
  const [selectedDiagnoses, setSelectedDiagnoses] = useState(value || []);
  const [error, setError] = useState('');

  // Синхронизация с внешним value
  useEffect(() => {
    setSelectedDiagnoses(value);
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedDiagnoses(newValue);
    if (onChange) onChange(newValue);
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
          <Autocomplete
            multiple
            id="diagnosis-autocomplete"
            options={diagnoses || []}
            value={selectedDiagnoses}
            onChange={handleChange}
            getOptionLabel={(diagnosis) => diagnosis?.code ? t(`diagnoses.${diagnosis.code}`) : ''}
            isOptionEqualToValue={(option, value) => option?.code === value?.code}
            renderInput={(params) => (
              <TextField {...params} placeholder={t('selectPlaceholder')} />
            )}
            fullWidth
            disableCloseOnSelect
            sx={{ marginBottom: 2 }}
          />
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

