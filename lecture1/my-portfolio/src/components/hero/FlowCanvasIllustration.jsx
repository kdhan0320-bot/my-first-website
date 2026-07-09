import { Box } from '@mui/material';
import useInViewOnce from '../../hooks/useInViewOnce';

/* 카드 레이어(정렬된 웹 화면 프레임) 위치/딜레이 정의 */
const CARD_LAYERS = [
  { x: 236, y: 214, delay: 0.9 },
  { x: 256, y: 236, delay: 1.02 },
  { x: 276, y: 258, delay: 1.14 },
];

/* 좌상단 "흩어진 정보 조각" — 점 + 짧은 선 */
const SCATTER_DOTS = [
  { cx: 34, cy: 40, r: 3 },
  { cx: 58, cy: 26, r: 2 },
  { cx: 78, cy: 52, r: 2.5 },
  { cx: 30, cy: 70, r: 2 },
  { cx: 96, cy: 34, r: 1.8 },
];

const FlowCanvasIllustration = () => {
  const [ref, isVisible] = useInViewOnce(0.3);

  return (
    <Box
      ref={ref}
      aria-hidden="true"
      sx={{
        width: '100%',
        maxWidth: { xs: 240, sm: 300, md: 520 },
        mx: 'auto',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.96)',
        transition: 'opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.22,1,0.36,1)',
        '@keyframes pulseGlow': {
          '0%, 100%': { opacity: 0.55 },
          '50%': { opacity: 1 },
        },
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 440 400"
        width="100%"
        aria-hidden="true"
        focusable="false"
        sx={{ display: 'block', height: 'auto', overflow: 'visible' }}
      >
        {/* 옅은 guide line — 모바일에서는 생략 */}
        <Box
          component="g"
          sx={{ display: { xs: 'none', md: 'block' } }}
        >
          <line x1="20" y1="150" x2="420" y2="150" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 8" opacity="0.06" />
          <line x1="150" y1="10" x2="150" y2="390" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 8" opacity="0.05" />
        </Box>

        {/* 좌상단: 흩어진 정보 조각 — 모바일에서는 생략 */}
        <Box component="g" sx={{ display: { xs: 'none', md: 'block' } }}>
          {SCATTER_DOTS.map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="#CBD5E1" opacity={isVisible ? 0.4 : 0}
              style={{ transition: `opacity 0.5s ease ${0.08 * i}s` }} />
          ))}
          <line x1="20" y1="92" x2="52" y2="88" stroke="#CBD5E1" strokeWidth="1.4" strokeLinecap="round" opacity={isVisible ? 0.3 : 0}
            style={{ transition: 'opacity 0.5s ease 0.3s' }} />
          <line x1="66" y1="70" x2="90" y2="76" stroke="#CBD5E1" strokeWidth="1.4" strokeLinecap="round" opacity={isVisible ? 0.28 : 0}
            style={{ transition: 'opacity 0.5s ease 0.36s' }} />
        </Box>

        {/* 중앙: flow line — 흩어진 정보에서 정렬된 화면으로 연결 */}
        <path
          d="M40 60 C130 40, 150 140, 210 150 C270 160, 250 210, 300 224"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="2.5"
          strokeLinecap="round"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: isVisible ? 0 : 1,
            transition: 'stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s',
            opacity: 0.9,
          }}
        />

        {/* 우하단: 정렬된 카드 레이어 3개 */}
        {CARD_LAYERS.map((c, i) => (
          <Box
            component="g"
            key={i}
            style={{
              transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
              opacity: isVisible ? 1 : 0,
              transition: `transform 0.55s cubic-bezier(0.22,1,0.36,1) ${c.delay}s, opacity 0.55s ease ${c.delay}s`,
            }}
          >
            <rect x={c.x} y={c.y} width="128" height="76" rx="10"
              fill={i === CARD_LAYERS.length - 1 ? '#131C2E' : '#111827'}
              stroke="#38BDF8" strokeOpacity={i === CARD_LAYERS.length - 1 ? 0.35 : 0.16} strokeWidth="1.2" />
            <circle cx={c.x + 16} cy={c.y + 16} r="3" fill="#38BDF8" opacity="0.5" />
            <rect x={c.x + 28} y={c.y + 13} width="24" height="5" rx="2.5" fill="#94A3B8" opacity="0.25" />
          </Box>
        ))}

        {/* flow line 끝 — check node (정리 완료 지점) */}
        <circle
          cx="300" cy="224" r="7"
          fill="#A7F3D0"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(0.4)',
            transformOrigin: '300px 224px',
            transition: 'opacity 0.4s ease 1.55s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) 1.55s',
            animation: isVisible ? 'pulseGlow 7s ease-in-out 2.2s infinite' : 'none',
          }}
        />
        <circle
          cx="300" cy="224" r="13"
          fill="none"
          stroke="#A7F3D0"
          strokeWidth="1"
          style={{
            opacity: isVisible ? 0.35 : 0,
            transition: 'opacity 0.4s ease 1.6s',
          }}
        />

        {/* KD 시그니처 — 작은 visual anchor */}
        <Box component="g" sx={{ display: { xs: 'none', md: 'block' } }} style={{ opacity: isVisible ? 0.5 : 0, transition: 'opacity 0.6s ease 1.3s' }}>
          <circle cx="404" cy="368" r="14" fill="none" stroke="#94A3B8" strokeWidth="1" opacity="0.4" />
          <text x="404" y="372" textAnchor="middle" fontSize="11" fontWeight="700" fill="#94A3B8" fontFamily="sans-serif">K</text>
        </Box>
      </Box>
    </Box>
  );
};

export default FlowCanvasIllustration;
