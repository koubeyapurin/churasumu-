import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { mockProperties, mockPlans } from '../../data/mockData';
import styles from './StayHomePage.module.css';

export default function StayHomePage() {
  const { t, i18n } = useTranslation();
  const { currentUser, activeBooking, toggleLock } = useApp();

  if (!currentUser) return null;

  if (!activeBooking) {
    return (
      <div className="page">
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🏠</span>
          <h2>{t('stay.noActiveBookingTitle')}</h2>
          <p>{t('stay.noActiveBookingDescription')}</p>
          <Link to="/onboarding/recommend" className="btn btn-primary btn-lg">
            {t('common.choosePlan')}
          </Link>
        </div>
      </div>
    );
  }

  const property = mockProperties.find((p) => p.id === activeBooking.propertyId)!;
  const plan = mockPlans.find((p) => p.id === activeBooking.planId)!;
  const checkIn = new Date(activeBooking.checkIn);
  const checkOut = new Date(activeBooking.checkOut);
  const today = new Date();
  const daysLeft = Math.ceil((checkOut.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const locale = i18n.language === 'ja' ? 'ja-JP' : i18n.language === 'zh' ? 'zh-CN' : 'en-US';

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('stay.welcome', { name: currentUser.name.split(' ')[0] })} 👋</h1>
        <p>{t('stay.daysRemaining', { count: daysLeft })}</p>
      </div>

      <div className={styles.lockCard}>
        <div className={styles.lockInfo}>
          <div className={styles.lockStatus}>
            <span
              className={`${styles.lockDot} ${activeBooking.isLocked ? styles.locked : styles.unlocked}`}
            />
            <span>
              {activeBooking.isLocked ? t('stay.lockStatusLocked') : t('stay.lockStatusUnlocked')}
            </span>
          </div>
          <p className={styles.lockProperty}>{property.name}</p>
        </div>
        <button
          className={`btn ${activeBooking.isLocked ? 'btn-primary' : 'btn-danger'} btn-lg`}
          onClick={() => toggleLock(activeBooking.id)}
        >
          {activeBooking.isLocked ? `🔓 ${t('stay.unlock')}` : `🔒 ${t('stay.lock')}`}
        </button>
      </div>

      <div className={styles.stayCard}>
        <div className={styles.stayGrid}>
          <div className={styles.stayItem}>
            <span className={styles.stayLabel}>{t('stay.checkIn')}</span>
            <span className={styles.stayValue}>{checkIn.toLocaleDateString(locale)}</span>
          </div>
          <div className={styles.stayItem}>
            <span className={styles.stayLabel}>{t('stay.checkOut')}</span>
            <span className={styles.stayValue}>{checkOut.toLocaleDateString(locale)}</span>
          </div>
          <div className={styles.stayItem}>
            <span className={styles.stayLabel}>{t('stay.title')}</span>
            <span className={styles.stayValue}>
              {daysLeft} {t('common.days')}
            </span>
          </div>
          <div className={styles.stayItem}>
            <span className={styles.stayLabel}>{t('stay.plan')}</span>
            <span className={styles.stayValue}>{plan.name}</span>
          </div>
        </div>
      </div>

      <h3 className={styles.sectionTitle}>{t('stay.quickActions')}</h3>
      <div className={styles.actionGrid}>
        <Link to="/stay/trouble" className={styles.actionCard}>
          <span className={styles.actionIcon}>🔧</span>
          <span>{t('stay.troubleReport')}</span>
        </Link>
        <Link to="/stay/cleaning" className={styles.actionCard}>
          <span className={styles.actionIcon}>🧹</span>
          <span>{t('stay.cleaning')}</span>
        </Link>
        <Link to="/stay/extend" className={styles.actionCard}>
          <span className={styles.actionIcon}>📅</span>
          <span>{t('stay.extend')}</span>
        </Link>
        <Link to="/stay/facilities" className={styles.actionCard}>
          <span className={styles.actionIcon}>ℹ️</span>
          <span>{t('stay.facilities')}</span>
        </Link>
      </div>

      <Link to="/stay/emergency" className={styles.emergencyBtn}>
        🚨 {t('stay.emergency')}
      </Link>
    </div>
  );
}
