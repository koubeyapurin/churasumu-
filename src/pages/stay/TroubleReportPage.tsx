import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { TroubleReport } from '../../types';
import styles from './TroubleReportPage.module.css';

const categories = [
  { value: 'facility', label: '設備・インフラ', icon: '🏗️' },
  { value: 'appliance', label: '家電・器具', icon: '📺' },
  { value: 'wifi', label: 'Wi-Fi・インターネット', icon: '📶' },
  { value: 'cleaning', label: '清掃・衛生', icon: '🧹' },
  { value: 'other', label: 'その他', icon: '❓' },
];

const statusLabel = {
  open: '受付中',
  in_progress: '対応中',
  resolved: '解決済み',
};

const statusBadge = {
  open: 'badge-red',
  in_progress: 'badge-orange',
  resolved: 'badge-green',
};

export default function TroubleReportPage() {
  const { currentUser, activeBooking, troubleReports, addTroubleReport } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<TroubleReport['category']>('facility');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const myReports = troubleReports.filter(r => r.userId === currentUser?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBooking) return;
    addTroubleReport({
      bookingId: activeBooking.id,
      userId: currentUser!.id,
      category,
      title,
      description,
      photoUrls: [],
      status: 'open',
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      setTitle('');
      setDescription('');
    }, 2000);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>トラブル報告</h1>
        <p>設備の不具合などをご報告ください</p>
      </div>

      {!showForm ? (
        <>
          <button className="btn btn-primary" style={{ marginBottom: 20 }} onClick={() => setShowForm(true)}>
            + 新しいトラブルを報告
          </button>

          <h3 className={styles.sectionTitle}>過去の報告</h3>
          {myReports.length === 0 ? (
            <p className={styles.empty}>報告はありません</p>
          ) : (
            <div className={styles.reportList}>
              {myReports.map(r => (
                <div key={r.id} className={styles.reportCard}>
                  <div className={styles.reportHeader}>
                    <span className={`badge ${statusBadge[r.status]}`}>
                      <span className={`status-dot ${r.status}`} />
                      {statusLabel[r.status]}
                    </span>
                    <span className={styles.reportDate}>
                      {new Date(r.createdAt).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                  <h4 className={styles.reportTitle}>{r.title}</h4>
                  <p className={styles.reportDesc}>{r.description}</p>
                  <span className={styles.reportCategory}>
                    {categories.find(c => c.value === r.category)?.icon} {categories.find(c => c.value === r.category)?.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          {submitted && (
            <div className={styles.successMsg}>✅ 報告を受け付けました。担当者が確認します。</div>
          )}
          <h3 className={styles.formTitle}>トラブル詳細を入力</h3>

          <div className="form-group">
            <label>カテゴリ</label>
            <div className={styles.categoryGrid}>
              {categories.map(c => (
                <button
                  key={c.value}
                  type="button"
                  className={`${styles.categoryBtn} ${category === c.value ? styles.categoryBtnSelected : ''}`}
                  onClick={() => setCategory(c.value as TroubleReport['category'])}
                >
                  <span>{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>件名</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="例：エアコンから異音がする"
              required
            />
          </div>

          <div className="form-group">
            <label>詳細</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="いつから・どのような症状か詳しくお知らせください"
              rows={4}
              required
            />
          </div>

          <div className={styles.photoArea}>
            <span className={styles.photoIcon}>📷</span>
            <span className={styles.photoText}>写真を添付（任意）</span>
            <span className={styles.photoBadge}>モック</span>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className="btn btn-primary" disabled={submitted}>
              報告を送信
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
              キャンセル
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
