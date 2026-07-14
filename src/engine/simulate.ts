import type { FormationName, Match, MatchStats, Player, SimEvent, Side, Tactics, TeamSetup } from './types'
import { RNG } from './rng'
import { computePower, type TeamPower } from './strength'
import { applyMatrix, deriveMods, type TeamMods } from './tactics'
import { autoAssign } from './lineup'
import { getTeam } from '../data/teams'

type ById = Record<string, Player>

const FULL_TIME = 90

interface LiveSide {
  setup: TeamSetup
  power: TeamPower
  mods: TeamMods
  vulnCounter: number
  teamId: string
  subsLeft: number
  onPitch: Set<string> // 현재 그라운드 선수
  slotOf: Record<string, string> // playerId -> slotId (교체 대상 파악)
}

export interface EngineConfig {
  match: Match
  home: TeamSetup
  away: TeamSetup
  byId: ById
  seed: number
}

export interface EngineState {
  minute: number
  score: [number, number]
  stats: MatchStats
  events: SimEvent[]
  momentum: number[]
  finished: boolean
  half: 1 | 2
  subsLeft: [number, number]
}

// ── 유틸 ────────────────────────────────────────────────────────
function flavor(rng: RNG, arr: string[]): string {
  return arr[Math.floor(rng.next() * arr.length)]
}

export class MatchEngine {
  private rng: RNG
  private cfg: EngineConfig
  private home: LiveSide
  private away: LiveSide
  private stamina: Record<string, number> = {}
  private homeMinutes = 0 // 점유 집계용
  private totalMinutes = 0
  private shots: [number, number] = [0, 0]
  private sot: [number, number] = [0, 0]
  private xg: [number, number] = [0, 0]
  private score: [number, number] = [0, 0]
  private events: SimEvent[] = []
  private momentum: number[] = []
  private minute = 0
  private finished = false
  private teamTalkBoost = 0 // 하프타임 팀토크 → 후반 초반 모멘텀 보정
  private scorers: { min: number; side: Side; player: string }[] = []

  constructor(cfg: EngineConfig) {
    this.cfg = cfg
    this.rng = new RNG(cfg.seed)
    this.home = this.buildSide(cfg.home, cfg.match.home, cfg.away)
    this.away = this.buildSide(cfg.away, cfg.match.away, cfg.home)
    this.pushEvent('neutral', 'kickoff', '킥오프! 경기가 시작됩니다.', false)
  }

  private buildSide(setup: TeamSetup, teamId: string, oppSetup: TeamSetup): LiveSide {
    const power = computePower(setup, this.cfg.byId)
    const oppProfile = getTeam(oppSetup === this.cfg.home ? this.cfg.match.home : this.cfg.match.away).profile
    const base = deriveMods(setup.tactics)
    const { mods } = applyMatrix(setup.tactics, base, oppProfile)
    const onPitch = new Set(Object.values(setup.lineup))
    const slotOf: Record<string, string> = {}
    for (const [slotId, pid] of Object.entries(setup.lineup)) slotOf[pid] = slotId
    for (const pid of onPitch) this.stamina[pid] = 100
    return {
      setup,
      power,
      mods,
      vulnCounter: mods.vulnCounter,
      teamId,
      subsLeft: 3,
      onPitch,
      slotOf,
    }
  }

  private recomputeSide(side: LiveSide, oppTeamId: string) {
    side.power = computePower(side.setup, this.cfg.byId)
    const oppProfile = getTeam(oppTeamId).profile
    const base = deriveMods(side.setup.tactics)
    const { mods } = applyMatrix(side.setup.tactics, base, oppProfile)
    side.mods = mods
    side.vulnCounter = mods.vulnCounter
  }

  // 체력 반영 실효 전력
  private live(side: LiveSide): { attack: number; defense: number; midfield: number } {
    let sum = 0
    let n = 0
    for (const pid of side.onPitch) {
      const st = this.stamina[pid] ?? 100
      const f = st >= 70 ? 1 : 0.7 + 0.3 * (st / 70)
      sum += f
      n++
    }
    const fatigue = n ? sum / n : 1
    return {
      attack: side.power.attack * fatigue,
      defense: side.power.defense * fatigue,
      midfield: side.power.midfield * fatigue,
    }
  }

  private drainStamina(side: LiveSide) {
    for (const pid of side.onPitch) {
      const p = this.cfg.byId[pid]
      if (!p) continue
      const roleBase = 0.26
      const drain = roleBase * side.mods.staminaDrain * (85 / p.stamina)
      this.stamina[pid] = Math.max(20, (this.stamina[pid] ?? 100) - drain)
    }
  }

