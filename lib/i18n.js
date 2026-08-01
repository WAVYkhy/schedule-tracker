'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'preferred_lang';
const SUPPORTED_LANGS = ['ko', 'ja', 'en'];

export const translations = {
  ko: {
    brand_logo: 'WAVIT_studio',
    header_title_prefix: '지금 예약하실 경우 ',
    header_title_suffix: '부터 작업 가능합니다.',
    nav_prev_month: '이전 달',
    nav_next_month: '다음 달',
    weekdays: ['일', '월', '화', '수', '목', '금', '토'],
    deadline_placeholder_title: '희망 마감일을 달력에서 선택해 보세요',
    deadline_placeholder_desc: '선택하신 마감일에 따라 작업 가능 여부를 즉시 계산해 드립니다.',
    desired_deadline_title: '희망 마감일:',
    service_basic: '커버곡/오리지널곡 (10일 소요)',
    service_live2d: '커버곡/오리지널곡 + Live2D (15일 소요)',
    status_available: '작업 가능',
    status_negotiate: '협의 필요 ⓘ',
    status_unavailable: '기간 부족',
    tooltip_text: '곡, 일러스트, 요청사항 등의 검토가 필요합니다. 기간 부족에 따른 추가금이 요청될 수 있다는 점 양해 부탁드립니다.',
    deadline_caption: '* 빠른 마감을 원하실 경우 협의가 필요합니다.',
    footer_text: 'designed by WAVIT',
    blocked_tag: ' (마감됨)',
    selected_tag: ' (선택됨)',
  },
  ja: {
    brand_logo: 'WAVIT_studio',
    header_title_prefix: '今ご予約いただく場合、',
    header_title_suffix: 'より着手可能です。',
    nav_prev_month: '前月',
    nav_next_month: '翌月',
    weekdays: ['日', '月', '火', '水', '木', '金', '土'],
    deadline_placeholder_title: 'ご希望の納期をカレンダーから選択してください',
    deadline_placeholder_desc: '選択された納期に応じて、対応可能性を即座に計算します。',
    desired_deadline_title: '希望納期:',
    service_basic: 'カバー曲/オリジナル曲 (10日所要)',
    service_live2d: 'カバー曲/オリジナル曲 + Live2D (15日所要)',
    status_available: '対応可能',
    status_negotiate: '要相談 ⓘ',
    status_unavailable: '日程不足',
    tooltip_text: '楽曲、イラスト、ご要望事項などの確認が必要です。日程不足に伴い追加料金が発生する場合がありますのでご了承ください。',
    deadline_caption: '※ 短納期をご希望の場合は事前にご相談ください。',
    footer_text: 'designed by WAVIT',
    blocked_tag: ' (締め切り)',
    selected_tag: ' (選択中)',
  },
  en: {
    brand_logo: 'WAVIT_studio',
    header_title_prefix: 'If you book now, work can start from ',
    header_title_suffix: '.',
    nav_prev_month: 'Previous month',
    nav_next_month: 'Next month',
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    deadline_placeholder_title: 'Select your target deadline on the calendar',
    deadline_placeholder_desc: 'We will instantly calculate availability based on your selected date.',
    desired_deadline_title: 'Target Deadline:',
    service_basic: 'Cover / Original Song (10 days needed)',
    service_live2d: 'Cover / Original Song + Live2D (15 days needed)',
    status_available: 'Available',
    status_negotiate: 'Negotiable ⓘ',
    status_unavailable: 'Tight Schedule',
    tooltip_text: 'Review of audio, artwork, and specifications is required. Please note that rush fees may apply due to tight timelines.',
    deadline_caption: '* Expedited deadlines require prior consultation.',
    footer_text: 'designed by WAVIT',
    blocked_tag: ' (Blocked)',
    selected_tag: ' (Selected)',
  },
};

const monthsENShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthsENLong = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function formatDate(dateObjOrStr, lang = 'ko') {
  if (!dateObjOrStr) return '';
  
  let month, date;
  if (typeof dateObjOrStr === 'string') {
    const parts = dateObjOrStr.split('-');
    if (parts.length === 3) {
      month = parseInt(parts[1], 10);
      date = parseInt(parts[2], 10);
    }
  } else if (typeof dateObjOrStr === 'object') {
    month = dateObjOrStr.month;
    date = dateObjOrStr.date;
  }

  if (!month || !date) return '';

  if (lang === 'ja') {
    return `${month}月${date}日`;
  }
  if (lang === 'en') {
    return `${monthsENShort[month - 1]} ${date}`;
  }
  return `${month}월 ${date}일`;
}

export function formatHeaderRange(currentDate, nextMonthDate, lang = 'ko') {
  const y1 = currentDate.getFullYear();
  const m1 = currentDate.getMonth() + 1;
  const y2 = nextMonthDate.getFullYear();
  const m2 = nextMonthDate.getMonth() + 1;

  if (lang === 'en') {
    if (y1 === y2) {
      return `${monthsENShort[m1 - 1]} — ${monthsENShort[m2 - 1]} ${y1}`;
    }
    return `${monthsENShort[m1 - 1]} ${y1} — ${monthsENShort[m2 - 1]} ${y2}`;
  }

  if (lang === 'ja') {
    if (y1 === y2) {
      return `${y1}年 ${m1}月 — ${m2}月`;
    }
    return `${y1}年 ${m1}月 — ${y2}年 ${m2}月`;
  }

  // KO
  if (y1 === y2) {
    return `${y1}년 ${m1}월 — ${m2}월`;
  }
  return `${y1}년 ${m1}월 — ${y2}년 ${m2}월`;
}

export function formatMonthTitle(monthDate, lang = 'ko') {
  const y = monthDate.getFullYear();
  const m = monthDate.getMonth();

  if (lang === 'en') {
    return `${monthsENLong[m]} ${y}`;
  }
  if (lang === 'ja') {
    return `${y}年 ${m + 1}月`;
  }
  return `${y}년 ${m + 1}월`;
}

export function formatDayAriaLabel(y, m, d, blocked, selected, lang = 'ko') {
  const t = translations[lang] || translations.ko;
  let baseStr = '';
  if (lang === 'en') {
    baseStr = `${monthsENShort[m]} ${d}, ${y}`;
  } else if (lang === 'ja') {
    baseStr = `${y}年 ${m + 1}月 ${d}日`;
  } else {
    baseStr = `${y}년 ${m + 1}월 ${d}일`;
  }

  if (blocked) baseStr += t.blocked_tag;
  if (selected) baseStr += t.selected_tag;
  return baseStr;
}

const LanguageContext = createContext({
  lang: 'ko',
  isTransitioning: false,
  setLang: () => {},
  t: (key) => translations.ko[key] || key,
  formatDate: (dateObjOrStr) => '',
  formatHeaderRange: (curr, next) => '',
  formatMonthTitle: (date) => '',
  formatDayAriaLabel: (y, m, d, b, s) => '',
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('ko');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY);
      if (savedLang && SUPPORTED_LANGS.includes(savedLang)) {
        setLangState(savedLang);
        return;
      }

      const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
      if (browserLang.startsWith('ja')) {
        setLangState('ja');
      } else if (browserLang.startsWith('en')) {
        setLangState('en');
      } else {
        setLangState('ko');
      }
    } catch {
      setLangState('ko');
    }
  }, []);

  const setLang = (newLang) => {
    if (!SUPPORTED_LANGS.includes(newLang) || newLang === lang || isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setLangState(newLang);
      setIsTransitioning(false);
      try {
        localStorage.setItem(STORAGE_KEY, newLang);
      } catch (e) {
        console.error('Failed to save language preference', e);
      }
    }, 180);
  };

  const t = (key) => {
    const dict = translations[lang] || translations.ko;
    return dict[key] || translations.ko[key] || key;
  };

  const value = {
    lang,
    isTransitioning,
    setLang,
    t,
    formatDate: (dateObjOrStr) => formatDate(dateObjOrStr, lang),
    formatHeaderRange: (curr, next) => formatHeaderRange(curr, next, lang),
    formatMonthTitle: (date) => formatMonthTitle(date, lang),
    formatDayAriaLabel: (y, m, d, b, s) => formatDayAriaLabel(y, m, d, b, s, lang),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
