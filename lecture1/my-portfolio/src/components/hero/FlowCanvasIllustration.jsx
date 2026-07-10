import { Box, Typography } from '@mui/material';
import useInViewOnce from '../../hooks/useInViewOnce';
import LogoSymbol from '../ui/LogoSymbol';

/* Flow Core — FEConf식 "하나의 중심 오브젝트" 표현. 행성/궤도 이미지를 직접 쓰지 않고
 * 작업 방식(Figma/React·MUI/Responsive QA/AI Assist)을 원형 코어 주변 라벨로 추상화했다. */
const CORE_LABELS = [
  { label: 'Figma',          accent: '#F97316', pos: 'top' },
  { label: 'React/MUI',      accent: '#38BDF8', pos: 'right' },
  { label: 'Responsive QA',  accent: '#A7F3D0', pos: 'bottom' },
  { label: 'AI Assist',      accent: '#94A3B8', pos: 'left', muted: true },
];

const POS_SX = {
  top:    { top: 0,      left: '50%', transform: 'translate(-50%, -50%)' },
  right:  { top: '50%',  right: 0,    transform: 'translate(50%, -50%)' },
  bottom: { bottom: 0,   left: '50%', transform: 'translate(-50%, 50%)' },
  left:   { top: '50%',  left: 0,     transform: 'translate(-50%, -50%)' },
};

const FlowCanvasIllustration = () => {
  const [ref, isVisible] = useInViewOnce(0.3);

  return (
    <Box
      ref={ref}
      sx={{
        width: '100%',
        maxWidth: { xs: 355, sm: 400, md: 450 },
        mx: 'auto',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.94)',
        transition: 'opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.22,1,0.36,1)',
        /* Hero 한정 ambient motion — 느리고 약함, prefers-reduced-motion에서는 HeroSection 루트 규칙으로 제거됨 */
        '@keyframes coreOrbitSpin': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
      }}
    >
      {/* 원형 코어 + orbit 라벨 영역 */}
      <Box
        sx={{
          position: 'relative',
          width: { xs: 260, sm: 295, md: 330 },
          height: { xs: 260, sm: 295, md: 330 },
          mx: 'auto',
        }}
      >
        {/* orbit guide — 얇은 원형 라인 하나만 사용(과한 궤도 연출 지양) */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '1px solid rgba(56,189,248,0.32)',
          }}
        />

        {/* orbit 위를 도는 아주 약한 highlight — 16초 1회전, reduced-motion에서 제거 */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            inset: 0,
            animation: isVisible ? 'coreOrbitSpin 16s linear infinite' : 'none',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 9,
              height: 9,
              borderRadius: '50%',
              bgcolor: '#BAE6FD',
              boxShadow: '0 0 12px 2px rgba(186,230,253,0.65)',
              opacity: isVisible ? 0.9 : 0,
              transition: 'opacity 0.6s ease 0.9s',
            }}
          />
        </Box>

        {/* 코어 뒤 은은한 glow — spotlightBreathe는 HeroSection에서 전역 등록된 keyframe 재사용 */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: 168, md: 215 },
            height: { xs: 168, md: 215 },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56,189,248,0.35) 0%, transparent 70%)',
            filter: 'blur(20px)',
            animation: 'spotlightBreathe 16s ease-in-out infinite',
          }}
        />

        {/* 코어 — 개인 브랜드 마크를 중심 오브젝트로 사용 */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: 90, sm: 104, md: 118 },
            height: { xs: 90, sm: 104, md: 118 },
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(160deg, rgba(30,58,95,0.9) 0%, rgba(11,16,32,0.9) 100%)',
            border: '1px solid rgba(56,189,248,0.54)',
            boxShadow: '0 0 40px rgba(56,189,248,0.36), inset 0 0 22px rgba(56,189,248,0.16)',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s ease 0.15s',
          }}
        >
          <LogoSymbol size={48} />
        </Box>

        {/* 코어 주변 라벨 4개 — AI Assist는 마지막 보조 라벨 */}
        {CORE_LABELS.map((item, i) => (
          <Box
            key={item.label}
            sx={{
              position: 'absolute',
              ...POS_SX[item.pos],
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.25,
              py: 0.6,
              borderRadius: 999,
              border: '1px solid rgba(148,163,184,0.24)',
              bgcolor: 'rgba(13,19,33,0.96)',
              whiteSpace: 'nowrap',
              opacity: isVisible ? (item.muted ? 0.75 : 1) : 0,
              transition: `opacity 0.5s ease ${0.15 + i * 0.15}s`,
            }}
          >
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: item.accent, flexShrink: 0 }} />
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.secondary', letterSpacing: '0.02em' }}>
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* 하단 캡션 */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography
          sx={{
            color: 'text.disabled',
            fontSize: '0.875rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          Flow Core
        </Typography>
        <Typography sx={{ color: 'text.disabled', fontSize: '0.875rem', mt: 0.25 }}>
          Figma · React/MUI · Responsive QA를 오가는 작업 흐름
        </Typography>
      </Box>
    </Box>
  );
};

export default FlowCanvasIllustration;
