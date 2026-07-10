import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Home as HomeIcon, RotateCcw, Trophy } from 'lucide-react'
import { flag, getMatch, getTeam, useGame } from '../store/useGame'
import { GRADE_COLOR } from '../engine/rating'
import { drawResultCard } from '../lib/card'

export default function Report() {
  const matchId = useGame((s) => s.matchId)!
  const result = useGame((s) => s.result)!
  const gotoWarRoom = useGame((s) => s.gotoWarRoom)
  const goHome = useGame((s) => s.goHome)
  const gotoArchive = useGame((s) => s.gotoArchive)

  const match = getMatch(matchId)
  const home = getTeam(match.home)
  const away = getTeam(match.away)
  const { rating, score, scorers, momentum } = result

  const [slider, setSlider] = useState(100) // 0=실제, 100=나의
  const [saving, setSaving] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const myGoals = scorers.filter((s) => s.side === 'home')

  async function saveImage() {
    setSaving(true)
    try {
      const blob = await drawResultCard({
        homeName: home.short,
        awayName: away.short,
        homeFlag: flag(home.nationCode),
        awayFlag: flag(away.nationCode),
        myScore: score,
        realScore: match.realScore,
        grade: rating.grade,
        gradeColor: GRADE_COLOR[rating.grade],
        headline: rating.headline,
        competition: match.competition,
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `REMATCH_${match.home}_${rating.grade}.png`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('이미지 저장에 실패했습니다. 화면을 캡처해 공유해주세요.')
    } finally {
      setSaving(false)
    }
  }

  const verdictClass =
    rating.verdict === 'triumph' || rating.verdict === 'improved'
      ? 'triumph'
      : rating.verdict === 'worse'
        ? 'worse'
        : 'repeat'

  return (
    <div className="report fade-in">
      {/* 헤드라인 카드 */}
      <motion.div
        ref={cardRef}
        className={`report-hero ${verdictClass}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="badge">IF 리포트 · {match.competition}</span>
        <h1 className="report-headline">"{rating.headline}"</h1>
        <p className="report-sub">{rating.subhead}</p>

        <div className="report-scoreline">
          <div className="rs-team">
            <span className="rs-flag">{flag(home.nationCode)}</span>
            <span>{home.short}</span>
          </div>
          <div className="rs-score">
            <b>{score[0]}</b>
            <span>:</span>
            <b>{score[1]}</b>
          </div>
          <div className="rs-team">
            <span className="rs-flag">{flag(away.nationCode)}</span>
            <span>{away.short}</span>
          </div>
        </div>

        <div className="grade-badge" style={{ ['--gc' as string]: GRADE_COLOR[rating.grade] }}>
          <span className="grade-letter">{rating.grade}</span>
          <div className="grade-meta">
            <b>감독 평점</b>
            <span>{rating.score}점 / 100</span>
          </div>
        </div>
      </motion.div>

      <div className="report-grid">
        {/* 비교 슬라이더 (INT-10) */}
        <div className="panel compare-card">
          <div className="section-title">
            <span>실제 역사 vs 나의 경기</span>
            <span className="dim" style={{ fontWeight: 600, textTransform: 'none', letterSpacing: 0 }}>
              슬라이더를 움직여 비교
            </span>
          </div>
          <div className="compare-stage">
            <div className="compare-layer real">
              <span className="cl-tag">실제 역사</span>
              <div className="cl-score">
                {match.realScore[0]} : {match.realScore[1]}
              </div>
              <ul className="cl-time">
                {match.realTimeline.slice(0, 5).map((e, i) => (
                  <li key={i}>
                    <b>{e.min}'</b> {e.note}
                  </li>
                ))}
              </ul>
            </div>
            <div className="compare-layer mine" style={{ clipPath: `inset(0 0 0 ${100 - slider}%)` }}>
              <span className="cl-tag mine">나의 경기</span>
              <div className="cl-score">
                {score[0]} : {score[1]}
              </div>
              <ul className="cl-time">
                {myGoals.length ? (
                  myGoals.map((g, i) => (
                    <li key={i}>
                      <b>{g.min}'</b> {g.player} 득점
                    </li>
                  ))
                ) : (
                  <li className="dim">나의 팀은 득점하지 못했습니다</li>
                )}
                {scorers
                  .filter((s) => s.side === 'away')
                  .slice(0, 3)
                  .map((g, i) => (
                    <li key={`a${i}`} className="dim">
                      <b>{g.min}'</b> {g.player} 실점
                    </li>
                  ))}
              </ul>
            </div>
            <div className="compare-divider" style={{ left: `${slider}%` }} />
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={slider}
            onChange={(e) => setSlider(Number(e.target.value))}
            className="compare-slider"
            aria-label="실제와 나의 경기 비교"
          />
          <div className="compare-snaps">
            <button className="btn sm ghost" onClick={() => setSlider(0)}>
              ← 실제
            </button>
            <button className="btn sm ghost" onClick={() => setSlider(100)}>
              나의 경기 →
            </button>
          </div>
        </div>

        {/* 평점 축 + 성취 */}
        <div className="report-side">
          <div className="panel">
            <div className="section-title">감독 평점 분석</div>
            <div className="axes">
              {rating.axes.map((ax) => (
                <div key={ax.label} className="axis-row">
                  <div className="axis-top">
                    <span>{ax.label}</span>
                    <b>{ax.value}</b>
                  </div>
                  <div className="axis-bar">
                    <motion.div
                      className="axis-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${ax.value}%` }}
                      transition={{ duration: 0.7 }}
                    />
                  </div>
                  <span className="axis-note dim">{ax.note}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="section-title">
              <Trophy size={13} /> 결정적 장면 · 성취
            </div>
            <ul className="achievements">
              {rating.achievements.map((a, i) => (
                <li key={i}>✔ {a}</li>
              ))}
            </ul>
            {momentum.length > 0 && <MomentumSpark data={momentum} />}
          </div>
        </div>
      </div>

      <div className="report-actions">
        <button className="btn" disabled={saving} onClick={saveImage}>
          <Download size={16} /> {saving ? '저장 중...' : '결과 카드 저장'}
        </button>
        <button className="btn" onClick={gotoWarRoom}>
          <RotateCcw size={16} /> 재도전
        </button>
        <button className="btn" onClick={gotoArchive}>
          <Trophy size={16} /> 내 기록
        </button>
        <button className="btn primary" onClick={goHome}>
          <HomeIcon size={16} /> 다른 경기
        </button>
      </div>
    </div>
  )
}

function MomentumSpark({ data }: { data: number[] }) {
  const w = 260
  const h = 44
  const pts = data
    .map((v, i) => {
      const x = (i / Math.max(1, data.length - 1)) * w
      const y = h / 2 - (v / 100) * (h / 2 - 3)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  return (
    <div className="spark">
      <span className="dim" style={{ fontSize: '.72rem' }}>
        경기 모멘텀 흐름 (위: 우리 우세)
      </span>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
        <line x1="0" y1={h / 2} x2={w} y2={h / 2} stroke="var(--line)" strokeWidth="1" />
        <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth="2" />
      </svg>
    </div>
  )
}
