// 헤드리스 밸런스 검증 — 각 경기를 기본 셋업으로 N회 시뮬레이션.
// 실행: npm run balance
import { MATCHES } from '../src/data/matches'
import { getTeam } from '../src/data/teams'
import { PLAYERS } from '../src/data/players'
import { buildAutoSetup } from '../src/engine/lineup'
import { simulateFull } from '../src/engine/simulate'

const byId = Object.fromEntries(PLAYERS.map((p) => [p.id, p]))
const N = 400

console.log(`\n=== REMATCH 밸런스 검증 (${N}회/경기) ===\n`)

for (const match of MATCHES) {
  const home = getTeam(match.home)
  const away = getTeam(match.away)
  const homeSetup = buildAutoSetup(home, byId)
  const awaySetup = buildAutoSetup(away, byId)

  let hg = 0
  let ag = 0
  let hw = 0
  let d = 0
  let aw = 0
  let blowout = 0
  let maxTotal = 0
  const scoreCount: Record<string, number> = {}

  for (let i = 0; i < N; i++) {
    const res = simulateFull({ match, home: homeSetup, away: awaySetup, byId, seed: i * 2654435761 + 12345 })
    hg += res.score[0]
    ag += res.score[1]
    if (res.score[0] > res.score[1]) hw++
    else if (res.score[0] === res.score[1]) d++
    else aw++
    const total = res.score[0] + res.score[1]
    maxTotal = Math.max(maxTotal, total)
    if (Math.abs(res.score[0] - res.score[1]) >= 5) blowout++
    const key = `${res.score[0]}-${res.score[1]}`
    scoreCount[key] = (scoreCount[key] ?? 0) + 1
  }

  const top = Object.entries(scoreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([k, v]) => `${k}(${Math.round((v / N) * 100)}%)`)
    .join('  ')

  console.log(`▶ ${match.title}  [실제 ${match.realScore[0]}:${match.realScore[1]}]`)
  console.log(
    `  평균 ${(hg / N).toFixed(2)} : ${(ag / N).toFixed(2)}  |  ` +
      `홈승 ${pct(hw, N)} 무 ${pct(d, N)} 원정승 ${pct(aw, N)}  |  ` +
      `대량득실 ${pct(blowout, N)} 최다합계 ${maxTotal}`,
  )
  console.log(`  최빈 스코어: ${top}\n`)
}

function pct(n: number, total: number): string {
  return `${Math.round((n / total) * 100)}%`
}
