import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const openDropdown = () => {
    setIsAnimating(true);
    setIsOpen(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const closeDropdown = () => {
    setIsAnimating(true);
    setIsOpen(false);
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handleLanguageChange = async (languageCode) => {
    if (languageCode === i18n.language) {
      closeDropdown();
      return;
    }

    // Add micro-interaction animation
    const icon = buttonRef.current?.querySelector('.language-icon');
    if (icon) {
      icon.style.transform = 'rotate(180deg)';
      setTimeout(() => {
        icon.style.transform = 'rotate(0deg)';
      }, 100);
    }

    await i18n.changeLanguage(languageCode);
    closeDropdown();
  };

  const handleKeyDown = (event, languageCode) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLanguageChange(languageCode);
    }
  };

  return (
    <div className="language-switcher">
      <button
        ref={buttonRef}
        className="language-button"
        onClick={isOpen ? closeDropdown : openDropdown}
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Change language"
      >
        <span className="language-icon">🌐</span>
        <span className="language-code">{currentLanguage.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className={`language-dropdown ${isAnimating ? 'animating' : ''}`}
          role="menu"
          aria-label="Language options"
        >
          {languages.map((language) => (
            <button
              key={language.code}
              className={`language-option ${language.code === i18n.language ? 'active' : ''}`}
              onClick={() => handleLanguageChange(language.code)}
              onKeyDown={(e) => handleKeyDown(e, language.code)}
              role="menuitem"
              tabIndex={0}
              aria-label={`Switch to ${language.name}`}
            >
              <span className="language-flag">{language.flag}</span>
              <span className="language-name">{language.name}</span>
              {language.code === i18n.language && (
                <span className="language-check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 