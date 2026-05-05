import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './ExtendPage.module.css';

export default function ExtendPage() {
  const { activeBooking, extendStay } = useApp();
  const [newDate, setNewDate] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!activeBooking) return (
    <div className="page"><p>予約情報が見つかりません</p></div>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    extendStay(activeBooking.id, newDate);
    setSubmitted(true);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>滞在期間の延長申請</h1>
        <p>退去予定日の7日前までにお申し込みください</p>
      </div>

      <div className={styles.currentCard}>
        <div className={styles.currentRow}>
          <span>現在のチェックアウト</span>
          <strong>{new Date(activeBooking.checkOut).toLocaleDateString('ja-JP')}</strong>
        </div>
      </div>

      {submitted ? (
        <div className={styles.success}>
          <span className={styles.successIcon}>✅</span>
          <h3>延長申請を受け付けました</h3>
          <p>新チェックアウト日: {new Date(newDate).toLocaleDateString('ja-JP')}</p>
          <p className={styles.successNote}>空き状況を確認後、メールでご連絡します。</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label>希望する新しいチェックアウト日</label>
            <input
              type="date"
              value={newDate}
              min={activeBooking.checkOut}
              onChange={e => setNewDate(e.target.value)}
              required
            />
          </div>
          <div className={styles.notice}>
            ⚠️ 空き状況によってはご希望に添えない場合があります。延長料金は翌月分に合算請求されます。
          </div>
          <button type="submit" className="btn btn-primary">延長申請を送信</button>
        </form>
      )}
    </div>
  );
}
