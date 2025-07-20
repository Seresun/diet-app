import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(nextLang);
  };

  return (
    <button 
      onClick={toggleLanguage}
      className="language-switcher"
      title={i18n.language === 'ru' ? 'Switch to English' : 'Переключиться на русский'}
    >
      {i18n.language === 'ru' ? 'EN' : 'RU'}
    </button>
  );
};

export default LanguageSwitcher; 