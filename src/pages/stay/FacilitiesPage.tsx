import { useApp } from '../../context/AppContext';
import { mockProperties } from '../../data/mockData';
import styles from './FacilitiesPage.module.css';

const facilityGuides = [
  { icon: '❄️', title: 'エアコン', desc: 'リモコンはテレビ台の上。冷房26〜28℃、暖房20〜22℃が目安。フィルターは月1回清掃してください。' },
  { icon: '🚿', title: 'シャワー・給湯器', desc: '給湯器の設定温度は40〜42℃推奨。追い炊き機能あり。水圧が低い場合は管理室にご連絡ください。' },
  { icon: '🫧', title: '洗濯機', desc: '洗剤は洗濯槽上の棚に常備。洗濯コースは「標準」推奨。使用後はフタを開けておいてください。' },
  { icon: '🔥', title: 'IHコンロ', desc: '電源ボタンを押してから火力調節。鉄・ステンレス鍋対応。IH非対応鍋は使用不可。' },
  { icon: '📶', title: 'Wi-Fi', desc: 'SSID: CHURASUMU-[部屋番号]。パスワードは入室書類参照。ルーターは玄関の棚の上。' },
  { icon: '🗑️', title: 'ゴミ出し', desc: '燃えるゴミ：月水金8時まで。プラ：第2・4火。缶/ビン/ペット：毎週木。ゴミ置き場：1F駐輪場横。' },
];

export default function FacilitiesPage() {
  const { activeBooking } = useApp();
  const property = activeBooking ? mockProperties.find(p => p.id === activeBooking.propertyId) : null;

  return (
    <div className="page">
      <div className="page-header">
        <h1>設備・施設情報</h1>
        {property && <p>{property.name}</p>}
      </div>

      {property && (
        <div className={styles.amenityCard}>
          <h3 className={styles.cardTitle}>設備一覧</h3>
          <div className={styles.amenityGrid}>
            {property.amenities.map(a => (
              <span key={a} className={styles.amenityItem}>✓ {a}</span>
            ))}
          </div>
        </div>
      )}

      <h3 className={styles.sectionTitle}>設備の使い方</h3>
      <div className={styles.guideList}>
        {facilityGuides.map(g => (
          <div key={g.title} className={styles.guideCard}>
            <span className={styles.guideIcon}>{g.icon}</span>
            <div>
              <h4 className={styles.guideTitle}>{g.title}</h4>
              <p className={styles.guideDesc}>{g.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
