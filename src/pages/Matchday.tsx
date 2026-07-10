import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeftRight, FastForward, Flag as FlagIcon, Pause, Play, Sliders } from 'lucide-react'
import { BY_ID, getMatch, getTeam, useGame } from '../store/useGame'
import { FORMATIONS } from '../data/formations'
import Pitch, { shortName } from '../components/Pitch'
import Flag from '../components/Flag'
import TacticsPanel from '../components/TacticsPanel'
import type { SimEvent } from '../engine/types'

export default function Matchday() {
  const matchId = useGame((s) => s.matchId)!
  const engine = useGame((s) => s.engine)!
  const tick = useGame((s) => s.tick)
  const playing = useGame((s) => s.playing)
  const speed = useGame((s) => s.speed)
  const halftime = useGame((s) => s.halftime)
  const matchFinished = useGame((s) => s.matchFinished)

  const play = useGame((s) => s.play)
  const pause = useGame((s) => s.pause)
  const setSpeed = useGame((s) => s.setSpeed)
  const advance = useGame((s) => s.advance)
  const resumeSecondHalf = useGame((s) => s.resumeSecondHalf)
  const substitute = useGame((s) => s.substitute)
  const changeTactics = useGame((s) => s.changeTactics)
  const finishToReport = useGame((s) => s.finishToReport)

  const match = getMatch(matchId)
  const home = getTeam(match.home)
  const away = getTeam(match.away)

  // 상태 스냅샷 (tick마다 갱신)
  const state = useMemo(() => engine.getState(), [engine, tick])
  const homeSetup = useMemo(() => engine.sideSetup('home'), [engine, tick])

  const [showSub, setShowSub] = useState(false)
  const [showTac, setShowTac] = useState(false)
  const [flash, setFlash] = useState<SimEvent | null>(null)
  const lastEventCount = useRef(0)

  // 재생 루프
  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => advance(), 720 / speed)
    return () => clearInterval(id)
  }, [playing, speed, advance])

  // 골 플래시 (events 배열은 in-place 변경되므로 tick에 의존)
  useEffect(() => {
    const evs = engine.getState().events
    if (evs.length > lastEventCount.current) {
      const fresh = evs.slice(lastEventCount.current)
      lastEventCount.current = evs.length
      const goal = [...fresh].reverse().find((e) => e.type === 'goal')
      if (goal) {
        setFlash(goal)
        const t = setTimeout(() => setFlash(null), 1700)
        return () => clearTimeout(t)
      }
    }
  }, [tick, engine])

  const momentum = state.momentum.length ? state.momentum[state.momentum.length - 1] : 0
  const homeMo = Math.round(50 + momentum / 2)
  const subsLeft = engine.subsLeftFor('home')

  return (
    <div className="matchday fade-in">
      {/* 스코어보드 */}
      <div className="scoreboard">
        <div className="sb-team home">
          <Flag code={home.nationCode} size={28} />
          <span className="sb-name">{home.short}</span>
        </div>
        <div className="sb-center">
          <div className="sb-score">
            <b>{state.score[0]}</b>
            <span>:</span>
            <b>{state.score[1]}</b>
          </div>
          <div className="sb-clock">
            <span className="live-dot" /> {Math.min(state.minute, 90)}'
          </div>
        </div>
        <div className="sb-team away">
          <span className="sb-name">{away.short}</span>
          <Flag code={away.nationCode} size={28} />
        </div>
      </div>

      {/* 모멘텀 */}
      <div className="momentum">
        <span className="mo-label home">{home.short}</span>
        <div className="mo-bar">
          <div className="mo-fill" style={{ width: `${homeMo}%` }} />
          <span className="mo-center" />
        </div>
        <span className="mo-label away">{away.short}</span>
      </div>

      <div className="md-grid">
        {/* 피치 */}
        <div className="md-pitch panel">
          <Pitch
            formation={FORMATIONS[homeSetup.formationName]}
            lineup={homeSetup.lineup}
            byId={BY_ID}
            mode="live"
            color={home.color}
            staminaOf={(pid) => engine.staminaOf(pid)}
          />
          <div className="md-stats">
            <Stat label="점유율" h={`${state.stats.possession}%`} a={`${100 - state.stats.possession}%`} />
            <Stat label="슈팅" h={state.stats.shots[0]} a={state.stats.shots[1]} />
            <Stat label="유효슈팅" h={state.stats.shotsOnTarget[0]} a={state.stats.shotsOnTarget[1]} />
            <Stat label="xG" h={state.stats.xg[0].toFixed(1)} a={state.stats.xg[1].toFixed(1)} />
          </div>
        </div>

        {/* 해설 + 개입 */}
        <div className="md-side">
          <div className="panel md-feed">
            <div className="section-title">
              <FlagIcon size={13} /> 실시간 중계
            </div>
            <div className="feed-scroll">
              <AnimatePresence initial={false}>
                {[...state.events]
                  .reverse()
                  .slice(0, 40)
                  .map((ev, i) => (
                    <motion.div
                      key={state.events.length - i}
                      className={`feed-item ${ev.type} ${ev.side}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      {ev.text}
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>

          {/* 개입 패널 */}
          <div className="panel md-intervene">
            <div className="section-title">감독 개입</div>
            {!matchFinished ? (
              <>
                <div className="intervene-row">
                  <button
                    className="btn"
                    disabled={subsLeft <= 0}
                    onClick={() => {
                      pause()
                      setShowSub(true)
                    }}
                  >
                    <ArrowLeftRight size={15} /> 교체
                    <span className="sub-cards">
                      {[0, 1, 2].map((i) => (
                        <i key={i} className={i < subsLeft ? 'left' : 'used'} />
                      ))}
                    </span>
                  </button>
                  <button
                    className="btn"
                    onClick={() => {
                      pause()
                      setShowTac(true)
                    }}
                  >
                    <Sliders size={15} /> 전술 변경
                  </button>
                </div>
                <div className="intervene-controls">
                  <button className="btn sm ghost" onClick={() => (playing ? pause() : play())}>
                    {playing ? <Pause size={15} /> : <Play size={15} />} {playing ? '일시정지' : '재생'}
                  </button>
                  <div className="speed">
                    <FastForward size={14} className="dim" />
                    {([1, 2, 4] as const).map((s) => (
                      <button key={s} className={`spd ${speed === s ? 'on' : ''}`} onClick={() => setSpeed(s)}>
                        ×{s}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="md-finished">
                <b>경기 종료</b>
                <p className="muted">
                  최종 {home.short} {state.score[0]} : {state.score[1]} {away.short}
                </p>
                <button className="btn primary block lg" onClick={finishToReport}>
                  IF 리포트 보기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 골 플래시 */}
      <AnimatePresence>
        {flash && (
          <motion.div
            className="goal-flash"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
          >
            <span className="gf-big">GOAL!</span>
            <span className="gf-text">{flash.text.replace(/^⚽\s*\d+'\s*골!\s*/, '')}</span>
            <span className="gf-score">
              {state.score[0]} : {state.score[1]}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 하프타임 */}
      {halftime && <Halftime home={home.short} score={state.score} tactics={homeSetup.tactics} onResume={resumeSecondHalf} />}

      {/* 교체 모달 */}
      {showSub && (
        <SubModal
          onClose={() => {
            setShowSub(false)
            play()
          }}
          onConfirm={(out, inId) => {
            const ok = substitute(out, inId)
            setShowSub(false)
            play()
            return ok
          }}
          engine={engine}
          setup={homeSetup}
        />
      )}

      {/* 전술 변경 모달 */}
      {showTac && (
        <div className="modal-backdrop" onClick={() => { setShowTac(false); play() }}>
          <motion.div className="modal" onClick={(e) => e.stopPropagation()} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <h3 style={{ marginBottom: '.4rem' }}>전술 변경</h3>
            <p className="muted" style={{ marginBottom: '1rem', fontSize: '.85rem' }}>
              변경은 즉시 남은 경기에 반영됩니다.
            </p>
            <TacticsPanel tactics={homeSetup.tactics} onChange={(t) => changeTactics({ ...homeSetup.tactics, ...t })} />
            <div className="confirm-actions" style={{ marginTop: '1rem' }}>
              <button className="btn primary" onClick={() => { setShowTac(false); play() }}>
                적용하고 계속
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function Stat({ label, h, a }: { label: string; h: string | number; a: string | number }) {
  return (
    <div className="md-stat">
      <span className="ms-h">{h}</span>
      <span className="ms-l">{label}</span>
      <span className="ms-a">{a}</span>
    </div>
  )
}

// ── 하프타임 ──
function Halftime({
  home,
  score,
  tactics,
  onResume,
}: {
  home: string
  score: [number, number]
  tactics: import('../engine/types').Tactics
  onResume: (boost: number, tactics?: import('../engine/types').Tactics) => void
}) {
  const [talk, setTalk] = useState<number | null>(null)
  const [tac, setTac] = useState(tactics)
  const [seconds, setSeconds] = useState(60)

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [])
  useEffect(() => {
    if (seconds === 0 && talk === null) {
      onResume(4, tac) // 방치 시 '침착' 자동
    }
  }, [seconds, talk, tac, onResume])

  const TALKS = [
    { k: 0, label: '질책', boost: 15, desc: '강하게 다그친다 — 후반 초반 화력 상승, 부담도 크다' },
    { k: 1, label: '독려', boost: 10, desc: '자신감을 불어넣는다 — 안정적인 상승효과' },
    { k: 2, label: '침착', boost: 4, desc: '평정심을 유지한다 — 변화는 작지만 리스크도 없다' },
  ]

  const lead = score[0] > score[1]
  return (
    <div className="modal-backdrop">
      <motion.div className="modal halftime" initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="ht-head">
          <span className="badge accent">하프타임 · 라커룸</span>
          <span className="ht-timer">{seconds}s</span>
        </div>
        <h3>
          전반 종료 — {home} {score[0]}:{score[1]}
        </h3>
        <p className="muted" style={{ fontSize: '.86rem' }}>
          {lead ? '리드를 지킬지, 더 밀어붙일지 결정하세요.' : score[0] === score[1] ? '균형을 깨야 합니다.' : '뒤집을 시간입니다.'}
        </p>

        <div className="section-title" style={{ marginTop: '1rem' }}>팀토크</div>
        <div className="talk-grid">
          {TALKS.map((t) => (
            <button key={t.k} className={`talk-card ${talk === t.k ? 'on' : ''}`} onClick={() => setTalk(t.k)}>
              <b>{t.label}</b>
              <span>{t.desc}</span>
            </button>
          ))}
        </div>

        <div className="section-title" style={{ marginTop: '1rem' }}>전술 재조정 (선택)</div>
        <TacticsPanel tactics={tac} onChange={(t) => setTac({ ...tac, ...t })} compact />

        <button
          className="btn go block lg"
          style={{ marginTop: '1.1rem' }}
          disabled={talk === null}
          onClick={() => onResume(TALKS[talk!].boost, tac)}
        >
          후반전 시작
        </button>
      </motion.div>
    </div>
  )
}

// ── 교체 모달 ──
function SubModal({
  engine,
  setup,
  onClose,
  onConfirm,
}: {
  engine: import('../engine/simulate').MatchEngine
  setup: import('../engine/types').TeamSetup
  onClose: () => void
  onConfirm: (out: string, inId: string) => boolean
}) {
  const [out, setOut] = useState<string | null>(null)
  const [inId, setInId] = useState<string | null>(null)
  const onPitch = Object.values(setup.lineup).filter(Boolean)
  const bench = setup.bench

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div className="modal sub-modal" onClick={(e) => e.stopPropagation()} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <h3>선수 교체</h3>
        <p className="muted" style={{ fontSize: '.84rem', marginBottom: '.8rem' }}>
          내보낼 선수와 투입할 선수를 선택하세요. 교체 카드 1장이 소모됩니다.
        </p>
        <div className="sub-cols">
          <div className="sub-col">
            <div className="section-title">OUT · 필드</div>
            <div className="sub-list">
              {onPitch.map((pid) => {
                const p = BY_ID[pid]
                const st = Math.round(engine.staminaOf(pid))
                return (
                  <button key={pid} className={`sub-item ${out === pid ? 'sel out' : ''}`} onClick={() => setOut(pid)}>
                    <span>
                      {p.number} {shortName(p.name)}
                    </span>
                    <span className={`stam ${st < 55 ? 'low' : ''}`}>{st}%</span>
                  </button>
                )
              })}
            </div>
          </div>
          <div className="sub-col">
            <div className="section-title">IN · 벤치</div>
            <div className="sub-list">
              {bench.map((pid) => {
                const p = BY_ID[pid]
                return (
                  <button key={pid} className={`sub-item ${inId === pid ? 'sel in' : ''}`} onClick={() => setInId(pid)}>
                    <span>
                      {p.number} {shortName(p.name)}
                    </span>
                    <span className="dim" style={{ fontSize: '.72rem' }}>
                      {p.positions[0]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
        <div className="confirm-actions" style={{ marginTop: '1rem' }}>
          <button className="btn ghost" onClick={onClose}>
            취소
          </button>
          <button className="btn primary" disabled={!out || !inId} onClick={() => out && inId && onConfirm(out, inId)}>
            교체 확정
          </button>
        </div>
      </motion.div>
    </div>
  )
}
