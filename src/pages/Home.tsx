import { motion } from 'framer-motion'
import { ChevronRight, Star, Trophy } from 'lucide-react'
import { allMatches, getTeam, useGame } from '../store/useGame'
import Flag from '../components/Flag'

export default function Home() {
  const selectMatch = useGame((s) => s.selectMatch)
  const archive = useGame((s) => s.archive)
  const gotoArchive = useGame((s) => s.gotoArchive)
  const matches = allMatches()

  const bestGrade = archive.length ? archive.reduce((a, b) => (b.ratingScore > a.ratingScore ? b : a)) : null
  const flipped = archive.filter((a) => a.verdict === 'triumph' || a.verdict === 'improved').length

  return (
    <div className="home fade-in">
      <section className="hero">
        <div className="hero-glow" />
        <span className="hero-kicker">월드컵 리매치 시뮬레이터</span>
        <h1 className="hero-title">
          어제 끝난 그 경기,
          <br />
          오늘은 <em>당신이</em> 지휘합니다.
        </h1>
        <p className="hero-sub">
          이미 끝난 실제 월드컵 경기의 감독석에 다시 앉으세요. 라인업을 바꾸고, 전술을 지시하고,
          경기 중 교체 카드를 꺼내 — <strong>"내가 감독이었다면"</strong>의 결과를 데이터로 검증합니다.
        </p>
        <div className="hero-cta">
          <a className="btn primary lg" href="#matches">
            경기 선택하기 <ChevronRight size={18} />
          </a>
          {archive.length > 0 && (
            <button className="btn ghost lg" onClick={gotoArchive}>
              <Trophy size={18} /> 내 감독 커리어
            </button>
          )}
        </div>

        {archive.length > 0 && (
          <div className="hero-stats">
            <div>
              <b>{archive.length}</b>
              <span>도전</span>
            </div>
            <div>
              <b>{flipped}</b>
              <span>뒤집은 역사</span>
            </div>
            <div>
              <b style={{ color: 'var(--gold)' }}>{bestGrade?.grade ?? '-'}</b>
              <span>최고 평점</span>
            </div>
          </div>
        )}
      </section>

      <section id="matches" className="matches">
        <div className="section-title">
          <span>경기 라이브러리</span>
          <span className="muted" style={{ fontWeight: 600, textTransform: 'none', letterSpacing: 0 }}>
            {matches.length}경기 · 당신의 도전을 기다립니다
          </span>
        </div>
        <div className="match-grid">
          {matches.map((m, i) => {
            const home = getTeam(m.home)
            const away = getTeam(m.away)
            const done = archive.filter((a) => a.matchId === m.id)
            const best = done.length ? done.reduce((a, b) => (b.ratingScore > a.ratingScore ? b : a)) : null
            return (
              <motion.button
                key={m.id}
                className="match-card"
                onClick={() => selectMatch(m.id)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <div className="mc-comp">{m.competition}</div>
                <div className="mc-teams">
                  <div className="mc-team">
                    <Flag code={home.nationCode} size={30} />
                    <span className="mc-name">{home.short}</span>
                  </div>
                  <div className="mc-score">
                    <b>{m.realScore[0]}</b>
                    <span>:</span>
                    <b>{m.realScore[1]}</b>
                  </div>
                  <div className="mc-team">
                    <Flag code={away.nationCode} size={30} />
                    <span className="mc-name">{away.short}</span>
                  </div>
                </div>
                <div className="mc-goal">🎯 {m.goal}</div>
                <div className="mc-foot">
                  <span className="mc-diff">
                    난이도{' '}
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} size={12} fill={s < m.difficulty ? 'var(--accent)' : 'none'} color="var(--accent)" />
                    ))}
                  </span>
                  {best ? (
                    <span className="badge green">최고 {best.grade}등급</span>
                  ) : (
                    <span className="mc-provoke">정말 최선이었을까?</span>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>
      </section>

      <footer className="home-foot muted">
        REMATCH · 실제 월드컵 데이터를 참조한 전술 시뮬레이터 · 선수 능력치는 자체 산정값이며 공식 기록이 아닙니다.
      </footer>
    </div>
  )
}
