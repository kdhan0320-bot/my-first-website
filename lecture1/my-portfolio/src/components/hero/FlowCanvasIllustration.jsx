import { Box, Typography, Stack } from '@mui/material';
import useInViewOnce from '../../hooks/useInViewOnce';

/* Flow Board — 요구사항 정리 → 화면 구조 설계 → React UI 구현 → 반응형 QA */
const FLOW_STEPS = [
  { n: 1, label: '요구사항 정리', desc: '정보 구조화', x: 16, y: 40, delay: 0.15 },
  { n: 2, label: '화면 구조 설계', desc: 'Figma 와이어프레임', x: 108, y: 138, delay: 0.25 },
  { n: 3, label: 'React UI 구현', desc: '반응형 컴포넌트', x: 200, y: 236, delay: 0.35 },
  { n: 4, label: '반응형 QA', desc: '접근성 점검', x: 292, y: 334, delay: 0.45, isFinal: true },
];

/* 패널 하단 status strip — AI Assist는 보조 배지로 마지막에만 노출 */
const STATUS_BADGES = [
  { label: 'Figma', accent: '#F97316' },
  { label: 'React/MUI', accent: '#38BDF8' },
  { label: 'Responsive QA', accent: '#A7F3D0' },
  { label: 'AI Assist', accent: '#94A3B8', muted: true },
];

const CARD_W = 132;
const CARD_H = 84;

const FLOW_PATH =
  'M28 74 C 70 104, 70 138, 120 172 C 162 202, 162 236, 212 270 C 254 300, 254 334, 304 368';

const FlowCanvasIllustration = () => {
  const [ref, isVisible] = useInViewOnce(0.3);

  return (
    <Box
      ref={ref}
      sx={{
        width: '100%',
        maxWidth: { xs: 340, sm: 420, md: 600 },
        mx: 'auto',
        p: { xs: 2.5, sm: 3, md: 3.5 },
        borderRadius: 4,
        border: '1px solid rgba(56,189,248,0.16)',
        background: 'linear-gradient(180deg, rgba(19,28,46,0.6) 0%, rgba(11,16,32,0.42) 100%)',
        backdropFilter: 'blur(18px)',
        boxShadow: '0 24px 60px rgba(2,6,23,0.35)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.96)',
        transition: 'opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <Box sx={{ mb: 1.5, textAlign: { xs: 'center', md: 'left' } }}>
        <Typography
          sx={{
            color: 'text.disabled',
            fontSize: '0.875rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          Design to Web Flow
        </Typography>
        <Typography
          sx={{
            color: 'text.disabled',
            fontSize: '0.875rem',
            mt: 0.25,
          }}
        >
          문제 정리부터 반응형 QA까지
        </Typography>
      </Box>

      <Box
        component="svg"
        viewBox="0 0 440 440"
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
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s',
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
              transition: `transform 0.5s cubic-bezier(0.22,1,0.36,1) ${step.delay}s, opacity 0.5s ease ${step.delay}s`,
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

            {step.isFinal && (
              /* 마지막 카드: 브라우저 크롬 느낌의 점 3개 (완료된 화면 은유) */
              <>
                <circle cx={step.x + CARD_W - 36} cy={step.y + 15} r="2.5" fill="#A7F3D0" opacity="0.8" />
                <circle cx={step.x + CARD_W - 26} cy={step.y + 15} r="2.5" fill="#94A3B8" opacity="0.4" />
                <circle cx={step.x + CARD_W - 16} cy={step.y + 15} r="2.5" fill="#94A3B8" opacity="0.4" />
              </>
            )}

            <text
              x={step.x + 16}
              y={step.y + 22}
              fontSize="9.5"
              fontWeight="700"
              letterSpacing="0.06em"
              fill={step.isFinal ? '#A7F3D0' : '#38BDF8'}
              fontFamily="sans-serif"
            >
              {`STEP 0${step.n}`}
            </text>
            <text
              x={step.x + 16}
              y={step.y + 44}
              fontSize="13"
              fontWeight="600"
              fill="#E5E7EB"
              fontFamily="Pretendard, sans-serif"
            >
              {step.label}
            </text>
            <text
              x={step.x + 16}
              y={step.y + 62}
              fontSize="10.5"
              fontWeight="500"
              fill="#94A3B8"
              fontFamily="Pretendard, sans-serif"
            >
              {step.desc}
            </text>
          </Box>
        ))}

        {/* QA 완료 표시 — 마지막 카드 우측 상단에 1회 점등(무한 반복 없음) */}
        <circle
          cx={FLOW_STEPS[3].x + CARD_W - 14}
          cy={FLOW_STEPS[3].y + 14}
          r="5"
          fill="#A7F3D0"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(0.4)',
            transformOrigin: `${FLOW_STEPS[3].x + CARD_W - 14}px ${FLOW_STEPS[3].y + 14}px`,
            transition: 'opacity 0.4s ease 0.95s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.95s',
          }}
        />
        <circle
          cx={FLOW_STEPS[3].x + CARD_W - 14}
          cy={FLOW_STEPS[3].y + 14}
          r="13"
          fill="none"
          stroke="#A7F3D0"
          strokeWidth="1"
          style={{
            opacity: isVisible ? 0.35 : 0,
            transition: 'opacity 0.4s ease 1s',
          }}
        />
      </Box>

      {/* status strip — 사용 도구/검증 요약, AI Assist는 마지막 보조 배지로만 표시 */}
      <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px solid rgba(148,163,184,0.14)' }}>
        <Stack
          direction="row"
          sx={{ flexWrap: 'wrap', rowGap: 1, columnGap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}
        >
          {STATUS_BADGES.map((badge) => (
            <Box
              key={badge.label}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.25,
                py: 0.5,
                borderRadius: 999,
                border: '1px solid rgba(148,163,184,0.18)',
                bgcolor: 'rgba(15,23,42,0.4)',
                opacity: badge.muted ? 0.7 : 1,
              }}
            >
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: badge.accent, flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: 'text.secondary', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
                {badge.label}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default FlowCanvasIllustration;