  private pickScorer(side: LiveSide, counter: boolean): Player {
    const candidates: Player[] = []
    const weights: number[] = []
    for (const pid of side.onPitch) {
      const p = this.cfg.byId[pid]
      if (!p) continue
      const role = p.positions[0]
      let w = 0.2
      if (['ST', 'LW', 'RW', 'AM'].includes(role)) w = 3
      else if (['CM', 'LM', 'RM'].includes(role)) w = 1.1
      else if (['DM'].includes(role)) w = 0.5
      else if (['LB', 'RB'].includes(role)) w = 0.35
      else if (role === 'GK') w = 0
      w *= 0.5 + p.stats.shot / 100
      if (p.traits.includes('clutch')) w *= 1.35
      if (counter && (p.traits.includes('counter_attacker') || p.traits.includes('sprinter'))) w *= 1.6
      if (counter) w *= 0.6 + p.stats.pace / 130
      candidates.push(p)
      weights.push(w)
    }
    return this.rng.weighted(candidates, weights)
  }

  private assister(side: LiveSide, scorer: Player): Player | null {
    const pool = [...side.onPitch].map((id) => this.cfg.byId[id]).filter((p): p is Player => !!p && p.id !== scorer.id)
    if (!pool.length) return null
    const weights = pool.map((p) => {
      const role = p.positions[0]
      let w = 0.5
      if (['AM', 'LW', 'RW', 'LM', 'RM'].includes(role)) w = 2.4
      else if (['CM', 'LB', 'RB'].includes(role)) w = 1.3
      w *= 0.5 + p.stats.pass / 120
      if (p.traits.includes('playmaker')) w *= 1.5
      if (p.traits.includes('set_piece')) w *= 1.2
      return w
    })
    return this.rng.weighted(pool, weights)
  }

  // 한 팀의 공격 시도 처리
  private attackAttempt(atk: LiveSide, def: LiveSide, side: Side, possShare: number, calibAtk: number, calibDef: number) {
    const la = this.live(atk)
    const ld = this.live(def)
    const attS = la.attack * atk.mods.chanceRate * calibAtk
    const defS = ld.defense * def.mods.solidity * calibDef
    let pShot = 0.3 * possShare * (attS / (defS + 1)) * 0.58
    pShot = Math.min(0.6, pShot)

    // 역습 판정: 상대가 볼을 많이 가진 상황에서 취약할 때
    const counter = this.rng.chance(0.28 * atk.mods.counterRate * (0.6 + (1 - possShare)) * (def.vulnCounter - 0.9))
    if (!this.rng.chance(pShot) && !counter) return

    // 기회 품질(xG)
    let q = 0.128 * atk.mods.chanceQuality
    q *= 0.7 + atk.power.finishing / 120
    if (counter) q *= 1.25 * def.vulnCounter
    // 제공권 세트피스 보정
    if (atk.mods.aerialBias > 1.08 && this.rng.chance(0.3)) q *= 1.1
    q = Math.max(0.03, Math.min(0.7, q))

    this.shots[sideIdx(side)]++
    this.xg[sideIdx(side)] += q

    // 유효슈팅 여부
    const onTarget = this.rng.chance(0.42 + atk.power.finishing / 260)
    if (onTarget) this.sot[sideIdx(side)]++

    // 골 판정 (상대 GK 반영)
    const gkSave = 1 - (def.power.gk - 50) / 170
    const goalP = q * gkSave
    const scorer = this.pickScorer(atk, counter)

    if (onTarget && this.rng.chance(goalP)) {
      this.score[sideIdx(side)]++
      const asst = this.assister(atk, scorer)
      this.scorers.push({ min: this.minute, side, player: scorer.name })
      const how = counter
        ? flavor(this.rng, ['빠른 역습을 마무리', '배후를 파고들어 침착하게', '순식간의 전환에서'])
        : atk.mods.aerialBias > 1.12
          ? flavor(this.rng, ['크로스를 헤더로', '세트피스 혼전을 마무리', '제공권 경합에서'])
          : flavor(this.rng, ['날카로운 슛으로', '문전 혼전을 놓치지 않고', '환상적인 마무리로'])
      const asstTxt = asst ? ` (도움: ${asst.name})` : ''
      this.pushEvent(side, 'goal', `⚽ ${this.minute}' 골! ${scorer.name}, ${how} 득점!${asstTxt}`, true)
    } else if (onTarget) {
      if (this.rng.chance(0.5)) {
        this.pushEvent(side, 'save', `${this.minute}' ${scorer.name}의 슛! 상대 골키퍼가 선방합니다.`, false)
      } else {
        this.pushEvent(side, 'shot', `${this.minute}' ${scorer.name}의 유효 슈팅, 아깝게 빗나갑니다.`, false)
      }
    } else {
      this.pushEvent(side, 'shot', `${this.minute}' ${scorer.name}의 슈팅 시도가 골문을 벗어납니다.`, false)
    }
  }

