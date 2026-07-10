import type { Grade } from '../engine/rating'
import type { MatchStats } from '../engine/types'

const ARCHIVE_KEY = 'rematch_archive_v1'
const ONBOARD_KEY = 'rematch_onboarded_v1'

export interface ArchiveEntry {
  id: string // unique
  matchId: string
  matchTitle: string
  competition: string
  homeCode: string
  awayCode: string
  myScore: [number, number]
  realScore: [number, number]
  grade: Grade
  ratingScore: number
  verdict: string
  stats: MatchStats
  ts: number // 저장 시각 (ms)
}

export function loadArchive(): ArchiveEntry[] {
  try {
    const raw = localStorage.getItem(ARCHIVE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveArchive(entries: ArchiveEntry[]): void {
  try {
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(entries.slice(0, 100)))
  } catch {
    /* localStorage 불가 환경 — 무시 */
  }
}

export function clearArchive(): void {
  try {
    localStorage.removeItem(ARCHIVE_KEY)
  } catch {
    /* noop */
  }
}

export function isOnboarded(): boolean {
  try {
    return localStorage.getItem(ONBOARD_KEY) === '1'
  } catch {
    return false
  }
}

export function setOnboarded(): void {
  try {
    localStorage.setItem(ONBOARD_KEY, '1')
  } catch {
    /* noop */
  }
}

// id 생성 (Date.now 사용 가능한 브라우저 런타임)
export function genId(): string {
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`
}
