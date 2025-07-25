import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from 'react-i18next';

export default function MealCarousel({ time, label, options }) {
  const { t } = useTranslation();
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

  // Try to translate meal name, fallback to prettified key
  const mealName = t(`products.meals.${label}`);
  const displayMealName = mealName === `products.meals.${label}` ? prettifyKey(label) : mealName;

  return (
    <div className="meal-carousel">
      <h3>{time} — {displayMealName}</h3>
      <Slider {...settings}>
        {options.map((option, idx) => {
          const ingredientName = t(`products.${option}`);
          const displayIngredient = ingredientName === `products.${option}` ? prettifyKey(option) : ingredientName;
          return (
            <div key={idx} className="meal-option">
              <p>Ingredient: {displayIngredient}</p>
            </div>
          );
        })}
      </Slider>
    </div>
  );
} 