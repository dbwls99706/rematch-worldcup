import type { FormationName, Match, Player, Tactics, TeamSetup } from './types'
import { getTeam } from '../data/teams'

type ById = Record<string, Player>

export interface CoachAdvice {
  formation: FormationName
  tactics: Tactics
  reasons: { title: string; detail: string }[]
  keyman: { player: Player; note: string } | null
}

// 상대 프로필과 상성 매트릭스를 역방향 탐색해 기대효과가 큰 조합을 제시
export function recommend(match: Match, mySetup: TeamSetup, byId: ById): CoachAdvice {
  const oppTeamId = match.away
  const opp = getTeam(oppTeamId).profile
  const t: Tactics = { defLine: 50, press: 50, tempo: 55, width: 50, build: 55 }
  const reasons: { title: string; detail: string }[] = []

  // 결과 목표: 지고 있던 경기(뒤집기)면 공격적으로, 이기던 경기(지키기)면 안정적으로
  const chasing = match.realScore[0] <= match.realScore[1]

  if (opp.maxFwPace >= 87) {
    t.defLine = 38
    reasons.push({
      title: '수비 라인을 낮춰라',
      detail: `상대 최전방 스피드(${opp.maxFwPace})가 매우 빠릅니다. 라인을 내려 배후 공간을 지우면 역습 피격 위험이 줄어듭니다.`,
    })
  } else if (!chasing) {
    t.defLine = 44
  } else {
    t.defLine = 56
    reasons.push({ title: '라인을 끌어올려라', detail: '상대 전방 위협이 크지 않습니다. 라인을 올려 상대를 진영에 가두고 압박하세요.' })
  }

  if (opp.buildup === 'short') {
    t.press = 70
    reasons.push({
      title: '전방에서 압박하라',
      detail: '상대는 짧은 빌드업으로 후방에서 볼을 돌립니다. 강한 전방 압박으로 실수를 유도하고 높은 위치에서 볼을 끊으세요.',
    })
  } else if (opp.buildup === 'long') {
    t.press = 42
    reasons.push({ title: '압박보다 간격 유지', detail: '상대가 롱볼을 주로 씁니다. 무리한 압박 대신 라인 간격을 좁혀 세컨볼 경합에 대비하세요.' })
  } else {
    t.press = 54
  }

  if (opp.aerialWeak) {
    t.build = 38
    t.width = 66
    reasons.push({
      title: '측면 크로스로 제공권을 노려라',
      detail: '상대 수비는 공중 경합에 약합니다. 폭을 넓히고 롱볼·크로스 비중을 높여 세트피스와 헤더 기회를 만드세요.',
    })
  } else if (opp.fullbackJoin === 'high') {
    t.width = 66
    reasons.push({
      title: '풀백 뒷공간을 공략하라',
      detail: '상대 풀백이 공격에 적극 가담합니다. 폭을 넓혀 그 배후 공간을 빠른 측면 자원으로 파고드세요.',
    })
  } else {
    t.width = 50
  }

  t.tempo = chasing ? 68 : 48
  if (chasing) reasons.push({ title: '템포를 끌어올려라', detail: '뒤집어야 하는 경기입니다. 빠른 템포로 기회의 총량을 늘리되, 후반 교체로 체력을 관리하세요.' })
  else reasons.push({ title: '침착하게 관리하라', detail: '리드를 지켜야 합니다. 템포를 늦춰 볼을 간수하고 상대의 실수를 기다리세요.' })

  // 키맨: 상대 약점에 맞는 우리 선수
  const onPitch = Object.values(mySetup.lineup).map((id) => byId[id]).filter((p): p is Player => !!p)
  let keyman: CoachAdvice['keyman'] = null
  if (opp.aerialWeak) {
    const target = best(onPitch, (p) => p.stats.physical * (p.traits.includes('aerial_threat') ? 1.3 : 1) + (p.positions[0] === 'ST' ? 20 : 0))
    if (target) keyman = { player: target, note: '제공권 경합의 핵심 — 크로스의 목표점으로 삼으세요.' }
  } else if (opp.fullbackJoin === 'high' || opp.maxFwPace >= 87) {
    const target = best(onPitch, (p) => p.stats.pace + (p.traits.includes('sprinter') ? 15 : 0) + (['LW', 'RW', 'ST'].includes(p.positions[0]) ? 10 : 0))
    if (target) keyman = { player: target, note: '측면 배후 침투의 열쇠 — 역습의 창끝으로 활용하세요.' }
  } else {
    const target = best(onPitch, (p) => p.stats.pass + p.stats.dribble + (p.traits.includes('playmaker') ? 20 : 0))
    if (target) keyman = { player: target, note: '창의성의 원천 — 볼을 그의 발에 자주 연결하세요.' }
  }

  return { formation: mySetup.formationName, tactics: t, reasons, keyman }
}

function best<T>(arr: T[], score: (t: T) => number): T | null {
  let bestItem: T | null = null
  let bestScore = -Infinity
  for (const item of arr) {
    const s = score(item)
    if (s > bestScore) {
      bestScore = s
      bestItem = item
    }
  }
  return bestItem
}
