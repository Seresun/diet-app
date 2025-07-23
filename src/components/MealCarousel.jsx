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

  return (
    <div className="meal-carousel">
      <h3>{time} — {label ? t(`products.meals.${label}`) : ''}</h3>
      <Slider {...settings}>
        {options.map((option, idx) => (
          <div key={idx} className="meal-option">
            <p>Option {idx + 1}: {t(`products.meals.${option}`) || option}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
} 