import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function DietResult({ data }) {
  const { t } = useTranslation();

  if (data.tooFewAllowed) {
    return (
      <div className="diet-result">
        <h2 className="result-title">⚠️ {t('recommendationsFor')} {data.selectedIds.map(id => t(`diagnoses.${id}`)).join(', ')}</h2>
        <div className="error-message">
          {t('tooFewAllowedWarning')}
        </div>
      </div>
    );
  }

  return (
    <div className="diet-result">
      <h2 className="result-title">{t('recommendationsFor')} {data.selectedIds.map(id => t(`diagnoses.${id}`)).join(', ')}</h2>

      <h3 className="section-title">{t('allowedFoods')}</h3>
      <Slider
        dots={true}
        infinite={false}
        speed={500}
        slidesToShow={4}
        slidesToScroll={4}
        responsive={[{ breakpoint: 900, settings: { slidesToShow: 4, slidesToScroll: 4 } }, { breakpoint: 600, settings: { slidesToShow: 4, slidesToScroll: 4 } }]}
        className="allowed-foods-carousel"
      >
        {data.allowedFoods.map((item, index) => (
          <div key={index} className="food-carousel-item allowed">
            {t(`products.${item}`)}
          </div>
        ))}
      </Slider>

      <h3 className="section-title">{t('prohibitedFoods')}</h3>
      <Slider
        dots={true}
        infinite={false}
        speed={500}
        slidesToShow={4}
        slidesToScroll={4}
        responsive={[{ breakpoint: 900, settings: { slidesToShow: 4, slidesToScroll: 4 } }, { breakpoint: 600, settings: { slidesToShow: 4, slidesToScroll: 4 } }]}
        className="prohibited-foods-carousel"
      >
        {data.prohibitedFoods.map((item, index) => (
          <div key={index} className="food-carousel-item prohibited">
            {t(`products.${item}`)}
          </div>
        ))}
      </Slider>

      {data.dailyPlan && data.dailyPlan.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <Link
            to="/daily-menu"
            state={{ menu: data.dailyPlan }}
            className="submit-link"
          >
            {t('dailyMenu')}
          </Link>
        </div>
      )}
    </div>
  );
}

export default DietResult;
