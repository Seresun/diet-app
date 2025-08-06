import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export default function CalorieSelector({ diet, onMenuUpdate }) {
  const { t } = useTranslation();
  
  // Добавляем проверки и значения по умолчанию
  const recommendedCalories = diet?.recommendedCalories || { min: 1500, max: 2500, unit: 'kcal' };
  const baseCalories = Math.round((recommendedCalories.min + recommendedCalories.max) / 2);
  const [userCalories, setUserCalories] = useState(baseCalories);

  const adjustMenu = useCallback(() => {
    const factor = userCalories / baseCalories;
    const dailyPlan = diet?.dailyPlan || [];
    const updatedMenu = dailyPlan.map(meal => ({
      ...meal,
      weight_grams: Math.round((meal.weight_grams || 0) * factor),
      nutrition: {
        calories: Math.round((meal.nutrition?.calories || 0) * factor),
        proteins: Math.round((meal.nutrition?.proteins || 0) * factor),
        fats: Math.round((meal.nutrition?.fats || 0) * factor),
        carbs: Math.round((meal.nutrition?.carbs || 0) * factor),
      }
    }));
    onMenuUpdate(updatedMenu);
  }, [userCalories, baseCalories, diet, onMenuUpdate]);

  // Auto-adjust menu when calories change
  useEffect(() => {
    adjustMenu();
  }, [adjustMenu]);

  const handlePresetClick = (calories) => {
    setUserCalories(calories);
  };

  return (
    <div className="calorie-selector">
      <h3>
        {t('calorieSelector.recommended')}: {recommendedCalories.min}-{recommendedCalories.max} {recommendedCalories.unit}
      </h3>
      
      <div className="preset-buttons">
        <button 
          className={`preset-btn ${userCalories === recommendedCalories.min ? 'active' : ''}`}
          onClick={() => handlePresetClick(recommendedCalories.min)}
        >
          {t('calorieSelector.weightLoss')}
        </button>
        <button 
          className={`preset-btn ${userCalories === Math.round((recommendedCalories.min + recommendedCalories.max) / 2) ? 'active' : ''}`}
          onClick={() => handlePresetClick(Math.round((recommendedCalories.min + recommendedCalories.max) / 2))}
        >
          {t('calorieSelector.maintenance')}
        </button>
        <button 
          className={`preset-btn ${userCalories === recommendedCalories.max ? 'active' : ''}`}
          onClick={() => handlePresetClick(recommendedCalories.max)}
        >
          {t('calorieSelector.weightGain')}
        </button>
      </div>
      
      <div className="slider-container">
        <input
          type="range"
          min={recommendedCalories.min}
          max={recommendedCalories.max}
          step={50}
          value={userCalories}
          onChange={e => setUserCalories(Number(e.target.value))}
          className="calorie-slider"
        />
        <p className="selected-calories">
          {t('calorieSelector.selected')}: {userCalories} {recommendedCalories.unit}
        </p>
      </div>
    </div>
  );
} 