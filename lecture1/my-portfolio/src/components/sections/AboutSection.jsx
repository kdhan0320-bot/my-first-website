import { useRef } from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import RevealOnScroll from '../ui/RevealOnScroll';
import DMark from '../ui/DMark';
import FlowNode from '../ui/FlowNode';
import useInViewOnce from '../../hooks/useInViewOnce';

/* Home용 About Snapshot — /about 페이지의 핵심만 축약해 Home 한 화면 흐름 안에서 보여준다 */
const APPLICATION_FOCUS = ['UX/UI', 'Web Publishing', 'React/MUI', 'Responsive QA'];

const TOOL_LINE = 'Figma · React/MUI · HTML/CSS/JavaScript · GitHub · Supabase · AI Tools';

const InlineRow = ({ label, children }) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 1, mt: 2 }}>
    <Typography
      variant="caption"
      sx={{ color: 'text.disabled', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0 }}
    >
      {label}
    </Typography>
    {children}
  </Box>
);

/* About timeline — 정리→설계→구현→검증. SKILL_CARDS와 같은 순서/컬러를 재사용해
 * timeline(요약, node+라벨+1줄 설명)과 아래 4장 카드(상세) 두 자리가 같은 흐름을 가리키게 한다. */
const PROCESS_STEPS = [
  { step: '01', label: '정리', color: '#38BDF8', desc: '정보 구조와 사용자 흐름 정리' },
  { step: '02', label: '설계', color: '#3B82F6', desc: 'Figma 화면과 컴포넌트 설계' },
  { step: '03', label: '구현', color: '#60A5FA', desc: 'React/MUI 반응형 화면 구현' },
  { step: '04', label: '검증', color: '#A7F3D0', desc: '접근성·반응형·한계 확인' },
];

const SKILL_CARDS = [
  {
    index: '01',
    icon: <AccountTreeOutlinedIcon sx={{ fontSize: 22 }} />,
    title: '문제 정리',
    color: '#38BDF8',
    body: '요구사항과 사용자 흐름을 정리하고, 화면에서 먼저 보여야 할 정보를 구분합니다.',
  },
  {
    index: '02',
    icon: <GridViewOutlinedIcon sx={{ fontSize: 22 }} />,
    title: '화면 설계',
    color: '#3B82F6',
    body: 'Figma에서 와이어프레임과 컴포넌트 구조를 잡고, 모바일/태블릿 기준까지 함께 검토합니다.',
  },
  {
    index: '03',
    icon: <CodeOutlinedIcon sx={{ fontSize: 22 }} />,
    title: '웹 구현',
    color: '#60A5FA',
    body: 'React/MUI, HTML/CSS, JavaScript로 카드, 모달, 반응형 레이아웃을 구현합니다.',
  },
  {
    index: '04',
    icon: <FactCheckOutlinedIcon sx={{ fontSize: 22 }} />,
    title: '검증과 보완',
    color: '#A7F3D0',
    body: '링크, 접근성, 모바일 화면, 프로젝트 한계를 확인하며 제출 가능한 상태로 다듬습니다.',
  },
];

/* timeline 아이템 — node-only 순차 점등(scale+glow)을 위해 각자 useInViewOnce를 갖는다.
 * .map() 콜백 안에서는 훅을 호출할 수 없어 별도 컴포넌트로 분리했다. */
