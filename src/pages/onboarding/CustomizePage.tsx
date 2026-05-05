import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockPlans, mockOptions, mockProperties } from '../../data/mockData';
import styles from './CustomizePage.module.css';

export default function CustomizePage() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const plan = mockPlans.find(p => p.id === planId) ?? mockPlans[1];

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedProperty, setSelectedProperty] = useState(mockProperties[0].id);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const toggleOption = (id: string) => {
    setSelectedOptions(prev =>
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    );
  };

  const optionTotal = mockOptions
    .filter(o => selectedOptions.includes(o.id))
    .reduce((sum, o) => sum + o.price, 0);
  const property = mockProperties.find(p => p.id === selectedProperty)!;
  const total = plan.basePrice + optionTotal + (property.monthlyRate - plan.basePrice);

  const handleNext = () => navigate('/onboarding/payment', {
    state: { planId: plan.id, optionIds: selectedOptions, propertyId: selectedProperty, checkIn, checkOut, total }
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1>プランをカスタマイズ</h1>
        <p>{plan.name}をベースに自分好みに調整できます</p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>物件を選ぶ</h3>
        <div className={styles.propertyList}>
          {mockProperties.map(p => (
            <div
              key={p.id}
              className={`${styles.propertyCard} ${selectedProperty === p.id ? styles.propertyCardSelected : ''}`}
              onClick={() => setSelectedProperty(p.id)}
            >
              <div className={styles.propertyHeader}>
                <span className={styles.propertyName}>{p.name}</span>
                <span className={styles.propertyPrice}>¥{p.monthlyRate.toLocaleString()}/月</span>
              </div>
              <p className={styles.propertyArea}>📍 {p.address}</p>
              <div className={styles.amenityTags}>
                {p.amenities.slice(0, 4).map(a => (
                  <span key={a} className={styles.amenityTag}>{a}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>滞在期間</h3>
        <div className="grid-2">
          <div className="form-group">
            <label>チェックイン</label>
            <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
          </div>
          <div className="form-group">
            <label>チェックアウト</label>
            <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>オプションを追加</h3>
        <div className={styles.optionList}>
          {mockOptions.map(opt => (
            <div
              key={opt.id}
              className={`${styles.optionCard} ${selectedOptions.includes(opt.id) ? styles.optionCardSelected : ''}`}
              onClick={() => toggleOption(opt.id)}
            >
              <div className={styles.optionLeft}>
                <span className={styles.optionIcon}>{opt.icon}</span>
                <div>
                  <div className={styles.optionName}>{opt.name}</div>
                  <div className={styles.optionDesc}>{opt.description}</div>
                </div>
              </div>
              <div className={styles.optionRight}>
                <span className={styles.optionPrice}>+¥{opt.price.toLocaleString()}</span>
                <div className={`${styles.checkbox} ${selectedOptions.includes(opt.id) ? styles.checkboxChecked : ''}`}>
                  {selectedOptions.includes(opt.id) && '✓'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span>物件費用</span>
          <span>¥{property.monthlyRate.toLocaleString()}/月</span>
        </div>
        <div className={styles.summaryRow}>
          <span>オプション</span>
          <span>+¥{optionTotal.toLocaleString()}/月</span>
        </div>
        <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
          <span>合計</span>
          <span>¥{(property.monthlyRate + optionTotal).toLocaleString()}/月</span>
        </div>
        <button
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: '16px' }}
          onClick={handleNext}
          disabled={!checkIn || !checkOut}
        >
          料金確認へ進む →
        </button>
      </div>
    </div>
  );
}
