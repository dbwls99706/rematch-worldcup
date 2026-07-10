import type { Tactics, TeamProfile } from './types'
import type { TeamPower } from './strength'

// 시뮬레이션에 투입되는 팀 계수
export interface TeamMods {
  chanceRate: number // 기회 생성 빈도 배수
  chanceQuality: number // 기회당 xG 배수
  possession: number // 점유율 가감 (%p)
  solidity: number // 수비 견고함 배수
  counterRate: number // 볼 탈취 시 역습 발생 배수
  counterQuality: number // 역습 기회 품질 배수
  staminaDrain: number // 분당 체력 소모 배수
  aerialBias: number // 제공권/크로스 의존 배수
  vulnCounter: number // 상대 역습 피격 취약 배수
  lineHeight: number // 0(깊음)~1(높음)
  pressLevel: number // 0~1
}

export interface MatrixMessage {
  kind: 'warn' | 'tip'
  text: string
}

function c(v: number): number {
  return (v - 50) / 50 // -1 ~ 1
}

export function deriveMods(t: Tactics): TeamMods {
  const cp = c(t.press)
  const cl = c(t.defLine)
  const ct = c(t.tempo)
  const cw = c(t.width)
  const cb = c(t.build)
  return {
    chanceRate: 1 + 0.14 * ct + 0.05 * cl + 0.05 * cw - 0.03 * cb,
    chanceQuality: 1 + 0.1 * cb - 0.05 * ct - 0.05 * cw,
    possession: 6 * cb + 4 * cl - 3 * cw + 4 * cp,
    solidity: 1 + 0.1 * -cl + 0.05 * cp - 0.04 * ct,
    counterRate: 1 + 0.14 * -cl + 0.08 * cp + 0.06 * ct - 0.06 * cb,
    counterQuality: 1 + 0.1 * -cl + 0.04 * ct,
    staminaDrain: 1 + 0.22 * cp + 0.14 * ct + 0.05 * cw - 0.04 * cb,
    aerialBias: 1 + 0.14 * cw - 0.12 * cb,
    vulnCounter: 1,
    lineHeight: t.defLine / 100,
    pressLevel: t.press / 100,
  }
}

// 나의 전술 × 상대 프로필 상성 매트릭스
export function applyMatrix(
  t: Tactics,
  mods: TeamMods,
  opp: TeamProfile,
): { mods: TeamMods; messages: MatrixMessage[] } {
  const m = { ...mods }
  const msg: MatrixMessage[] = []

  // R1 — 높은 라인 vs 빠른 공격수
  if (t.defLine >= 63 && opp.maxFwPace >= 85) {
    m.vulnCounter *= 1.2
    m.chanceRate *= 1.06
    msg.push({ kind: 'warn', text: '역습 피격 위험 — 상대 최전방 스피드가 매우 빠릅니다. 수비 라인을 내리는 것을 고려하세요.' })
  }
  // R2 — 강한 압박 vs 숏 빌드업
  if (t.press >= 63 && opp.buildup === 'short') {
    m.solidity *= 1.1
    m.counterRate *= 1.12
    msg.push({ kind: 'tip', text: '상대는 짧은 빌드업을 씁니다 — 전방 압박으로 후방에서 볼을 끊어낼 수 있습니다.' })
  }
  // R3 — 압박 포기 vs 점유형 상대
  if (t.press <= 37 && opp.buildup === 'short') {
    m.possession -= 5
    m.solidity *= 0.94
    msg.push({ kind: 'warn', text: '점유형 상대를 압박하지 않으면 계속 끌려다닙니다 — 중원을 내주게 됩니다.' })
  }
  // R4 — 롱볼 vs 제공권 약한 수비
  if (t.build <= 40 && opp.aerialWeak) {
    m.aerialBias *= 1.16
    m.chanceQuality *= 1.08
    msg.push({ kind: 'tip', text: '상대 수비는 제공권이 약합니다 — 롱볼과 크로스로 공중 경합을 노리세요.' })
  }
  // R5 — 넓은 폭 vs 공격 가담형 풀백
  if (t.width >= 63 && opp.fullbackJoin === 'high') {
    m.chanceRate *= 1.1
    m.chanceQuality *= 1.05
    msg.push({ kind: 'tip', text: '상대 풀백이 공격에 가담합니다 — 그 뒷공간을 넓은 측면 공격으로 공략하세요.' })
  }
  // R6 — 잠그기 (내린 라인 + 느린 템포)
  if (t.defLine <= 37 && t.tempo <= 40) {
    m.solidity *= 1.14
    m.chanceRate *= 0.86
    m.counterQuality *= 1.06
    msg.push({ kind: 'tip', text: '잠그기 전술 — 실점 위험은 낮지만 득점 기회도 줄어듭니다. 리드 상황에 적합합니다.' })
  }
  // R7 — 압박+템포 과부하 (체력 경고)
  if (t.press >= 70 && t.tempo >= 68) {
    m.staminaDrain *= 1.12
    msg.push({ kind: 'warn', text: '강한 압박 + 빠른 템포 — 체력 소모가 극심합니다. 후반 60분 이후 교체 계획이 필수입니다.' })
  }
  // R8 — 다이렉트 상대의 세트피스/제공권
  if (opp.tags.includes('aerial') && t.defLine >= 60) {
    m.vulnCounter *= 1.05
  }

  return { mods: m, messages: msg }
}

// 슬라이더 자체의 트레이드오프 안내 (매트릭스와 별개)
export function tacticNotes(t: Tactics): string[] {
  const notes: string[] = []
  if (t.press >= 65) notes.push('강한 압박: 볼 탈취 ↑ · 후반 체력 소모 ↑')
  if (t.press <= 35) notes.push('낮은 압박: 체력 보존 ↑ · 상대 빌드업 허용 ↑')
  if (t.defLine >= 65) notes.push('높은 라인: 공격 지역 압축 ↑ · 배후 역습 위험 ↑')
  if (t.defLine <= 35) notes.push('낮은 라인: 실점 위험 ↓ · 공격 전개 거리 ↑')
  if (t.tempo >= 65) notes.push('빠른 템포: 기회 생성 ↑ · 체력 소모 ↑ · 정확도 ↓')
  if (t.tempo <= 35) notes.push('느린 템포: 볼 간수 ↑ · 기회 수 ↓')
  if (t.width >= 65) notes.push('넓은 폭: 측면·크로스 ↑ · 중앙 밀집도 ↓')
  if (t.width <= 35) notes.push('좁은 폭: 중앙 침투 품질 ↑ · 측면 공간 노출')
  if (t.build >= 65) notes.push('짧은 빌드업: 점유율 ↑ · 기회 품질 ↑ · 전개 속도 ↓')
  if (t.build <= 35) notes.push('롱볼: 제공권·세컨볼 ↑ · 점유율 ↓')
  return notes
}

// 게이지 표시용 투영 전력 (0~100)
export function projectStrength(power: TeamPower, mods: TeamMods): {
  attack: number
  defense: number
  control: number
} {
  const clamp = (n: number) => Math.max(1, Math.min(99, n))
  return {
    attack: clamp(power.attack + 42 * (mods.chanceRate - 1) + 22 * (mods.chanceQuality - 1)),
    defense: clamp(power.defense + 40 * (mods.solidity - 1) - 26 * (mods.vulnCounter - 1)),
    control: clamp(power.midfield + mods.possession * 0.8),
  }
}
