import { create } from 'zustand'
import type { FormationName, Match, Player, SimEvent, Tactics, TeamSetup } from '../engine/types'
import { MATCHES, getMatch } from '../data/matches'
import { PLAYERS } from '../data/players'
import { getTeam } from '../data/teams'
import { buildAutoSetup, remapFormation } from '../engine/lineup'
import { MatchEngine } from '../engine/simulate'
import { computeRating, type ManagerRating } from '../engine/rating'
import { hashSeed } from '../engine/rng'
import type { CoachAdvice } from '../engine/aiCoach'
import {
  ArchiveEntry,
  clearArchive,
  genId,
  isOnboarded,
  loadArchive,
  saveArchive,
  setOnboarded,
} from '../lib/persist'
import { flag } from '../data/teams'

const BY_ID: Record<string, Player> = Object.fromEntries(PLAYERS.map((p) => [p.id, p]))

export type View = 'home' | 'briefing' | 'warroom' | 'matchday' | 'report' | 'archive'

export interface ResultData {
  score: [number, number]
  rating: ManagerRating
  events: SimEvent[]
  momentum: number[]
  scorers: { min: number; side: 'home' | 'away'; player: string }[]
  subsUsed: number
}

interface GameState {
  view: View
  matchId: string | null
  setup: TeamSetup | null
  // matchday
  engine: MatchEngine | null
  playing: boolean
  speed: 1 | 2 | 4
  tick: number
  halftime: boolean
  matchFinished: boolean
  subsUsed: number
  // result
  result: ResultData | null
  // meta
  onboardingDone: boolean
  archive: ArchiveEntry[]

  // ── navigation ──
  goHome: () => void
  selectMatch: (id: string) => void
  gotoBriefing: () => void
  gotoWarRoom: () => void
  gotoArchive: () => void

  // ── war room ──
  setFormation: (name: FormationName) => void
  assignToSlot: (slotId: string, playerId: string) => void
  removeFromSlot: (slotId: string) => void
  applyCoach: (advice: CoachAdvice) => void
  setTactics: (t: Partial<Tactics>) => void
  resetSetup: () => void

  // ── matchday ──
  startMatch: () => boolean
  play: () => void
  pause: () => void
  setSpeed: (s: 1 | 2 | 4) => void
  advance: () => void // one minute
  resumeSecondHalf: (talkBoost: number, tactics?: Tactics) => void
  substitute: (outId: string, inId: string) => boolean
  changeTactics: (t: Tactics) => void
  finishToReport: () => void

  // ── archive / onboarding ──
  dismissOnboarding: () => void
  wipeArchive: () => void
}

