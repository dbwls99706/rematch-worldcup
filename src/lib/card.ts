import type { Grade } from '../engine/rating'

interface CardData {
  homeName: string
  awayName: string
  homeCode: string
  awayCode: string
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

    // 팀 이름 + 국기
    ctx.font = '700 40px Pretendard, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.fillText(d.homeName, center - 175, 560)
    ctx.fillText(d.awayName, center + 175, 560)
    drawFlag(ctx, d.homeCode, center - 175 - flagW(d.homeName, ctx) / 2 - 66, 528, 54, 36)
    drawFlag(ctx, d.awayCode, center + 175 + flagW(d.awayName, ctx) / 2 + 12, 528, 54, 36)

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

function flagW(name: string, ctx: CanvasRenderingContext2D): number {
  const prev = ctx.font
  ctx.font = '700 40px Pretendard, sans-serif'
  const w = ctx.measureText(name).width
  ctx.font = prev
  return w
}

// 간이 국기 렌더러 (SVG Flag 컴포넌트와 동일 팔레트)
function drawFlag(ctx: CanvasRenderingContext2D, code: string, x: number, y: number, w: number, h: number) {
  ctx.save()
  const cx = x + w / 2
  const cy = y + h / 2
  const box = (fill: string, dx = 0, dy = 0, dw = w, dh = h) => {
    ctx.fillStyle = fill
    ctx.fillRect(x + dx, y + dy, dw, dh)
  }
  switch (code) {
    case 'DE':
      box('#111', 0, 0, w, h / 3)
      box('#D00', 0, h / 3, w, h / 3)
      box('#FFCE00', 0, (2 * h) / 3, w, h / 3)
      break
    case 'IT':
      box('#fff'); box('#009246', 0, 0, w / 3); box('#CE2B37', (2 * w) / 3, 0, w / 3)
      break
    case 'FR':
      box('#fff'); box('#0055A4', 0, 0, w / 3); box('#EF4135', (2 * w) / 3, 0, w / 3)
      break
    case 'GH':
      box('#CE1126', 0, 0, w, h / 3)
      box('#FCD116', 0, h / 3, w, h / 3)
      box('#006B3F', 0, (2 * h) / 3, w, h / 3)
      star(ctx, cx, cy, h * 0.16, '#111')
      break
    case 'BR':
      box('#009C3B')
      ctx.fillStyle = '#FFDF00'
      ctx.beginPath()
      ctx.moveTo(cx, y + h * 0.14)
      ctx.lineTo(x + w * 0.86, cy)
      ctx.lineTo(cx, y + h * 0.86)
      ctx.lineTo(x + w * 0.14, cy)
      ctx.closePath()
      ctx.fill()
      circle(ctx, cx, cy, h * 0.22, '#002776')
      break
    case 'AR':
      box('#fff'); box('#74ACDF', 0, 0, w, h / 3); box('#74ACDF', 0, (2 * h) / 3, w, h / 3)
      circle(ctx, cx, cy, h * 0.13, '#F6B40E')
      break
    case 'UY':
      box('#fff')
      for (let i = 0; i < 4; i++) box('#0038A8', 0, h * (0.22 + i * 0.22), w, h * 0.11)
      box('#fff', 0, 0, w * 0.37, h * 0.55)
      circle(ctx, x + w * 0.185, y + h * 0.275, h * 0.12, '#F6B40E')
      break
    case 'KR':
      box('#fff')
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, h * 0.28, 0, Math.PI * 2)
      ctx.clip()
      box('#C60C30', 0, 0, w, h / 2)
      box('#003478', 0, h / 2, w, h / 2)
      ctx.restore()
      break
    case 'ZA':
      box('#DE3831', 0, 0, w, h / 2)
      box('#002395', 0, h / 2, w, h / 2)
      box('#fff', 0, h * 0.28, w, h * 0.44)
      box('#007A4D', 0, h * 0.35, w, h * 0.3)
      ctx.fillStyle = '#FFB915'
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + w * 0.5, cy)
      ctx.lineTo(x, y + h)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = '#111'
      ctx.beginPath()
      ctx.moveTo(x, y + h * 0.1)
      ctx.lineTo(x + w * 0.4, cy)
      ctx.lineTo(x, y + h * 0.9)
      ctx.closePath()
      ctx.fill()
      break
    case 'DZ':
      box('#006233', 0, 0, w / 2)
      box('#fff', w / 2, 0, w / 2)
      circle(ctx, x + w * 0.47, cy, h * 0.22, '#D21034')
      circle(ctx, x + w * 0.54, cy, h * 0.175, '#fff')
      star(ctx, x + w * 0.62, cy, h * 0.11, '#D21034')
      break
    case 'CZ':
      box('#fff', 0, 0, w, h / 2)
      box('#D7141A', 0, h / 2, w, h / 2)
      ctx.fillStyle = '#11457E'
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + w / 2, cy)
      ctx.lineTo(x, y + h)
      ctx.closePath()
      ctx.fill()
      break
    case 'MX':
      box('#fff'); box('#006847', 0, 0, w / 3); box('#CE1126', (2 * w) / 3, 0, w / 3)
      circle(ctx, cx, cy, h * 0.14, '#8C6239')
      break
    default:
      box('#64748b')
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = 1.5
  ctx.strokeRect(x, y, w, h)
  ctx.restore()
}

function circle(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, fill: string) {
  ctx.fillStyle = fill
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()
}

function star(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, fill: string) {
  ctx.fillStyle = fill
  ctx.beginPath()
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI / 2.5) * i - Math.PI / 2
    const a2 = a + Math.PI / 5
    ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
    ctx.lineTo(cx + r * 0.42 * Math.cos(a2), cy + r * 0.42 * Math.sin(a2))
  }
  ctx.closePath()
  ctx.fill()
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
