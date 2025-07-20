import React, { useState } from 'react';

function DietForm({ diagnoses, onSubmit }) {
  const [diagnosisId, setDiagnosisId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!diagnosisId) {
      setError('Пожалуйста, выберите диагноз');
      return;
    }
    
    onSubmit(diagnosisId);
  };

  return (
    <div className="diet-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            Выберите диагноз:
          </label>
          <select 
            className="form-select"
            value={diagnosisId} 
            onChange={(e) => setDiagnosisId(e.target.value)}
            required
          >
            <option value="" disabled>-- выберите диагноз --</option>
            {diagnoses.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={!diagnosisId}
        >
          Показать рекомендации
        </button>
      </form>
    </div>
  );
}

export default DietForm;

