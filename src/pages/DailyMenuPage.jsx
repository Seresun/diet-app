import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DailyMenu from "../components/DailyMenu";
import CalorieSelector from "../components/CalorieSelector";
import apiService from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

export default function DailyMenuPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const [menu, setMenu] = useState([]); // Пустой массив по умолчанию
  const [diet, setDiet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDietData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const diagnosisId = location.state?.diagnosisId;
        
        if (diagnosisId) {
          // Загружаем полные данные диагноза (включая план питания)
          const diagnosisData = await apiService.getDailyPlan(diagnosisId);
          console.log('DailyMenuPage: Loaded diagnosis data:', diagnosisData);
          console.log('DailyMenuPage: Full diagnosis data structure:', JSON.stringify(diagnosisData, null, 2));

          // Проверяем структуру данных
          if (diagnosisData && diagnosisData.dailyPlan && Array.isArray(diagnosisData.dailyPlan)) {
            diagnosisData.dailyPlan.forEach((meal, index) => {
              console.log(`DailyMenuPage: Meal ${index}:`, {
                time: meal?.time,
                mealKey: meal?.mealKey,
                ingredients: meal?.ingredients,
                nutrition: meal?.nutrition,
                weight_grams: meal?.weight_grams
              });
              console.log(`DailyMenuPage: Meal ${index} full data:`, JSON.stringify(meal, null, 2));
            });
          }
          
          // Проверяем recommendedCalories
          console.log('DailyMenuPage: recommendedCalories:', diagnosisData?.recommendedCalories);
          
          // Проверяем все возможные поля плана питания
          const dailyPlan = diagnosisData?.dailyPlan || diagnosisData?.daily_plan || diagnosisData?.plan || diagnosisData?.menu || [];
          console.log('DailyMenuPage: Found dailyPlan with length:', dailyPlan.length);
          
          setDiet(diagnosisData);
          setMenu(dailyPlan);
        } else if (location.state?.menu) {
          // Fallback to direct menu data
          console.log('DailyMenuPage: Using fallback menu data:', location.state.menu);
          setMenu(Array.isArray(location.state.menu) ? location.state.menu : []);
        } else {
          setError('No diagnosis ID provided');
        }
      } catch (err) {
        console.error('Failed to load diet data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDietData();
  }, [location.state]);

  const handleMenuUpdate = (updatedMenu) => {
    setMenu(updatedMenu);
  };

  if (loading) {
    return (
      <div className="daily-menu-page">
        <h1 style={{ color: '#4a5568', fontSize: '1.5rem', marginBottom: '1rem' }}>{t('dailyMenuTitle')}</h1>
        <Link to="/">← {t('back')}</Link>
        <LoadingSpinner message={t('loading.menu')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="daily-menu-page">
        <h1 style={{ color: '#4a5568', fontSize: '1.5rem', marginBottom: '1rem' }}>{t('dailyMenuTitle')}</h1>
        <Link to="/">← {t('back')}</Link>
        <ErrorMessage 
          error={error} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  if (!diet && !menu.length) {
    return (
      <div className="daily-menu-page">
        <h1 style={{ color: '#4a5568', fontSize: '1.5rem', marginBottom: '1rem' }}>{t('dailyMenuTitle')}</h1>
        <Link to="/">← {t('back')}</Link>
        <p>No menu data available. Please go back and select a diet.</p>
      </div>
    );
  }

  return (
    <div className="daily-menu-page">
      <h1 style={{ color: '#4a5568', fontSize: '1.5rem', marginBottom: '1rem' }}>{t('dailyMenuTitle')}</h1>
      <Link to="/">← {t('back')}</Link>
      
      {diet && diet.recommendedCalories && (
        <CalorieSelector
          diet={diet}
          onMenuUpdate={handleMenuUpdate}
        />
      )}
      
      <DailyMenu menu={menu} />
    </div>
  );
} 