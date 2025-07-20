import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function DietForm({ diagnoses, onSubmit }) {
  const { t } = useTranslation();
  const [diagnosisId, setDiagnosisId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!diagnosisId) {
      setError(t('pleaseSelectDiagnosis'));
      return;
    }
    
    onSubmit(diagnosisId);
  };

  return (
    <div className="diet-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            {t('selectDiagnosis')}
          </label>
          <select 
            className="form-select"
            value={diagnosisId} 
            onChange={(e) => setDiagnosisId(e.target.value)}
            required
          >
            <option value="" disabled>{t('selectPlaceholder')}</option>
            {diagnoses.map(d => (
              <option key={d.id} value={d.id}>{t(`diagnoses.${d.id}`)}</option>
            ))}
          </select>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={!diagnosisId}
        >
          {t('showRecommendations')}
        </button>
      </form>
    </div>
  );
}

export default DietForm;

