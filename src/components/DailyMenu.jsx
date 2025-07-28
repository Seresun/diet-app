import React from "react";
import MealCarousel from "./MealCarousel";
import { useTranslation } from 'react-i18next';

export default function DailyMenu({ menu }) {
  const { t } = useTranslation();

  // Calculate total daily nutrition
  const totalNutrition = menu.reduce((total, meal) => ({
    calories: total.calories + meal.nutrition.calories,
    proteins: total.proteins + meal.nutrition.proteins,
    fats: total.fats + meal.nutrition.fats,
    carbs: total.carbs + meal.nutrition.carbs,
  }), { calories: 0, proteins: 0, fats: 0, carbs: 0 });

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
      
      {menu.map((meal, idx) => (
        <div key={idx} className="meal-container">
          <div className="meal-header">
            <h4>{meal.time} — {meal.mealKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</h4>
            <div className="meal-nutrition">
              <span className="portion">{t('dailyMenu.portion')}: {meal.weight_grams}g</span>
              <span className="calories">{meal.nutrition.calories} kcal</span>
              <span className="macros">
                P: {meal.nutrition.proteins}g | F: {meal.nutrition.fats}g | C: {meal.nutrition.carbs}g
              </span>
            </div>
          </div>
          <MealCarousel
            time={meal.time}
            label={meal.mealKey}
            options={meal.ingredients}
          />
        </div>
      ))}
    </div>
  );
} 