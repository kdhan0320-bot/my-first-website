import { Box, Typography } from '@mui/material';
import useInViewOnce from '../../hooks/useInViewOnce';

/* Flow Board — 요구사항 정리 → 화면 구조 설계 → React UI 구현 → 반응형 QA */
const FLOW_STEPS = [
  { n: 1, label: '요구사항 정리', x: 16, y: 40, delay: 0.5 },
  { n: 2, label: '화면 구조 설계', x: 108, y: 138, delay: 0.66 },
  { n: 3, label: 'React UI 구현', x: 200, y: 236, delay: 0.82 },
  { n: 4, label: '반응형 QA', x: 292, y: 334, delay: 0.98, isFinal: true },
];

const CARD_W = 132;
const CARD_H = 68;

const FLOW_PATH =
  'M28 74 C 70 104, 70 138, 120 172 C 162 202, 162 236, 212 270 C 254 300, 254 334, 304 368';

const FlowCanvasIllustration = () => {
  const [ref, isVisible] = useInViewOnce(0.3);

  return (
    <Box
      ref={ref}
      sx={{
        width: '100%',
        maxWidth: { xs: 280, sm: 340, md: 480 },
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
      <Typography
        sx={{
          color: 'text.disabled',
          fontSize: '0.68rem',
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          mb: 1,
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        Flow Board
      </Typography>

      <Box
        component="svg"
        viewBox="0 0 440 420"
        width="100%"
        aria-hidden="true"
        focusable="false"
        sx={{ display: 'block', height: 'auto', overflow: 'visible' }}
      >
        {/* 연결 스텝 라인 */}
        <path
          d={FLOW_PATH}
          fill="none"
          stroke="#38BDF8"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: isVisible ? 0 : 1,
            transition: 'stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s',
            opacity: 0.8,
          }}
        />

        {FLOW_STEPS.map((step) => (
          <Box
            component="g"
            key={step.n}
            style={{
              transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
              opacity: isVisible ? 1 : 0,
              transition: `transform 0.55s cubic-bezier(0.22,1,0.36,1) ${step.delay}s, opacity 0.55s ease ${step.delay}s`,
            }}
          >
            {/* 카드 */}
            <rect
              x={step.x} y={step.y} width={CARD_W} height={CARD_H} rx="10"
              fill={step.isFinal ? '#131C2E' : '#111827'}
              stroke={step.isFinal ? '#A7F3D0' : '#38BDF8'}
              strokeOpacity={step.isFinal ? 0.45 : 0.18}
              strokeWidth="1.2"
            />

            {step.isFinal ? (
              /* 마지막 카드: 브라우저 크롬 느낌의 점 3개 */
              <>
                <circle cx={step.x + 16} cy={step.y + 16} r="2.5" fill="#A7F3D0" opacity="0.8" />
                <circle cx={step.x + 26} cy={step.y + 16} r="2.5" fill="#94A3B8" opacity="0.4" />
                <circle cx={step.x + 36} cy={step.y + 16} r="2.5" fill="#94A3B8" opacity="0.4" />
              </>
            ) : (
              /* 스텝 번호 배지 */
              <circle cx={step.x + 16} cy={step.y + 16} r="9" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />
            )}
            {!step.isFinal && (
              <text x={step.x + 16} y={step.y + 20} textAnchor="middle" fontSize="10" fontWeight="700" fill="#38BDF8" fontFamily="sans-serif">
                {step.n}
              </text>
            )}

            <text
              x={step.x + 16}
              y={step.y + 42}
              fontSize="13"
              fontWeight="600"
              fill="#E5E7EB"
              fontFamily="Pretendard, sans-serif"
            >
              {step.label}
            </text>
          </Box>
        ))}

        {/* QA 완료 표시 — 마지막 카드 우측 상단에 점등 */}
        <circle
          cx={FLOW_STEPS[3].x + CARD_W - 14}
          cy={FLOW_STEPS[3].y + 14}
          r="5"
          fill="#A7F3D0"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(0.4)',
            transformOrigin: `${FLOW_STEPS[3].x + CARD_W - 14}px ${FLOW_STEPS[3].y + 14}px`,
            transition: 'opacity 0.4s ease 1.2s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) 1.2s',
            animation: isVisible ? 'pulseGlow 7s ease-in-out 1.6s infinite' : 'none',
          }}
        />
      </Box>
    </Box>
  );
};

export default FlowCanvasIllustration;
