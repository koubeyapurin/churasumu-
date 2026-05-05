import type { RecommendAnswers } from '../types';
import { mockPlans } from '../data/mockData';

interface PlanScore {
  planId: string;
  score: number;
  reasons: string[];
}

/**
 * ユーザーの回答に基づいてプランをスコアリング
 * より正確なマッチングを実現
 */
export function scorePlans(answers: RecommendAnswers): PlanScore[] {
  return mockPlans.map((plan) => {
    const reasons: string[] = [];
    let score = 0;

    // 期間のマッチング (最重要: 40点)
    if (answers.duration === 'short' && plan.type === 'short') {
      score += 40;
      reasons.push('期間が完全に一致');
    } else if (answers.duration === 'medium' && plan.type === 'standard') {
      score += 40;
      reasons.push('期間が完全に一致');
    } else if (answers.duration === 'long' && plan.type === 'long') {
      score += 40;
      reasons.push('期間が完全に一致');
    } else if (plan.type === 'standard') {
      // スタンダードプランはすべての期間に対応
      score += 25;
      reasons.push('スタンダードプランで対応可能');
    } else {
      score += 5;
    }

    // 目的のマッチング (20点)
    if (answers.purpose === 'work') {
      if (plan.features.some((f) => f.includes('テレワーク') || f.includes('Wi-Fi'))) {
        score += 20;
        reasons.push('リモートワーク環境が充実');
      } else {
        score += 8;
      }
    } else if (answers.purpose === 'tourism') {
      if (plan.features.some((f) => f.includes('観光') || f.includes('地域'))) {
        score += 20;
        reasons.push('観光・リフレッシュに最適');
      } else {
        score += 5;
      }
    } else if (answers.purpose === 'migration') {
      if (plan.features.some((f) => f.includes('移住') || f.includes('相談'))) {
        score += 20;
        reasons.push('移住検討者向けサポート充実');
      } else {
        score += 12;
        reasons.push('長期滞在で移住検討が可能');
      }
    }

    // 優先度のマッチング (15点)
    if (answers.priority === 'price') {
      if (plan.basePrice < 150000) {
        score += 15;
        reasons.push('コスト効率が良い');
      } else {
        score += 5;
      }
    } else if (answers.priority === 'location') {
      score += 8;
      reasons.push('立地条件を提供');
    } else if (answers.priority === 'community') {
      if (plan.features.some((f) => f.includes('コミュニティ') || f.includes('交流'))) {
        score += 15;
        reasons.push('コミュニティ機能が充実');
      } else {
        score += 5;
      }
    }

    // 追加ボーナス
    if (plan.features.length >= 5) {
      score += 10;
      reasons.push('機能が充実');
    }

    return {
      planId: plan.id,
      score,
      reasons,
    };
  }).sort((a, b) => b.score - a.score);
}

/**
 * スコアリング結果から最適なプランを選択
 */
export function recommendBestPlan(answers: RecommendAnswers) {
  const scores = scorePlans(answers);
  const topScore = scores[0];
  return mockPlans.find((p) => p.id === topScore.planId)!;
}

/**
 * 同点の複数プランを取得 (ユーザーに選択肢を提供)
 */
export function getTopPlans(answers: RecommendAnswers, limit: number = 3) {
  const scores = scorePlans(answers);
  return scores
    .slice(0, limit)
    .map((s) => ({
      plan: mockPlans.find((p) => p.id === s.planId)!,
      score: s.score,
      reasons: s.reasons,
    }));
}
