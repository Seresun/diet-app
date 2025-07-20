import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function MealCarousel({ time, label, options }) {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div className="meal-carousel">
      <h3>{time} — {label}</h3>
      <Slider {...settings}>
        {options.map((option, idx) => (
          <div key={idx} className="meal-option">
            <p>Option {idx + 1}: {option}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
} 