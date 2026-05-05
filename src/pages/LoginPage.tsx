import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import styles from './LoginPage.module.css';

const demoAccounts = [
  { key: 'login.guestMigration', email: 'misaki@example.com' },
  { key: 'login.guestNomad', email: 'kenji@example.com' },
  { key: 'login.guestTourism', email: 'sarah@example.com' },
  { key: 'login.admin', email: 'admin@tamaki-home.jp' },
];

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(email);
    if (ok) {
      const isAdmin = email === 'admin@tamaki-home.jp';
      navigate(isAdmin ? '/admin' : '/stay');
    } else {
      setError(t('login.welcomeBack'));
    }
  };

  const handleDemo = (demoEmail: string) => {
    const ok = login(demoEmail);
    if (ok) {
      const isAdmin = demoEmail === 'admin@tamaki-home.jp';
      navigate(isAdmin ? '/admin' : '/stay');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoArea}>
          <span className={styles.logoEmoji}>🏝️</span>
          <h1 className={styles.logoText}>{t('common.appName')}</h1>
          <p className={styles.tagline}>{t('login.tagline')}</p>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className="form-group">
            <label>{t('login.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>{t('login.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            {t('login.login')}
          </button>
        </form>

        <div className={styles.divider}>
          <span>{t('signup.noAccount')}</span>
        </div>

        <Link to="/signup" className="btn btn-secondary btn-lg" style={{ width: '100%', marginBottom: 16 }}>
          {t('signup.createAccount')}
        </Link>

        <div className={styles.divider}>
          <span>{t('login.demo')}</span>
        </div>

        <div className={styles.demoList}>
          {demoAccounts.map((acc) => (
            <button
              key={acc.email}
              onClick={() => handleDemo(acc.email)}
              className={styles.demoBtn}
            >
              <span className={styles.demoLabel}>{t(acc.key)}</span>
              <span className={styles.demoEmail}>{acc.email}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
