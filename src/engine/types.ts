// ─────────────────────────────────────────────────────────────
// REMATCH — core domain types (shared by data, engine, UI)
// ─────────────────────────────────────────────────────────────

export type Position =
  | 'GK'
  | 'CB'
  | 'LB'
  | 'RB'
  | 'DM'
  | 'CM'
  | 'AM'
  | 'LM'
  | 'RM'
  | 'LW'
  | 'RW'
  | 'ST'

export interface Stats {
  pace: number // 스피드
  pass: number // 패스
  dribble: number // 드리블
  shot: number // 슛
  defense: number // 수비
  physical: number // 피지컬
}

export type StatKey = keyof Stats

export type Trait =
  | 'counter_attacker' // 역습 전개
  | 'aerial_threat' // 제공권
  | 'playmaker' // 경기 조율
  | 'clutch' // 결정적 순간
  | 'ball_winner' // 볼 탈취
  | 'sprinter' // 순간 스피드
  | 'set_piece' // 세트피스
  | 'wall' // 최후의 벽 (GK/CB)
  | 'engine' // 왕성한 활동량
  | 'target_man' // 타겟형 최전방

export interface Player {
  id: string
  name: string
  nation: string // ISO-ish code used to look up flag emoji
  number: number
  positions: Position[] // 첫 항목이 주 포지션
  stats: Stats
  stamina: number // 기초 체력 (0~99)
  traits: Trait[]
}

export interface TeamProfile {
  // 상대 AI + AI 코치 룰엔진이 참조하는 팀 성향 태그
  style: string // 한 줄 설명
  maxFwPace: number // 최전방 선수 최고 pace
  buildup: 'short' | 'mixed' | 'long'
  fullbackJoin: 'low' | 'mid' | 'high' // 풀백 공격 가담
  aerialWeak: boolean // 공중 경합 약점
  tags: string[]
}

export interface Team {
  id: string
  name: string
  short: string
  nationCode: string // 국기 이모지 매핑용
  color: string
  squad: string[] // player ids
  profile: TeamProfile
  defaultFormation: FormationName
}

export type FormationName = '4-3-3' | '4-2-3-1' | '3-4-3' | '3-5-2' | '4-4-2'

export interface Slot {
  id: string // 슬롯 고유 id (예: 'st', 'lcb')
  role: Position // 이 슬롯이 요구하는 포지션
  x: number // 0(좌)~100(우)
  y: number // 0(상대 골라인)~100(우리 골라인). GK가 가장 큼
  label: string // 화면 표기 (LB, CB, DM ...)
}

export interface Formation {
  name: FormationName
  slots: Slot[] // 항상 11개
  note: string
}

// ── 전술 지시: 모두 0~100 슬라이더 ──────────────────────────────
export interface Tactics {
  defLine: number // 0 깊게 ~ 100 높게
  press: number // 0 관망 ~ 100 강한 압박
  tempo: number // 0 느리게 ~ 100 빠르게
  width: number // 0 좁게 ~ 100 넓게
  build: number // 0 롱볼 ~ 100 짧은 빌드업
}

export const DEFAULT_TACTICS: Tactics = {
  defLine: 50,
  press: 50,
  tempo: 55,
  width: 50,
  build: 55,
}

export type Side = 'home' | 'away'

// slotId -> playerId. 벤치는 별도.
export type Lineup = Record<string, string>

export interface TeamSetup {
  formationName: FormationName
  lineup: Lineup // slotId -> playerId (11명)
  bench: string[] // 교체 후보 playerId
  tactics: Tactics
}

// ── 경기 데이터 ────────────────────────────────────────────────
export interface TimelineEvent {
  min: number
  team: Side
  type: 'goal' | 'chance' | 'card' | 'sub' | 'info'
  note: string
}

export interface MatchStats {
  possession: number // 홈 점유율 %
  shots: [number, number] // [home, away]
  shotsOnTarget: [number, number]
  xg: [number, number]
}

export interface Match {
  id: string
  title: string
  competition: string
  date: string
  home: string // team id
  away: string // team id
  realScore: [number, number]
  realFormation: Record<string, FormationName> // teamId -> formation
  realStats: MatchStats
  realTimeline: TimelineEvent[]
  briefing: {
    headline: string
    threat: string // 상대 위협 한 줄
    weakness: string // 상대 약점 한 줄
    keyman: string // 상대 키플레이어 player id
    ourNote: string // 우리 팀 상태 한 줄
    realManagerNote: string // 실제 감독의 선택 한 줄
  }
  difficulty: 1 | 2 | 3 | 4 | 5
  goal: string // 이 도전의 목표 (예: "2:3 패배를 뒤집어라")
  // 시뮬레이션 캘리브레이션: 실제 라인업이면 실제 결과 근방이 최빈값
  calibration: { homeAtk: number; awayAtk: number; homeDef: number; awayDef: number }
}

// ── 시뮬레이션 결과 ────────────────────────────────────────────
export interface SimEvent {
  min: number
  side: Side | 'neutral'
  type: 'goal' | 'chance' | 'shot' | 'save' | 'sub' | 'half' | 'kickoff' | 'fulltime' | 'info' | 'card'
  text: string
  scoreAfter: [number, number]
  big?: boolean // 골/PK 등 강조 연출
}

export interface SimResult {
  seed: number
  score: [number, number]
  stats: MatchStats
  events: SimEvent[]
  momentum: number[] // 분당 홈 우세도 -100~100
  scorers: { min: number; side: Side; player: string }[]
}
