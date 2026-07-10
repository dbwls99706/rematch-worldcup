import type { Player, TeamSetup } from './types'
import { fitness } from './fitness'
import { FORMATIONS } from '../data/formations'

export interface TeamPower {
  attack: number
  defense: number
  midfield: number
  pace: number // 최전방·측면 스피드 (역습 상성 판정용)
  aerial: number
  creativity: number
  finishing: number
  setPiece: number
  gk: number
  fitnessAvg: number
  placed: number // 배치된 선수 수
  hasGK: boolean
  warnings: string[]
}

type ById = Record<string, Player>

function staminaFactor(p: Player): number {
  // 기초 체력 자체는 경기 시작 시점엔 100% (실시간 소모는 simulate가 처리)
  return 0.9 + (p.stamina / 99) * 0.1
}

function roleRating(p: Player, category: 'def' | 'mid' | 'atk' | 'gk'): number {
  const s = p.stats
  switch (category) {
    case 'gk':
      return s.defense * 0.72 + s.physical * 0.18 + s.pass * 0.1
    case 'def':
      return s.defense * 0.5 + s.physical * 0.24 + s.pace * 0.16 + s.pass * 0.1
    case 'mid':
      return s.pass * 0.34 + s.dribble * 0.18 + s.defense * 0.2 + s.physical * 0.14 + s.pace * 0.14
    case 'atk':
      return s.shot * 0.3 + s.dribble * 0.24 + s.pace * 0.26 + s.pass * 0.2
  }
}

function categoryOf(role: string): 'def' | 'mid' | 'atk' | 'gk' {
  if (role === 'GK') return 'gk'
  if (role === 'CB' || role === 'LB' || role === 'RB') return 'def'
  if (role === 'DM' || role === 'CM' || role === 'LM' || role === 'RM') return 'mid'
  return 'atk' // AM, LW, RW, ST
}

export function computePower(setup: TeamSetup, byId: ById): TeamPower {
  const formation = FORMATIONS[setup.formationName]
  const defR: number[] = []
  const midR: number[] = []
  const atkR: number[] = []
  let gk = 55
  let hasGK = false
  let fitSum = 0
  let placed = 0
  const paces: number[] = []
  const aerials: number[] = []
  const creat: number[] = []
  const finish: number[] = []
  let bestSetPiece = 40
  const warnings: string[] = []

  for (const slot of formation.slots) {
    const pid = setup.lineup[slot.id]
    if (!pid) continue
    const p = byId[pid]
    if (!p) continue
    placed++
    const f = fitness(p.positions, slot.role)
    fitSum += f
    const sf = staminaFactor(p)
    const cat = categoryOf(slot.role)
    // 적합도가 낮으면 실효 능력치 하락 (0.6 fit → 84% 발휘)
    const eff = (0.6 + 0.4 * f) * sf
    const r = roleRating(p, cat) * eff

    if (cat === 'gk') {
      gk = roleRating(p, 'gk') * sf
      hasGK = true
    } else if (cat === 'def') {
      defR.push(r)
      aerials.push((p.stats.physical * 0.6 + p.stats.defense * 0.4) * (p.traits.includes('aerial_threat') ? 1.12 : 1))
    } else if (cat === 'mid') {
      midR.push(r)
      creat.push(p.stats.pass * 0.5 + p.stats.dribble * 0.5)
    } else {
      atkR.push(r)
      paces.push(p.stats.pace)
      creat.push(p.stats.pass * 0.4 + p.stats.dribble * 0.6)
      finish.push(p.stats.shot * (p.traits.includes('clutch') ? 1.06 : 1))
      aerials.push((p.stats.physical * 0.6 + p.stats.shot * 0.4) * (p.traits.includes('aerial_threat') ? 1.15 : 0.9))
    }
    if (p.traits.includes('set_piece')) {
      bestSetPiece = Math.max(bestSetPiece, p.stats.pass * 0.5 + p.stats.shot * 0.5)
    }
  }

  const avg = (a: number[], fb = 50) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : fb)
  // DM/CM은 수비에도 기여
  const midDefBonus = avg(midR) * 0.18

  const attack = clamp(avg(atkR) * 0.78 + avg(midR) * 0.22)
  const defense = clamp(avg(defR) * 0.66 + gk * 0.16 + midDefBonus)
  const midfield = clamp(avg(midR) * 0.8 + avg(atkR) * 0.1 + avg(defR) * 0.1)

  if (!hasGK) warnings.push('골키퍼가 배치되지 않았습니다')
  if (placed < 11) warnings.push(`선발 ${placed}/11 — ${11 - placed}명이 비었습니다`)
  const fitnessAvg = placed ? fitSum / placed : 0
  if (placed >= 11 && fitnessAvg < 0.72) warnings.push('포지션 부적합 선수가 많습니다 — 전력 손실')

  return {
    attack,
    defense,
    midfield,
    pace: paces.length ? Math.max(...paces) : 60,
    aerial: clamp(avg(aerials)),
    creativity: clamp(avg(creat)),
    finishing: clamp(avg(finish, 55)),
    setPiece: clamp(bestSetPiece),
    gk: clamp(gk),
    fitnessAvg,
    placed,
    hasGK,
    warnings,
  }
}

function clamp(n: number): number {
  return Math.max(1, Math.min(99, n))
}
