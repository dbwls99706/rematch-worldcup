import type { Team } from '../engine/types'

// squad 배열: 앞 11명이 실제 기준 선발, 이후가 벤치. (기본 라인업 자동 구성에 사용)
export const TEAMS: Record<string, Team> = {
  kr22: {
    id: 'kr22',
    name: '대한민국 2022',
    short: '대한민국',
    nationCode: 'KR',
    color: '#c8102e',
    defaultFormation: '4-2-3-1',
    squad: [
      'kr22_kimsg', 'kr22_kimmw', 'kr22_kimmj', 'kr22_kimyg', 'kr22_kimjs',
      'kr22_jungwy', 'kr22_hwangib', 'kr22_son', 'kr22_leejs', 'kr22_hwanghc',
      'kr22_chogs', 'kr22_leeki', 'kr22_nash', 'kr22_baeksh', 'kr22_choym', 'kr22_songbg',
    ],
    profile: {
      style: '손흥민의 역습과 김민재의 수비를 축으로 한 조직적 4-2-3-1',
      maxFwPace: 92, buildup: 'mixed', fullbackJoin: 'high', aerialWeak: false,
      tags: ['counter', 'organized', 'son_dependent'],
    },
  },
  gha22: {
    id: 'gha22',
    name: '가나 2022',
    short: '가나',
    nationCode: 'GH',
    color: '#006b3f',
    defaultFormation: '4-3-3',
    squad: [
      'gha22_ati', 'gha22_seidu', 'gha22_amartey', 'gha22_salisu', 'gha22_baba',
      'gha22_samed', 'gha22_partey', 'gha22_kudus', 'gha22_ayewj', 'gha22_williams',
      'gha22_ayewa', 'gha22_sulemana', 'gha22_bukari', 'gha22_owusu',
    ],
    profile: {
      style: '쿠두스·윌리엄스의 스피드와 세트피스 제공권을 노리는 다이렉트 축구',
      maxFwPace: 92, buildup: 'long', fullbackJoin: 'mid', aerialWeak: false,
      tags: ['pace', 'aerial', 'set_piece', 'direct'],
    },
  },
  kr18: {
    id: 'kr18',
    name: '대한민국 2018',
    short: '대한민국',
    nationCode: 'KR',
    color: '#c8102e',
    defaultFormation: '4-4-2',
    squad: [
      'kr18_johw', 'kr18_leey', 'kr18_yoonys', 'kr18_kimyg', 'kr18_hongc',
      'kr18_jungwy', 'kr18_koo', 'kr18_leejs', 'kr18_moonsm', 'kr18_son',
      'kr18_hwanghc', 'kr18_koojc', 'kr18_jidw', 'kr18_jusj', 'kr18_kimsg',
    ],
    profile: {
      style: '조현우의 선방과 밀집 수비 뒤 손흥민의 역습 한 방',
      maxFwPace: 90, buildup: 'long', fullbackJoin: 'low', aerialWeak: false,
      tags: ['low_block', 'counter', 'goalkeeper'],
    },
  },
  ger18: {
    id: 'ger18',
    name: '독일 2018',
    short: '독일',
    nationCode: 'DE',
    color: '#111827',
    defaultFormation: '4-2-3-1',
    squad: [
      'ger18_neuer', 'ger18_kimmich', 'ger18_sule', 'ger18_hummels', 'ger18_hector',
      'ger18_kroos', 'ger18_goretzka', 'ger18_ozil', 'ger18_muller', 'ger18_draxler',
      'ger18_werner', 'ger18_gomez', 'ger18_reus', 'ger18_gundogan', 'ger18_brandt',
    ],
    profile: {
      style: '크로스·외질의 점유율 지배, 높은 라인과 후방 빌드업',
      maxFwPace: 93, buildup: 'short', fullbackJoin: 'high', aerialWeak: false,
      tags: ['possession', 'high_line', 'creative'],
    },
  },
  kr02: {
    id: 'kr02',
    name: '대한민국 2002',
    short: '대한민국',
    nationCode: 'KR',
    color: '#c8102e',
    defaultFormation: '3-4-3',
    squad: [
      'kr02_leewj', 'kr02_choijc', 'kr02_hongmb', 'kr02_kimty', 'kr02_songjk',
      'kr02_kimni', 'kr02_yoosc', 'kr02_leeyp', 'kr02_hwangsh', 'kr02_seolkh',
      'kr02_parkjs', 'kr02_ahnjh', 'kr02_leecs', 'kr02_chadr', 'kr02_leeus',
    ],
    profile: {
      style: '히딩크의 3-4-3 강한 압박과 지치지 않는 체력, 측면 오버래핑',
      maxFwPace: 86, buildup: 'mixed', fullbackJoin: 'high', aerialWeak: false,
      tags: ['pressing', 'stamina', 'wing_overload'],
    },
  },
  ita02: {
    id: 'ita02',
    name: '이탈리아 2002',
    short: '이탈리아',
    nationCode: 'IT',
    color: '#0057b8',
    defaultFormation: '4-4-2',
    squad: [
      'ita02_buffon', 'ita02_panucci', 'ita02_maldini', 'ita02_nesta', 'ita02_iuliano',
      'ita02_zambrotta', 'ita02_tommasi', 'ita02_gattuso', 'ita02_totti', 'ita02_vieri',
      'ita02_delpiero', 'ita02_montella', 'ita02_delvecchio', 'ita02_dinogennaro', 'ita02_toldo',
    ],
    profile: {
      style: '카테나치오 — 네스타·말디니의 수비 위 비에리·토티의 한 방, 리드 후 잠그기',
      maxFwPace: 82, buildup: 'mixed', fullbackJoin: 'mid', aerialWeak: false,
      tags: ['catenaccio', 'lead_defend', 'clinical'],
    },
  },
  bra14: {
    id: 'bra14',
    name: '브라질 2014',
    short: '브라질',
    nationCode: 'BR',
    color: '#ffcf00',
    defaultFormation: '4-2-3-1',
    squad: [
      'bra14_juliocesar', 'bra14_maicon', 'bra14_dante', 'bra14_davidluiz', 'bra14_marcelo',
      'bra14_fernandinho', 'bra14_luizgustavo', 'bra14_hulk', 'bra14_oscar', 'bra14_bernard',
      'bra14_fred', 'bra14_ramires', 'bra14_paulinho', 'bra14_willian', 'bra14_jo',
    ],
    profile: {
      style: '네이마르·티아구 실바 없이 감정에 기댄 공격 일변도 — 수비 뒷공간이 위험',
      maxFwPace: 88, buildup: 'mixed', fullbackJoin: 'high', aerialWeak: true,
      tags: ['emotional', 'open', 'fragile_defense', 'no_neymar'],
    },
  },
  ger14: {
    id: 'ger14',
    name: '독일 2014',
    short: '독일',
    nationCode: 'DE',
    color: '#111827',
    defaultFormation: '4-3-3',
    squad: [
      'ger14_neuer', 'ger14_lahm', 'ger14_boateng', 'ger14_hummels', 'ger14_howedes',
      'ger14_khedira', 'ger14_schweinsteiger', 'ger14_muller', 'ger14_kroos', 'ger14_ozil',
      'ger14_klose', 'ger14_schurrle', 'ger14_draxler', 'ger14_podolski', 'ger14_gotze',
    ],
    profile: {
      style: '완성형 티키타카 — 크로스의 지휘 아래 순식간의 연속 골 폭풍',
      maxFwPace: 88, buildup: 'short', fullbackJoin: 'high', aerialWeak: false,
      tags: ['possession', 'clinical', 'ruthless', 'high_press'],
    },
  },
  arg22: {
    id: 'arg22',
    name: '아르헨티나 2022',
    short: '아르헨티나',
    nationCode: 'AR',
    color: '#6cabdd',
    defaultFormation: '4-3-3',
    squad: [
      'arg22_martinez', 'arg22_molina', 'arg22_romero', 'arg22_otamendi', 'arg22_tagliafico',
      'arg22_depaul', 'arg22_fernandez', 'arg22_macallister', 'arg22_messi', 'arg22_dimaria',
      'arg22_alvarez', 'arg22_lautaro', 'arg22_dybala', 'arg22_montiel', 'arg22_paredes',
    ],
    profile: {
      style: '메시를 위한 헌신적 중원과 마르티네스의 선방, 승부차기의 제왕',
      maxFwPace: 88, buildup: 'mixed', fullbackJoin: 'high', aerialWeak: false,
      tags: ['messi', 'togetherness', 'penalty_kings'],
    },
  },
  fra22: {
    id: 'fra22',
    name: '프랑스 2022',
    short: '프랑스',
    nationCode: 'FR',
    color: '#1a2a6c',
    defaultFormation: '4-2-3-1',
    squad: [
      'fra22_lloris', 'fra22_kounde', 'fra22_varane', 'fra22_upamecano', 'fra22_hernandez',
      'fra22_tchouameni', 'fra22_rabiot', 'fra22_dembele', 'fra22_griezmann', 'fra22_mbappe',
      'fra22_giroud', 'fra22_kolomuani', 'fra22_thuram', 'fra22_coman', 'fra22_camavinga',
    ],
    profile: {
      style: '음바페의 폭발적 스피드와 그리즈만의 조율 — 순간 화력의 정점',
      maxFwPace: 97, buildup: 'mixed', fullbackJoin: 'high', aerialWeak: false,
      tags: ['pace', 'mbappe', 'transition', 'firepower'],
    },
  },
  kr10: {
    id: 'kr10',
    name: '대한민국 2010',
    short: '대한민국',
    nationCode: 'KR',
    color: '#c8102e',
    defaultFormation: '4-2-3-1',
    squad: [
      'kr10_jungsr', 'kr10_ohbs', 'kr10_leejs', 'kr10_choyh', 'kr10_leeyp',
      'kr10_koo', 'kr10_kimjw', 'kr10_leecy', 'kr10_parkjs', 'kr10_yeomkh',
      'kr10_leedg', 'kr10_parkjy', 'kr10_kimjs', 'kr10_kimni', 'kr10_leewj',
    ],
    profile: {
      style: '박지성의 리더십과 이청용의 측면 돌파 — 사상 첫 원정 16강 세대',
      maxFwPace: 84, buildup: 'mixed', fullbackJoin: 'mid', aerialWeak: true,
      tags: ['park_leadership', 'wing', 'young'],
    },
  },
  uru10: {
    id: 'uru10',
    name: '우루과이 2010',
    short: '우루과이',
    nationCode: 'UY',
    color: '#5cbfeb',
    defaultFormation: '3-5-2',
    squad: [
      'uru10_muslera', 'uru10_maxi', 'uru10_lugano', 'uru10_godin', 'uru10_fucile',
      'uru10_arevalo', 'uru10_perez', 'uru10_alvaro', 'uru10_forlan', 'uru10_suarez',
      'uru10_cavani', 'uru10_abreu', 'uru10_ignacio', 'uru10_fernandez', 'uru10_scotti',
    ],
    profile: {
      style: '포를란·수아레스·카바니 삼각편대의 개인 능력과 고딘의 단단함',
      maxFwPace: 88, buildup: 'mixed', fullbackJoin: 'mid', aerialWeak: false,
      tags: ['front_three', 'individual', 'solid'],
    },
  },
}

export function getTeam(id: string): Team {
  const t = TEAMS[id]
  if (!t) throw new Error(`Unknown team id: ${id}`)
  return t
}

// 국가 코드 → 국기 이모지
const FLAGS: Record<string, string> = {
  KR: '🇰🇷', GH: '🇬🇭', DE: '🇩🇪', IT: '🇮🇹', BR: '🇧🇷',
  AR: '🇦🇷', FR: '🇫🇷', UY: '🇺🇾',
}
export function flag(nationCode: string): string {
  return FLAGS[nationCode] ?? '🏳️'
}