export const useGame = create<GameState>((set, get) => ({
  view: 'home',
  matchId: null,
  setup: null,
  engine: null,
  playing: false,
  speed: 1,
  tick: 0,
  halftime: false,
  matchFinished: false,
  subsUsed: 0,
  result: null,
  onboardingDone: isOnboarded(),
  archive: loadArchive(),

  goHome: () => set({ view: 'home', engine: null, playing: false, result: null, halftime: false, matchFinished: false }),

  selectMatch: (id) => {
    const match = getMatch(id)
    const home = getTeam(match.home)
    const setup = buildAutoSetup(home, BY_ID)
    set({ matchId: id, setup, view: 'briefing', result: null })
  },

  gotoBriefing: () => set({ view: 'briefing' }),
  gotoWarRoom: () => set({ view: 'warroom' }),
  gotoArchive: () => set({ view: 'archive', archive: loadArchive() }),

  setFormation: (name) => {
    const { setup } = get()
    if (!setup) return
    set({ setup: remapFormation(setup, name, BY_ID) })
  },

  assignToSlot: (slotId, playerId) => {
    const { setup } = get()
    if (!setup) return
    const lineup = { ...setup.lineup }
    const bench = [...setup.bench]
    // 이 선수가 이미 다른 슬롯에 있으면 그 슬롯을 비운다 (또는 스왑)
    const prevSlot = Object.keys(lineup).find((s) => lineup[s] === playerId)
    const occupant = lineup[slotId] // 대상 슬롯의 기존 선수

    if (prevSlot && prevSlot !== slotId) {
      // 필드 내 스왑
      if (occupant) {
        lineup[prevSlot] = occupant
      } else {
        delete lineup[prevSlot]
      }
      lineup[slotId] = playerId
    } else {
      // 벤치/외부에서 투입
      if (occupant && occupant !== playerId) {
        bench.push(occupant)
      }
      lineup[slotId] = playerId
      const bi = bench.indexOf(playerId)
      if (bi >= 0) bench.splice(bi, 1)
    }
    set({ setup: { ...setup, lineup, bench } })
  },

  removeFromSlot: (slotId) => {
    const { setup } = get()
    if (!setup) return
    const lineup = { ...setup.lineup }
    const pid = lineup[slotId]
    if (!pid) return
    delete lineup[slotId]
    set({ setup: { ...setup, lineup, bench: [...setup.bench, pid] } })
  },

  applyCoach: (advice) => {
    const { setup } = get()
    if (!setup) return
    let next = setup
    if (advice.formation !== setup.formationName) {
      next = remapFormation(setup, advice.formation, BY_ID)
    }
    set({ setup: { ...next, tactics: { ...advice.tactics } } })
  },

  setTactics: (t) => {
    const { setup } = get()
    if (!setup) return
    set({ setup: { ...setup, tactics: { ...setup.tactics, ...t } } })
  },

  resetSetup: () => {
    const { matchId } = get()
    if (!matchId) return
    const match = getMatch(matchId)
    set({ setup: buildAutoSetup(getTeam(match.home), BY_ID) })
  },

  startMatch: () => {
    const { setup, matchId } = get()
    if (!setup || !matchId) return false
    const match = getMatch(matchId)
    // 검증: 11명 + GK
    const placed = Object.values(setup.lineup).filter(Boolean)
    const hasGK = Object.entries(setup.lineup).some(([slot, pid]) => slot === 'gk' && pid)
    if (placed.length < 11 || !hasGK) return false

    const awaySetup = buildAutoSetup(getTeam(match.away), BY_ID)
    const seed = hashSeed(matchId + JSON.stringify(setup.lineup) + JSON.stringify(setup.tactics) + Date.now())
    const engine = new MatchEngine({ match, home: setup, away: awaySetup, byId: BY_ID, seed })
    set({
      engine,
      view: 'matchday',
      playing: true,
      speed: 1,
      tick: get().tick + 1,
      halftime: false,
      matchFinished: false,
      subsUsed: 0,
      result: null,
    })
    return true
  },

  play: () => set({ playing: true }),
  pause: () => set({ playing: false }),
  setSpeed: (s) => set({ speed: s }),

  advance: () => {
    const { engine } = get()
    if (!engine) return
    const st = engine.getState()
    if (st.finished) {
      set({ playing: false, matchFinished: true })
      return
    }
    engine.step()
    const next = engine.getState()
    const patch: Partial<GameState> = { tick: get().tick + 1 }
    if (next.minute === 45 && !next.finished) {
      patch.playing = false
      patch.halftime = true
    }
    if (next.finished) {
      patch.playing = false
      patch.matchFinished = true
    }
    set(patch)
  },

  resumeSecondHalf: (talkBoost, tactics) => {
    const { engine } = get()
    if (!engine) return
    if (tactics) engine.setTactics('home', tactics)
    engine.applyTeamTalk(talkBoost)
    set({ halftime: false, playing: true, tick: get().tick + 1 })
  },

  substitute: (outId, inId) => {
    const { engine, subsUsed } = get()
    if (!engine) return false
    const ok = engine.substitute('home', outId, inId)
    if (ok) set({ subsUsed: subsUsed + 1, tick: get().tick + 1 })
    return ok
  },

  changeTactics: (t) => {
    const { engine } = get()
    if (!engine) return
    engine.setTactics('home', t)
    // setup도 동기화(재개 후 표시용)
    const { setup } = get()
    if (setup) set({ setup: { ...setup, tactics: t } })
    set({ tick: get().tick + 1 })
  },

  finishToReport: () => {
    const { engine, matchId, subsUsed, archive } = get()
    if (!engine || !matchId) return
    const match = getMatch(matchId)
    const st = engine.getState()
    const rating = computeRating(match, st.score, st.stats, subsUsed)
    const result: ResultData = {
      score: st.score,
      rating,
      events: st.events,
      momentum: st.momentum,
      scorers: engine.getScorers(),
      subsUsed,
    }
    // 아카이브 저장
    const entry: ArchiveEntry = {
      id: genId(),
      matchId,
      matchTitle: match.title,
      competition: match.competition,
      homeCode: getTeam(match.home).nationCode,
      awayCode: getTeam(match.away).nationCode,
      myScore: st.score,
      realScore: match.realScore,
      grade: rating.grade,
      ratingScore: rating.score,
      verdict: rating.verdict,
      stats: st.stats,
      ts: Date.now(),
    }
    const nextArchive = [entry, ...archive].slice(0, 100)
    saveArchive(nextArchive)
    set({ result, view: 'report', archive: nextArchive })
  },

  dismissOnboarding: () => {
    setOnboarded()
    set({ onboardingDone: true })
  },

  wipeArchive: () => {
    clearArchive()
    set({ archive: [] })
  },
}))

// 편의 셀렉터
export const playersById = BY_ID
export function allMatches(): Match[] {
  return MATCHES
}
export { flag, getTeam, getMatch, BY_ID }
