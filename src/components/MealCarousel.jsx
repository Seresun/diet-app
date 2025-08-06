import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from 'react-i18next';

export default function MealCarousel({ time, label, options }) {
  const { t, i18n } = useTranslation();
  
  // Проверяем входные данные
  if (!time || !label || !options) {
    console.warn('MealCarousel: Missing required props:', { time, label, options });
    return (
      <div className="meal-carousel">
        <h3>{time || 'Unknown'} — {label || 'Unknown'}</h3>
        <p style={{ textAlign: 'center', color: '#666' }}>
          {t('noIngredientsAvailable')}
        </p>
      </div>
    );
  }

  // Проверяем, что options является массивом
  if (!Array.isArray(options)) {
    console.warn('MealCarousel: options is not an array:', options);
    return (
      <div className="meal-carousel">
        <h3>{time} — {label}</h3>
        <p style={{ textAlign: 'center', color: '#666' }}>
          {t('invalidIngredientsData')}
        </p>
      </div>
    );
  }

  // Фильтруем валидные ингредиенты
  const validOptions = options.filter(option => {
    if (!option) {
      console.warn('MealCarousel: Found null/undefined ingredient');
      return false;
    }
    return true;
  });

  if (validOptions.length === 0) {
    return (
      <div className="meal-carousel">
        <h3>{time} — {label}</h3>
        <p style={{ textAlign: 'center', color: '#666' }}>
          {t('noIngredientsAvailable')}
        </p>
      </div>
    );
  }

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  // Helper to prettify mealKey if translation is missing
  function prettifyKey(key) {
    return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  // Try to get translation directly from resources
  const getMealTranslation = (key) => {
    const currentLang = i18n.language;
    const resources = i18n.store.data[currentLang];
    
    console.log(`DEBUG: Looking for meal key "${key}" in language "${currentLang}"`);
    console.log(`DEBUG: Resources available:`, resources);
    
    if (resources && resources.translation && resources.translation.meals) {
      console.log(`DEBUG: Meals available:`, Object.keys(resources.translation.meals));
      if (resources.translation.meals[key]) {
        console.log(`DEBUG: Found translation for "${key}": "${resources.translation.meals[key]}"`);
        return resources.translation.meals[key];
      } else {
        console.log(`DEBUG: No translation found for "${key}"`);
      }
    } else {
      console.log(`DEBUG: No meals section found in resources`);
    }
    
    return prettifyKey(key);
  };

  const getProductTranslation = (key) => {
    const currentLang = i18n.language;
    const resources = i18n.store.data[currentLang];
    if (resources && resources.translation && resources.translation.products && resources.translation.products[key]) {
      return resources.translation.products[key];
    }
    return prettifyKey(key);
  };

  const displayMealName = getMealTranslation(label);

  return (
    <div className="meal-carousel">
      <h3>{time} — {displayMealName}</h3>
      <Slider {...settings}>
        {validOptions.map((option, idx) => {
          // Обрабатываем разные форматы данных от backend
          let ingredientCode = option;
          
          // Если backend возвращает объект с вложенной структурой
          if (typeof option === 'object' && option !== null) {
            if (option.food && option.food.code) {
              ingredientCode = option.food.code;
            } else if (option.code) {
              ingredientCode = option.code;
            } else if (option.name) {
              ingredientCode = option.name;
            } else {
              console.warn('MealCarousel: Unknown ingredient object structure:', option);
              ingredientCode = 'unknown';
            }
          }
          
          const displayIngredient = getProductTranslation(ingredientCode);
          return (
            <div key={idx} className="meal-option">
              <p>{t('ingredient')}: {displayIngredient}</p>
            </div>
          );
        })}
      </Slider>
    </div>
  );
} 