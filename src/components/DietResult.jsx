import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import TextFit from './TextFit';

function DietResult({ data }) {
  const { t } = useTranslation();

  // Add null checks for data
  if (!data) {
    return (
      <div className="diet-result">
        <p style={{ textAlign: 'center', color: '#666' }}>
          {t('noDataAvailable')}
        </p>
      </div>
    );
  }

  if (data.tooFewAllowed) {
    return (
      <div className="diet-result">
        <h2 className="result-title">⚠️ {t('recommendationsFor')} {(data.selectedCodes || []).map(code => t(`diagnoses.${code}`)).join(', ')}</h2>
        <div className="error-message">
          {t('tooFewAllowedWarning')}
        </div>
      </div>
    );
  }

  return (
    <div className="diet-result">
      <h2 className="result-title">{t('recommendationsFor')} {(data.selectedCodes || []).map(code => t(`diagnoses.${code}`)).join(', ')}</h2>

      <h3 className="section-title">{t('allowedFoods')}</h3>
      <Slider
        dots={true}
        infinite={false}
        speed={500}
        slidesToShow={4}
        slidesToScroll={4}
        responsive={[
          { 
            breakpoint: 900, 
            settings: { 
              slidesToShow: 3, 
              slidesToScroll: 3 
            } 
          }, 
          { 
            breakpoint: 600, 
            settings: { 
              slidesToShow: 2, 
              slidesToScroll: 2 
            } 
          }
        ]}
        className="allowed-foods-carousel"
      >
        {(data.allowedFoods || []).map((item, index) => (
          <div key={index} className="food-carousel-item allowed">
            <TextFit min={8} max={16}>
              {t(`products.${item}`)}
            </TextFit>
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
        responsive={[
          { 
            breakpoint: 900, 
            settings: { 
              slidesToShow: 3, 
              slidesToScroll: 3 
            } 
          }, 
          { 
            breakpoint: 600, 
            settings: { 
              slidesToShow: 2, 
              slidesToScroll: 2 
            } 
          }
        ]}
        className="prohibited-foods-carousel"
      >
        {(data.prohibitedFoods || []).map((item, index) => (
          <div key={index} className="food-carousel-item prohibited">
            <TextFit min={8} max={16}>
              {t(`products.${item}`)}
            </TextFit>
          </div>
        ))}
      </Slider>

      {data.selectedCodes && data.selectedCodes.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <Link
            to="/daily-menu"
            state={{ diagnosisId: data.selectedIds ? data.selectedIds[0] : data.selectedCodes[0] }}
            className="submit-link"
          >
            {t('dailyMenuButton')}
          </Link>
        </div>
      )}
    </div>
  );
}

export default DietResult;
