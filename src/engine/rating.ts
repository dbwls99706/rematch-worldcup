import type { Match, MatchStats } from './types'

export type Grade = 'S' | 'A' | 'B' | 'C' | 'D' | 'F'

export interface ManagerRating {
  grade: Grade
  score: number // 0~100
  headline: string
  subhead: string
  axes: { label: string; value: number; note: string }[]
  verdict: 'triumph' | 'improved' | 'repeat' | 'worse'
  achievements: string[]
}

function points(gf: number, ga: number): number {
  if (gf > ga) return 3
  if (gf === ga) return 1
  return 0
}

export function computeRating(
  match: Match,
  myScore: [number, number],
  stats: MatchStats,
  subsUsed: number,
): ManagerRating {
  const real = match.realScore
  const myPts = points(myScore[0], myScore[1])
  const realPts = points(real[0], real[1])
  const myDiff = myScore[0] - myScore[1]
  const realDiff = real[0] - real[1]

  // ── 결과 축 (40) ──
  let resultScore = 40 + (myPts - realPts) * 9 + (myDiff - realDiff) * 3
  if (myPts === 3) resultScore += 6
  resultScore = clamp(resultScore, 6, 62)

  // ── 전술 축 (35) : xG 우위 + 점유 + 유효슈팅 ──
  const xgEdge = stats.xg[0] - stats.xg[1]
  const possEdge = (stats.possession - 50) / 50
  let tacticsScore = 18 + xgEdge * 6 + possEdge * 6 + (stats.shotsOnTarget[0] - stats.shotsOnTarget[1]) * 0.8
  tacticsScore = clamp(tacticsScore, 4, 33)

  // ── 효율 축 (25) : 결정력(골/xG) + 실점 억제 + 교체 절제 ──
  const finishing = stats.xg[0] > 0.3 ? myScore[0] / stats.xg[0] : 1
  let effScore = 8 + (finishing - 1) * 8 + (realDiff < 0 && myScore[1] < real[1] ? (real[1] - myScore[1]) * 2.5 : 0)
  if (myScore[1] === 0) effScore += 5 // 클린시트
  effScore -= Math.max(0, subsUsed - 3) * 2
  effScore = clamp(effScore, 3, 25)

  const total = Math.round(clamp(resultScore + tacticsScore + effScore, 1, 100))

  // 등급
  const grade: Grade =
    total >= 88 ? 'S' : total >= 76 ? 'A' : total >= 62 ? 'B' : total >= 48 ? 'C' : total >= 34 ? 'D' : 'F'

  // 판정 + 헤드라인
  let verdict: ManagerRating['verdict']
  let headline: string
  let subhead: string
  if (myPts > realPts || (myPts === realPts && myDiff > realDiff)) {
    if (realPts < 3 && myPts === 3) {
      verdict = 'triumph'
      headline = '당신은 역사를 바꿨습니다'
      subhead = `실제 ${real[0]}:${real[1]}의 결과를 ${myScore[0]}:${myScore[1]}(으)로 뒤집었습니다.`
    } else {
      verdict = 'improved'
      headline = myPts === 3 ? '역사를 넘어섰습니다' : '분명한 진전을 만들었다'
      subhead =
        myPts === 3
          ? `실제 ${real[0]}:${real[1]}를 넘어 ${myScore[0]}:${myScore[1]} 승리를 만들었습니다.`
          : `실제 ${real[0]}:${real[1]}보다 나아진 ${myScore[0]}:${myScore[1]} — 그날보다 분명히 앞으로 나아갔습니다.`
    }
  } else if (myPts === realPts && myDiff === realDiff && myScore[0] === real[0] && myScore[1] === real[1]) {
    verdict = 'repeat'
    headline = '역사는 반복되었다'
    subhead = `실제와 동일한 ${myScore[0]}:${myScore[1]} — 그날의 결과는 필연이었을까요?`
  } else if (myPts >= realPts) {
    verdict = 'repeat'
    headline = '무게추는 그대로였다'
    subhead = `${myScore[0]}:${myScore[1]} — 승점은 지켰지만 역사를 넘지는 못했습니다.`
  } else {
    verdict = 'worse'
    headline = '그날의 벽은 높았다'
    subhead = `${myScore[0]}:${myScore[1]} — 이번엔 실제만큼도 닿지 못했습니다. 다시 도전해보세요.`
  }

  // 부분 성취 (패배도 서사로)
  const achievements: string[] = []
  if (myScore[1] < real[1]) achievements.push(`실점을 ${real[1] - myScore[1]}골 줄였습니다`)
  if (myScore[0] > real[0]) achievements.push(`득점을 ${myScore[0] - real[0]}골 늘렸습니다`)
  if (myScore[1] === 0 && real[1] > 0) achievements.push('무실점 경기 — 완벽한 수비 조직')
  if (xgEdge > 0.8) achievements.push('기대득점(xG)에서 상대를 압도했습니다')
  if (stats.possession >= 60) achievements.push(`점유율 ${stats.possession}%로 경기를 주도했습니다`)
  if (!achievements.length) achievements.push('경험은 남았습니다 — 전술을 다듬어 재도전하세요')

  return {
    grade,
    score: total,
    headline,
    subhead,
    verdict,
    axes: [
      { label: '승부 결과', value: Math.round((resultScore / 62) * 100), note: verdictNote(myPts, realPts) },
      { label: '전술 적중', value: Math.round((tacticsScore / 33) * 100), note: xgEdge > 0 ? 'xG 우위 확보' : '기회 창출 부족' },
      { label: '경기 운영', value: Math.round((effScore / 25) * 100), note: myScore[1] === 0 ? '무실점' : `${myScore[1]}실점 · 교체 ${subsUsed}회` },
    ],
    achievements,
  }
}

function verdictNote(my: number, real: number): string {
  if (my > real) return '실제보다 나은 승점'
  if (my === real) return '실제와 동일 승점'
  return '실제에 미치지 못함'
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n))
}

export const GRADE_COLOR: Record<Grade, string> = {
  S: '#fbbf24',
  A: '#22c55e',
  B: '#38bdf8',
  C: '#a3a3a3',
  D: '#f97316',
  F: '#ef4444',
}
