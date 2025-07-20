import React from 'react';

function DietResult({ data }) {
  return (
    <div className="diet-result">
      <h2 className="result-title">Рекомендации для: {data.name}</h2>

      <h3 className="section-title">✅ Разрешённые продукты:</h3>
      <ul className="food-list">
        {data.allowedFoods.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h3 className="section-title">❌ Запрещённые продукты:</h3>
      <ul className="food-list prohibited-list">
        {data.prohibitedFoods.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h3 className="section-title">🍽️ Пример меню на день:</h3>
      <ul className="food-list meal-plan">
        {data.dailyPlan.map((entry, index) => (
          <li key={index}>
            <span className="meal-time">{entry.time}</span>: {entry.meal}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DietResult;
