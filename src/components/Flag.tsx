// 국기 SVG — 이모지 국기는 Windows(Segoe UI Emoji)에서 국가코드 박스로 깨지므로
// 8개국을 직접 SVG로 렌더링해 모든 플랫폼에서 동일하게 보이도록 한다.

interface Props {
  code: string
  size?: number // 높이(px). 폭은 1.5배
  className?: string
}

export default function Flag({ code, size = 20, className }: Props) {
  const w = size * 1.5
  return (
    <span
      className={className}
      style={{ display: 'inline-flex', verticalAlign: 'middle', width: w, height: size, borderRadius: 3, overflow: 'hidden', flexShrink: 0, boxShadow: '0 0 0 1px rgba(0,0,0,.25)' }}
    >
      <svg viewBox="0 0 30 20" width={w} height={size} preserveAspectRatio="none">
        {FLAGS[code] ?? FALLBACK}
      </svg>
    </span>
  )
}

const FALLBACK = <rect width="30" height="20" fill="#64748b" />

const FLAGS: Record<string, JSX.Element> = {
  // 독일 — 흑/적/금 가로 삼색
  DE: (
    <>
      <rect width="30" height="20" fill="#111" />
      <rect y="6.67" width="30" height="6.67" fill="#D00" />
      <rect y="13.33" width="30" height="6.67" fill="#FFCE00" />
    </>
  ),
  // 이탈리아 — 녹/백/적 세로 삼색
  IT: (
    <>
      <rect width="30" height="20" fill="#fff" />
      <rect width="10" height="20" fill="#009246" />
      <rect x="20" width="10" height="20" fill="#CE2B37" />
    </>
  ),
  // 프랑스 — 청/백/적 세로 삼색
  FR: (
    <>
      <rect width="30" height="20" fill="#fff" />
      <rect width="10" height="20" fill="#0055A4" />
      <rect x="20" width="10" height="20" fill="#EF4135" />
    </>
  ),
  // 대한민국 — 백색 + 태극(적/청)
  KR: (
    <>
      <rect width="30" height="20" fill="#fff" />
      <g transform="translate(15,10)">
        <path d="M0,-4 A4,4 0 0,1 0,4 A2,2 0 0,1 0,0 A2,2 0 0,0 0,-4 Z" fill="#C60C30" />
        <path d="M0,4 A4,4 0 0,1 0,-4 A2,2 0 0,0 0,0 A2,2 0 0,1 0,4 Z" fill="#003478" />
      </g>
      <g stroke="#111" strokeWidth="0.7">
        <line x1="5.5" y1="5" x2="8" y2="7.5" />
        <line x1="22" y1="12.5" x2="24.5" y2="15" />
      </g>
    </>
  ),
  // 가나 — 적/금/녹 + 흑성
  GH: (
    <>
      <rect width="30" height="20" fill="#CE1126" />
      <rect y="6.67" width="30" height="6.67" fill="#FCD116" />
      <rect y="13.33" width="30" height="6.67" fill="#006B3F" />
      <polygon points="15,7 15.9,9.6 18.6,9.6 16.4,11.2 17.3,13.9 15,12.2 12.7,13.9 13.6,11.2 11.4,9.6 14.1,9.6" fill="#111" />
    </>
  ),
  // 브라질 — 녹 + 황 마름모 + 청 원
  BR: (
    <>
      <rect width="30" height="20" fill="#009C3B" />
      <polygon points="15,2.5 27,10 15,17.5 3,10" fill="#FFDF00" />
      <circle cx="15" cy="10" r="4" fill="#002776" />
    </>
  ),
  // 아르헨티나 — 하늘색/백/하늘색 + 오월의 태양
  AR: (
    <>
      <rect width="30" height="20" fill="#fff" />
      <rect width="30" height="6.67" fill="#74ACDF" />
      <rect y="13.33" width="30" height="6.67" fill="#74ACDF" />
      <circle cx="15" cy="10" r="2.1" fill="#F6B40E" />
    </>
  ),
  // 남아프리카공화국 — 적/청 + 녹색 Y + 흑색 삼각(금 테두리)
  ZA: (
    <>
      <rect width="30" height="10" fill="#DE3831" />
      <rect y="10" width="30" height="10" fill="#002395" />
      <rect y="5.5" width="30" height="9" fill="#fff" />
      <rect y="7" width="30" height="6" fill="#007A4D" />
      <polygon points="0,0 16,10 0,20" fill="#FFB915" />
      <polygon points="0,2 12.5,10 0,18" fill="#111" />
    </>
  ),
  // 알제리 — 녹/백 + 적색 초승달·별
  DZ: (
    <>
      <rect width="15" height="20" fill="#006233" />
      <rect x="15" width="15" height="20" fill="#fff" />
      <circle cx="14.4" cy="10" r="4.4" fill="#D21034" />
      <circle cx="16" cy="10" r="3.5" fill="#fff" />
      <polygon points="18,7.4 18.7,9.5 20.9,9.5 19.1,10.8 19.8,12.9 18,11.6 16.2,12.9 16.9,10.8 15.1,9.5 17.3,9.5" fill="#D21034" />
    </>
  ),
  // 체코 — 백/적 가로 + 청색 삼각(호이스트)
  CZ: (
    <>
      <rect width="30" height="10" fill="#fff" />
      <rect y="10" width="30" height="10" fill="#D7141A" />
      <polygon points="0,0 15,10 0,20" fill="#11457E" />
    </>
  ),
  // 멕시코 — 녹/백/적 세로 삼색 + 중앙 문장
  MX: (
    <>
      <rect width="30" height="20" fill="#fff" />
      <rect width="10" height="20" fill="#006847" />
      <rect x="20" width="10" height="20" fill="#CE1126" />
      <circle cx="15" cy="10" r="2.8" fill="#8C6239" />
    </>
  ),
  // 우루과이 — 백/청 줄무늬 + 태양 칸톤
  UY: (
    <>
      <rect width="30" height="20" fill="#fff" />
      <rect y="4.4" width="30" height="2.2" fill="#0038A8" />
      <rect y="8.9" width="30" height="2.2" fill="#0038A8" />
      <rect y="13.3" width="30" height="2.2" fill="#0038A8" />
      <rect y="17.8" width="30" height="2.2" fill="#0038A8" />
      <rect width="11" height="11" fill="#fff" />
      <circle cx="5.5" cy="5.5" r="2.2" fill="#F6B40E" />
    </>
  ),
}
