import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import DietForm from './components/DietForm';
import DietResult from './components/DietResult';
import LanguageSwitcher from './components/LanguageSwitcher';
import CustomDiagnosisGPT from './components/CustomDiagnosisGPT';
import diagnoses from './data/diagnoses.json';
import './App.css';
import About from './pages/About';
import DailyMenuPage from './pages/DailyMenuPage';


function intersect(arrays) {
  if (arrays.length === 0) return [];
  return arrays.reduce((a, b) => a.filter(x => b.includes(x)));
}

function union(arrays) {
  return Array.from(new Set(arrays.flat()));
}

const LOCAL_STORAGE_KEY = 'selectedDiagnoses';

function MainPage({ resultData, selectedDiagnoses, handleDiagnosesChange, handleSubmit }) {
  const { t } = useTranslation();
  return (
    <>
      <DietForm 
        diagnoses={diagnoses} 
        onSubmit={handleSubmit} 
        value={selectedDiagnoses}
        onChange={handleDiagnosesChange}
      />
      {resultData && <DietResult data={resultData} />}
      <div style={{ marginTop: 24 }}>
        <Link to="/custom">{t('cantFindDiagnosis')}</Link>
      </div>
      <footer style={{ marginTop: 40, textAlign: 'center' }}>
        <Link to="/about">{t('aboutProject')}</Link>
      </footer>
    </>
  );
}

function App() {
  const { t } = useTranslation();
  const [resultData, setResultData] = useState(null);
  const [selectedDiagnoses, setSelectedDiagnoses] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSelectedDiagnoses(parsed);
          handleSubmit(parsed);
        }
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selectedDiagnoses));
  }, [selectedDiagnoses]);

  const handleDiagnosesChange = (ids) => {
    setSelectedDiagnoses(ids);
  };

  const handleSubmit = (diagnosisIds) => {
    setSelectedDiagnoses(diagnosisIds);
    const selected = diagnoses.filter(d => diagnosisIds.includes(d.id));
    if (selected.length === 0) {
      setResultData(null);
      return;
    }
    const allowedFoods = intersect(selected.map(d => d.allowedFoods));
    const prohibitedFoods = union(selected.map(d => d.prohibitedFoods));
    const allPlans = selected.map(d => d.dailyPlan).flat();
    const filteredPlan = allPlans.filter(entry => {
      // entry.ingredients is now an array of ingredients
      // Исключаем блюда с запрещёнными продуктами
      if (prohibitedFoods.some(prod => entry.ingredients.includes(prod))) return false;
      // Оставляем блюда, где есть хотя бы один разрешённый продукт
      if (allowedFoods.length > 0) {
        const hasAllowed = allowedFoods.some(prod => entry.ingredients.includes(prod));
        if (!hasAllowed) return false;
      }
      return true;
    });
    const tooFewAllowed = allowedFoods.length === 0 || filteredPlan.length === 0;
    setResultData({
      allowedFoods,
      prohibitedFoods,
      dailyPlan: filteredPlan,
      tooFewAllowed,
      selectedIds: diagnosisIds
    });
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <div className="header-top">
            <Link to="/" className="logo-link">
              <img src="/newlogo.png" alt="EatLence" className="app-logo" />
            </Link>
            <LanguageSwitcher />
          </div>
          <div className="header-bottom">
            <h1 className="app-title" dangerouslySetInnerHTML={{ __html: t('title') }} />
          </div>
        </header>
        <main className="app-main">
          <Routes>
          <Route path="/" element={
            <MainPage 
              resultData={resultData}
              selectedDiagnoses={selectedDiagnoses}
              handleDiagnosesChange={handleDiagnosesChange}
              handleSubmit={handleSubmit}
            />
          } />
          <Route path="/daily-menu" element={<DailyMenuPage />} />
          <Route path="/custom" element={<>
            <Link to="/">← {t('backToMain')}</Link>
            <CustomDiagnosisGPT />
          </>} />
          <Route path="/about" element={<About />} />
        </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
