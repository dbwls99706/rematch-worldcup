import type { Player, Position, Stats, Trait } from '../engine/types'

// 컴팩트 팩토리 — [pace, pass, dribble, shot, defense, physical]
function p(
  id: string,
  name: string,
  nation: string,
  number: number,
  positions: Position[],
  s: [number, number, number, number, number, number],
  stamina: number,
  traits: Trait[] = [],
): Player {
  const stats: Stats = { pace: s[0], pass: s[1], dribble: s[2], shot: s[3], defense: s[4], physical: s[5] }
  return { id, name, nation, number, positions, stats, stamina, traits }
}

// ⚠️ 능력치는 공개된 활약상을 참고한 REMATCH 자체 산정값(0~99)이며 공식 기록이 아닙니다.
// 실명·소속·포지션은 사실 정보를 참조로만 사용합니다.

export const PLAYERS: Player[] = [
  // ─────────────── 대한민국 2022 (vs 가나) ───────────────
  p('kr22_kimsg', '김승규', 'KR', 1, ['GK'], [58, 62, 45, 20, 78, 80], 84, ['wall']),
  p('kr22_kimmw', '김문환', 'KR', 2, ['RB'], [86, 70, 74, 55, 74, 72], 86, ['engine']),
  p('kr22_kimmj', '김민재', 'KR', 4, ['CB'], [82, 74, 66, 48, 90, 88], 88, ['wall', 'aerial_threat']),
  p('kr22_kimyg', '김영권', 'KR', 19, ['CB'], [70, 72, 58, 45, 84, 82], 82, ['aerial_threat']),
  p('kr22_kimjs', '김진수', 'KR', 3, ['LB'], [84, 78, 76, 58, 76, 74], 85, ['set_piece', 'engine']),
  p('kr22_jungwy', '정우영', 'KR', 15, ['DM', 'CM'], [72, 82, 74, 66, 78, 76], 84, ['playmaker', 'set_piece']),
  p('kr22_hwangib', '황인범', 'KR', 6, ['CM', 'DM'], [76, 84, 80, 70, 74, 72], 88, ['playmaker', 'engine']),
  p('kr22_leejs', '이재성', 'KR', 17, ['AM', 'CM'], [78, 82, 82, 74, 70, 70], 86, ['engine', 'clutch']),
  p('kr22_son', '손흥민', 'KR', 7, ['LW', 'ST'], [90, 84, 88, 91, 44, 74], 84, ['counter_attacker', 'clutch', 'sprinter']),
  p('kr22_hwanghc', '황희찬', 'KR', 11, ['RW', 'ST'], [92, 74, 82, 80, 50, 78], 82, ['sprinter', 'counter_attacker']),
  p('kr22_chogs', '조규성', 'KR', 9, ['ST'], [76, 66, 70, 82, 46, 86], 84, ['aerial_threat', 'target_man']),
  // bench
  p('kr22_leeki', '이강인', 'KR', 18, ['AM', 'RW'], [76, 86, 88, 78, 52, 62], 80, ['playmaker', 'set_piece']),
  p('kr22_nash', '나상호', 'KR', 12, ['RW', 'LW'], [88, 72, 80, 74, 52, 66], 82, ['sprinter']),
  p('kr22_baeksh', '백승호', 'KR', 8, ['CM', 'DM'], [72, 80, 76, 70, 72, 76], 84, ['engine']),
  p('kr22_choym', '조유민', 'KR', 20, ['CB'], [72, 66, 56, 44, 80, 82], 82, ['aerial_threat']),
  p('kr22_songbg', '송범근', 'KR', 21, ['GK'], [56, 58, 42, 18, 75, 82], 83, ['wall']),

  // ─────────────── 가나 2022 (vs 대한민국) ───────────────
  p('gha22_ati', '아티지기', 'GH', 22, ['GK'], [60, 60, 46, 20, 76, 80], 83, ['wall']),
  p('gha22_seidu', '세이두', 'GH', 5, ['RB', 'CB'], [82, 66, 66, 40, 76, 78], 84, []),
  p('gha22_amartey', '아마르테이', 'GH', 18, ['CB', 'RB'], [74, 66, 56, 42, 80, 84], 82, ['aerial_threat']),
  p('gha22_salisu', '살리수', 'GH', 3, ['CB'], [80, 70, 60, 50, 82, 86], 84, ['aerial_threat', 'wall']),
  p('gha22_baba', '바바 라만', 'GH', 21, ['LB'], [84, 68, 70, 44, 74, 74], 84, ['engine']),
  p('gha22_samed', '압둘 사메드', 'GH', 15, ['DM'], [72, 74, 66, 52, 78, 80], 85, ['ball_winner']),
  p('gha22_partey', '파티', 'GH', 5, ['DM', 'CM'], [78, 84, 80, 72, 82, 84], 88, ['ball_winner', 'playmaker']),
  p('gha22_kudus', '쿠두스', 'GH', 20, ['AM', 'RW'], [88, 80, 88, 84, 56, 78], 86, ['clutch', 'counter_attacker', 'sprinter']),
  p('gha22_ayewj', '조던 아유', 'GH', 9, ['ST', 'RW'], [82, 74, 76, 74, 52, 76], 84, []),
  p('gha22_williams', '이냐키 윌리엄스', 'GH', 19, ['ST', 'LW'], [92, 70, 78, 74, 48, 82], 86, ['sprinter', 'counter_attacker']),
  p('gha22_ayewa', '앙드레 아유', 'GH', 10, ['AM', 'LW'], [76, 80, 78, 76, 58, 72], 84, ['set_piece', 'clutch']),
  // bench
  p('gha22_sulemana', '술레마나', 'GH', 8, ['LW'], [90, 70, 82, 72, 46, 68], 82, ['sprinter']),
  p('gha22_bukari', '부카리', 'GH', 11, ['RW'], [86, 72, 80, 72, 50, 66], 82, ['sprinter']),
  p('gha22_owusu', '오우수', 'GH', 14, ['ST'], [78, 64, 70, 74, 44, 80], 82, ['aerial_threat']),

  // ─────────────── 대한민국 2018 (vs 독일) ───────────────
  p('kr18_johw', '조현우', 'KR', 21, ['GK'], [62, 60, 46, 20, 82, 78], 85, ['wall', 'clutch']),
  p('kr18_leey', '이용', 'KR', 2, ['RB'], [82, 68, 68, 46, 74, 74], 85, ['engine']),
  p('kr18_yoonys', '윤영선', 'KR', 20, ['CB'], [72, 64, 54, 40, 80, 82], 82, ['aerial_threat']),
  p('kr18_kimyg', '김영권', 'KR', 19, ['CB'], [70, 70, 56, 46, 82, 82], 82, ['aerial_threat', 'clutch']),
  p('kr18_hongc', '홍철', 'KR', 3, ['LB'], [84, 76, 74, 52, 72, 70], 84, ['set_piece']),
  p('kr18_jungwy', '정우영', 'KR', 15, ['DM'], [70, 78, 68, 58, 78, 78], 84, ['ball_winner']),
  p('kr18_koo', '기성용', 'KR', 16, ['CM', 'DM'], [70, 86, 76, 70, 74, 78], 86, ['playmaker', 'set_piece']),
  p('kr18_leejs', '이재성', 'KR', 17, ['AM', 'CM'], [78, 80, 80, 72, 68, 68], 86, ['engine', 'clutch']),
  p('kr18_moonsm', '문선민', 'KR', 12, ['RW', 'LW'], [90, 70, 78, 70, 50, 64], 84, ['sprinter', 'counter_attacker']),
  p('kr18_son', '손흥민', 'KR', 7, ['LW', 'ST'], [90, 82, 87, 90, 44, 72], 84, ['counter_attacker', 'clutch', 'sprinter']),
  p('kr18_hwanghc', '황희찬', 'KR', 11, ['ST', 'RW'], [90, 70, 78, 74, 48, 76], 82, ['sprinter', 'counter_attacker']),
  // bench
  p('kr18_koojc', '구자철', 'KR', 13, ['AM', 'CM'], [72, 80, 76, 74, 62, 70], 82, ['clutch']),
  p('kr18_jidw', '지동원', 'KR', 18, ['ST'], [74, 68, 70, 72, 46, 78], 80, ['aerial_threat']),
  p('kr18_jusj', '주세종', 'KR', 8, ['CM'], [70, 82, 72, 64, 66, 70], 82, ['playmaker', 'set_piece']),
  p('kr18_kimsg', '김승규', 'KR', 1, ['GK'], [58, 60, 44, 20, 78, 80], 83, ['wall']),

  // ─────────────── 독일 2018 (vs 대한민국) ───────────────
  p('ger18_neuer', '노이어', 'DE', 1, ['GK'], [70, 82, 62, 30, 88, 86], 86, ['wall', 'playmaker']),
  p('ger18_kimmich', '킴미히', 'DE', 6, ['RB', 'DM'], [82, 88, 78, 62, 80, 74], 90, ['engine', 'set_piece', 'playmaker']),
  p('ger18_sule', '쥘레', 'DE', 15, ['CB'], [78, 72, 58, 42, 84, 90], 84, ['aerial_threat', 'wall']),
  p('ger18_hummels', '훔멜스', 'DE', 5, ['CB'], [68, 84, 62, 48, 86, 84], 82, ['playmaker', 'aerial_threat', 'wall']),
  p('ger18_hector', '헥토어', 'DE', 3, ['LB'], [82, 76, 72, 52, 74, 74], 86, ['engine']),
  p('ger18_kroos', '크로스', 'DE', 8, ['CM', 'DM'], [66, 92, 80, 74, 72, 72], 86, ['playmaker', 'set_piece']),
  p('ger18_goretzka', '고레츠카', 'DE', 18, ['CM'], [78, 80, 78, 76, 74, 84], 88, ['engine', 'aerial_threat']),
  p('ger18_ozil', '외질', 'DE', 10, ['AM'], [72, 90, 86, 74, 50, 66], 80, ['playmaker', 'clutch']),
  p('ger18_muller', '뮐러', 'DE', 13, ['RW', 'AM', 'ST'], [76, 82, 78, 82, 56, 74], 86, ['clutch', 'engine']),
  p('ger18_draxler', '드락슬러', 'DE', 7, ['LW', 'AM'], [82, 80, 84, 74, 54, 68], 84, ['counter_attacker']),
  p('ger18_werner', '베르너', 'DE', 9, ['ST', 'LW'], [93, 72, 78, 78, 44, 70], 86, ['sprinter', 'counter_attacker']),
  // bench
  p('ger18_gomez', '고메스', 'DE', 23, ['ST'], [66, 66, 66, 82, 42, 84], 80, ['aerial_threat', 'target_man']),
  p('ger18_reus', '로이스', 'DE', 21, ['LW', 'AM'], [88, 82, 86, 82, 52, 66], 82, ['counter_attacker', 'clutch', 'sprinter']),
  p('ger18_gundogan', '귄도안', 'DE', 20, ['CM', 'AM'], [72, 86, 82, 74, 66, 70], 84, ['playmaker']),
  p('ger18_brandt', '브란트', 'DE', 19, ['LW', 'AM'], [86, 80, 82, 72, 52, 66], 82, ['sprinter']),

  // ─────────────── 대한민국 2002 (vs 이탈리아) ───────────────
  p('kr02_leewj', '이운재', 'KR', 1, ['GK'], [58, 58, 42, 20, 82, 80], 85, ['wall', 'clutch']),
  p('kr02_choijc', '최진철', 'KR', 20, ['CB'], [70, 60, 50, 40, 82, 84], 84, ['aerial_threat', 'wall']),
  p('kr02_hongmb', '홍명보', 'KR', 4, ['CB', 'DM'], [66, 80, 66, 58, 84, 80], 86, ['playmaker', 'wall', 'clutch']),
  p('kr02_kimty', '김태영', 'KR', 22, ['CB', 'LB'], [76, 62, 54, 38, 82, 82], 86, ['aerial_threat']),
  p('kr02_songjk', '송종국', 'KR', 8, ['RB', 'DM'], [86, 70, 74, 52, 76, 76], 88, ['engine', 'sprinter']),
  p('kr02_kimni', '김남일', 'KR', 5, ['DM'], [78, 68, 66, 52, 82, 84], 90, ['ball_winner', 'engine']),
  p('kr02_yoosc', '유상철', 'KR', 6, ['CM', 'ST'], [78, 76, 74, 78, 72, 82], 88, ['engine', 'clutch']),
  p('kr02_leeyp', '이영표', 'KR', 12, ['LB', 'LM'], [88, 76, 82, 50, 76, 70], 90, ['engine', 'sprinter']),
  p('kr02_hwangsh', '황선홍', 'KR', 18, ['ST'], [74, 70, 72, 80, 46, 80], 82, ['aerial_threat', 'clutch']),
  p('kr02_seolkh', '설기현', 'KR', 11, ['LW', 'ST'], [86, 70, 78, 74, 48, 80], 84, ['sprinter', 'counter_attacker']),
  p('kr02_parkjs', '박지성', 'KR', 21, ['RW', 'AM', 'CM'], [86, 80, 82, 74, 66, 74], 94, ['engine', 'clutch', 'sprinter']),
  // bench
  p('kr02_ahnjh', '안정환', 'KR', 19, ['ST', 'AM'], [82, 76, 84, 82, 44, 70], 80, ['clutch', 'counter_attacker']),
  p('kr02_leecs', '이천수', 'KR', 14, ['RW', 'LW'], [88, 74, 82, 74, 46, 62], 82, ['sprinter', 'set_piece']),
  p('kr02_chadr', '차두리', 'KR', 24, ['RW', 'RB'], [93, 66, 74, 66, 58, 84], 88, ['sprinter']),
  p('kr02_leeus', '이을용', 'KR', 15, ['CM', 'DM'], [72, 78, 70, 62, 72, 74], 84, ['set_piece', 'playmaker']),

  // ─────────────── 이탈리아 2002 (vs 대한민국) ───────────────
  p('ita02_buffon', '부폰', 'IT', 1, ['GK'], [66, 70, 50, 24, 90, 84], 88, ['wall', 'clutch']),
  p('ita02_panucci', '파누치', 'IT', 3, ['RB', 'CB'], [80, 72, 66, 50, 82, 80], 84, ['aerial_threat']),
  p('ita02_maldini', '말디니', 'IT', 6, ['LB', 'CB'], [80, 82, 74, 50, 90, 82], 88, ['wall', 'clutch']),
  p('ita02_nesta', '네스타', 'IT', 13, ['CB'], [80, 78, 66, 44, 92, 84], 86, ['wall', 'aerial_threat']),
  p('ita02_iuliano', '율리아노', 'IT', 5, ['CB'], [72, 64, 54, 42, 82, 86], 82, ['aerial_threat']),
  p('ita02_zambrotta', '잠브로타', 'IT', 19, ['RB', 'LM'], [86, 76, 78, 56, 78, 78], 88, ['engine', 'sprinter']),
  p('ita02_tommasi', '톰마시', 'IT', 16, ['CM', 'DM'], [80, 74, 70, 68, 78, 80], 90, ['engine', 'ball_winner']),
  p('ita02_gattuso', '가투소', 'IT', 8, ['DM'], [78, 68, 64, 52, 82, 82], 92, ['ball_winner', 'engine']),
  p('ita02_totti', '토티', 'IT', 10, ['AM', 'ST'], [78, 88, 86, 84, 56, 76], 84, ['playmaker', 'clutch', 'set_piece']),
  p('ita02_vieri', '비에리', 'IT', 9, ['ST'], [76, 66, 68, 88, 42, 88], 82, ['aerial_threat', 'target_man', 'clutch']),
  p('ita02_delpiero', '델 피에로', 'IT', 7, ['ST', 'AM'], [80, 82, 84, 86, 48, 70], 82, ['clutch', 'set_piece', 'counter_attacker']),
  // bench
  p('ita02_montella', '몬텔라', 'IT', 20, ['ST'], [82, 72, 78, 82, 44, 66], 80, ['clutch', 'sprinter']),
  p('ita02_delvecchio', '델 베키오', 'IT', 21, ['ST'], [72, 64, 66, 76, 46, 80], 80, ['aerial_threat']),
  p('ita02_dinogennaro', '디 나폴리', 'IT', 14, ['CM'], [76, 76, 70, 60, 72, 74], 84, ['engine']),
  p('ita02_toldo', '톨도', 'IT', 12, ['GK'], [60, 64, 46, 22, 84, 84], 84, ['wall']),

  // ─────────────── 브라질 2014 (vs 독일, 미네이랑) ───────────────
  p('bra14_juliocesar', '줄리우 세자르', 'BR', 12, ['GK'], [66, 68, 50, 24, 84, 82], 84, ['wall', 'clutch']),
  p('bra14_maicon', '마이콩', 'BR', 23, ['RB'], [82, 72, 74, 58, 74, 82], 84, ['sprinter']),
  p('bra14_dante', '단테', 'BR', 13, ['CB'], [74, 72, 58, 44, 82, 84], 82, ['aerial_threat']),
  p('bra14_davidluiz', '다비드 루이스', 'BR', 4, ['CB', 'DM'], [78, 78, 66, 60, 78, 86], 86, ['set_piece', 'aerial_threat']),
  p('bra14_marcelo', '마르셀루', 'BR', 6, ['LB'], [88, 84, 88, 62, 68, 72], 86, ['engine', 'sprinter', 'counter_attacker']),
  p('bra14_fernandinho', '페르난지뉴', 'BR', 17, ['DM', 'CM'], [78, 80, 76, 62, 80, 82], 88, ['ball_winner', 'engine']),
  p('bra14_luizgustavo', '루이스 구스타부', 'BR', 15, ['DM'], [74, 74, 64, 56, 82, 84], 88, ['ball_winner']),
  p('bra14_hulk', '훌크', 'BR', 7, ['RW', 'ST'], [86, 74, 78, 84, 52, 88], 84, ['sprinter', 'counter_attacker']),
  p('bra14_oscar', '오스카르', 'BR', 11, ['AM', 'CM'], [80, 84, 84, 76, 60, 66], 86, ['playmaker', 'clutch']),
  p('bra14_bernard', '베르나르드', 'BR', 20, ['LW', 'AM'], [88, 78, 84, 68, 48, 56], 82, ['sprinter', 'counter_attacker']),
  p('bra14_fred', '프레드', 'BR', 9, ['ST'], [76, 66, 68, 76, 42, 80], 80, ['aerial_threat', 'target_man']),
  // bench
  p('bra14_ramires', '하미레스', 'BR', 16, ['CM', 'RW'], [88, 74, 76, 66, 68, 74], 90, ['engine', 'sprinter']),
  p('bra14_paulinho', '파울리뉴', 'BR', 18, ['CM'], [80, 76, 72, 74, 70, 78], 86, ['engine', 'aerial_threat']),
  p('bra14_willian', '윌리안', 'BR', 19, ['RW', 'LW'], [86, 78, 84, 72, 54, 64], 84, ['sprinter', 'counter_attacker']),
  p('bra14_jo', '조', 'BR', 21, ['ST'], [72, 62, 64, 70, 40, 80], 78, ['aerial_threat', 'target_man']),

  // ─────────────── 독일 2014 (vs 브라질) ───────────────
  p('ger14_neuer', '노이어', 'DE', 1, ['GK'], [72, 82, 62, 30, 90, 86], 88, ['wall', 'playmaker', 'clutch']),
  p('ger14_lahm', '람', 'DE', 16, ['RB', 'DM'], [84, 84, 80, 58, 80, 70], 90, ['engine', 'playmaker']),
  p('ger14_boateng', '보아텡', 'DE', 17, ['CB'], [80, 76, 62, 44, 86, 88], 84, ['aerial_threat', 'wall']),
  p('ger14_hummels', '훔멜스', 'DE', 5, ['CB'], [70, 84, 62, 48, 86, 84], 84, ['playmaker', 'aerial_threat', 'clutch']),
  p('ger14_howedes', '회베데스', 'DE', 4, ['LB', 'CB'], [76, 70, 58, 44, 82, 82], 86, ['aerial_threat']),
  p('ger14_khedira', '케디라', 'DE', 6, ['CM', 'DM'], [78, 78, 72, 66, 78, 84], 88, ['engine', 'ball_winner']),
  p('ger14_schweinsteiger', '슈바인슈타이거', 'DE', 7, ['CM', 'DM'], [72, 86, 78, 72, 78, 82], 90, ['playmaker', 'engine', 'clutch']),
  p('ger14_muller', '뮐러', 'DE', 13, ['RW', 'AM', 'ST'], [78, 82, 78, 86, 56, 74], 88, ['clutch', 'engine']),
  p('ger14_kroos', '크로스', 'DE', 18, ['CM'], [66, 92, 80, 78, 70, 72], 86, ['playmaker', 'set_piece', 'clutch']),
  p('ger14_ozil', '외질', 'DE', 8, ['AM', 'LW'], [76, 90, 86, 74, 50, 64], 82, ['playmaker', 'clutch']),
  p('ger14_klose', '클로제', 'DE', 11, ['ST'], [70, 70, 68, 86, 46, 80], 82, ['aerial_threat', 'clutch', 'target_man']),
  // bench
  p('ger14_schurrle', '쉬를레', 'DE', 9, ['LW', 'ST'], [88, 76, 80, 82, 48, 72], 84, ['sprinter', 'counter_attacker', 'clutch']),
  p('ger14_draxler', '드락슬러', 'DE', 21, ['LW', 'AM'], [84, 80, 84, 74, 52, 68], 84, ['counter_attacker']),
  p('ger14_podolski', '포돌스키', 'DE', 10, ['LW', 'ST'], [82, 76, 76, 84, 48, 76], 82, ['set_piece', 'sprinter']),
  p('ger14_gotze', '괴체', 'DE', 19, ['AM', 'ST'], [82, 84, 86, 78, 52, 62], 82, ['clutch', 'counter_attacker']),

  // ─────────────── 아르헨티나 2022 (결승 vs 프랑스) ───────────────
  p('arg22_martinez', '에밀리아노 마르티네스', 'AR', 23, ['GK'], [72, 72, 56, 26, 88, 84], 86, ['wall', 'clutch']),
  p('arg22_molina', '몰리나', 'AR', 26, ['RB'], [90, 74, 78, 54, 74, 72], 88, ['sprinter', 'engine']),
  p('arg22_romero', '로메로', 'AR', 13, ['CB'], [82, 76, 62, 44, 86, 84], 86, ['aerial_threat', 'wall']),
  p('arg22_otamendi', '오타멘디', 'AR', 19, ['CB'], [76, 74, 58, 46, 84, 84], 84, ['aerial_threat', 'wall']),
  p('arg22_tagliafico', '탈리아피코', 'AR', 3, ['LB'], [84, 74, 72, 50, 78, 74], 86, ['engine']),
  p('arg22_depaul', '데 파울', 'AR', 7, ['CM', 'DM'], [80, 82, 80, 68, 76, 78], 90, ['engine', 'ball_winner']),
  p('arg22_fernandez', '엔소 페르난데스', 'AR', 24, ['CM', 'DM'], [78, 86, 80, 72, 74, 78], 90, ['playmaker', 'engine']),
  p('arg22_macallister', '맥 알리스터', 'AR', 20, ['CM', 'AM'], [78, 84, 82, 76, 70, 74], 88, ['playmaker', 'clutch']),
  p('arg22_messi', '메시', 'AR', 10, ['RW', 'AM', 'ST'], [82, 94, 96, 92, 42, 66], 82, ['playmaker', 'clutch', 'set_piece', 'counter_attacker']),
  p('arg22_dimaria', '디 마리아', 'AR', 11, ['LW', 'RW'], [86, 84, 88, 80, 52, 62], 82, ['clutch', 'counter_attacker', 'sprinter']),
  p('arg22_alvarez', '알바레스', 'AR', 9, ['ST'], [88, 76, 80, 84, 52, 74], 88, ['sprinter', 'counter_attacker', 'clutch']),
  // bench
  p('arg22_lautaro', '라우타로', 'AR', 22, ['ST'], [86, 74, 80, 84, 50, 80], 86, ['aerial_threat', 'clutch']),
  p('arg22_dybala', '디발라', 'AR', 21, ['AM', 'ST'], [82, 84, 88, 84, 46, 62], 80, ['clutch', 'set_piece']),
  p('arg22_montiel', '몬티엘', 'AR', 4, ['RB'], [84, 72, 72, 50, 74, 74], 84, ['clutch']),
  p('arg22_paredes', '파레데스', 'AR', 5, ['DM'], [70, 84, 72, 68, 76, 78], 84, ['playmaker', 'set_piece']),

  // ─────────────── 프랑스 2022 (결승 vs 아르헨티나) ───────────────
  p('fra22_lloris', '요리스', 'FR', 1, ['GK'], [72, 74, 58, 28, 86, 80], 84, ['wall', 'clutch']),
  p('fra22_kounde', '쿤데', 'FR', 5, ['RB', 'CB'], [88, 78, 74, 50, 82, 80], 86, ['sprinter', 'aerial_threat']),
  p('fra22_varane', '바란', 'FR', 4, ['CB'], [84, 76, 62, 44, 86, 84], 84, ['aerial_threat', 'wall', 'clutch']),
  p('fra22_upamecano', '우파메카노', 'FR', 18, ['CB'], [88, 74, 64, 46, 84, 88], 86, ['aerial_threat', 'wall', 'sprinter']),
  p('fra22_hernandez', '테오 에르난데스', 'FR', 22, ['LB'], [90, 78, 80, 62, 74, 80], 88, ['sprinter', 'engine', 'counter_attacker']),
  p('fra22_tchouameni', '추아메니', 'FR', 8, ['DM', 'CM'], [82, 82, 74, 62, 84, 84], 90, ['ball_winner', 'engine']),
  p('fra22_rabiot', '라비오', 'FR', 14, ['CM'], [78, 80, 78, 68, 74, 82], 88, ['engine', 'aerial_threat']),
  p('fra22_dembele', '뎀벨레', 'FR', 11, ['RW'], [93, 78, 90, 74, 48, 62], 84, ['sprinter', 'counter_attacker']),
  p('fra22_griezmann', '그리즈만', 'FR', 7, ['AM', 'ST'], [80, 88, 86, 84, 60, 66], 88, ['playmaker', 'clutch', 'set_piece']),
  p('fra22_mbappe', '음바페', 'FR', 10, ['LW', 'ST'], [97, 82, 92, 90, 46, 78], 86, ['sprinter', 'clutch', 'counter_attacker']),
  p('fra22_giroud', '지루', 'FR', 9, ['ST'], [64, 72, 66, 84, 46, 86], 82, ['aerial_threat', 'target_man', 'clutch']),
  // bench
  p('fra22_kolomuani', '콜로 무아니', 'FR', 12, ['ST', 'RW'], [92, 72, 80, 78, 48, 82], 86, ['sprinter', 'counter_attacker']),
  p('fra22_thuram', '튀랑', 'FR', 26, ['ST', 'LW'], [88, 72, 78, 76, 50, 84], 86, ['sprinter', 'aerial_threat']),
  p('fra22_coman', '코망', 'FR', 20, ['RW', 'LW'], [93, 76, 86, 72, 48, 62], 84, ['sprinter', 'counter_attacker']),
  p('fra22_camavinga', '카마빙가', 'FR', 25, ['CM', 'LB'], [86, 80, 82, 62, 76, 72], 88, ['engine', 'ball_winner']),

  // ─────────────── 대한민국 2010 (16강 vs 우루과이) ───────────────
  p('kr10_jungsr', '정성룡', 'KR', 1, ['GK'], [60, 60, 44, 20, 80, 80], 84, ['wall']),
  p('kr10_ohbs', '오범석', 'KR', 22, ['RB', 'CB'], [82, 66, 66, 46, 76, 80], 86, ['engine']),
  p('kr10_leejs', '이정수', 'KR', 14, ['CB'], [72, 66, 56, 46, 82, 82], 84, ['aerial_threat', 'clutch']),
  p('kr10_choyh', '조용형', 'KR', 20, ['CB'], [70, 62, 52, 38, 80, 82], 82, ['aerial_threat']),
  p('kr10_leeyp', '이영표', 'KR', 12, ['LB'], [84, 76, 80, 50, 76, 68], 88, ['engine', 'sprinter']),
  p('kr10_koo', '기성용', 'KR', 16, ['CM', 'DM'], [70, 84, 74, 68, 72, 76], 86, ['playmaker', 'set_piece']),
  p('kr10_kimjw', '김정우', 'KR', 8, ['DM'], [74, 70, 64, 56, 80, 80], 88, ['ball_winner', 'engine']),
  p('kr10_leecy', '이청용', 'KR', 17, ['RW', 'AM'], [84, 80, 84, 76, 54, 62], 86, ['clutch', 'counter_attacker', 'sprinter']),
  p('kr10_parkjs', '박지성', 'KR', 13, ['AM', 'RW', 'CM'], [86, 82, 84, 78, 66, 74], 94, ['engine', 'clutch', 'sprinter']),
  p('kr10_yeomkh', '염기훈', 'KR', 11, ['LW'], [78, 80, 76, 72, 48, 66], 82, ['set_piece', 'counter_attacker']),
  p('kr10_leedg', '이동국', 'KR', 9, ['ST'], [72, 70, 70, 82, 44, 80], 80, ['aerial_threat', 'clutch']),
  // bench
  p('kr10_parkjy', '박주영', 'KR', 10, ['ST', 'LW'], [80, 78, 80, 82, 48, 68], 82, ['set_piece', 'clutch']),
  p('kr10_kimjs', '김재성', 'KR', 7, ['RW', 'CM'], [80, 74, 76, 68, 56, 64], 82, ['engine']),
  p('kr10_kimni', '김남일', 'KR', 5, ['DM'], [74, 68, 64, 52, 80, 82], 84, ['ball_winner']),
  p('kr10_leewj', '이운재', 'KR', 21, ['GK'], [56, 58, 42, 20, 78, 80], 82, ['wall']),

  // ─────────────── 우루과이 2010 (16강 vs 대한민국) ───────────────
  p('uru10_muslera', '무슬레라', 'UY', 1, ['GK'], [66, 66, 48, 22, 82, 80], 84, ['wall']),
  p('uru10_maxi', '막시 페레이라', 'UY', 16, ['RB'], [84, 72, 72, 52, 76, 76], 88, ['engine', 'sprinter']),
  p('uru10_lugano', '루가노', 'UY', 2, ['CB'], [70, 66, 54, 46, 84, 86], 84, ['aerial_threat', 'wall']),
  p('uru10_godin', '고딘', 'UY', 3, ['CB'], [74, 72, 58, 48, 88, 86], 86, ['aerial_threat', 'wall', 'clutch']),
  p('uru10_fucile', '푸실레', 'UY', 4, ['LB'], [82, 70, 68, 48, 76, 74], 84, ['engine']),
  p('uru10_arevalo', '아레발로 리오스', 'UY', 15, ['DM'], [76, 72, 64, 52, 82, 82], 90, ['ball_winner', 'engine']),
  p('uru10_perez', '디에고 페레스', 'UY', 17, ['DM', 'CM'], [72, 70, 62, 54, 80, 80], 86, ['ball_winner']),
  p('uru10_alvaro', '알바로 페레이라', 'UY', 6, ['LM', 'LB'], [84, 74, 74, 58, 72, 74], 88, ['engine', 'sprinter']),
  p('uru10_forlan', '포를란', 'UY', 10, ['ST', 'AM'], [82, 84, 84, 88, 52, 74], 86, ['clutch', 'set_piece', 'counter_attacker']),
  p('uru10_suarez', '수아레스', 'UY', 9, ['ST', 'LW'], [86, 78, 88, 88, 50, 76], 86, ['clutch', 'counter_attacker', 'sprinter']),
  p('uru10_cavani', '카바니', 'UY', 7, ['ST', 'RW'], [88, 72, 76, 84, 56, 82], 90, ['aerial_threat', 'engine', 'sprinter']),
  // bench
  p('uru10_abreu', '아브레우', 'UY', 13, ['ST'], [68, 68, 70, 78, 44, 82], 80, ['aerial_threat', 'target_man', 'clutch']),
  p('uru10_ignacio', '이그나시오 곤살레스', 'UY', 11, ['AM', 'LM'], [78, 78, 76, 68, 56, 66], 82, ['playmaker']),
  p('uru10_fernandez', '알바로 페르난데스', 'UY', 8, ['RW', 'AM'], [84, 72, 78, 66, 54, 64], 82, ['sprinter']),
  p('uru10_scotti', '스코티', 'UY', 14, ['CB', 'DM'], [72, 64, 54, 44, 78, 80], 82, []),

  // ─────────────── 대한민국 2026 (vs 남아프리카공화국 · 가상 시나리오) ───────────────
  p('kr26_johw', '조현우', 'KR', 21, ['GK'], [62, 64, 46, 20, 84, 78], 85, ['wall', 'clutch']),
  p('kr26_seolyw', '설영우', 'KR', 15, ['RB', 'LB'], [88, 76, 80, 52, 76, 72], 88, ['engine', 'sprinter']),
  p('kr26_kimmj', '김민재', 'KR', 4, ['CB'], [83, 76, 66, 48, 91, 88], 88, ['wall', 'aerial_threat', 'clutch']),
  p('kr26_jungsh', '정승현', 'KR', 20, ['CB'], [74, 68, 56, 42, 82, 84], 84, ['aerial_threat']),
  p('kr26_kimjs', '김진수', 'KR', 3, ['LB'], [82, 78, 76, 56, 76, 74], 84, ['set_piece', 'engine']),
  p('kr26_park', '박용우', 'KR', 5, ['DM'], [72, 80, 70, 58, 80, 80], 86, ['ball_winner', 'engine']),
  p('kr26_hwangib', '황인범', 'KR', 6, ['CM', 'DM'], [77, 86, 82, 72, 74, 74], 89, ['playmaker', 'engine']),
  p('kr26_leejs', '이재성', 'KR', 17, ['AM', 'CM'], [78, 84, 82, 74, 70, 70], 87, ['engine', 'clutch']),
  p('kr26_leeki', '이강인', 'KR', 18, ['AM', 'RW'], [79, 88, 90, 82, 54, 62], 84, ['playmaker', 'set_piece', 'clutch']),
  p('kr26_son', '손흥민', 'KR', 7, ['LW', 'ST'], [89, 85, 88, 91, 46, 74], 84, ['counter_attacker', 'clutch', 'sprinter']),
  p('kr26_chogs', '조규성', 'KR', 9, ['ST'], [77, 68, 72, 82, 46, 87], 84, ['aerial_threat', 'target_man']),
  // bench
  p('kr26_hwanghc', '황희찬', 'KR', 11, ['RW', 'ST'], [92, 74, 82, 81, 50, 78], 82, ['sprinter', 'counter_attacker']),
  p('kr26_ohhg', '오현규', 'KR', 19, ['ST'], [86, 70, 76, 80, 48, 78], 84, ['sprinter', 'clutch']),
  p('kr26_baejh', '배준호', 'KR', 22, ['AM', 'LW'], [85, 80, 86, 74, 52, 62], 84, ['sprinter', 'counter_attacker']),
  p('kr26_honghs', '홍현석', 'KR', 16, ['CM'], [76, 80, 76, 68, 66, 68], 84, ['engine', 'playmaker']),
  p('kr26_kimsg', '김승규', 'KR', 1, ['GK'], [58, 62, 44, 20, 80, 80], 83, ['wall']),

  // ─────────────── 남아프리카공화국 2026 (vs 대한민국 · 가상 시나리오) ───────────────
  p('rsa26_williams', '론웬 윌리엄스', 'ZA', 1, ['GK'], [66, 66, 48, 22, 84, 82], 85, ['wall', 'clutch']),
  p('rsa26_mudau', '무다우', 'ZA', 2, ['RB'], [88, 70, 74, 48, 76, 76], 88, ['sprinter', 'engine']),
  p('rsa26_kekana', '케카나', 'ZA', 5, ['CB'], [76, 68, 58, 44, 80, 82], 84, ['aerial_threat']),
  p('rsa26_mvala', '음발라', 'ZA', 4, ['CB', 'DM'], [78, 70, 60, 50, 80, 84], 84, ['aerial_threat', 'ball_winner']),
  p('rsa26_modiba', '모디바', 'ZA', 3, ['LB'], [86, 74, 74, 54, 74, 72], 86, ['engine', 'set_piece']),
  p('rsa26_mokoena', '모케나', 'ZA', 8, ['DM', 'CM'], [76, 78, 72, 66, 80, 80], 88, ['ball_winner', 'set_piece']),
  p('rsa26_sithole', '시톨레', 'ZA', 6, ['CM'], [78, 76, 74, 62, 74, 74], 86, ['engine']),
  p('rsa26_zwane', '즈와네', 'ZA', 10, ['AM'], [78, 82, 84, 76, 58, 62], 82, ['playmaker', 'clutch']),
  p('rsa26_tau', '퍼시 타우', 'ZA', 11, ['RW', 'AM'], [86, 80, 86, 78, 54, 64], 84, ['counter_attacker', 'sprinter', 'clutch']),
  p('rsa26_foster', '라일 포스터', 'ZA', 9, ['ST'], [87, 68, 76, 80, 46, 80], 84, ['sprinter', 'counter_attacker']),
  p('rsa26_mofokeng', '모포켕', 'ZA', 7, ['LW'], [89, 74, 86, 74, 48, 60], 82, ['sprinter', 'counter_attacker']),
  // bench
  p('rsa26_makgopa', '막고파', 'ZA', 17, ['ST'], [80, 66, 70, 76, 44, 82], 82, ['aerial_threat', 'target_man']),
  p('rsa26_appollis', '아폴리스', 'ZA', 19, ['RW', 'LW'], [88, 74, 84, 70, 48, 58], 82, ['sprinter']),
  p('rsa26_hlongwane', '흘롱와네', 'ZA', 20, ['ST', 'RW'], [90, 68, 78, 74, 46, 66], 84, ['sprinter', 'counter_attacker']),

  // ─────────────── 대한민국 2014 (vs 알제리) ───────────────
  p('kr14_jungsr', '정성룡', 'KR', 1, ['GK'], [60, 60, 44, 20, 78, 80], 83, ['wall']),
  p('kr14_leey', '이용', 'KR', 2, ['RB'], [82, 68, 68, 46, 74, 74], 85, ['engine']),
  p('kr14_kimyg', '김영권', 'KR', 5, ['CB'], [72, 68, 56, 44, 78, 80], 82, ['aerial_threat']),
  p('kr14_hongjh', '홍정호', 'KR', 20, ['CB'], [74, 72, 58, 44, 80, 80], 82, ['aerial_threat', 'playmaker']),
  p('kr14_yoonsy', '윤석영', 'KR', 12, ['LB'], [82, 72, 72, 48, 72, 68], 84, ['engine']),
  p('kr14_koo', '기성용', 'KR', 16, ['CM', 'DM'], [70, 85, 76, 70, 72, 78], 86, ['playmaker', 'set_piece']),
  p('kr14_hanky', '한국영', 'KR', 6, ['DM'], [72, 72, 64, 54, 78, 82], 88, ['ball_winner', 'engine']),
  p('kr14_koojc', '구자철', 'KR', 13, ['AM', 'CM'], [74, 80, 78, 76, 62, 70], 84, ['clutch']),
  p('kr14_leecy', '이청용', 'KR', 17, ['RW', 'AM'], [82, 78, 82, 72, 54, 62], 84, ['counter_attacker', 'sprinter']),
  p('kr14_son', '손흥민', 'KR', 7, ['LW', 'ST'], [88, 78, 85, 85, 42, 70], 84, ['counter_attacker', 'clutch', 'sprinter']),
  p('kr14_parkjy', '박주영', 'KR', 10, ['ST'], [76, 74, 74, 76, 44, 68], 80, ['clutch']),
  // bench
  p('kr14_kimsw', '김신욱', 'KR', 9, ['ST'], [66, 62, 62, 74, 42, 90], 80, ['aerial_threat', 'target_man']),
  p('kr14_leegh', '이근호', 'KR', 11, ['ST', 'RW'], [86, 70, 76, 72, 48, 68], 84, ['sprinter', 'counter_attacker']),
  p('kr14_kimbk', '김보경', 'KR', 19, ['AM', 'LW'], [78, 78, 78, 70, 54, 64], 82, ['playmaker']),
  p('kr14_kimsg', '김승규', 'KR', 21, ['GK'], [58, 60, 44, 20, 78, 80], 82, ['wall']),

  // ─────────────── 알제리 2014 (vs 대한민국) ───────────────
  p('alg14_mbolhi', '음볼리', 'DZ', 23, ['GK'], [62, 62, 46, 22, 82, 80], 84, ['wall', 'clutch']),
  p('alg14_mandi', '만디', 'DZ', 21, ['RB', 'CB'], [82, 74, 66, 46, 80, 80], 86, ['aerial_threat']),
  p('alg14_halliche', '할리셰', 'DZ', 5, ['CB'], [72, 66, 56, 44, 80, 82], 82, ['aerial_threat']),
  p('alg14_bougherra', '부게라', 'DZ', 15, ['CB'], [70, 68, 56, 46, 80, 84], 82, ['aerial_threat', 'wall']),
  p('alg14_ghoulam', '굴람', 'DZ', 3, ['LB'], [84, 78, 76, 54, 74, 74], 86, ['engine', 'set_piece']),
  p('alg14_medjani', '메드자니', 'DZ', 4, ['DM', 'CB'], [72, 70, 62, 52, 78, 82], 84, ['ball_winner']),
  p('alg14_bentaleb', '벤탈렙', 'DZ', 17, ['CM', 'DM'], [74, 80, 74, 64, 74, 76], 86, ['playmaker', 'engine']),
  p('alg14_taider', '타이데르', 'DZ', 8, ['CM'], [76, 78, 76, 72, 68, 74], 84, ['engine', 'set_piece']),
  p('alg14_feghouli', '페굴리', 'DZ', 7, ['RW', 'AM'], [84, 80, 84, 76, 56, 70], 84, ['counter_attacker', 'sprinter']),
  p('alg14_brahimi', '브라히미', 'DZ', 18, ['AM', 'LW'], [84, 82, 88, 76, 52, 62], 84, ['playmaker', 'clutch', 'sprinter']),
  p('alg14_slimani', '슬리마니', 'DZ', 13, ['ST'], [82, 68, 74, 82, 46, 84], 84, ['aerial_threat', 'clutch', 'target_man']),
  // bench
  p('alg14_djabou', '자부', 'DZ', 14, ['AM', 'LW'], [80, 80, 84, 74, 50, 60], 82, ['clutch', 'set_piece']),
  p('alg14_mahrez', '마레즈', 'DZ', 20, ['RW'], [86, 82, 90, 80, 46, 58], 82, ['sprinter', 'counter_attacker', 'clutch']),
  p('alg14_soudani', '소우다니', 'DZ', 9, ['ST', 'LW'], [86, 68, 76, 76, 46, 80], 84, ['sprinter', 'aerial_threat']),
]

// ── 조회 헬퍼 ──────────────────────────────────────────────────
const BY_ID: Record<string, Player> = Object.fromEntries(PLAYERS.map((pl) => [pl.id, pl]))

export function getPlayer(id: string): Player {
  const found = BY_ID[id]
  if (!found) throw new Error(`Unknown player id: ${id}`)
  return found
}

export function maybePlayer(id: string): Player | undefined {
  return BY_ID[id]
}
