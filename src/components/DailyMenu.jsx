import React from "react";
import MealCarousel from "./MealCarousel";

export default function DailyMenu({ menu }) {
  return (
    <div>
      {menu.map((meal, idx) => (
        <MealCarousel
          key={idx}
          time={meal.time}
          label={meal.mealKey} // Pass mealKey as label
          options={meal.ingredients} // Pass ingredients as options
        />
      ))}
    </div>
  );
} 