import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ru from './locales/ru.json';
import de from './locales/de.json';

// Отладочная информация перед инициализацией
console.log('Loading translations...');
console.log('ru.meals keys:', Object.keys(ru.meals || {}).slice(0, 10));
console.log('en.meals keys:', Object.keys(en.meals || {}).slice(0, 10));
console.log('de.meals keys:', Object.keys(de.meals || {}).slice(0, 10));

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      de: { translation: de },
    },
    lng: 'ru', // default language
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    // Отключаем кэширование для разработки
    debug: true,
    saveMissing: false,
    missingKeyHandler: false,
    // Принудительно обновляем ресурсы
    updateMissing: true,
    // Очищаем кэш при инициализации
    initImmediate: false,
    // Принудительно перезагружаем ресурсы
    reloadResources: true,
  });

// Принудительно обновляем ресурсы после инициализации
i18n.reloadResources();

// Отладочная информация после инициализации
console.log('i18n initialized with resources:', {
  ru: Object.keys(ru.meals || {}).slice(0, 5),
  en: Object.keys(en.meals || {}).slice(0, 5),
  de: Object.keys(de.meals || {}).slice(0, 5),
});

// Проверяем конкретные ключи
console.log('Checking specific keys:');
console.log('buckwheat_zucchini_egg in ru:', ru.meals?.buckwheat_zucchini_egg);
console.log('cottage_cheese_apple in ru:', ru.meals?.cottage_cheese_apple);
console.log('pumpkin_puree_kefir in ru:', ru.meals?.pumpkin_puree_kefir);

export default i18n; 