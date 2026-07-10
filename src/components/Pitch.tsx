import type { Formation, Lineup, Player } from '../engine/types'
import { fitness, fitLevel, FIT_COLOR } from '../engine/fitness'

interface PitchProps {
  formation: Formation
  lineup: Lineup
  byId: Record<string, Player>
  mode?: 'edit' | 'live'
  selectedSlot?: string | null
  selectedPlayer?: string | null
  onSlotClick?: (slotId: string) => void
  onTokenClick?: (slotId: string, playerId: string) => void
  onTokenPointerDown?: (slotId: string, playerId: string, e: React.PointerEvent) => void
  staminaOf?: (playerId: string) => number
  scoredSlots?: Set<string>
  color?: string
}

export default function Pitch({
  formation,
  lineup,
  byId,
  mode = 'edit',
  selectedSlot,
  selectedPlayer,
  onSlotClick,
  onTokenClick,
  onTokenPointerDown,
  staminaOf,
  color = '#ef4444',
}: PitchProps) {
  return (
    <div className="pitch-wrap">
      <div className="pitch" data-pitch>
        <div className="pitch-stripes" />
        {/* markings */}
        <svg className="pitch-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <rect x="1" y="1" width="98" height="98" fill="none" stroke="var(--pitch-line)" strokeWidth="0.4" />
          <line x1="1" y1="50" x2="99" y2="50" stroke="var(--pitch-line)" strokeWidth="0.4" />
          <circle cx="50" cy="50" r="9" fill="none" stroke="var(--pitch-line)" strokeWidth="0.4" />
          <circle cx="50" cy="50" r="0.8" fill="var(--pitch-line)" />
          {/* our goal (bottom) */}
          <rect x="30" y="85" width="40" height="14" fill="none" stroke="var(--pitch-line)" strokeWidth="0.4" />
          <rect x="41" y="94" width="18" height="5" fill="none" stroke="var(--pitch-line)" strokeWidth="0.4" />
          {/* opp goal (top) */}
          <rect x="30" y="1" width="40" height="14" fill="none" stroke="var(--pitch-line)" strokeWidth="0.4" />
          <rect x="41" y="1" width="18" height="5" fill="none" stroke="var(--pitch-line)" strokeWidth="0.4" />
        </svg>

        {/* slots */}
        {formation.slots.map((slot) => {
          const pid = lineup[slot.id]
          const player = pid ? byId[pid] : undefined
          const isSel = selectedSlot === slot.id
          const empty = !player
          const f = player ? fitness(player.positions, slot.role) : 0
          const lvl = player ? fitLevel(f) : 'poor'
          const stam = player && staminaOf ? staminaOf(player.id) : 100
          const tired = stam < 60
          return (
            <div
              key={slot.id}
              data-slot={slot.id}
              className={`slot ${empty ? 'empty' : ''} ${isSel ? 'selected' : ''} ${
                selectedPlayer && empty ? 'droppable' : ''
              }`}
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
              onClick={() => onSlotClick?.(slot.id)}
            >
              {empty ? (
                <div className="slot-ghost">
                  <span>{slot.label}</span>
                </div>
              ) : (
                <div
                  className={`token ${mode === 'live' && tired ? 'tired' : ''} ${
                    selectedPlayer === player!.id ? 'picked' : ''
                  }`}
                  data-token={player!.id}
                  style={{ ['--tk' as string]: color }}
                  onPointerDown={(e) => onTokenPointerDown?.(slot.id, player!.id, e)}
                  onClick={(e) => {
                    e.stopPropagation()
                    onTokenClick?.(slot.id, player!.id)
                  }}
                >
                  <span className="token-num">{player!.number}</span>
                  <span className="token-name">{shortName(player!.name)}</span>
                  <span className="token-pos" style={{ background: FIT_COLOR[lvl] }}>
                    {slot.label}
                  </span>
                  {mode === 'live' && staminaOf && (
                    <span className="token-stam">
                      <i style={{ width: `${stam}%`, background: stam < 45 ? 'var(--danger)' : stam < 65 ? 'var(--accent)' : 'var(--green)' }} />
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function shortName(name: string): string {
  // 한글은 그대로, 영문/공백 포함 시 성만
  if (/[가-힣]/.test(name)) return name.length > 4 ? name.slice(0, 4) : name
  const parts = name.split(' ')
  return parts[parts.length - 1]
}
