import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { mockPlans } from '../../data/mockData';
import { recommendBestPlan, getTopPlans } from '../../utils/recommendationEngine';
import type { RecommendAnswers } from '../../types';
import styles from './RecommendPage.module.css';

export default function RecommendPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<RecommendAnswers>({ purpose: null, duration: null, priority: null });
  const [result, setResult] = useState<typeof mockPlans[0] | null>(null);
  const [topPlans, setTopPlans] = useState<Array<any> | null>(null);

  const questions = [
    {
      key: 'purpose' as const,
      question: t('onboarding.question2'),
      options: [
        { value: 'work', label: t('onboarding.work'), icon: '💻' },
        { value: 'tourism', label: t('onboarding.vacation'), icon: '🌺' },
        { value: 'migration', label: t('onboarding.relocation'), icon: '🏡' },
      ],
    },
    {
      key: 'duration' as const,
      question: t('onboarding.question1'),
      options: [
        { value: 'short', label: t('onboarding.shortTerm'), icon: '📅' },
        { value: 'medium', label: t('onboarding.medium'), icon: '🗓️' },
        { value: 'long', label: t('onboarding.longTerm'), icon: '📆' },
      ],
    },
    {
      key: 'priority' as const,
      question: t('onboarding.question3'),
      options: [
        { value: 'price', label: t('onboarding.lowBudget'), icon: '💴' },
        { value: 'location', label: t('onboarding.midBudget'), icon: '📍' },
        { value: 'community', label: t('onboarding.highBudget'), icon: '🤝' },
      ],
    },
  ];

  const handleAnswer = (value: string) => {
    const q = questions[step];
    const newAnswers = { ...answers, [q.key]: value } as RecommendAnswers;
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(s => s + 1);
    } else {
      const topPlans = getTopPlans(newAnswers, 3);
      const bestPlan = recommendBestPlan(newAnswers);
      setTopPlans(topPlans);
      setResult(bestPlan);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({ purpose: null, duration: null, priority: null });
    setResult(null);
    setTopPlans(null);
  };

  if (result && topPlans) {
    return (
      <div className="page">
        <div className={styles.resultCard}>
          <div className={styles.resultBadge}>{t('onboarding.recommended')}</div>
          <h2 className={styles.resultTitle}>{result.name}</h2>
          <p className={styles.resultDesc}>{result.description}</p>
          <div className={styles.resultPrice}>
            <span className={styles.priceLabel}>{t('onboarding.duration')}</span>
            <span className={styles.priceValue}>¥{result.basePrice.toLocaleString()}</span>
            <span className={styles.priceSuffix}>/月〜</span>
          </div>
          <div className={styles.featureList}>
            {result.features.map(f => (
              <span key={f} className={styles.featureTag}>✓ {f}</span>
            ))}
          </div>
          
          {/* トッププランの理由を表示 */}
          {topPlans[0] && (
            <div className={styles.reasonsBox}>
              <h4 className={styles.reasonsTitle}>なぜこのプラン？</h4>
              <ul className={styles.reasonsList}>
                {topPlans[0].reasons.map((reason: string, i: number) => (
                  <li key={i}>{reason}</li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.resultActions}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate(`/onboarding/customize/${result.id}`)}
            >
              {t('onboarding.confirm')}
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>
              {t('common.back')}
            </button>
          </div>

          {/* 他のプランも提案 */}
          {topPlans.length > 1 && (
            <div className={styles.alternativePlans}>
              <h4 className={styles.alternativeTitle}>他のプランも検討</h4>
              <div className={styles.planGrid}>
                {topPlans.slice(1).map((item) => (
                  <div
                    key={item.plan.id}
                    className={styles.planOption}
                    onClick={() => navigate(`/onboarding/customize/${item.plan.id}`)}
                  >
                    <h5>{item.plan.name}</h5>
                    <p>¥{item.plan.basePrice.toLocaleString()}/月</p>
                    <small>スコア: {item.score}</small>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const q = questions[step];
  return (
    <div className="page">
      <div className={styles.container}>
        <div className={styles.progress}>
          {questions.map((_, i) => (
            <div
              key={i}
              className={`${styles.progressDot} ${i <= step ? styles.progressDotActive : ''}`}
            />
          ))}
        </div>

        <p className={styles.stepLabel}>質問 {step + 1} / {questions.length}</p>
        <h2 className={styles.question}>{q.question}</h2>

        <div className={styles.options}>
          {q.options.map(opt => (
            <button
              key={opt.value}
              className={styles.optionBtn}
              onClick={() => handleAnswer(opt.value)}
            >
              <span className={styles.optionIcon}>{opt.icon}</span>
              <span className={styles.optionLabel}>{opt.label}</span>
            </button>
          ))}
        </div>

        {step > 0 && (
          <button className={styles.backBtn} onClick={() => setStep(s => s - 1)}>
            ← {t('common.back')}
          </button>
        )}
      </div>
    </div>
  );
}