  private pushEvent(side: Side | 'neutral', type: SimEvent['type'], text: string, big: boolean) {
    this.events.push({ min: this.minute, side, type, text, scoreAfter: [...this.score] as [number, number], big })
  }

  // ── 공개 API ──────────────────────────────────────────────────
  /** 1분 진행. 반환: 이번 분에 생성된 이벤트들 */
  step(): SimEvent[] {
    if (this.finished) return []
    const before = this.events.length
    this.minute++

    // 점유율/모멘텀
    const lh = this.live(this.home)
    const la = this.live(this.away)
    const ctrlH = Math.max(1, lh.midfield + this.home.mods.possession * 0.5)
    const ctrlA = Math.max(1, la.midfield + this.away.mods.possession * 0.5)
    const possShareH = ctrlH / (ctrlH + ctrlA)
    if (this.rng.chance(possShareH)) this.homeMinutes++
    this.totalMinutes++

    const calib = this.cfg.match.calibration
    // 공격 시도 (양 팀)
    this.attackAttempt(this.home, this.away, 'home', possShareH, calib.homeAtk, calib.awayDef)
    this.attackAttempt(this.away, this.home, 'away', 1 - possShareH, calib.awayAtk, calib.homeDef)

    // 체력 소모
    this.drainStamina(this.home)
    this.drainStamina(this.away)

    // 모멘텀 기록 (-100~100)
    let mo = (possShareH - 0.5) * 150
    const goalSwing = this.recentGoalSwing()
    mo = Math.max(-100, Math.min(100, mo * 0.7 + goalSwing + this.teamTalkBoost))
    this.momentum.push(Math.round(mo))
    if (this.teamTalkBoost !== 0 && this.minute > 60) this.teamTalkBoost *= 0.85

    // 가끔 플레이 흐름 코멘트
    if (this.events.length === before && this.rng.chance(0.12)) {
      const dominant = possShareH > 0.6 ? this.cfg.home : possShareH < 0.4 ? this.cfg.away : null
      if (dominant) {
        this.pushEvent(dominant === this.cfg.home ? 'home' : 'away', 'info',
          `${this.minute}' ${getTeam(dominant === this.cfg.home ? this.cfg.match.home : this.cfg.match.away).short}이(가) 경기를 지배하며 상대를 몰아붙입니다.`, false)
      }
    }

    // 하프타임
    if (this.minute === 45) {
      this.pushEvent('neutral', 'half', '전반 종료 — 하프타임입니다.', false)
    }
    // 종료
    if (this.minute >= FULL_TIME) {
      this.finalize()
    }
    return this.events.slice(before)
  }

  private recentGoalSwing(): number {
    let swing = 0
    for (const s of this.scorers) {
      const age = this.minute - s.min
      if (age < 0 || age > 8) continue
      const dir = s.side === 'home' ? 1 : -1
      swing += dir * (35 - age * 3)
    }
    return swing
  }

  private finalize() {
    this.finished = true
    const home = getTeam(this.cfg.match.home).short
    const away = getTeam(this.cfg.match.away).short
    this.pushEvent('neutral', 'fulltime',
      `경기 종료! ${home} ${this.score[0]} : ${this.score[1]} ${away}`, true)
  }

  /** 교체 (INT-07). 반환: 성공 여부 */
  substitute(side: Side, outId: string, inId: string): boolean {
    const s = side === 'home' ? this.home : this.away
    if (s.subsLeft <= 0) return false
    if (!s.onPitch.has(outId) || s.onPitch.has(inId)) return false
    const slot = s.slotOf[outId]
    if (!slot) return false
    // 라인업 갱신
    s.setup = { ...s.setup, lineup: { ...s.setup.lineup, [slot]: inId }, bench: s.setup.bench.filter((b) => b !== inId).concat(outId) }
    s.onPitch.delete(outId)
    s.onPitch.add(inId)
    delete s.slotOf[outId]
    s.slotOf[inId] = slot
    this.stamina[inId] = 100
    s.subsLeft--
    this.recomputeSide(s, side === 'home' ? this.cfg.match.away : this.cfg.match.home)
    const outP = this.cfg.byId[outId]
    const inP = this.cfg.byId[inId]
    this.pushEvent(side, 'sub', `🔄 ${this.minute}' 교체 — OUT ${outP?.name} / IN ${inP?.name}`, false)
    return true
  }

  /** 전술 변경 (INT-03/08) */
  setTactics(side: Side, tactics: Tactics) {
    const s = side === 'home' ? this.home : this.away
    s.setup = { ...s.setup, tactics }
    this.recomputeSide(s, side === 'home' ? this.cfg.match.away : this.cfg.match.home)
  }

