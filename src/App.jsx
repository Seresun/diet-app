import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DietForm from './components/DietForm';
import DietResult from './components/DietResult';
import LanguageSwitcher from './components/LanguageSwitcher';
import diagnoses from './data/diagnoses.json';
import './App.css';

function App() {
  const { t } = useTranslation();
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);

  const handleSubmit = (diagnosisId) => {
    const diagnosis = diagnoses.find(d => d.id === diagnosisId);
    setSelectedDiagnosis(diagnosis);
  };

  return (
    <div className="app-container">
      <LanguageSwitcher />
      <h1 className="app-title">{t('title')}</h1>
      <DietForm diagnoses={diagnoses} onSubmit={handleSubmit} />
      {selectedDiagnosis && <DietResult data={selectedDiagnosis} />}
    </div>
  );
}

export default App;
