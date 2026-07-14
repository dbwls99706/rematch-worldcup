import { useState } from 'react'
import { motion } from 'framer-motion'
import { MousePointerClick, Sliders, Play } from 'lucide-react'

const STEPS = [
  {
    icon: MousePointerClick,
    title: '① 선수를 배치하세요',
    body: '벤치의 선수를 탭하거나 드래그해 피치의 빈 자리에 놓으세요. 이미 있는 선수끼리는 자리를 맞바꿉니다. 포지션 색상이 적합도를 알려줍니다.',
  },
  {
    icon: Sliders,
    title: '② 전술을 지시하세요',
    body: '수비 라인·압박·템포·폭·빌드업 5개의 다이얼로 팀의 성향을 정합니다. 모든 지시에는 대가가 따르고, 예상 전력 게이지가 실시간으로 반응합니다.',
  },
  {
    icon: Play,
    title: '③ 킥오프하세요',
    body: '준비가 끝나면 킥오프. 단, 킥오프 후에는 선발 라인업을 되돌릴 수 없습니다. 경기 중에는 교체 카드 3장과 전술·포메이션 변경, 하프타임 조정으로 개입할 수 있습니다.',
  },
]

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const s = STEPS[step]
  const Icon = s.icon
  const last = step === STEPS.length - 1

  return (
    <div className="modal-backdrop">
      <motion.div
        className="modal onboard"
        key={step}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="onboard-icon">
          <Icon size={26} />
        </div>
        <h3>{s.title}</h3>
        <p className="muted">{s.body}</p>
        <div className="onboard-dots">
          {STEPS.map((_, i) => (
            <span key={i} className={i === step ? 'on' : ''} />
          ))}
        </div>
        <div className="onboard-actions">
          <button className="btn ghost sm" onClick={onDone}>
            다시 보지 않기
          </button>
          <button className="btn primary" onClick={() => (last ? onDone() : setStep(step + 1))}>
            {last ? '시작하기' : '다음'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