const TimelineStep = ({ item, index, isLast }) => {
  const prefersReduced = useRef(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );
  const [ref, isVisible] = useInViewOnce(0.3);
  const show = prefersReduced.current || isVisible;
  const nodeDelay = index * 0.13 + 0.15;

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: { xs: 'row', md: 'column' },
        alignItems: { xs: 'flex-start', md: 'center' },
        textAlign: { xs: 'left', md: 'center' },
        gap: { xs: 1.5, md: 1 },
        px: { md: 1.5 },
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : { xs: 'translateY(8px)', md: 'translateY(14px)' },
        transition: `opacity 0.5s ease ${index * 0.12}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 0.12}s`,
        '&:hover .timeline-node': {
          borderColor: item.color,
          boxShadow: `0 0 14px ${item.color}55`,
          transform: 'scale(1.06)',
        },
        '&:hover .timeline-connector': {
          background: `linear-gradient(90deg, ${item.color}, ${item.color}40)`,
        },
      }}
    >
      {/* 모바일/태블릿: 이전 노드에서 내려오는 세로 커넥터 — node 원 앞에서 여유를 두고 끊김 */}
      {index > 0 && (
        <Box
          aria-hidden="true"
          sx={{
            display: { xs: 'block', md: 'none' },
            position: 'absolute',
            left: 21, top: -22, width: '2px', height: 18,
            background: 'linear-gradient(180deg, rgba(56,189,248,0.08), rgba(56,189,248,0.35))',
          }}
        />
      )}
      {/* 데스크톱: 다음 노드로 이어지는 가로 커넥터 — 양쪽 node 반지름(22px)만큼 gap을 둬 node 내부를 지나가지 않음 */}
      {!isLast && (
        <Box
          aria-hidden="true"
          className="timeline-connector"
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            left: 'calc(50% + 22px)', top: 22, width: 'calc(100% - 44px)', height: '2px',
            background: 'linear-gradient(90deg, rgba(56,189,248,0.32), rgba(56,189,248,0.14))',
            opacity: show ? 1 : 0,
            transition: `opacity 0.4s ease ${nodeDelay + 0.1}s, background 0.25s ease`,
            zIndex: 0,
          }}
        />
      )}
      {/* node — 완전 불투명한 배경으로 뒤 커넥터가 절대 비치지 않게 함 */}
      <Box
        className="timeline-node"
        sx={{
          position: 'relative', zIndex: 1, flexShrink: 0,
          width: 44, height: 44, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          bgcolor: '#0F172A',
          border: `1.5px solid ${item.color}55`,
          transform: show ? 'scale(1)' : 'scale(0.85)',
          boxShadow: show ? `0 0 19px ${item.color}8A` : `0 0 0px ${item.color}00`,
          transition: `transform 0.4s ease ${nodeDelay}s, box-shadow 0.4s ease ${nodeDelay}s, border-color 0.25s ease, background-color 0.25s ease`,
        }}
      >
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: item.color }}>
          {item.step}
        </Typography>
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: 'text.primary' }}>
          {item.label}
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', lineHeight: 1.6, mt: 0.25 }}>
          {item.desc}
        </Typography>
      </Box>
    </Box>
  );
};

