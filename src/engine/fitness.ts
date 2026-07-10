import type { Position } from './types'

// 각 포지션의 인접 포지션 (자연스럽게 소화 가능한 역할)
const ADJACENT: Record<Position, Position[]> = {
  GK: [],
  CB: ['LB', 'RB', 'DM'],
  LB: ['CB', 'LM', 'LW'],
  RB: ['CB', 'RM', 'RW'],
  DM: ['CM', 'CB'],
  CM: ['DM', 'AM'],
  AM: ['CM', 'LW', 'RW', 'ST'],
  LM: ['LW', 'LB', 'CM'],
  RM: ['RW', 'RB', 'CM'],
  LW: ['LM', 'AM', 'ST', 'RW'],
  RW: ['RM', 'AM', 'ST', 'LW'],
  ST: ['AM', 'LW', 'RW'],
}

export type FitLevel = 'perfect' | 'good' | 'ok' | 'poor'

/** 선수의 포지션 목록과 슬롯 역할의 적합도 (0~1) */
export function fitness(playerPositions: Position[], slotRole: Position): number {
  const primary = playerPositions[0]
  // GK는 교차 배치 시 치명적
  if ((slotRole === 'GK') !== (primary === 'GK')) return 0.1
  if (primary === slotRole) return 1.0
  if (playerPositions.includes(slotRole)) return 0.86
  if (ADJACENT[primary].includes(slotRole)) return 0.68
  // 상대 포지션이 내 부포지션과 인접한 경우도 약간 인정
  for (const pos of playerPositions.slice(1)) {
    if (ADJACENT[pos].includes(slotRole)) return 0.58
  }
  return 0.45
}

export function fitLevel(f: number): FitLevel {
  if (f >= 0.98) return 'perfect'
  if (f >= 0.82) return 'good'
  if (f >= 0.62) return 'ok'
  return 'poor'
}

export const FIT_COLOR: Record<FitLevel, string> = {
  perfect: '#22c55e',
  good: '#84cc16',
  ok: '#eab308',
  poor: '#ef4444',
}

export const FIT_LABEL: Record<FitLevel, string> = {
  perfect: '주포지션',
  good: '소화 가능',
  ok: '어색함',
  poor: '부적합',
}
