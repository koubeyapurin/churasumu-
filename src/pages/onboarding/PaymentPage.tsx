import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import styles from './PaymentPage.module.css';

type PaymentState = {
  total?: number;
  checkIn?: string;
  checkOut?: string;
  planId?: string;
  propertyId?: string;
  optionIds?: string[];
};

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, createBooking } = useApp();
  const state = (location.state as PaymentState | null) ?? null;

  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [paid, setPaid] = useState(false);

  const total = state?.total ?? 85000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentUser && state?.planId && state?.propertyId && state?.checkIn && state?.checkOut) {
      createBooking({
        userId: currentUser.id,
        propertyId: state.propertyId,
        planId: state.planId,
        optionIds: state.optionIds ?? [],
        checkIn: state.checkIn,
        checkOut: state.checkOut,
        totalPrice: total,
        status: 'active',
      });
    }

    setPaid(true);
  };

  if (paid) {
    return (
      <div className="page">
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✅</div>
          <h2>お支払いが完了しました</h2>
          <p>予約内容を反映し、滞在管理ページへ進める状態になりました。</p>
          <p className={styles.successSub}>
            スマートロック情報や設備案内は滞在管理ページから確認できます。
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/stay')}>
            滞在管理へ進む
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>料金確認・決済</h1>
      </div>

      <div className={styles.priceCard}>
        <div className={styles.priceRow}>
          <span>請求金額</span>
          <span>¥{total.toLocaleString()}</span>
        </div>
        <div className={styles.priceRow}>
          <span>お支払い総額</span>
          <strong>¥{total.toLocaleString()}</strong>
        </div>
        <div className={styles.priceNote}>モック決済のため、実際の請求は行われません。</div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <h3 className={styles.formTitle}>クレジットカード情報</h3>
        <div className={styles.mockBadge}>モック決済: 入力内容は保存されません。</div>

        <div className="form-group">
          <label>カード番号</label>
          <input
            type="text"
            maxLength={19}
            placeholder="1234 5678 9012 3456"
            value={cardNum}
            onChange={(e) =>
              setCardNum(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())
            }
            required
          />
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label>有効期限</label>
            <input type="text" placeholder="MM/YY" maxLength={5} value={expiry} onChange={(e) => setExpiry(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>CVV</label>
            <input type="text" placeholder="123" maxLength={4} value={cvv} onChange={(e) => setCvv(e.target.value)} required />
          </div>
        </div>
        <div className="form-group">
          <label>カード名義</label>
          <input type="text" placeholder="TARO TAMAKI" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className={styles.agreementBox}>
          <label className={styles.checkLabel}>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} required />
            <span>利用規約・キャンセルポリシー・個人情報の取り扱いに同意します。</span>
          </label>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={!agreed}>
          ¥{total.toLocaleString()} を支払う
        </button>
      </form>
    </div>
  );
}
