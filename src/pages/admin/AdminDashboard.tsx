import { Link } from 'react-router-dom';
import { mockProperties, mockBookings, mockTroubleReports, mockUsers } from '../../data/mockData';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const activeBookings = mockBookings.filter(b => b.status === 'active');
  const openTroubles = mockTroubleReports.filter(t => t.status !== 'resolved');
  const totalRevenue = mockBookings
    .filter(b => b.status === 'active' || b.status === 'completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const stats = [
    { label: '稼働中予約', value: activeBookings.length, icon: '🏠', color: '#0ea5e9' },
    { label: '物件数', value: mockProperties.length, icon: '🗝️', color: '#8b5cf6' },
    { label: '未対応トラブル', value: openTroubles.length, icon: '🔧', color: '#f97316' },
    { label: '今月売上', value: `¥${totalRevenue.toLocaleString()}`, icon: '💰', color: '#22c55e' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>管理ダッシュボード</h1>
        <p>タマキホーム 物件・予約管理</p>
      </div>

      <div className={styles.statsGrid}>
        {stats.map(s => (
          <div key={s.label} className={styles.statCard} style={{ borderLeftColor: s.color }}>
            <span className={styles.statIcon}>{s.icon}</span>
            <div className={styles.statInfo}>
              <span className={styles.statValue} style={{ color: s.color }}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <h3 className={styles.sectionTitle}>物件稼働率</h3>
      <div className={styles.propertyList}>
        {mockProperties.map(p => (
          <div key={p.id} className={styles.propertyRow}>
            <div className={styles.propertyInfo}>
              <span className={styles.propertyName}>{p.name}</span>
              <span className={styles.propertyArea}>{p.area}</span>
            </div>
            <div className={styles.occupancyBar}>
              <div className={styles.barBg}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${p.occupancyRate}%`,
                    background: p.occupancyRate > 80 ? '#22c55e' : p.occupancyRate > 60 ? '#f59e0b' : '#ef4444',
                  }}
                />
              </div>
              <span className={styles.occupancyValue}>{p.occupancyRate}%</span>
            </div>
          </div>
        ))}
      </div>

      <h3 className={styles.sectionTitle}>最近のトラブル報告</h3>
      {openTroubles.map(t => {
        const user = mockUsers.find(u => u.id === t.userId);
        return (
          <div key={t.id} className={styles.troubleCard}>
            <div className={styles.troubleHeader}>
              <span className={`badge ${t.status === 'open' ? 'badge-red' : 'badge-orange'}`}>
                <span className={`status-dot ${t.status}`} />
                {t.status === 'open' ? '未対応' : '対応中'}
              </span>
              <span className={styles.troubleDate}>{new Date(t.createdAt).toLocaleDateString('ja-JP')}</span>
            </div>
            <p className={styles.troubleTitle}>{t.title}</p>
            <p className={styles.troubleUser}>報告者: {user?.name}</p>
          </div>
        );
      })}

      <div className={styles.quickLinks}>
        <Link to="/admin/bookings" className={styles.quickLink}>予約一覧を見る →</Link>
        <Link to="/admin/troubles" className={styles.quickLink}>全トラブルを見る →</Link>
        <Link to="/admin/revenue" className={styles.quickLink}>売上詳細を見る →</Link>
      </div>
    </div>
  );
}
