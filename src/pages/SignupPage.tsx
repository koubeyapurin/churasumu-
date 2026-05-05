import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import styles from './LoginPage.module.css';

export default function SignupPage() {
  const { t } = useTranslation();
  const { register } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nationality, setNationality] = useState('');
  const [purpose, setPurpose] = useState<'migration' | 'nomad' | 'tourism'>('migration');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = register({
      name,
      email,
      nationality,
      purpose,
    });

    if (!result.ok) {
      setError(
        result.reason === 'duplicate_email'
          ? t('signup.duplicateEmail')
          : t('common.error'),
      );
      return;
    }

    navigate('/stay');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoArea}>
          <span className={styles.logoEmoji}>🏝️</span>
          <h1 className={styles.logoText}>{t('signup.title')}</h1>
          <p className={styles.tagline}>{t('signup.tagline')}</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label>{t('signup.name')}</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
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
            <label>{t('signup.nationality')}</label>
            <input
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              placeholder={t('signup.nationalityPlaceholder')}
            />
          </div>
          <div className="form-group">
            <label>{t('signup.purpose')}</label>
            <select value={purpose} onChange={(e) => setPurpose(e.target.value as 'migration' | 'nomad' | 'tourism')}>
              <option value="migration">{t('onboarding.relocation')}</option>
              <option value="nomad">{t('signup.nomad')}</option>
              <option value="tourism">{t('onboarding.vacation')}</option>
            </select>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            {t('signup.createAccount')}
          </button>
        </form>

        <div className={styles.divider}>
          <span>{t('signup.haveAccount')}</span>
        </div>

        <Link to="/login" className="btn btn-secondary btn-lg" style={{ width: '100%' }}>
          {t('signup.backToLogin')}
        </Link>
      </div>
    </div>
  );
}
