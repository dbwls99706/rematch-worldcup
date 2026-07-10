import { AlertTriangle, Lightbulb } from 'lucide-react'
import type { MatrixMessage } from '../engine/tactics'

interface Props {
  attack: number
  defense: number
  control: number
  warnings: string[]
  messages: MatrixMessage[]
}

const BARS: { key: 'attack' | 'defense' | 'control'; label: string; color: string }[] = [
  { key: 'attack', label: '공격력', color: 'var(--danger)' },
  { key: 'control', label: '중원 장악', color: 'var(--accent)' },
  { key: 'defense', label: '수비력', color: 'var(--blue)' },
]

export default function StrengthGauge({ attack, defense, control, warnings, messages }: Props) {
  const vals = { attack, defense, control }
  return (
    <div className="strength">
      {BARS.map((b) => (
        <div className="str-row" key={b.key}>
          <span className="str-label">{b.label}</span>
          <div className="str-bar">
            <div
              className="str-fill"
              style={{ width: `${Math.round(vals[b.key])}%`, background: b.color }}
            />
          </div>
          <span className="str-num">{Math.round(vals[b.key])}</span>
        </div>
      ))}

      {warnings.map((w, i) => (
        <div key={`w${i}`} className="str-msg warn">
          <AlertTriangle size={13} /> {w}
        </div>
      ))}
      {messages.map((m, i) => (
        <div key={`m${i}`} className={`str-msg ${m.kind}`}>
          {m.kind === 'warn' ? <AlertTriangle size={13} /> : <Lightbulb size={13} />} {m.text}
        </div>
      ))}
    </div>
  )
}
