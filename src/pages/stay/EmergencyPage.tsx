import styles from './EmergencyPage.module.css';

const emergencyContacts = [
  { type: 'fire', label: '火災・救急', number: '119', color: '#ef4444', icon: '🚑' },
  { type: 'police', label: '警察', number: '110', color: '#3b82f6', icon: '🚔' },
  { type: 'tamaki', label: 'タマキホーム緊急', number: '098-XXX-XXXX', color: '#f97316', icon: '🏠', note: '24時間対応' },
];

export default function EmergencyPage() {
  return (
    <div className="page">
      <div className={styles.header}>
        <span className={styles.warningIcon}>🚨</span>
        <h1>緊急連絡</h1>
        <p>緊急時は以下に連絡してください</p>
      </div>

      <div className={styles.contactList}>
        {emergencyContacts.map(c => (
          <button key={c.type} className={styles.contactCard} style={{ borderColor: c.color }}>
            <span className={styles.contactIcon}>{c.icon}</span>
            <div className={styles.contactInfo}>
              <span className={styles.contactLabel}>{c.label}</span>
              <span className={styles.contactNumber} style={{ color: c.color }}>{c.number}</span>
              {c.note && <span className={styles.contactNote}>{c.note}</span>}
            </div>
            <span className={styles.callIcon}>📞</span>
          </button>
        ))}
      </div>

      <div className={styles.safetyBox}>
        <h3>⚠️ 避難・安全確認</h3>
        <ul className={styles.safetyList}>
          <li>避難経路は玄関脇の掲示板を確認してください</li>
          <li>消火器は玄関横・廊下に設置されています</li>
          <li>AEDは1階エントランスに設置されています</li>
          <li>集合場所: 建物前の公園</li>
        </ul>
      </div>
    </div>
  );
}
