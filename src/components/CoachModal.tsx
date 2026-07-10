import { motion } from 'framer-motion'
import { Check, Sparkles, X } from 'lucide-react'
import type { CoachAdvice } from '../engine/aiCoach'
import { flag } from '../data/teams'

interface Props {
  advice: CoachAdvice
  onApply: () => void
  onClose: () => void
}

const LABELS: Record<string, string> = {
  defLine: '수비 라인',
  press: '압박',
  tempo: '템포',
  width: '폭',
  build: '빌드업',
}

export default function CoachModal({ advice, onApply, onClose }: Props) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div
        className="modal coach-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.94, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      >
        <button className="modal-x" onClick={onClose} aria-label="닫기">
          <X size={18} />
        </button>
        <div className="coach-head">
          <div className="coach-avatar">
            <Sparkles size={20} />
          </div>
          <div>
            <b>AI 코치의 전술 제안</b>
            <p className="dim">상대 분석 기반 추천입니다. 초안일 뿐, 최종 결정은 감독님의 몫입니다.</p>
          </div>
        </div>

        <div className="coach-reasons">
          {advice.reasons.map((r, i) => (
            <div key={i} className="coach-reason">
              <b>{r.title}</b>
              <span>{r.detail}</span>
            </div>
          ))}
        </div>

        {advice.keyman && (
          <div className="coach-keyman">
            <span className="badge accent">추천 키맨</span>
            <b>
              {flag(advice.keyman.player.nation)} {advice.keyman.player.name}
            </b>
            <span className="dim">{advice.keyman.note}</span>
          </div>
        )}

        <div className="coach-tactics">
          <span className="dim">추천 전술 세팅</span>
          <div className="coach-chips">
            {(Object.keys(LABELS) as (keyof typeof advice.tactics)[]).map((k) => (
              <span key={k} className="chip">
                {LABELS[k]} <b>{advice.tactics[k]}</b>
              </span>
            ))}
          </div>
        </div>

        <div className="coach-actions">
          <button className="btn ghost" onClick={onClose}>
            직접 짜겠습니다
          </button>
          <button className="btn primary" onClick={onApply}>
            <Check size={16} /> 추천 적용
          </button>
        </div>
      </motion.div>
    </div>
  )
}
