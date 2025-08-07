import React from 'react';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="about-page" style={{ maxWidth: 700, margin: '0 auto', lineHeight: 1.6 }}>
      <h1 style={{ fontSize: '2rem', marginBottom: 16 }}>🩺 {t('aboutProject')}</h1>

      <p>
        {t('about.greeting')}
      </p>

      <h2 style={{ fontSize: '1.4rem', marginTop: 24 }}>{t('about.purpose')}</h2>
      <p dangerouslySetInnerHTML={{ __html: t('about.purposeDescription') }} />
      <ul>
        <li>{t('about.conditions.gastritis')}</li>
        <li>{t('about.conditions.diabetes')}</li>
        <li>{t('about.conditions.hypertension')}</li>
        <li>{t('about.conditions.ibs')}</li>
      </ul>
      <p dangerouslySetInnerHTML={{ __html: t('about.howItWorks') }} />
      <p dangerouslySetInnerHTML={{ __html: t('about.aiAssistant') }} />

      <h2 style={{ fontSize: '1.4rem', marginTop: 32 }}>{t('about.important')}</h2>
      <p dangerouslySetInnerHTML={{ __html: t('about.disclaimer') }} />
      <p dangerouslySetInnerHTML={{ __html: t('about.basedOn') }} />
      <p dangerouslySetInnerHTML={{ __html: t('about.updates') }} />

      <h2 style={{ fontSize: '1.4rem', marginTop: 32 }}>{t('about.feedback')}</h2>
      <p>
        {t('about.feedbackDescription')}
      </p>
      <a
        href="https://docs.google.com/forms/d/10-t0xpyAGzIEA1LY9hEZCog4vpO6txHHwjpLFOG7tyo/edit"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#667eea', fontWeight: 600, fontSize: '1.1rem' }}
      >
        {t('about.feedbackLink')}
      </a>
    </div>
  );
}
