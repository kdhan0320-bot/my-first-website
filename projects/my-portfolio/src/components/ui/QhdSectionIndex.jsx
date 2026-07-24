import { Box } from '@mui/material';
import { FONT_MONO, FONT_SANS, HUMAN_SIGNAL, QHD_DECORATION_MIN_WIDTH } from '../../theme';

/* Phase 4F: Figma QHD Home(347:383)의 "Wide Index / Wide Label" 4쌍 — Human
 * Signal의 "단계·구조·검증" 정체성을 QHD(1920px+) 여백에 설명하는 승인된 요소다.
 * `QhdAmbientSignal.jsx`(원/선/점 장식)와 역할이 달라 별도 컴포넌트로 분리했다.
 *
 * Phase 5A: Projects Index(QHD Signal Field 381:257)가 같은 컴포넌트를 다시
 * 쓰면서 direct node 실측값이 Home과 미묘하게 다르다는 게 확인됐다(index 색
 * deepHarbor vs inkNavy, size 150px vs 170px, label opacity 0.55 vs 0.56,
 * 수평 gutter offset도 페이지마다 다름) — 그래서 스타일·수평 offset을 전부
 * prop으로 받는 generic 컴포넌트로 바꿨다. Home 4개 호출부는 기존 렌더 결과가
 * 그대로 나오도록 원래 하드코딩값을 명시적으로 넘긴다(동작 변경 없음).
 *
 * 좌우 수평 위치는 중앙 1440(HOME_WIDE_MAX_WIDTH) shell 기준 Figma gutter
 * 간격을 그대로 보존한 calc식이다 — `indexOffset`/`labelOffset`은 shell 절반
 * (720px)에서 얼마나 더 바깥쪽으로 나가는지를 나타내는 px 값이다.
 *
 * Phase 5A-R: 표시 기준을 `1920px`에서 `QHD_DECORATION_MIN_WIDTH`(2480,
 * `theme.js`)로 바꿨다. Projects index(offset 502/210)의 경우 index/label
 * 전체가 화면 안에 들어오려면 실측상 최소 2444px가 필요해, 1920~2320px대에서는
 * 오른쪽 02 index/label이 실제로 화면 밖으로 잘리고 있었다(사용자가 실제 2560
 * 모니터에서 발견). QhdAmbientSignal과 같은 상수를 공유해 Home/Projects
 * 표시 기준을 통일한다. */
const QHD_MQ = `@media (min-width:${QHD_DECORATION_MIN_WIDTH}px)`;

const horizontalFor = (side, offset) =>
  side === 'left'
    ? `calc(50% - 720px - ${offset}px)`
    : `calc(50% + 720px + ${offset}px)`;

const QhdSectionIndex = ({
  id, index, label, side, indexTop, labelTop, indexOffset, labelOffset,
  indexColor = HUMAN_SIGNAL.inkNavy,
  indexFontSize = '170px',
  indexOpacity = 0.05,
  labelOpacity = 0.56,
}) => (
  <Box
    aria-hidden="true"
    sx={{
      display: 'none',
      [QHD_MQ]: { display: 'block' },
      position: 'absolute', inset: 0, overflow: 'hidden',
      pointerEvents: 'none', userSelect: 'none',
    }}
  >
    <Box
      data-qhd-index={index}
      sx={{
        position: 'absolute', top: indexTop, left: horizontalFor(side, indexOffset),
        fontFamily: FONT_SANS, fontWeight: 700, fontSize: indexFontSize, lineHeight: 1,
        color: indexColor, opacity: indexOpacity, whiteSpace: 'nowrap',
      }}
    >
      {index}
    </Box>
    <Box
      data-qhd-index-label={id}
      sx={{
        position: 'absolute', top: labelTop, left: horizontalFor(side, labelOffset),
        fontFamily: FONT_MONO, fontWeight: 600, fontSize: '11px',
        color: HUMAN_SIGNAL.burntOrange, opacity: labelOpacity, whiteSpace: 'nowrap',
      }}
    >
      {label}
    </Box>
  </Box>
);

export default QhdSectionIndex;
