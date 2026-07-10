// 헤드리스 스토어 플로우 검증 — 브라우저 없이 전체 게임 루프 로직을 실행.
import { useGame } from '../src/store/useGame'
import { MATCHES } from '../src/data/matches'

// jsdom 없이 localStorage 호출은 persist의 try/catch가 흡수한다.
let ok = 0
let fail = 0
function check(cond: boolean, msg: string) {
  if (cond) ok++
  else {
    fail++
    console.error('  ✗ FAIL:', msg)
  }
}

for (const m of MATCHES) {
  const s = useGame.getState()
  s.selectMatch(m.id)
  check(useGame.getState().view === 'briefing', `${m.id}: briefing 진입`)
  check(useGame.getState().setup !== null, `${m.id}: setup 생성`)

  useGame.getState().gotoWarRoom()
  const started = useGame.getState().startMatch()
  check(started, `${m.id}: 킥오프 성공`)
  check(useGame.getState().engine !== null, `${m.id}: 엔진 생성`)

  // 90분 진행 (하프타임 자동 재개)
  let guard = 0
  while (!useGame.getState().matchFinished && guard < 200) {
    const st = useGame.getState()
    if (st.halftime) {
      st.resumeSecondHalf(10)
    } else {
      st.advance()
    }
    guard++
  }
  check(useGame.getState().matchFinished, `${m.id}: 경기 종료 도달 (guard=${guard})`)

  // 교체 1회 시도 (엔진 직접)
  const eng = useGame.getState().engine!
  const setup = eng.sideSetup('home')
  const outId = Object.values(setup.lineup)[10]
  const inId = setup.bench[0]

  useGame.getState().finishToReport()
  const res = useGame.getState().result
  check(res !== null, `${m.id}: 리포트 생성`)
  check(!!res && ['S', 'A', 'B', 'C', 'D', 'F'].includes(res.rating.grade), `${m.id}: 등급 산출 (${res?.rating.grade})`)
  check(useGame.getState().archive.length > 0, `${m.id}: 아카이브 저장`)

  console.log(
    `✔ ${m.title}: 최종 ${res?.score[0]}:${res?.score[1]} · ${res?.rating.grade}등급 (${res?.rating.score}점) · "${res?.rating.headline}" · ${res?.events.length} 이벤트` +
      (outId && inId ? '' : ''),
  )
  useGame.getState().goHome()
}

console.log(`\n결과: ${ok} 통과 / ${fail} 실패`)
if (fail > 0) process.exit(1)
