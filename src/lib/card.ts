import type { Grade } from '../engine/rating'

interface CardData {
  homeName: string
  awayName: string
  homeFlag: string
  awayFlag: string
  myScore: [number, number]
  realScore: [number, number]
  grade: Grade
  gradeColor: string
  headline: string
  competition: string
}

// Canvas로 공유용 결과 카드(PNG)를 렌더링
export function drawResultCard(d: CardData): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const W = 1080
    const H = 1350
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    if (!ctx) return reject(new Error('no ctx'))

    // 배경 그라디언트
    const bg = ctx.createLinearGradient(0, 0, 0, H)
    bg.addColorStop(0, '#0a5c30')
    bg.addColorStop(0.5, '#0a3d24')
    bg.addColorStop(1, '#090c12')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    // 상단 피치 라인 장식
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(W / 2, 250, 120, 0, Math.PI * 2)
    ctx.stroke()

    const center = W / 2
    ctx.textAlign = 'center'

    // 로고/타이틀
    ctx.fillStyle = '#f59e0b'
    ctx.font = '800 46px Pretendard, sans-serif'
    ctx.fillText('RE·MATCH', center, 130)
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.font = '600 24px Pretendard, sans-serif'
    ctx.fillText(d.competition, center, 175)

    // 헤드라인
    ctx.fillStyle = '#ffffff'
    ctx.font = '800 54px Pretendard, sans-serif'
    wrapText(ctx, `"${d.headline}"`, center, 340, 940, 64)

    // 스코어
    ctx.font = '700 40px Pretendard, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.fillText(`${d.homeFlag}  ${d.homeName}`, center - 200, 560)
    ctx.fillText(`${d.awayName}  ${d.awayFlag}`, center + 200, 560)

    ctx.font = '900 150px Pretendard, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`${d.myScore[0]} : ${d.myScore[1]}`, center, 700)

    ctx.font = '600 30px Pretendard, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.fillText(`실제 결과  ${d.realScore[0]} : ${d.realScore[1]}`, center, 760)

    // 등급 원
    ctx.beginPath()
    ctx.arc(center, 960, 130, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.05)'
    ctx.fill()
    ctx.lineWidth = 8
    ctx.strokeStyle = d.gradeColor
    ctx.stroke()
    ctx.fillStyle = d.gradeColor
    ctx.font = '900 150px Pretendard, sans-serif'
    ctx.fillText(d.grade, center, 1015)
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.font = '700 28px Pretendard, sans-serif'
    ctx.fillText('감독 평점', center, 1140)

    // 푸터
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.font = '600 24px Pretendard, sans-serif'
    ctx.fillText('그날의 경기, 나의 전술로 다시 — REMATCH', center, 1280)

    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('toBlob failed'))
    }, 'image/png')
  })
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const chars = text.split('')
  let line = ''
  const lines: string[] = []
  for (const ch of chars) {
    const test = line + ch
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = ch
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  const startY = y - ((lines.length - 1) * lineHeight) / 2
  lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight))
}