const AboutSection = () => {
  return (
    <Box
      component="section"
      id="about"
      aria-label="소개"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.default',
        pt: { xs: 6, md: 8 },
        pb: { xs: 3, md: 8 },
      }}
    >
      {/* Interface Blueprint grid — Hero/Projects와 같은 blue 톤으로 통일해 Home 전체가 하나의 배경 시스템처럼 보이게 함 */}
      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.09) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 75% 60% at 50% 40%, black 20%, transparent 82%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 60% at 50% 40%, black 20%, transparent 82%)',
        }}
      />
      {/* Hero Flow Path를 받는 소프트 글로우 — 위 섹션 커넥터가 번져 들어오는 느낌, 하드 라인으로 끊기지 않게 함 */}
      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          top: '-4%', left: '50%', transform: 'translateX(-50%)',
          width: 320, height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(56,189,248,0.13) 0%, transparent 72%)',
          filter: 'blur(52px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {/* Hero의 Flow Stream이 이어지는 느낌의 정적 리본 — About 밖에서는 무한 반복 모션을 쓰지 않으므로 정지 상태로 배치 */}
      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          top: '-18%', left: '-15%',
          width: '130%', height: '55%',
          background: 'linear-gradient(100deg, transparent 30%, rgba(56,189,248,0.135) 48%, rgba(129,140,248,0.1) 53%, transparent 72%)',
          filter: 'blur(30px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {/* 배경이 비어 보이지 않도록 radial glow — 텍스트 가독성은 유지하는 선에서 체감되게 강화 */}
      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          top: '10%', right: '-6%',
          width: 460, height: 460,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.155) 0%, transparent 70%)',
          filter: 'blur(64px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {/* D 모노그램 workmark — Hero/Footer의 실물 로고와 구분되는 옅은 배경 마크 */}
      <DMark size={220} sx={{ top: '4%', right: '0%' }} />
      {/* 카드 행 뒤 process line — 4개 카드가 하나의 흐름임을 표시, 체감되게 강화 */}
      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          left: 0, right: 0, bottom: '14%',
          height: '1.5px',
          background: 'linear-gradient(90deg, transparent 8%, rgba(56,189,248,0.38) 50%, transparent 92%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {/* Flow Path — Hero 하단 커넥터와 동일한 정적 패턴, 다음 섹션(Projects)으로 흐름 연결 */}
      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          left: '50%', bottom: 0, transform: 'translateX(-50%)',
          width: '1px', height: 85,
          background: 'linear-gradient(180deg, transparent, rgba(56,189,248,0.55))',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      {/* Flow Node — About→Projects 경계 마디, Route Line 표준 마커 */}
      <FlowNode sx={{ left: '50%', bottom: 0, transform: 'translateX(-50%)' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>

        {/* 섹션 헤더 */}
        <RevealOnScroll>
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Typography
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '0.875rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                '&::before': { content: '""', display: 'block', width: 28, height: 1, bgcolor: 'primary.main', opacity: 0.45 },
                '&::after':  { content: '""', display: 'block', width: 28, height: 1, bgcolor: 'primary.main', opacity: 0.45 },
              }}
            >
              01 ABOUT / WORKFLOW
            </Typography>
            <Typography variant="h2" sx={{ color: 'text.primary', fontWeight: 800 }}>
              정리하고, 설계하고, 구현하는 사람
            </Typography>
          </Box>
        </RevealOnScroll>

        {/* 자기소개 */}
        <RevealOnScroll delay={0.05}>
          <Box
            sx={{
              maxWidth: 720,
              mx: 'auto',
              mb: { xs: 4, md: 5 },
              p: { xs: 3, md: 4 },
              bgcolor: 'rgba(56,189,248,0.05)',
              border: '1px solid rgba(148,163,184,0.16)',
              borderLeft: '4px solid',
              borderLeftColor: 'primary.main',
              borderRadius: '0 12px 12px 0',
            }}
          >
            <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.85, fontWeight: 500 }}>
              저는 화려한 그래픽보다 사용자가 화면을 이해하는 순서와 실제 구현 가능한 구조를 먼저 정리합니다. Figma에서 흐름과 컴포넌트를 잡고, React/MUI 기반으로 반응형 화면을 구현하며, 구현하지 않은 기능과 프로젝트 한계는 명확히 구분합니다.
            </Typography>

            <InlineRow label="지원 방향">
              <Box
                sx={{
                  display: { xs: 'grid', sm: 'flex' },
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)' },
                  flexWrap: { sm: 'wrap' },
                  gap: { xs: 1, sm: 0.75 },
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                {APPLICATION_FOCUS.map((item) => (
                  <Box
                    key={item}
                    sx={{
                      px: 1.1, py: 0.4, borderRadius: 999,
                      bgcolor: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </InlineRow>

            <InlineRow label="사용 도구">
              <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', lineHeight: 1.6 }}>
                {TOOL_LINE}
              </Typography>
            </InlineRow>

            <InlineRow label="현재 한계">
              <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', lineHeight: 1.6 }}>
                실제 사용자 테스트와 정량 성과 데이터는 아직 부족합니다.
              </Typography>
            </InlineRow>
          </Box>
        </RevealOnScroll>

        {/* About timeline — 정리→설계→구현→검증을 node+커넥터로 잇는 독립 블록.
            데스크톱은 가로 4열+중앙 흐름선, 태블릿은 2×2, 모바일은 세로 1열 */}
        <Box sx={{ maxWidth: 900, mx: 'auto', mb: { xs: 5, md: 6 } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              rowGap: { xs: 2.5, sm: 3, md: 0 },
              columnGap: { sm: 2 },
            }}
          >
            {PROCESS_STEPS.map((item, i) => (
              <TimelineStep key={item.step} item={item} index={i} isLast={i === PROCESS_STEPS.length - 1} />
            ))}
          </Box>
        </Box>

        {/* 역량 카드 — 카드별 개별 stagger reveal */}
        <Box sx={{ position: 'relative', mb: { xs: 1, md: 4 } }}>
          <Grid container spacing={3} sx={{ position: 'relative', zIndex: 2 }}>
            {SKILL_CARDS.map((card, i) => (
              <Grid key={card.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <RevealOnScroll delay={0.1 + i * 0.1} y={18} sx={{ height: '100%' }}>
                  <Box
                    sx={{
                      height: '100%',
                      p: { xs: 2.5, md: 3 },
                      bgcolor: '#111827',
                      border: '1px solid rgba(148,163,184,0.15)',
                      borderTop: `2px solid ${card.color}`,
                      borderRadius: 2.5,
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px ${card.color}28`,
                        borderColor: `${card.color}40`,
                      },
                      '&:hover .skill-icon': {
                        borderColor: `${card.color}70`,
                        boxShadow: `0 0 18px ${card.color}40`,
                      },
                    }}
                  >
                    {/* 아이콘 + 순번 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box
                        className="skill-icon"
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          bgcolor: `${card.color}18`,
                          border: `1px solid ${card.color}30`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: card.color,
                          boxShadow: `0 0 12px ${card.color}22`,
                          transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                        }}
                      >
                        {card.icon}
                      </Box>
                      <Typography
                        sx={{ color: card.color, fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.08em', opacity: 0.7 }}
                      >
                        {card.index}
                      </Typography>
                    </Box>

                    <Typography variant="h5" component="h3" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.25 }}>
                      {card.title}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.65, fontSize: '0.9375rem' }}>
                      {card.body}
                    </Typography>
                  </Box>
                </RevealOnScroll>
              </Grid>
            ))}
          </Grid>
        </Box>

      </Container>
    </Box>
  );
};

export default AboutSection;
