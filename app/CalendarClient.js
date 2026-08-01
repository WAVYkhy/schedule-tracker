'use client';

import { useState } from 'react';
import Calendar from '@/components/Calendar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/lib/i18n';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarClient({ initialBlockedDates, earliestStartStr, earliestDateObj }) {
  const [selectedDeadline, setSelectedDeadline] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const { t, formatDate } = useLanguage();

  const handleSelectDeadline = (dateStr) => {
    setSelectedDeadline(dateStr);
    setActiveTooltip(null);
  };

  const toggleTooltip = (type) => {
    setActiveTooltip((prev) => (prev === type ? null : type));
  };

  // Calculate project feasibilities
  let basicStatus = null;
  let live2DStatus = null;

  if (selectedDeadline && earliestStartStr) {
    const start = new Date(earliestStartStr);
    const deadline = new Date(selectedDeadline);

    let availableWorkingDays = 0;
    let current = new Date(start);

    while (current <= deadline) {
      const y = current.getFullYear();
      const m = current.getMonth();
      const d = current.getDate();
      const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

      if (!initialBlockedDates.includes(dateStr)) {
        availableWorkingDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    // Basic Omakase: 10+ days -> available, 7-9 days -> negotiate, <7 days -> unavailable
    if (availableWorkingDays >= 10) {
      basicStatus = 'available';
    } else if (availableWorkingDays >= 7) {
      basicStatus = 'negotiate';
    } else {
      basicStatus = 'unavailable';
    }

    // Live2D + Omakase: 15+ days -> available, 7-14 days -> negotiate, <7 days -> unavailable
    if (availableWorkingDays >= 15) {
      live2DStatus = 'available';
    } else if (availableWorkingDays >= 7) {
      live2DStatus = 'negotiate';
    } else {
      live2DStatus = 'unavailable';
    }
  }

  const tooltipText = t('tooltip_text');

  return (
    <div className="client-public-container">
      <div className="sharp-card">
        <div className="brand-header">
          <span className="brand-logo">{t('brand_logo')}</span>
          <LanguageSwitcher />
        </div>
        
        <h1 className="title" style={{ marginBottom: '2.25rem' }}>
          {t('header_title_prefix')}
          <br className="mobile-br"/>
          <span className="highlight-date">{formatDate(earliestDateObj)}</span>
          {t('header_title_suffix')}
        </h1>
        
        <div className="client-calendar-wrapper">
          <Calendar
            blockedDates={initialBlockedDates}
            isAdmin={false}
            selectedDeadline={selectedDeadline}
            onSelectDeadline={handleSelectDeadline}
          />

          {/* Deadline Info Panel */}
          <div className="deadline-info-container">
            {selectedDeadline ? (
              <div className="deadline-card">
                <h3 className="deadline-card-title">
                  {t('desired_deadline_title')} <span className="highlight-deadline-text">{formatDate(selectedDeadline)}</span>
                </h3>
                <div className="deadline-status-list">
                  <div className="deadline-status-item">
                    <span className="status-label">{t('service_basic')}</span>
                    <span
                      className={`status-badge ${basicStatus} ${activeTooltip === 'basic' ? 'tooltip-visible' : ''}`}
                      data-tooltip={basicStatus === 'negotiate' ? tooltipText : undefined}
                      onClick={() => basicStatus === 'negotiate' && toggleTooltip('basic')}
                    >
                      {basicStatus === 'available' ? t('status_available') : basicStatus === 'negotiate' ? t('status_negotiate') : t('status_unavailable')}
                    </span>
                  </div>
                  <div className="deadline-status-item">
                    <span className="status-label">{t('service_live2d')}</span>
                    <span
                      className={`status-badge ${live2DStatus} ${activeTooltip === 'live2D' ? 'tooltip-visible' : ''}`}
                      data-tooltip={live2DStatus === 'negotiate' ? tooltipText : undefined}
                      onClick={() => live2DStatus === 'negotiate' && toggleTooltip('live2D')}
                    >
                      {live2DStatus === 'available' ? t('status_available') : live2DStatus === 'negotiate' ? t('status_negotiate') : t('status_unavailable')}
                    </span>
                  </div>
                </div>
                <p className="deadline-caption">
                  {t('deadline_caption')}
                </p>
              </div>
            ) : (
              <div className="deadline-placeholder">
                <div className="deadline-placeholder-icon">
                  <CalendarIcon size={20} />
                </div>
                <div>
                  <strong>{t('deadline_placeholder_title')}</strong>
                  <p style={{ fontSize: '13px', marginTop: '2px', opacity: 0.8 }}>
                    {t('deadline_placeholder_desc')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="app-footer">
        {t('footer_text')}
      </footer>
    </div>
  );
}
