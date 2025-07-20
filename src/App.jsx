import React, { useState } from 'react';
import DietForm from './components/DietForm';
import DietResult from './components/DietResult';
import diagnoses from './data/diagnoses.json';
import './App.css';

function App() {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);

  const handleSubmit = (diagnosisId) => {
    const diagnosis = diagnoses.find(d => d.id === diagnosisId);
    setSelectedDiagnosis(diagnosis);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Диета по диагнозу</h1>
      <DietForm diagnoses={diagnoses} onSubmit={handleSubmit} />
      {selectedDiagnosis && <DietResult data={selectedDiagnosis} />}
    </div>
  );
}

export default App;
