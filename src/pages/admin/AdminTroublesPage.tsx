import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockUsers, mockProperties, mockBookings } from '../../data/mockData';
import styles from './AdminTroublesPage.module.css';

type Status = 'open' | 'in_progress' | 'resolved';

const statusLabel: Record<Status, string> = {
  open: '未対応',
  in_progress: '対応中',
  resolved: '解決済み',
};

export default function AdminTroublesPage() {
  const { troubleReports } = useApp();
  const [filter, setFilter] = useState<Status | 'all'>('all');

  const filtered = filter === 'all' ? troubleReports : troubleReports.filter(t => t.status === filter);

  const getProperty = (bookingId: string) => {
    const booking = mockBookings.find(b => b.id === bookingId);
    return booking ? mockProperties.find(p => p.id === booking.propertyId) : null;
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>トラブル報告一覧</h1>
      </div>

      <div className={styles.filters}>
        {(['all', 'open', 'in_progress', 'resolved'] as const).map(f => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? '全て' : statusLabel[f as Status]}
            <span className={styles.filterCount}>
              {f === 'all' ? troubleReports.length : troubleReports.filter(t => t.status === f).length}
            </span>
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {filtered.map(t => {
          const user = mockUsers.find(u => u.id === t.userId);
          const property = getProperty(t.bookingId);
          return (
            <div key={t.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={`badge ${t.status === 'open' ? 'badge-red' : t.status === 'in_progress' ? 'badge-orange' : 'badge-green'}`}>
                  <span className={`status-dot ${t.status}`} />
                  {statusLabel[t.status as Status]}
                </span>
                <span className={styles.date}>{new Date(t.createdAt).toLocaleDateString('ja-JP')}</span>
              </div>
              <h4 className={styles.title}>{t.title}</h4>
              <p className={styles.desc}>{t.description}</p>
              <div className={styles.meta}>
                <span>👤 {user?.name}</span>
                <span>🏠 {property?.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
