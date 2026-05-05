import { mockBookings, mockProperties, mockPlans, mockUsers } from '../../data/mockData';
import styles from './AdminBookingsPage.module.css';

const statusLabel: Record<string, string> = {
  pending: '確認中',
  confirmed: '確定',
  active: '滞在中',
  completed: '完了',
  cancelled: 'キャンセル',
};

const statusBadge: Record<string, string> = {
  pending: 'badge-orange',
  confirmed: 'badge-blue',
  active: 'badge-green',
  completed: 'badge-gray',
  cancelled: 'badge-red',
};

export default function AdminBookingsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>予約・契約管理</h1>
        <p>全{mockBookings.length}件の予約</p>
      </div>

      <div className={styles.list}>
        {mockBookings.map(b => {
          const user = mockUsers.find(u => u.id === b.userId);
          const property = mockProperties.find(p => p.id === b.propertyId);
          const plan = mockPlans.find(p => p.id === b.planId);
          return (
            <div key={b.id} className={styles.bookingCard}>
              <div className={styles.bookingHeader}>
                <span className={`badge ${statusBadge[b.status]}`}>{statusLabel[b.status]}</span>
                <span className={styles.bookingId}>#{b.id}</span>
              </div>
              <div className={styles.bookingInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>ゲスト</span>
                  <span>{user?.name}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>物件</span>
                  <span>{property?.name}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>プラン</span>
                  <span>{plan?.name}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>期間</span>
                  <span>{b.checkIn} 〜 {b.checkOut}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>金額</span>
                  <strong className={styles.price}>¥{b.totalPrice.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
