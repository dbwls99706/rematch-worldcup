import { Trash2, TrendingUp } from 'lucide-react'
import { useGame } from '../store/useGame'
import { GRADE_COLOR } from '../engine/rating'

const FLAGS: Record<string, string> = {
  KR: '🇰🇷', GH: '🇬🇭', DE: '🇩🇪', IT: '🇮🇹', BR: '🇧🇷', AR: '🇦🇷', FR: '🇫🇷', UY: '🇺🇾',
}

export default function Archive() {
  const archive = useGame((s) => s.archive)
  const selectMatch = useGame((s) => s.selectMatch)
  const wipeArchive = useGame((s) => s.wipeArchive)
  const goHome = useGame((s) => s.goHome)

  const flipped = archive.filter((a) => a.verdict === 'triumph' || a.verdict === 'improved').length
  const best = archive.length ? archive.reduce((a, b) => (b.ratingScore > a.ratingScore ? b : a)) : null
  const wins = archive.filter((a) => a.myScore[0] > a.myScore[1]).length
  const draws = archive.filter((a) => a.myScore[0] === a.myScore[1]).length
  const losses = archive.length - wins - draws

  return (
    <div className="archive fade-in">
      <div className="wr-head">
        <div>
          <span className="badge accent">내 감독 커리어</span>
          <h1 className="wr-title">감독 기록실</h1>
          <p className="muted">localStorage에 저장된 나만의 도전 기록 — 서버도 가입도 없이 브라우저에 보관됩니다.</p>
        </div>
        {archive.length > 0 && (
          <button className="btn sm ghost danger" onClick={() => confirm('모든 기록을 삭제할까요?') && wipeArchive()}>
            <Trash2 size={15} /> 초기화
          </button>
        )}
      </div>

      {archive.length === 0 ? (
        <div className="empty-archive panel">
          <TrendingUp size={40} className="dim" />
          <h3>아직 기록이 없습니다</h3>
          <p className="muted">첫 경기에 도전해 감독 커리어를 시작하세요.</p>
          <button className="btn primary" onClick={goHome}>
            경기 선택하기
          </button>
        </div>
      ) : (
        <>
          <div className="career-summary">
            <div className="cs-card">
              <b>{archive.length}</b>
              <span>총 도전</span>
            </div>
            <div className="cs-card">
              <b>
                {wins}<span className="dim" style={{ fontSize: '1rem' }}>승</span> {draws}
                <span className="dim" style={{ fontSize: '1rem' }}>무</span> {losses}
                <span className="dim" style={{ fontSize: '1rem' }}>패</span>
              </b>
              <span>전적</span>
            </div>
            <div className="cs-card">
              <b style={{ color: 'var(--green)' }}>{flipped}</b>
              <span>뒤집은 역사</span>
            </div>
            <div className="cs-card">
              <b style={{ color: best ? GRADE_COLOR[best.grade] : 'var(--gold)' }}>{best?.grade ?? '-'}</b>
              <span>최고 평점</span>
            </div>
          </div>

          <div className="archive-list">
            {archive.map((a) => (
              <div key={a.id} className="archive-item panel">
                <div
                  className="ai-grade"
                  style={{ ['--gc' as string]: GRADE_COLOR[a.grade], color: GRADE_COLOR[a.grade] }}
                >
                  {a.grade}
                </div>
                <div className="ai-main">
                  <div className="ai-title">{a.matchTitle}</div>
                  <div className="ai-comp dim">{a.competition}</div>
                  <div className="ai-scores">
                    <span className="ai-my">
                      {FLAGS[a.homeCode] ?? ''} 나 {a.myScore[0]}:{a.myScore[1]}
                    </span>
                    <span className="dim">
                      실제 {a.realScore[0]}:{a.realScore[1]}
                    </span>
                    {(a.verdict === 'triumph' || a.verdict === 'improved') && (
                      <span className="badge green">역사 변경</span>
                    )}
                  </div>
                </div>
                <button className="btn sm" onClick={() => selectMatch(a.matchId)}>
                  재도전
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
