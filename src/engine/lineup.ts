import type { FormationName, Lineup, Player, TeamSetup } from './types'
import type { Team } from './types'
import { DEFAULT_TACTICS } from './types'
import { FORMATIONS } from '../data/formations'
import { fitness } from './fitness'

type ById = Record<string, Player>

/** 스쿼드 선발(앞 11명)을 슬롯에 최적 배치하는 그리디 매칭 */
export function autoAssign(starterIds: string[], formationName: FormationName, byId: ById): Lineup {
  const slots = FORMATIONS[formationName].slots
  const pairs: { slotId: string; pid: string; f: number }[] = []
  for (const slot of slots) {
    for (const pid of starterIds) {
      const p = byId[pid]
      if (!p) continue
      // GK 슬롯엔 GK만, 필드 슬롯엔 비-GK 우선
      pairs.push({ slotId: slot.id, pid, f: fitness(p.positions, slot.role) })
    }
  }
  pairs.sort((a, b) => b.f - a.f)
  const lineup: Lineup = {}
  const usedSlots = new Set<string>()
  const usedPlayers = new Set<string>()
  for (const { slotId, pid } of pairs) {
    if (usedSlots.has(slotId) || usedPlayers.has(pid)) continue
    lineup[slotId] = pid
    usedSlots.add(slotId)
    usedPlayers.add(pid)
  }
  return lineup
}

export function buildAutoSetup(team: Team, byId: ById, formationName?: FormationName): TeamSetup {
  const fname = formationName ?? team.defaultFormation
  const starters = team.squad.slice(0, 11)
  const lineup = autoAssign(starters, fname, byId)
  const usedIds = new Set(Object.values(lineup))
  const bench = team.squad.filter((id) => !usedIds.has(id))
  return {
    formationName: fname,
    lineup,
    bench,
    tactics: { ...DEFAULT_TACTICS },
  }
}

/** 포메이션 변경 시 기존 선수를 새 슬롯으로 재매핑 (INT-02) */
export function remapFormation(setup: TeamSetup, newFormation: FormationName, byId: ById): TeamSetup {
  const placedIds = Object.values(setup.lineup)
  const lineup = autoAssign(placedIds, newFormation, byId)
  const usedIds = new Set(Object.values(lineup))
  const bench = [...setup.bench, ...placedIds.filter((id) => !usedIds.has(id))]
  return { ...setup, formationName: newFormation, lineup, bench }
}
