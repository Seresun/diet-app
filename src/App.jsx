import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import DietForm from './components/DietForm';
import DietResult from './components/DietResult';
import LanguageSwitcher from './components/LanguageSwitcher';
import CustomDiagnosisGPT from './components/CustomDiagnosisGPT';
import './App.css';
import About from './pages/About';
import DailyMenuPage from './pages/DailyMenuPage';
import apiService from './services/api';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

function intersect(arrays) {
  if (!arrays || arrays.length === 0) return [];
  const validArrays = arrays.filter(arr => Array.isArray(arr));
  if (validArrays.length === 0) return [];
  return validArrays.reduce((a, b) => a.filter(x => b.includes(x)));
}

function union(arrays) {
  if (!arrays || arrays.length === 0) return [];
  const validArrays = arrays.filter(arr => Array.isArray(arr));
  return Array.from(new Set(validArrays.flat()));
}

const LOCAL_STORAGE_KEY = 'selectedDiagnoses';

function MainPage({ resultData, selectedDiagnoses, handleDiagnosesChange, handleSubmit, diagnoses }) {
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
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загружаем диагнозы при монтировании компонента
  useEffect(() => {
    const loadDiagnoses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getDiagnoses();
        console.log('App: Loaded diagnoses data:', data);
        
        // Проверяем, что data является массивом
        if (Array.isArray(data)) {
          setDiagnoses(data);
        } else {
          console.error('App: Diagnoses data is not an array:', data);
          setError('Invalid diagnoses data format');
        }
      } catch (err) {
        console.error('Failed to load diagnoses:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDiagnoses();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Если сохранены старые ID, конвертируем их в объекты диагнозов
          if (typeof parsed[0] === 'string' || typeof parsed[0] === 'number') {
            const selectedObjects = diagnoses.filter(d => d && d.id && parsed.includes(d.id));
            setSelectedDiagnoses(selectedObjects);
            if (selectedObjects.length > 0) {
              handleSubmit(selectedObjects);
            }
          } else {
            // Если уже объекты, используем как есть
            const validObjects = parsed.filter(obj => obj && typeof obj === 'object');
            setSelectedDiagnoses(validObjects);
            if (validObjects.length > 0) {
              handleSubmit(validObjects);
            }
          }
        }
      } catch (error) {
        console.warn('Failed to parse localStorage data:', error);
      }
    }
  }, [diagnoses]); // Добавляем diagnoses в зависимости

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selectedDiagnoses));
  }, [selectedDiagnoses]);

  const handleDiagnosesChange = (selectedDiagnoses) => {
    setSelectedDiagnoses(selectedDiagnoses);
  };

  const handleSubmit = (selectedDiagnoses) => {
    setSelectedDiagnoses(selectedDiagnoses);
    const selected = selectedDiagnoses; // Теперь это уже объекты диагнозов
    
    // Add null checks and loading state validation
    if (!selected || selected.length === 0) {
      setResultData(null);
      return;
    }

    // Validate that all selected diagnoses have required data
    console.log('App: Processing selected diagnoses:', selected);
    
    const validSelected = selected.filter(diagnosis => {
      console.log('App: Checking diagnosis:', diagnosis);
      
      // Проверяем основные поля
      const hasBasicFields = diagnosis && 
        (diagnosis.id || diagnosis.code);
      
      // Проверяем, есть ли данные о продуктах (в любом формате)
      const hasFoodsData = diagnosis?.foods || diagnosis?.allowedFoods || diagnosis?.prohibitedFoods;
      
      // Проверяем, есть ли план питания (может быть в разных местах)
      const hasDailyPlan = diagnosis?.dailyPlan || diagnosis?.daily_plan || diagnosis?.plan;
      
      const isValid = hasBasicFields && (hasFoodsData || hasDailyPlan);
      
      if (!isValid) {
        console.warn('App: Invalid diagnosis found:', {
          hasDiagnosis: !!diagnosis,
          hasId: !!diagnosis?.id,
          hasCode: !!diagnosis?.code,
          hasFoodsData: !!hasFoodsData,
          hasDailyPlan: !!hasDailyPlan,
          diagnosis
        });
      }
      
      return isValid;
    });

    if (validSelected.length === 0) {
      console.warn('App: No valid diagnoses with required data found');
      console.log('App: Selected diagnoses that failed validation:', selected);
      setResultData(null);
      return;
    }
    
    // Обрабатываем продукты в новом формате API
    const processFoods = (diagnosis) => {
      if (diagnosis.foods) {
        // Новый формат: массив объектов с полем allowed
        const allowed = diagnosis.foods
          .filter(food => food.allowed === true)
          .map(food => food.food?.code || food.code)
          .filter(Boolean);
        
        const prohibited = diagnosis.foods
          .filter(food => food.allowed === false)
          .map(food => food.food?.code || food.code)
          .filter(Boolean);
        
        return { allowed, prohibited };
      } else {
        // Старый формат: отдельные массивы
        return {
          allowed: diagnosis.allowedFoods || [],
          prohibited: diagnosis.prohibitedFoods || []
        };
      }
    };

    // Для одного диагноза используем его разрешенные продукты напрямую
    // Для нескольких диагнозов - пересечение
    const allFoodsData = validSelected.map(processFoods);
    
    const allowedFoods = validSelected.length === 1 
      ? allFoodsData[0].allowed
      : intersect(allFoodsData.map(d => d.allowed));
    
    const prohibitedFoods = union(allFoodsData.map(d => d.prohibited));
    
    // Более гибкая обработка плана питания
    const allPlans = validSelected.map(d => {
      console.log('App: Full diagnosis data:', d);
      const plan = d?.dailyPlan || d?.daily_plan || d?.plan || d?.daily_menu || d?.menu || [];
      console.log('App: Processing plan for diagnosis:', d?.code || d?.id, 'plan:', plan);
      return plan;
    }).flat();
    
    console.log('App: Processed foods data:', {
      allowedFoods,
      prohibitedFoods,
      allPlans
    });
    
    const filteredPlan = allPlans.filter(entry => {
      // Add null checks for entry and ingredients
      if (!entry || !entry.ingredients) {
        console.warn('Invalid entry or missing ingredients:', entry);
        return false;
      }

      const safeIngredients = Array.isArray(entry.ingredients) ? entry.ingredients : [];
      
      // Исключаем блюда с запрещёнными продуктами
      if (prohibitedFoods.some(prod => safeIngredients.includes(prod))) return false;
      
      // Оставляем блюда, где есть хотя бы один разрешённый продукт
      if (allowedFoods.length > 0) {
        const hasAllowed = allowedFoods.some(prod => safeIngredients.includes(prod));
        if (!hasAllowed) return false;
      }
      return true;
    });
    
    // Изменяем логику: если есть разрешенные продукты, но нет плана, 
    // то это не критично - пользователь может составить меню сам
    const tooFewAllowed = allowedFoods.length === 0;
    console.log('App: tooFewAllowed =', tooFewAllowed, '(allowedFoods.length =', allowedFoods.length, ', filteredPlan.length =', filteredPlan.length, ')');
    console.log('App: Final result data:', {
      allowedFoods: allowedFoods.length,
      prohibitedFoods: prohibitedFoods.length,
      dailyPlan: filteredPlan.length,
      tooFewAllowed,
      selectedCodes: validSelected.map(d => d?.code),
      selectedIds: validSelected.map(d => d?.id)
    });
    setResultData({
      allowedFoods: allowedFoods || [],
      prohibitedFoods: prohibitedFoods || [],
      dailyPlan: filteredPlan || [],
      tooFewAllowed,
      selectedCodes: validSelected.map(d => d?.code).filter(Boolean),
      selectedIds: validSelected.map(d => d?.id).filter(Boolean)
    });
  };

  if (loading) {
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
              <div className="title-container">
                <h1 className="app-title" dangerouslySetInnerHTML={{ __html: t('title') }} />
              </div>
            </div>
          </header>
          <main className="app-main">
            <LoadingSpinner message={t('loading.diagnoses')} />
          </main>
        </div>
      </BrowserRouter>
    );
  }

  if (error) {
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
              <div className="title-container">
                <h1 className="app-title" dangerouslySetInnerHTML={{ __html: t('title') }} />
              </div>
            </div>
          </header>
          <main className="app-main">
            <ErrorMessage 
              error={error} 
              onRetry={() => window.location.reload()} 
            />
          </main>
        </div>
      </BrowserRouter>
    );
  }

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
            <div className="title-container">
              <h1 className="app-title" dangerouslySetInnerHTML={{ __html: t('title') }} />
            </div>
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
              diagnoses={diagnoses}
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
