import { Box } from '@mui/material';
import { HUMAN_SIGNAL } from '../../theme';

/* Figma "D Mark"(220:12, D Mark / 밝은 Header)의 실제 vector 4개를 그대로
 * 옮긴 마크다. 배경 rect·둥근 배지 없이 SVG 배경은 투명하며, 4개 path의
 * 로컬 좌표는 그대로 두고 translate로 위치만 맞춘다.
 * - Vector 1(220:13): 왼쪽 세로 Primary shape
 * - Vector 2(220:14): D ring Primary shape
 * - Vector 3(220:15): Sage lower shape
 * - Vector 4(220:16): Orange point
 * onLight/onDark는 배경 배지 없이 형태·비율이 완전히 동일하고 primary
 * 색상만 바뀐다(사용자 승인 B안). onDark는 Figma 105:53 / 221:30에 반영됨. */
const TONES = {
  onLight: {
    primary: HUMAN_SIGNAL.inkNavy,
    sage: HUMAN_SIGNAL.mutedSage,
    accent: HUMAN_SIGNAL.brightOrange,
  },
  onDark: {
    primary: HUMAN_SIGNAL.softWhite,
    sage: HUMAN_SIGNAL.mutedSage,
    accent: HUMAN_SIGNAL.brightOrange,
  },
};

/**
 * D2 브랜드 마크(Human Signal, Figma 220:12 실제 vector 기준).
 * - decorative=true(기본): 장식용, aria-hidden. Home 링크처럼 접근 가능한 이름을
 *   이미 제공하는 요소 안에 넣을 때 사용한다.
 * - decorative=false: 마크 자체가 유일한 콘텐츠일 때(레이블이 따로 없는 단독 배치)
 *   role="img" + aria-label을 부여한다.
 */
const DMark = ({ size = 44, tone = 'onLight', decorative = true, className, sx }) => {
  const colors = TONES[tone] ?? TONES.onLight;

  return (
    <Box
      component="svg"
      viewBox="0 0 44 44"
      width={size}
      height={size}
      className={className}
      aria-hidden={decorative ? 'true' : undefined}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : 'Dohan.K D2 마크'}
      sx={{ display: 'block', flexShrink: 0, ...sx }}
    >
      <path
        transform="translate(4 6)"
        fill={colors.primary}
        d="M 2 0 L 5 0 C 6.1045695543289185 0 7 0.8954304456710815 7 2 L 7 30 C 7 31.10456955432892 6.1045695543289185 32 5 32 L 2 32 C 0.8954304456710815 32 0 31.10456955432892 0 30 L 0 2 C 0 0.8954304456710815 0.8954304456710815 0 2 0 Z"
      />
      <path
        transform="translate(14 6)"
        fill={colors.primary}
        fillRule="nonzero"
        d="M 0 0 L 9 0 C 19.199999809265137 0 26 6.399999618530273 26 16 C 26 25.600000381469727 19.199999809265137 32 9 32 L 0 32 L 0 25 L 9 25 C 15 25 19 21.59999990463257 19 16 C 19 10.400000095367432 15 7 9 7 L 0 7 L 0 0 Z"
      />
      <path
        transform="translate(14 23.799999237060547)"
        fill={colors.sage}
        fillRule="nonzero"
        d="M 0 5.200000762939453 L 9 5.200000762939453 C 14.800000190734863 5.200000762939453 17.59999918937683 3.5999999046325684 19.299999237060547 0 C 18.799999237060547 7.599999904632568 15.199999809265137 14.200000762939453 9 14.200000762939453 L 0 14.200000762939453 L 0 5.200000762939453 Z"
      />
      <path
        transform="translate(35 7)"
        fill={colors.accent}
        d="M 1.5 0 L 3.5 0 C 4.3284271359443665 0 5 0.6715728640556335 5 1.5 L 5 3.5 C 5 4.3284271359443665 4.3284271359443665 5 3.5 5 L 1.5 5 C 0.6715728640556335 5 0 4.3284271359443665 0 3.5 L 0 1.5 C 0 0.6715728640556335 0.6715728640556335 0 1.5 0 Z"
      />
    </Box>
  );
};

export default DMark;
