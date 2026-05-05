import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockProperties } from '../../data/mockData';
import styles from './MigrationPage.module.css';

type Tab = 'consult' | 'simulator' | 'favorites' | 'support';

export default function MigrationPage() {
  const { favorites, toggleFavorite } = useApp();
  const [tab, setTab] = useState<Tab>('consult');

  const tabs = [
    { key: 'consult' as Tab, label: '移住相談', icon: '🗓️' },
    { key: 'simulator' as Tab, label: '購入シミュレーター', icon: '📊' },
    { key: 'favorites' as Tab, label: 'お気に入り', icon: '⭐' },
    { key: 'support' as Tab, label: '生活サポート', icon: '🧭' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>移住導線</h1>
        <p>沖縄での中長期滞在から移住検討までを一つの画面で進められます。</p>
      </div>

      <div className={styles.tabs}>
        {tabs.map((item) => (
          <button
            key={item.key}
            className={`${styles.tab} ${tab === item.key ? styles.tabActive : ''}`}
            onClick={() => setTab(item.key)}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      {tab === 'consult' && <ConsultTab />}
      {tab === 'simulator' && <SimulatorTab />}
      {tab === 'favorites' && <FavoritesTab favorites={favorites} toggle={toggleFavorite} />}
      {tab === 'support' && <SupportTab />}
    </div>
  );
}

function ConsultTab() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', time: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={styles.successCard}>
        <span className={styles.successIcon}>✅</span>
        <h3>相談予約を受け付けました</h3>
        <p>担当スタッフが内容を確認後、登録メールアドレス宛にご連絡します。</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.formTitle}>移住相談予約フォーム</h3>
      <div className="grid-2">
        <div className="form-group">
          <label>お名前</label>
          <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
        </div>
        <div className="form-group">
          <label>電話番号</label>
          <input value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} required placeholder="090-XXXX-XXXX" />
        </div>
      </div>
      <div className="form-group">
        <label>メールアドレス</label>
        <input type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
      </div>
      <div className="grid-2">
        <div className="form-group">
          <label>希望日</label>
          <input type="date" value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} required />
        </div>
        <div className="form-group">
          <label>希望時間</label>
          <select value={form.time} onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))}>
            {['10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map((time) => (
              <option key={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>相談内容</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
          rows={3}
          placeholder="希望エリア、家族構成、内見したい条件など"
        />
      </div>
      <button type="submit" className="btn btn-primary">予約する</button>
    </form>
  );
}

function SimulatorTab() {
  const [duration, setDuration] = useState(6);
  const [rent, setRent] = useState(90000);
  const [living, setLiving] = useState(80000);

  const monthly = rent + living;
  const total = monthly * duration;
  const difference = Math.max(0, (200000 - monthly) * duration);

  return (
    <div className={styles.simulatorForm}>
      <h3 className={styles.formTitle}>物件購入前シミュレーター</h3>
      <div className="form-group">
        <label>滞在月数: {duration}ヶ月</label>
        <input type="range" min={1} max={12} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>月額家賃: ¥{rent.toLocaleString()}</label>
        <input type="range" min={50000} max={150000} step={5000} value={rent} onChange={(e) => setRent(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>生活費: ¥{living.toLocaleString()}</label>
        <input type="range" min={50000} max={150000} step={5000} value={living} onChange={(e) => setLiving(Number(e.target.value))} />
      </div>
      <div className={styles.simResult}>
        <div className={styles.simRow}>
          <span>月額合計</span>
          <strong>¥{monthly.toLocaleString()}</strong>
        </div>
        <div className={styles.simRow}>
          <span>{duration}ヶ月の総額</span>
          <strong>¥{total.toLocaleString()}</strong>
        </div>
        <div className={`${styles.simRow} ${styles.simSavings}`}>
          <span>想定差額</span>
          <strong className={styles.savingsValue}>¥{difference.toLocaleString()}</strong>
        </div>
      </div>
      <p className={styles.simNote}>比較用の簡易シミュレーションです。実際の費用は条件により変動します。</p>
    </div>
  );
}

function FavoritesTab({ favorites, toggle }: { favorites: string[]; toggle: (id: string) => void }) {
  const favoriteProperties = mockProperties.filter((property) => favorites.includes(property.id));

  return (
    <div>
      <h3 className={styles.sectionTitle}>お気に入り物件一覧</h3>
      {favoriteProperties.length === 0 ? (
        <div className={styles.supportCard}>
          <h4 className={styles.supportTitle}>お気に入りはまだありません</h4>
          <p>気になる物件を保存すると、ここからまとめて見返せます。</p>
        </div>
      ) : (
        favoriteProperties.map((property) => (
          <div key={property.id} className={styles.propertyCard}>
            <div className={styles.propInfo}>
              <h4 className={styles.propName}>{property.name}</h4>
              <p className={styles.propArea}>📍 {property.address}</p>
              <p className={styles.propPrice}>¥{property.monthlyRate.toLocaleString()}/月</p>
            </div>
            <button
              className={`${styles.favBtn} ${favorites.includes(property.id) ? styles.favBtnActive : ''}`}
              onClick={() => toggle(property.id)}
            >
              ★
            </button>
          </div>
        ))
      )}
    </div>
  );
}

const supportItems = [
  {
    icon: '🏛️',
    title: '行政・生活',
    items: ['住民票や転入手続きの案内', '生活インフラ契約の基本情報', 'エリア別の暮らし方ガイド'],
  },
  {
    icon: '🏫',
    title: '学校・子育て',
    items: ['保育園・学校探しの相談', '通学しやすいエリアの比較', '子育て支援制度の紹介'],
  },
  {
    icon: '🏥',
    title: '病院・医療',
    items: ['近隣病院の一覧', '夜間救急の案内', '英語対応可能な医療機関情報'],
  },
  {
    icon: '🚌',
    title: '交通',
    items: ['主要エリア間の移動手段', 'レンタカー・カーシェア情報', 'バス路線と通勤利便性の目安'],
  },
];

function SupportTab() {
  return (
    <div className={styles.supportList}>
      {supportItems.map((item) => (
        <div key={item.title} className={styles.supportCard}>
          <div className={styles.supportHeader}>
            <span className={styles.supportIcon}>{item.icon}</span>
            <h3 className={styles.supportTitle}>{item.title}</h3>
          </div>
          <ul className={styles.supportItems}>
            {item.items.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
