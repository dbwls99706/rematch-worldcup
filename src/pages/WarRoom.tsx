import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw, Sparkles, Users2, X } from 'lucide-react'
import { BY_ID, getMatch, getTeam, useGame } from '../store/useGame'
import Flag from '../components/Flag'
import { FORMATIONS } from '../data/formations'
import { FORMATION_NAMES } from '../data/formations'
import { computePower } from '../engine/strength'
import { applyMatrix, deriveMods, projectStrength } from '../engine/tactics'
import { recommend, type CoachAdvice } from '../engine/aiCoach'
import type { Player, Position } from '../engine/types'
import Pitch, { shortName } from '../components/Pitch'
import TacticsPanel from '../components/TacticsPanel'
import StrengthGauge from '../components/StrengthGauge'
import RadarChart from '../components/RadarChart'
import CoachModal from '../components/CoachModal'
import Onboarding from '../components/Onboarding'

type Filter = 'ALL' | 'GK' | 'DF' | 'MF' | 'FW'
const GROUP: Record<Filter, Position[]> = {
  ALL: [],
  GK: ['GK'],
  DF: ['CB', 'LB', 'RB'],
  MF: ['DM', 'CM', 'AM', 'LM', 'RM'],
  FW: ['LW', 'RW', 'ST'],
}

