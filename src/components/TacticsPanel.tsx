import type { Tactics } from '../engine/types'
import { tacticNotes } from '../engine/tactics'

const SLIDERS: { key: keyof Tactics; label: string; lo: string; hi: string }[] = [
  { key: 'defLine', label: '수비 라인', lo: '낮게', hi: '높게' },
  { key: 'press', label: '압박 강도', lo: '관망', hi: '강하게' },
  { key: 'tempo', label: '경기 템포', lo: '느리게', hi: '빠르게' },
  { key: 'width', label: '공격 폭', lo: '좁게', hi: '넓게' },
  { key: 'build', label: '빌드업', lo: '롱볼', hi: '짧게' },
]

interface Props {
  tactics: Tactics
  onChange: (t: Partial<Tactics>) => void
  compact?: boolean
}

export default function TacticsPanel({ tactics, onChange, compact }: Props) {
  const notes = tacticNotes(tactics)
  return (
    <div className="tactics">
      {SLIDERS.map((s) => (
        <div className="slider-row" key={s.key}>
          <div className="slider-top">
            <span className="slider-label">{s.label}</span>
            <span className="slider-val">{tactics[s.key]}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={tactics[s.key]}
            onChange={(e) => onChange({ [s.key]: Number(e.target.value) } as Partial<Tactics>)}
            aria-label={s.label}
            style={{ ['--pct' as string]: `${tactics[s.key]}%` }}
          />
          <div className="slider-ends">
            <span>{s.lo}</span>
            <span>{s.hi}</span>
          </div>
        </div>
      ))}
      {!compact && notes.length > 0 && (
        <div className="tactic-notes">
          {notes.map((n, i) => (
            <div key={i} className="tactic-note">
              {n}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
