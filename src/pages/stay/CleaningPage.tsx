import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './CleaningPage.module.css';

const timeSlots = ['09:00〜11:00', '11:00〜13:00', '14:00〜16:00', '16:00〜18:00'];

export default function CleaningPage() {
  const { currentUser, activeBooking, addCleaningRequest, cleaningRequests } = useApp();
  const [date, setDate] = useState('');
  const [time, setTime] = useState(timeSlots[0]);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const myRequests = cleaningRequests.filter(r => r.userId === currentUser?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBooking) return;
    addCleaningRequest({
      bookingId: activeBooking.id,
      userId: currentUser!.id,
      preferredDate: date,
      preferredTime: time,
      notes,
      status: 'pending',
    });
    setSubmitted(true);
    setDate('');
    setNotes('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>清掃リクエスト</h1>
        <p>追加清掃をご希望の場合はお申し込みください（3,000円〜）</p>
      </div>

      {submitted && (
        <div className={styles.successMsg}>✅ 清掃リクエストを受け付けました</div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="form-group">
          <label>希望日</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>希望時間帯</label>
          <select value={time} onChange={e => setTime(e.target.value)}>
            {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>特記事項（任意）</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="特に重点的に清掃してほしい箇所など" />
        </div>
        <button type="submit" className="btn btn-primary">申し込む</button>
      </form>

      {myRequests.length > 0 && (
        <>
          <h3 className={styles.sectionTitle}>申し込み履歴</h3>
          {myRequests.map(r => (
            <div key={r.id} className={styles.requestCard}>
              <div className={styles.reqRow}>
                <span>{r.preferredDate} {r.preferredTime}</span>
                <span className={`badge ${r.status === 'confirmed' ? 'badge-green' : r.status === 'completed' ? 'badge-blue' : 'badge-orange'}`}>
                  {r.status === 'pending' ? '確認中' : r.status === 'confirmed' ? '確定' : '完了'}
                </span>
              </div>
              {r.notes && <p className={styles.reqNotes}>{r.notes}</p>}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
