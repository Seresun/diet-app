import React from 'react';
import { useTranslation } from 'react-i18next';

function DietResult({ data }) {
  const { t } = useTranslation();
  
  return (
    <div className="diet-result">
      <h2 className="result-title">{t('recommendationsFor')} {t(`diagnoses.${data.id}`)}</h2>

      <h3 className="section-title">{t('allowedFoods')}</h3>
      <ul className="food-list">
        {data.allowedFoods.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h3 className="section-title">{t('prohibitedFoods')}</h3>
      <ul className="food-list prohibited-list">
        {data.prohibitedFoods.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h3 className="section-title">{t('dailyMenu')}</h3>
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
