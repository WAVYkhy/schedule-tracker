'use client';

import { useLanguage } from '@/lib/i18n';
import { Globe } from 'lucide-react';

const OPTIONS = [
  { code: 'ko', label: 'KO' },
  { code: 'ja', label: 'JA' },
  { code: 'en', label: 'EN' },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="lang-switcher-container" role="tablist" aria-label="Language selection">
      <Globe size={14} className="lang-globe-icon" />
      <div className="lang-segmented-control">
        {OPTIONS.map((opt) => {
          const isActive = lang === opt.code;
          return (
            <button
              key={opt.code}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`lang-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setLang(opt.code)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
