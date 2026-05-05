import { mockBookings, mockProperties, mockUsers } from '../../data/mockData';
import styles from './AdminRevenuePage.module.css';

export default function AdminRevenuePage() {
  const totalRevenue = mockBookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const revenueByProperty = mockProperties.map(p => {
    const bookings = mockBookings.filter(b => b.propertyId === p.id && b.status !== 'cancelled');
    const revenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    return { property: p, bookings: bookings.length, revenue };
  }).sort((a, b) => b.revenue - a.revenue);

  const prospects = mockUsers.filter(u => u.purpose === 'migration' || u.purpose === 'nomad');

  return (
    <div className="page">
      <div className="page-header">
        <h1>売上サマリー</h1>
      </div>

      <div className={styles.totalCard}>
        <span className={styles.totalLabel}>今月の総売上</span>
        <span className={styles.totalValue}>¥{totalRevenue.toLocaleString()}</span>
        <span className={styles.totalSub}>アクティブ予約 {mockBookings.filter(b => b.status === 'active').length}件</span>
      </div>

      <h3 className={styles.sectionTitle}>物件別売上</h3>
      <div className={styles.propertyList}>
        {revenueByProperty.map(({ property, bookings, revenue }) => (
          <div key={property.id} className={styles.propertyRow}>
            <div className={styles.propInfo}>
              <span className={styles.propName}>{property.name}</span>
              <span className={styles.propBookings}>{bookings}件の予約</span>
            </div>
            <span className={styles.propRevenue}>¥{revenue.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <h3 className={styles.sectionTitle}>見込み客リスト</h3>
      <div className={styles.prospectList}>
        {prospects.map(u => (
          <div key={u.id} className={styles.prospectCard}>
            <span className={styles.prospectName}>{u.name}</span>
            <span className={styles.prospectPurpose}>
              {u.purpose === 'migration' ? '🏡 移住検討' : '💻 ノマド'}
            </span>
            <span className={styles.prospectEmail}>{u.email}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