export default function WarRoom() {
  const matchId = useGame((s) => s.matchId)!
  const setup = useGame((s) => s.setup)!
  const match = getMatch(matchId)
  const home = getTeam(match.home)
  const away = getTeam(match.away)

  const setFormation = useGame((s) => s.setFormation)
  const assignToSlot = useGame((s) => s.assignToSlot)
  const removeFromSlot = useGame((s) => s.removeFromSlot)
  const setTactics = useGame((s) => s.setTactics)
  const resetSetup = useGame((s) => s.resetSetup)
  const applyCoach = useGame((s) => s.applyCoach)
  const startMatch = useGame((s) => s.startMatch)
  const onboardingDone = useGame((s) => s.onboardingDone)
  const dismissOnboarding = useGame((s) => s.dismissOnboarding)

  const [selected, setSelected] = useState<string | null>(null)
  const [detail, setDetail] = useState<{ a: string | null; b: string | null }>({ a: null, b: null })
  const [filter, setFilter] = useState<Filter>('ALL')
  const [ghost, setGhost] = useState<{ pid: string; x: number; y: number } | null>(null)
  const [coach, setCoach] = useState<CoachAdvice | null>(null)
  const [showKick, setShowKick] = useState(false)

  const power = useMemo(() => computePower(setup, BY_ID), [setup])
  const projection = useMemo(() => {
    const base = deriveMods(setup.tactics)
    const { mods, messages } = applyMatrix(setup.tactics, base, away.profile)
    return { proj: projectStrength(power, mods), messages }
  }, [setup, power, away.profile])

  const placedIds = Object.values(setup.lineup).filter(Boolean)
  const placedCount = placedIds.length
  const hasGK = Boolean(setup.lineup['gk'])
  const ready = placedCount >= 11 && hasGK

  // ── drag & tap (동일 pointerup 경로로 처리해 click/drag 충돌 제거) ──
  function beginDrag(pid: string, from: 'bench' | 'slot', slotId: string | undefined, e: React.PointerEvent) {
    e.preventDefault()
    const start = { x: e.clientX, y: e.clientY }
    let moved = false
    setGhost({ pid, x: e.clientX, y: e.clientY })
    const move = (ev: PointerEvent) => {
      if (!moved && Math.hypot(ev.clientX - start.x, ev.clientY - start.y) > 6) moved = true
      setGhost({ pid, x: ev.clientX, y: ev.clientY })
    }
    const up = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      setGhost(null)
      if (!moved) {
        // 탭으로 처리
        if (from === 'slot' && slotId) handleSlotTap(pid)
        else tapPlayer(pid)
        return
      }
      const el = document.elementFromPoint(ev.clientX, ev.clientY) as HTMLElement | null
      const slotEl = el?.closest('[data-slot]')
      if (slotEl) {
        assignToSlot(slotEl.getAttribute('data-slot')!, pid)
      } else if (el?.closest('[data-bench]') && from === 'slot' && slotId) {
        removeFromSlot(slotId)
      }
      setSelected(null)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  function tapPlayer(pid: string) {
    setSelected((prev) => (prev === pid ? null : pid))
    setDetail((d) => (d.a && d.a !== pid && !d.b ? { a: d.a, b: pid } : { a: pid, b: null }))
  }

  function handleSlotTap(pid: string) {
    // 필드 위 선수를 탭: 다른 선수가 픽업 상태면 자리 이동, 아니면 상세 표시
    if (selected && selected !== pid) {
      const slotId = Object.keys(setup.lineup).find((s) => setup.lineup[s] === pid)
      if (slotId) assignToSlot(slotId, selected)
      setSelected(null)
    } else {
      tapPlayer(pid)
    }
  }

  function onSlotClick(slotId: string) {
    // 빈 슬롯 탭 → 픽업된 선수 배치
    if (selected && !setup.lineup[slotId]) {
      assignToSlot(slotId, selected)
      setSelected(null)
    }
  }

  function openCoach() {
    setCoach(recommend(match, setup, BY_ID))
  }

  const squadList = useMemo(() => {
    const ids = home.squad.filter((id) => (filter === 'ALL' ? true : GROUP[filter].includes(BY_ID[id].positions[0])))
    return ids.map((id) => BY_ID[id])
  }, [home.squad, filter])

  const detA = detail.a ? BY_ID[detail.a] : null
  const detB = detail.b ? BY_ID[detail.b] : null

  return (
    <div className="warroom fade-in">
      {!onboardingDone && <Onboarding onDone={dismissOnboarding} />}

      <div className="wr-head">
        <div>
          <span className="badge accent">작전실 · 전술 보드</span>
          <h1 className="wr-title">
            <Flag code={home.nationCode} size={24} /> {home.name} <span className="dim">감독석</span>
          </h1>
          <p className="muted">
            🎯 {match.goal} · 상대: <Flag code={away.nationCode} size={15} /> {away.name}
          </p>
        </div>
        <div className="wr-head-actions">
          <button className="btn sm" onClick={openCoach}>
            <Sparkles size={15} /> AI 코치
          </button>
          <button className="btn sm ghost" onClick={resetSetup}>
            <RotateCcw size={15} /> 초기화
          </button>
        </div>
      </div>

      <div className="wr-grid">
        {/* ── 피치 ── */}
        <div className="wr-pitch panel">
          <div className="wr-formations">
            {FORMATION_NAMES.map((f) => (
              <button
                key={f}
                className={`fbtn ${setup.formationName === f ? 'on' : ''}`}
                onClick={() => setFormation(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <Pitch
            formation={FORMATIONS[setup.formationName]}
            lineup={setup.lineup}
            byId={BY_ID}
            mode="edit"
            selectedPlayer={selected}
            color={home.color}
            onSlotClick={onSlotClick}
            onTokenPointerDown={(slotId, pid, e) => beginDrag(pid, 'slot', slotId, e)}
          />
          <div className="wr-pitch-foot">
            <span className="dim" style={{ fontSize: '.78rem' }}>
              {FORMATIONS[setup.formationName].note}
            </span>
            <span className={`placed ${ready ? 'ok' : 'warn'}`}>
              <Users2 size={14} /> 선발 {placedCount}/11 {!hasGK && '· GK 필요'}
            </span>
          </div>
        </div>

        {/* ── 우측 패널 ── */}
        <div className="wr-side">
          {/* 선수 상세 / 비교 */}
          {detA && (
            <div className="panel wr-detail">
              <button className="mini-x" onClick={() => setDetail({ a: null, b: null })} aria-label="닫기">
                <X size={15} />
              </button>
              <div className="section-title">선수 카드 {detB && '· 비교'}</div>
              <div className="detail-players">
                <div className="detail-p" style={{ color: '#22c55e' }}>
                  <Flag code={detA.nation} size={16} /> {detA.name} <span className="dim">#{detA.number}</span>
                  <div className="dim" style={{ fontSize: '.75rem' }}>
                    {detA.positions.join(' / ')}
                  </div>
                </div>
                {detB && (
                  <div className="detail-p" style={{ color: '#f59e0b' }}>
                    <Flag code={detB.nation} size={16} /> {detB.name} <span className="dim">#{detB.number}</span>
                    <div className="dim" style={{ fontSize: '.75rem' }}>
                      {detB.positions.join(' / ')}
                    </div>
                  </div>
                )}
              </div>
              <div className="detail-radar">
                <RadarChart stats={detA.stats} compare={detB?.stats} size={210} />
              </div>
              {detA.traits.length > 0 && (
                <div className="trait-row">
                  {detA.traits.map((t) => (
                    <span key={t} className="badge">
                      {TRAIT_KO[t] ?? t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 전력 게이지 */}
          <div className="panel wr-strength">
            <div className="section-title">예상 전력</div>
            <StrengthGauge
              attack={projection.proj.attack}
              defense={projection.proj.defense}
              control={projection.proj.control}
              warnings={power.warnings}
              messages={projection.messages}
            />
          </div>

          {/* 전술 지시 */}
          <div className="panel wr-tactics">
            <div className="section-title">전술 지시</div>
            <TacticsPanel tactics={setup.tactics} onChange={setTactics} />
          </div>
        </div>
      </div>

      {/* ── 스쿼드 리스트 ── */}
      <div className="panel wr-squad" data-bench>
        <div className="squad-head">
          <div className="section-title" style={{ margin: 0 }}>
            스쿼드 · 탭 또는 드래그로 배치
          </div>
          <div className="filter-tabs">
            {(['ALL', 'GK', 'DF', 'MF', 'FW'] as Filter[]).map((f) => (
              <button key={f} className={`ftab ${filter === f ? 'on' : ''}`} onClick={() => setFilter(f)}>
                {f === 'ALL' ? '전체' : f}
              </button>
            ))}
          </div>
        </div>
        <div className="squad-scroll">
          {squadList.map((p) => (
            <SquadCard
              key={p.id}
              player={p}
              placed={placedIds.includes(p.id)}
              selected={selected === p.id}
              onPointerDown={(e) => beginDrag(p.id, 'bench', undefined, e)}
            />
          ))}
        </div>
      </div>

      {/* ── 킥오프 바 ── */}
      <div className="kick-bar">
        <div className="kick-info">
          <span className="badge">{setup.formationName}</span>
          <span className="muted">{ready ? '준비 완료 — 되돌릴 수 없습니다' : '선발 11명과 골키퍼를 채우세요'}</span>
        </div>
        <button className="btn go lg" disabled={!ready} onClick={() => setShowKick(true)}>
          <Play size={18} /> 킥오프
        </button>
      </div>

      {/* 드래그 고스트 */}
      {ghost && (
        <div className="drag-ghost" style={{ left: ghost.x, top: ghost.y }}>
          {shortName(BY_ID[ghost.pid].name)}
        </div>
      )}

      {/* AI 코치 모달 */}
      {coach && (
        <CoachModal
          advice={coach}
          onApply={() => {
            applyCoach(coach)
            setCoach(null)
          }}
          onClose={() => setCoach(null)}
        />
      )}

      {/* 킥오프 확인 */}
      {showKick && (
        <div className="modal-backdrop" onClick={() => setShowKick(false)}>
          <motion.div
            className="modal confirm"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3>킥오프 하시겠습니까?</h3>
            <p className="muted">
              킥오프 이후에는 라인업과 포메이션을 되돌릴 수 없습니다. 경기 중에는 교체 카드 3장과 하프타임 조정으로만
              개입할 수 있습니다.
            </p>
            <div className="confirm-actions">
              <button className="btn ghost" onClick={() => setShowKick(false)}>
                더 준비하기
              </button>
              <button
                className="btn go"
                onClick={() => {
                  setShowKick(false)
                  startMatch()
                }}
              >
                <Play size={16} /> 경기 시작
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function SquadCard({
  player,
  placed,
  selected,
  onPointerDown,
}: {
  player: Player
  placed: boolean
  selected: boolean
  onPointerDown: (e: React.PointerEvent) => void
}) {
  return (
    <div
      className={`squad-card ${placed ? 'placed' : ''} ${selected ? 'selected' : ''}`}
      onPointerDown={onPointerDown}
      style={{ ['--ov' as string]: player.stats.shot > player.stats.defense ? '#ef4444' : '#38bdf8' }}
    >
      <span className="sc-num">{player.number}</span>
      <div className="sc-main">
        <span className="sc-name">
          <Flag code={player.nation} size={13} /> {shortName(player.name)}
        </span>
        <span className="sc-pos">{player.positions.join(' · ')}</span>
      </div>
      <span className="sc-ovr">{ovr(player)}</span>
      {placed && <span className="sc-badge">선발</span>}
    </div>
  )
}

function ovr(p: Player): number {
  const s = p.stats
  const primary = p.positions[0]
  if (primary === 'GK') return Math.round(s.defense * 0.7 + s.physical * 0.3)
  if (['CB', 'LB', 'RB'].includes(primary)) return Math.round(s.defense * 0.45 + s.physical * 0.25 + s.pace * 0.2 + s.pass * 0.1)
  if (['ST', 'LW', 'RW'].includes(primary)) return Math.round(s.shot * 0.32 + s.dribble * 0.24 + s.pace * 0.24 + s.pass * 0.2)
  return Math.round(s.pass * 0.34 + s.dribble * 0.2 + s.defense * 0.22 + s.pace * 0.12 + s.physical * 0.12)
}

const TRAIT_KO: Record<string, string> = {
  counter_attacker: '역습 전개',
  aerial_threat: '제공권',
  playmaker: '경기 조율',
  clutch: '결정력',
  ball_winner: '볼 탈취',
  sprinter: '스피드',
  set_piece: '세트피스',
  wall: '최후의 벽',
  engine: '활동량',
  target_man: '타겟형',
}