  /** 경기 중 포메이션 변경 — 그라운드의 11명을 새 포메이션 슬롯에 재배치 */
  setFormation(side: Side, formationName: FormationName) {
    const s = side === 'home' ? this.home : this.away
    if (s.setup.formationName === formationName) return
    const onPitchIds = Object.values(s.setup.lineup).filter(Boolean)
    const lineup = autoAssign(onPitchIds, formationName, this.cfg.byId)
    s.setup = { ...s.setup, formationName, lineup }
    s.slotOf = {}
    for (const [slotId, pid] of Object.entries(lineup)) s.slotOf[pid] = slotId
    this.recomputeSide(s, side === 'home' ? this.cfg.match.away : this.cfg.match.home)
    this.pushEvent(side, 'info', `📋 ${this.minute}' 포메이션 변경 — ${formationName}`, false)
  }

  /** 하프타임 팀토크 (INT-08) → 후반 초반 모멘텀 보정 */
  applyTeamTalk(boost: number) {
    this.teamTalkBoost = boost
  }

  getState(): EngineState {
    return {
      minute: this.minute,
      score: [...this.score] as [number, number],
      stats: this.currentStats(),
      events: this.events,
      momentum: this.momentum,
      finished: this.finished,
      half: this.minute < 45 ? 1 : 2,
      subsLeft: [this.home.subsLeft, this.away.subsLeft],
    }
  }

  currentStats(): MatchStats {
    const poss = this.totalMinutes ? Math.round((this.homeMinutes / this.totalMinutes) * 100) : 50
    return {
      possession: poss,
      shots: [...this.shots] as [number, number],
      shotsOnTarget: [...this.sot] as [number, number],
      xg: [Math.round(this.xg[0] * 10) / 10, Math.round(this.xg[1] * 10) / 10],
    }
  }

  getScorers() {
    return this.scorers
  }

  staminaOf(pid: string): number {
    return this.stamina[pid] ?? 100
  }

  subsLeftFor(side: Side): number {
    return (side === 'home' ? this.home : this.away).subsLeft
  }

  sideSetup(side: Side): TeamSetup {
    return (side === 'home' ? this.home : this.away).setup
  }

  isOnPitch(side: Side, pid: string): boolean {
    return (side === 'home' ? this.home : this.away).onPitch.has(pid)
  }
}

function sideIdx(s: Side): 0 | 1 {
  return s === 'home' ? 0 : 1
}

// ── 헤드리스 전체 시뮬레이션 (AI 상대 계획 + 밸런스 검증용) ────────────
export interface SubPlan {
  min: number
  side: Side
  outId: string
  inId: string
}

export function simulateFull(cfg: EngineConfig, plan: SubPlan[] = [], aiSubs = true): {
  score: [number, number]
  stats: MatchStats
  events: SimEvent[]
  momentum: number[]
  scorers: { min: number; side: Side; player: string }[]
} {
  const engine = new MatchEngine(cfg)
  const aiPlan = aiSubs ? buildAiSubPlan(cfg) : []
  const allPlan = [...plan, ...aiPlan].sort((a, b) => a.min - b.min)
  let idx = 0
  for (let m = 1; m <= FULL_TIME; m++) {
    while (idx < allPlan.length && allPlan[idx].min === m) {
      const s = allPlan[idx]
      engine.substitute(s.side, s.outId, s.inId)
      idx++
    }
    engine.step()
  }
  const st = engine.getState()
  return {
    score: st.score,
    stats: st.stats,
    events: st.events,
    momentum: st.momentum,
    scorers: engine.getScorers(),
  }
}

// AI 상대의 자동 교체 계획 (지친 선수 → 벤치 최적)
export function buildAiSubPlan(cfg: EngineConfig): SubPlan[] {
  const plan: SubPlan[] = []
  const away = cfg.away
  const bench = [...away.bench]
  const startersOnPitch = Object.values(away.lineup)
  const byId = cfg.byId
  const mins = [63, 72, 80]
  let bi = 0
  // 공격 자원 위주로 교체
  const outCandidates = startersOnPitch
    .map((id) => byId[id])
    .filter((p): p is Player => !!p && p.positions[0] !== 'GK')
    .sort((a, b) => a.stamina - b.stamina) // 체력 낮은 순
  for (const min of mins) {
    const inP = bench[bi]
    const outP = outCandidates[bi]
    if (inP && outP && byId[inP] && byId[inP].positions[0] !== 'GK') {
      plan.push({ min, side: 'away', outId: outP.id, inId: inP })
    }
    bi++
  }
  return plan
}
