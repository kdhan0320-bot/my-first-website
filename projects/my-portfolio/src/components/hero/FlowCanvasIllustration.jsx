import { Box, Typography } from '@mui/material';
import useInViewOnce from '../../hooks/useInViewOnce';
import LogoSymbol from '../ui/LogoSymbol';

/* Flow Core — FEConf식 "하나의 중심 오브젝트" 표현. 행성/궤도 이미지를 직접 쓰지 않고
 * 핵심 작업 축(Figma/React·MUI/Responsive QA)만 원형 코어 주변 3개 라벨로 추상화했다.
 * AI Assist 라벨은 과강조로 지적되어 제거 — AI 언급은 Hero 설명 문장 1회로 충분하다. */
const CORE_LABELS = [
  { label: 'Figma',          accent: '#F97316', pos: 'top' },
  { label: 'React/MUI',      accent: '#38BDF8', pos: 'right' },
  { label: 'Responsive QA',  accent: '#A7F3D0', pos: 'left' },
];

/* 원의 중심(50%,50%)에서 반지름 49.3%인 3개 지점 — 12시/4시/8시 방향(120도 간격) */
const POS_SX = {
  top:   { top: '0.7%',  left: '50%',   transform: 'translate(-50%, -50%)' },
  right: { top: '74.6%', left: '92.7%', transform: 'translate(-50%, -50%)' },
  left:  { top: '74.6%', left: '7.3%',  transform: 'translate(-50%, -50%)' },
};

const FlowCanvasIllustration = () => {
  const [ref, isVisible] = useInViewOnce(0.3);

  return (
    <Box
      ref={ref}
      sx={{
        width: '100%',
        maxWidth: { xs: 410, sm: 460, md: 520 },
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
          width: { xs: 300, sm: 340, md: 380 },
          height: { xs: 300, sm: 340, md: 380 },
          mx: 'auto',
        }}
      >
        {/* orbit guide — 라벨 3개 위치(12시/4시/8시, 120도 간격)에 정확히 갭을 낸 SVG 링.
            배경 마스크에 의존하지 않고 실제로 라인을 끊어 라벨 뒤에 선이 보이지 않게 한다. */}
        <Box
          component="svg"
          aria-hidden="true"
          viewBox="0 0 100 100"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
        >
          <circle
            cx="50" cy="50" r="49.3"
            fill="none"
            stroke="rgba(56,189,248,0.46)"
            strokeWidth="0.55"
            pathLength={400}
            strokeDasharray="80 53.333"
            strokeDashoffset="73.333"
          />
        </Box>

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
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: '#BAE6FD',
              boxShadow: '0 0 14px 3px rgba(186,230,253,0.75)',
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
            width: { xs: 195, md: 250 },
            height: { xs: 195, md: 250 },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56,189,248,0.46) 0%, transparent 70%)',
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
            width: { xs: 104, sm: 120, md: 136 },
            height: { xs: 104, sm: 120, md: 136 },
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(160deg, rgba(30,58,95,0.9) 0%, rgba(11,16,32,0.9) 100%)',
            border: '1px solid rgba(56,189,248,0.66)',
            boxShadow: '0 0 48px rgba(56,189,248,0.48), inset 0 0 24px rgba(56,189,248,0.22)',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s ease 0.15s',
          }}
        >
          <LogoSymbol size={60} />
        </Box>

        {/* 코어 주변 핵심 작업 축 3개 */}
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
              opacity: isVisible ? 1 : 0,
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
