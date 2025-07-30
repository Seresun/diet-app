import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DailyMenu from "../components/DailyMenu";
import CalorieSelector from "../components/CalorieSelector";
import diagnosesData from "../data/diagnoses.json";

export default function DailyMenuPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const [menu, setMenu] = useState([]);
  const [diet, setDiet] = useState(null);

  useEffect(() => {
    // Get diet data from location state or find by diagnosis ID
    const diagnosisId = location.state?.diagnosisId;
    
    if (diagnosisId) {
      const foundDiet = diagnosesData.find(d => d.id === diagnosisId);
      if (foundDiet) {
        setDiet(foundDiet);
        setMenu(foundDiet.dailyPlan);
      }
    } else if (location.state?.menu) {
      // Fallback to direct menu data
      setMenu(location.state.menu);
    }
  }, [location.state]);

  const handleMenuUpdate = (updatedMenu) => {
    setMenu(updatedMenu);
  };

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
      
      {diet && (
        <CalorieSelector 
          diet={diet} 
          onMenuUpdate={handleMenuUpdate} 
        />
      )}
      
      <DailyMenu menu={menu} />
    </div>
  );
} 