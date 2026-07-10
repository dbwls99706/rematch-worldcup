import { describe, expect, it } from 'vitest'
import { PLAYERS } from '../data/players'
import { MATCHES } from '../data/matches'
import { TEAMS, getTeam } from '../data/teams'
import { FORMATIONS } from '../data/formations'
import { buildAutoSetup } from './lineup'
import { computePower } from './strength'
import { deriveMods, applyMatrix, projectStrength } from './tactics'
import { simulateFull, MatchEngine } from './simulate'
import { computeRating } from './rating'
import { recommend } from './aiCoach'
import { RNG, hashSeed } from './rng'
import { fitness } from './fitness'

const byId = Object.fromEntries(PLAYERS.map((p) => [p.id, p]))

describe('데이터 무결성', () => {
  it('모든 팀의 스쿼드 선수 id가 실제로 존재한다', () => {
    for (const team of Object.values(TEAMS)) {
      for (const pid of team.squad) expect(byId[pid], `${team.id}:${pid}`).toBeDefined()
      expect(team.squad.length).toBeGreaterThanOrEqual(14)
    }
  })
  it('모든 경기의 팀 id와 키맨 id가 존재한다', () => {
    for (const m of MATCHES) {
      expect(TEAMS[m.home]).toBeDefined()
      expect(TEAMS[m.away]).toBeDefined()
      expect(byId[m.briefing.keyman]).toBeDefined()
    }
  })
  it('선수 id는 유일하다', () => {
    const ids = PLAYERS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('모든 포메이션은 정확히 11개 슬롯을 가진다', () => {
    for (const f of Object.values(FORMATIONS)) expect(f.slots.length).toBe(11)
  })
})

describe('RNG 결정성', () => {
  it('같은 시드는 같은 수열을 만든다', () => {
    const a = new RNG(42)
    const b = new RNG(42)
    for (let i = 0; i < 100; i++) expect(a.next()).toBe(b.next())
  })
  it('hashSeed는 안정적이다', () => {
    expect(hashSeed('rematch')).toBe(hashSeed('rematch'))
  })
})

describe('포지션 적합도', () => {
  it('주 포지션은 1.0, GK 교차 배치는 강한 페널티', () => {
    expect(fitness(['ST'], 'ST')).toBe(1)
    expect(fitness(['ST'], 'GK')).toBeLessThan(0.2)
    expect(fitness(['GK'], 'ST')).toBeLessThan(0.2)
    expect(fitness(['CB'], 'DM')).toBeGreaterThan(0.5)
  })
})

describe('전력 계산', () => {
  it('자동 셋업은 11명 배치와 GK를 포함한다', () => {
    const setup = buildAutoSetup(getTeam('kr22'), byId)
    expect(Object.keys(setup.lineup).length).toBe(11)
    expect(setup.lineup['gk']).toBeDefined()
    const power = computePower(setup, byId)
    expect(power.placed).toBe(11)
    expect(power.hasGK).toBe(true)
    expect(power.warnings.length).toBe(0)
  })
  it('강팀은 약팀보다 높은 전력을 가진다', () => {
    const ger = computePower(buildAutoSetup(getTeam('ger14'), byId), byId)
    const kr = computePower(buildAutoSetup(getTeam('kr10'), byId), byId)
    expect(ger.attack + ger.defense + ger.midfield).toBeGreaterThan(kr.attack + kr.defense + kr.midfield)
  })
})

describe('전술 계수 & 상성', () => {
  it('높은 라인 vs 빠른 공격수는 역습 취약 경고를 만든다', () => {
    const t = { defLine: 80, press: 50, tempo: 50, width: 50, build: 50 }
    const { messages } = applyMatrix(t, deriveMods(t), getTeam('fra22').profile)
    expect(messages.some((m) => m.kind === 'warn')).toBe(true)
  })
  it('강한 압박은 체력 소모를 늘린다', () => {
    const low = deriveMods({ defLine: 50, press: 20, tempo: 50, width: 50, build: 50 })
    const high = deriveMods({ defLine: 50, press: 90, tempo: 50, width: 50, build: 50 })
    expect(high.staminaDrain).toBeGreaterThan(low.staminaDrain)
  })
  it('투영 전력은 0~99 범위', () => {
    const setup = buildAutoSetup(getTeam('kr22'), byId)
    const proj = projectStrength(computePower(setup, byId), deriveMods(setup.tactics))
    for (const v of [proj.attack, proj.defense, proj.control]) {
      expect(v).toBeGreaterThan(0)
      expect(v).toBeLessThanOrEqual(99)
    }
  })
})

describe('시뮬레이션', () => {
  it('결정적: 같은 시드는 같은 결과', () => {
    const m = MATCHES[0]
    const home = buildAutoSetup(getTeam(m.home), byId)
    const away = buildAutoSetup(getTeam(m.away), byId)
    const r1 = simulateFull({ match: m, home, away, byId, seed: 777 })
    const r2 = simulateFull({ match: m, home, away, byId, seed: 777 })
    expect(r1.score).toEqual(r2.score)
    expect(r1.events.length).toBe(r2.events.length)
  })
  it('밸런스: 500회에서 극단적 대량득점이 드물다', () => {
    const m = MATCHES[0]
    const home = buildAutoSetup(getTeam(m.home), byId)
    const away = buildAutoSetup(getTeam(m.away), byId)
    let blowouts = 0
    let totalGoals = 0
    for (let i = 0; i < 500; i++) {
      const r = simulateFull({ match: m, home, away, byId, seed: i * 7919 + 3 })
      totalGoals += r.score[0] + r.score[1]
      if (Math.abs(r.score[0] - r.score[1]) >= 6) blowouts++
    }
    expect(blowouts / 500).toBeLessThan(0.03)
    const avgGoals = totalGoals / 500
    expect(avgGoals).toBeGreaterThan(1.5)
    expect(avgGoals).toBeLessThan(4.5)
  })
  it('교체는 카드를 소모하고 3장으로 제한된다', () => {
    const m = MATCHES[0]
    const home = buildAutoSetup(getTeam(m.home), byId)
    const away = buildAutoSetup(getTeam(m.away), byId)
    const eng = new MatchEngine({ match: m, home, away, byId, seed: 1 })
    const onPitch = Object.values(home.lineup)
    const bench = home.bench
    expect(eng.substitute('home', onPitch[10], bench[0])).toBe(true)
    expect(eng.substitute('home', onPitch[9], bench[1])).toBe(true)
    expect(eng.substitute('home', onPitch[8], bench[2])).toBe(true)
    expect(eng.subsLeftFor('home')).toBe(0)
    expect(eng.substitute('home', onPitch[7], bench[3])).toBe(false) // 카드 소진
  })
})

describe('감독 평점', () => {
  it('패배를 승리로 뒤집으면 triumph', () => {
    const m = MATCHES[0] // 실제 2:3 패
    const r = computeRating(m, [3, 1], { possession: 55, shots: [12, 8], shotsOnTarget: [6, 3], xg: [2.1, 1.0] }, 2)
    expect(r.verdict).toBe('triumph')
    expect(['S', 'A']).toContain(r.grade)
  })
  it('실점을 줄이면 성취로 기록된다', () => {
    const m = MATCHES[3] // 실제 1:7 (bra_ger)
    const r = computeRating(m, [1, 2], { possession: 45, shots: [10, 12], shotsOnTarget: [4, 5], xg: [1.2, 1.8] }, 3)
    expect(r.achievements.some((a) => a.includes('실점'))).toBe(true)
  })
})

describe('AI 코치', () => {
  it('빠른 상대에게는 라인을 낮추라고 조언한다', () => {
    const m = MATCHES.find((x) => x.away === 'fra22')!
    const setup = buildAutoSetup(getTeam(m.home), byId)
    const advice = recommend(m, setup, byId)
    expect(advice.tactics.defLine).toBeLessThan(50)
    expect(advice.reasons.length).toBeGreaterThan(0)
  })
})
