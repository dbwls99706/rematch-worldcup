// 결정적 시드 난수 (mulberry32) — 같은 시드는 같은 경기를 재현한다.
export class RNG {
  private s: number
  constructor(seed: number) {
    this.s = seed >>> 0
  }
  next(): number {
    this.s |= 0
    this.s = (this.s + 0x6d2b79f5) | 0
    let t = Math.imul(this.s ^ (this.s >>> 15), 1 | this.s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  /** [min, max) 실수 */
  range(min: number, max: number): number {
    return min + this.next() * (max - min)
  }
  /** 확률 p로 true */
  chance(p: number): boolean {
    return this.next() < p
  }
  /** 배열에서 하나 선택 */
  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)]
  }
  /** 가중치 기반 선택 */
  weighted<T>(items: T[], weights: number[]): T {
    const total = weights.reduce((a, b) => a + b, 0)
    let r = this.next() * total
    for (let i = 0; i < items.length; i++) {
      r -= weights[i]
      if (r <= 0) return items[i]
    }
    return items[items.length - 1]
  }
}

// 문자열 → 32bit 시드
export function hashSeed(str: string): number {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return (h ^= h >>> 16) >>> 0
}
