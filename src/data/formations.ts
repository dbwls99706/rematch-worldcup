import type { Formation, FormationName } from '../engine/types'

// 좌표계: x 0(좌)~100(우), y 0(상대 골)~100(우리 골).
// 우리 팀은 위(y 감소) 방향으로 공격한다. GK가 y값이 가장 크다.

export const FORMATIONS: Record<FormationName, Formation> = {
  '4-3-3': {
    name: '4-3-3',
    note: '측면 윙어의 폭과 중원 삼각형. 공수 균형의 표준.',
    slots: [
      { id: 'gk', role: 'GK', label: 'GK', x: 50, y: 92 },
      { id: 'lb', role: 'LB', label: 'LB', x: 15, y: 72 },
      { id: 'lcb', role: 'CB', label: 'CB', x: 38, y: 77 },
      { id: 'rcb', role: 'CB', label: 'CB', x: 62, y: 77 },
      { id: 'rb', role: 'RB', label: 'RB', x: 85, y: 72 },
      { id: 'dm', role: 'DM', label: 'DM', x: 50, y: 58 },
      { id: 'lcm', role: 'CM', label: 'CM', x: 32, y: 48 },
      { id: 'rcm', role: 'CM', label: 'CM', x: 68, y: 48 },
      { id: 'lw', role: 'LW', label: 'LW', x: 17, y: 27 },
      { id: 'st', role: 'ST', label: 'ST', x: 50, y: 20 },
      { id: 'rw', role: 'RW', label: 'RW', x: 83, y: 27 },
    ],
  },
  '4-2-3-1': {
    name: '4-2-3-1',
    note: '더블 볼란치가 뒤를 잠그고 3의 2선이 창의성을 담당.',
    slots: [
      { id: 'gk', role: 'GK', label: 'GK', x: 50, y: 92 },
      { id: 'lb', role: 'LB', label: 'LB', x: 15, y: 72 },
      { id: 'lcb', role: 'CB', label: 'CB', x: 38, y: 77 },
      { id: 'rcb', role: 'CB', label: 'CB', x: 62, y: 77 },
      { id: 'rb', role: 'RB', label: 'RB', x: 85, y: 72 },
      { id: 'ldm', role: 'DM', label: 'DM', x: 38, y: 60 },
      { id: 'rdm', role: 'DM', label: 'DM', x: 62, y: 60 },
      { id: 'lw', role: 'LW', label: 'LW', x: 18, y: 36 },
      { id: 'am', role: 'AM', label: 'AM', x: 50, y: 40 },
      { id: 'rw', role: 'RW', label: 'RW', x: 82, y: 36 },
      { id: 'st', role: 'ST', label: 'ST', x: 50, y: 20 },
    ],
  },
  '3-4-3': {
    name: '3-4-3',
    note: '스리백 위 넓은 4미들. 강한 압박과 측면 과부하에 최적.',
    slots: [
      { id: 'gk', role: 'GK', label: 'GK', x: 50, y: 92 },
      { id: 'lcb', role: 'CB', label: 'CB', x: 28, y: 77 },
      { id: 'cb', role: 'CB', label: 'CB', x: 50, y: 79 },
      { id: 'rcb', role: 'CB', label: 'CB', x: 72, y: 77 },
      { id: 'lm', role: 'LM', label: 'LM', x: 13, y: 52 },
      { id: 'lcm', role: 'CM', label: 'CM', x: 40, y: 55 },
      { id: 'rcm', role: 'CM', label: 'CM', x: 60, y: 55 },
      { id: 'rm', role: 'RM', label: 'RM', x: 87, y: 52 },
      { id: 'lw', role: 'LW', label: 'LW', x: 22, y: 26 },
      { id: 'st', role: 'ST', label: 'ST', x: 50, y: 20 },
      { id: 'rw', role: 'RW', label: 'RW', x: 78, y: 26 },
    ],
  },
  '3-5-2': {
    name: '3-5-2',
    note: '윙백이 폭을, 스리 미들이 중앙을 장악. 중원 수적 우위.',
    slots: [
      { id: 'gk', role: 'GK', label: 'GK', x: 50, y: 92 },
      { id: 'lcb', role: 'CB', label: 'CB', x: 28, y: 78 },
      { id: 'cb', role: 'CB', label: 'CB', x: 50, y: 80 },
      { id: 'rcb', role: 'CB', label: 'CB', x: 72, y: 78 },
      { id: 'lwb', role: 'LM', label: 'LWB', x: 11, y: 56 },
      { id: 'dm', role: 'DM', label: 'DM', x: 50, y: 62 },
      { id: 'lcm', role: 'CM', label: 'CM', x: 34, y: 47 },
      { id: 'rcm', role: 'CM', label: 'CM', x: 66, y: 47 },
      { id: 'rwb', role: 'RM', label: 'RWB', x: 89, y: 56 },
      { id: 'lst', role: 'ST', label: 'ST', x: 40, y: 22 },
      { id: 'rst', role: 'ST', label: 'ST', x: 60, y: 22 },
    ],
  },
  '4-4-2': {
    name: '4-4-2',
    note: '두 줄 4의 견고한 블록과 투톱. 역습과 세컨볼에 강하다.',
    slots: [
      { id: 'gk', role: 'GK', label: 'GK', x: 50, y: 92 },
      { id: 'lb', role: 'LB', label: 'LB', x: 15, y: 72 },
      { id: 'lcb', role: 'CB', label: 'CB', x: 38, y: 77 },
      { id: 'rcb', role: 'CB', label: 'CB', x: 62, y: 77 },
      { id: 'rb', role: 'RB', label: 'RB', x: 85, y: 72 },
      { id: 'lm', role: 'LM', label: 'LM', x: 16, y: 49 },
      { id: 'lcm', role: 'CM', label: 'CM', x: 40, y: 52 },
      { id: 'rcm', role: 'CM', label: 'CM', x: 60, y: 52 },
      { id: 'rm', role: 'RM', label: 'RM', x: 84, y: 49 },
      { id: 'lst', role: 'ST', label: 'ST', x: 40, y: 22 },
      { id: 'rst', role: 'ST', label: 'ST', x: 60, y: 22 },
    ],
  },
}

export const FORMATION_NAMES: FormationName[] = ['4-3-3', '4-2-3-1', '3-4-3', '3-5-2', '4-4-2']
