import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import styles from './Layout.module.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  const guestNav = [
    { to: '/stay', label: t('stay.title'), icon: '🏠' },
    { to: '/community', label: t('community.title'), icon: '👥' },
    { to: '/migration', label: t('migration.title'), icon: '🌴' },
    { to: '/chat', label: t('chat.title'), icon: '💬' },
  ];

  const adminNav = [
    { to: '/admin', label: t('admin.dashboard'), icon: '📊' },
    { to: '/admin/bookings', label: t('admin.bookings'), icon: '📋' },
    { to: '/admin/troubles', label: t('admin.troubles'), icon: '🔧' },
    { to: '/admin/revenue', label: t('admin.revenue'), icon: '💰' },
  ];

  const nav = currentUser?.role === 'admin' ? adminNav : guestNav;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <NavLink to={currentUser?.role === 'admin' ? '/admin' : '/stay'} className={styles.logo}>
          <span className={styles.logoIcon}>🌊</span>
          <span>{t('common.appName')}</span>
        </NavLink>
        <div className={styles.headerRight}>
          <LanguageSwitcher />
          {currentUser && (
            <>
              <span className={styles.userName}>{currentUser.name}</span>
              <button onClick={handleLogout} className={styles.logoutBtn}>{t('common.logout')}</button>
            </>
          )}
        </div>
      </header>

      <main className={styles.main}>
        {children}
      </main>

      {currentUser && (
        <nav className={styles.bottomNav}>
          {nav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}
