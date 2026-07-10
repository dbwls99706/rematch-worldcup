import { AlertTriangle, ArrowRight, Crosshair, Target, Users } from 'lucide-react'
import { BY_ID, getMatch, getTeam, useGame } from '../store/useGame'
import RadarChart from '../components/RadarChart'
import Flag from '../components/Flag'

export default function Briefing() {
  const matchId = useGame((s) => s.matchId)!
  const gotoWarRoom = useGame((s) => s.gotoWarRoom)
  const match = getMatch(matchId)
  const home = getTeam(match.home)
  const away = getTeam(match.away)
  const keyman = BY_ID[match.briefing.keyman]

  return (
    <div className="briefing fade-in">
      <div className="brief-head">
        <div>
          <span className="badge accent">프리매치 브리핑 · 스카우팅 리포트</span>
          <h1 className="brief-title">
            <Flag code={home.nationCode} size={26} /> {home.short} <span className="vs">vs</span> {away.short}{' '}
            <Flag code={away.nationCode} size={26} />
          </h1>
          <p className="muted">
            {match.competition} · {match.date}
          </p>
        </div>
        <button className="btn ghost sm" onClick={gotoWarRoom}>
          건너뛰기 <ArrowRight size={15} />
        </button>
      </div>

      <div className="brief-headline">"{match.briefing.headline}"</div>

      <div className="brief-grid">
        {/* 실제 경기 요약 */}
        <div className="panel brief-card">
          <div className="section-title">
            <Crosshair size={14} /> 실제 경기 기록
          </div>
          <div className="real-score">
            <span>{home.short}</span>
            <b>
              {match.realScore[0]} : {match.realScore[1]}
            </b>
            <span>{away.short}</span>
          </div>
          <div className="real-forms">
            <span className="badge">{match.realFormation[match.home]}</span>
            <span className="dim">실제 포메이션</span>
            <span className="badge">{match.realFormation[match.away]}</span>
          </div>
          <ul className="timeline">
            {match.realTimeline.map((ev, i) => (
              <li key={i} className={ev.team === 'home' ? 'home' : 'away'}>
                <span className="tl-min">{ev.min}'</span>
                <span className="tl-dot" />
                <span className="tl-note">{ev.note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 상대 위협 분석 */}
        <div className="panel brief-card">
          <div className="section-title">
            <AlertTriangle size={14} /> 상대 위협 분석
          </div>
          <div className="threat-box danger">
            <b>위협</b>
            {match.briefing.threat}
          </div>
          <div className="threat-box green">
            <b>약점</b>
            {match.briefing.weakness}
          </div>
          {keyman && (
            <div className="keyman">
              <div className="keyman-info">
                <span className="badge danger">
                  <Target size={12} /> 키플레이어
                </span>
                <div className="keyman-name">
                  <Flag code={keyman.nation} size={18} /> {keyman.name} <span className="dim">#{keyman.number}</span>
                </div>
                <div className="dim" style={{ fontSize: '.8rem' }}>
                  {keyman.positions.join(' / ')}
                </div>
              </div>
              <RadarChart stats={keyman.stats} size={132} color="#ef4444" showLabels={false} />
            </div>
          )}
        </div>

        {/* 우리 팀 상태 */}
        <div className="panel brief-card">
          <div className="section-title">
            <Users size={14} /> 우리 팀 · 감독 노트
          </div>
          <div className="threat-box">
            <b>{home.short}</b>
            {home.profile.style}
          </div>
          <div className="ournote">💬 {match.briefing.ourNote}</div>
          <div className="mgr-note">
            <span className="dim">실제 감독의 선택</span>
            <p>{match.briefing.realManagerNote}</p>
          </div>
        </div>
      </div>

      <div className="brief-cta">
        <div className="goal-banner">
          <span className="dim">이번 도전의 목표</span>
          <b>🎯 {match.goal}</b>
        </div>
        <button className="btn go lg" onClick={gotoWarRoom}>
          작전실로 이동 <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}
