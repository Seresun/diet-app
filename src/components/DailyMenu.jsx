import React from "react";
import MealCarousel from "./MealCarousel";
import { useTranslation } from 'react-i18next';

export default function DailyMenu({ menu }) {
  const { t } = useTranslation();

  // Проверяем, что menu существует и является массивом
  if (!menu || !Array.isArray(menu) || menu.length === 0) {
    return (
      <div className="daily-menu">
        <div className="daily-summary">
          <h3>{t('dailyMenu.dailySummary')}</h3>
          <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            {t('noDataAvailable')}
          </p>
        </div>
      </div>
    );
  }

  // Фильтруем валидные элементы и логируем структуру данных
  const validMenu = menu.filter(meal => {
    if (!meal) {
      console.warn('DailyMenu: Found null/undefined meal item');
      return false;
    }
    
    console.log('DailyMenu: Processing meal:', {
      time: meal.time,
      mealKey: meal.mealKey,
      ingredients: meal.ingredients,
      nutrition: meal.nutrition
    });

    // Проверяем только обязательные поля для бэкенда
    if (!meal.mealKey || !meal.ingredients) {
      console.warn('DailyMenu: Meal missing required fields (mealKey or ingredients):', meal);
      return false;
    }

    // Проверяем, что ingredients является массивом
    if (!Array.isArray(meal.ingredients)) {
      console.warn('DailyMenu: ingredients is not an array:', meal.ingredients);
      return false;
    }

    return true;
  });

  if (validMenu.length === 0) {
    return (
      <div className="daily-menu">
        <div className="daily-summary">
          <h3>{t('dailyMenu.dailySummary')}</h3>
          <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            {t('noValidDataAvailable')}
          </p>
        </div>
      </div>
    );
  }

  // Calculate total daily nutrition (with fallbacks for missing nutrition data)
  const totalNutrition = validMenu.reduce((total, meal) => ({
    calories: total.calories + (meal.nutrition?.calories || 0),
    proteins: total.proteins + (meal.nutrition?.proteins || 0),
    fats: total.fats + (meal.nutrition?.fats || 0),
    carbs: total.carbs + (meal.nutrition?.carbs || 0),
  }), { calories: 0, proteins: 0, fats: 0, carbs: 0 });
  
  console.log('DailyMenu: Total nutrition calculated:', totalNutrition);

  return (
    <div className="daily-menu">
      <div className="daily-summary">
        <h3>{t('dailyMenu.dailySummary')}</h3>
        <div className="nutrition-totals">
          <span>{t('dailyMenu.calories')}: {totalNutrition.calories} kcal</span>
          <span>{t('dailyMenu.proteins')}: {totalNutrition.proteins}g</span>
          <span>{t('dailyMenu.fats')}: {totalNutrition.fats}g</span>
          <span>{t('dailyMenu.carbs')}: {totalNutrition.carbs}g</span>
        </div>
      </div>
      
      {validMenu.map((meal, idx) => (
        <div key={idx} className="meal-container">
          <div className="meal-header">
            <div className="meal-nutrition">
              <span className="portion">{t('dailyMenu.portion')}: {meal.weight_grams || 0}g</span>
              <span className="calories">{meal.nutrition?.calories || 0} kcal</span>
              <span className="macros">
                P: {meal.nutrition?.proteins || 0}g | F: {meal.nutrition?.fats || 0}g | C: {meal.nutrition?.carbs || 0}g
              </span>
            </div>
          </div>
          <MealCarousel
            time={meal.time || `Прием пищи ${idx + 1}`}
            label={meal.mealKey}
            options={meal.ingredients}
          />
        </div>
      ))}
    </div>
  );
} 