import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function CalorieSelector({ diet, onMenuUpdate }) {
  const { t } = useTranslation();
  const baseCalories = (diet.recommendedCalories.min + diet.recommendedCalories.max) / 2;
  const [userCalories, setUserCalories] = useState(baseCalories);

  const adjustMenu = () => {
    const factor = userCalories / baseCalories;
    const updatedMenu = diet.dailyPlan.map(meal => ({
      ...meal,
      weight_grams: Math.round(meal.weight_grams * factor),
      nutrition: {
        calories: Math.round(meal.nutrition.calories * factor),
        proteins: Math.round(meal.nutrition.proteins * factor),
        fats: Math.round(meal.nutrition.fats * factor),
        carbs: Math.round(meal.nutrition.carbs * factor),
      }
    }));
    onMenuUpdate(updatedMenu);
  };

  // Auto-adjust menu when calories change
  useEffect(() => {
    adjustMenu();
  }, [userCalories]);

  const handlePresetClick = (calories) => {
    setUserCalories(calories);
  };

  return (
    <div className="calorie-selector">
      <h3>
        {t('calorieSelector.recommended')}: {diet.recommendedCalories.min}-{diet.recommendedCalories.max} {diet.recommendedCalories.unit}
      </h3>
      
      <div className="preset-buttons">
        <button 
          className={`preset-btn ${userCalories === diet.recommendedCalories.min ? 'active' : ''}`}
          onClick={() => handlePresetClick(diet.recommendedCalories.min)}
        >
          {t('calorieSelector.weightLoss')}
        </button>
        <button 
          className={`preset-btn ${userCalories === Math.round((diet.recommendedCalories.min + diet.recommendedCalories.max) / 2) ? 'active' : ''}`}
          onClick={() => handlePresetClick(Math.round((diet.recommendedCalories.min + diet.recommendedCalories.max) / 2))}
        >
          {t('calorieSelector.maintenance')}
        </button>
        <button 
          className={`preset-btn ${userCalories === diet.recommendedCalories.max ? 'active' : ''}`}
          onClick={() => handlePresetClick(diet.recommendedCalories.max)}
        >
          {t('calorieSelector.weightGain')}
        </button>
      </div>
      
      <div className="slider-container">
        <input
          type="range"
          min={diet.recommendedCalories.min}
          max={diet.recommendedCalories.max}
          step={50}
          value={userCalories}
          onChange={e => setUserCalories(Number(e.target.value))}
          className="calorie-slider"
        />
        <p className="selected-calories">
          {t('calorieSelector.selected')}: {userCalories} {diet.recommendedCalories.unit}
        </p>
      </div>
    </div>
  );
} 