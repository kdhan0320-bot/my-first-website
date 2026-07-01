import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Chip, Grid, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { usePortfolio } from '../../context/PortfolioContext';
import { supabase } from '../../lib/supabase';
import useInViewOnce from '../../hooks/useInViewOnce';
import useCountUp from '../../hooks/useCountUp';
import { scrollToSection } from '../../hooks/useScrollNav';
import StarField from '../common/StarField';

const PROCESS_STEPS = [
  { label: '조사', sub: '사용자 흐름과 불편한 지점을 파악합니다.',           num: '01', color: '#A78BFA', lightColor: '#7C3AED' },
  { label: '설계', sub: 'Figma로 화면 구조와 프로토타입을 정리합니다.',       num: '02', color: '#38BDF8', lightColor: '#2563EB' },
  { label: '구현', sub: 'React 기반으로 실제 웹 화면을 구현합니다.',          num: '03', color: '#22D3EE', lightColor: '#0891B2' },
  { label: '개선', sub: '피드백을 반영해 구조와 UI를 수정합니다.',            num: '04', color: '#F59E0B', lightColor: '#D97706' },
];

const CosmicHeroIllustration = () => {
  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';

  const oc1    = dark ? 'rgba(56,189,248,0.44)'  : 'rgba(37,99,235,0.30)';
  const oc2    = dark ? 'rgba(167,139,250,0.36)' : 'rgba(124,58,237,0.24)';
  const star   = dark ? 'rgba(255,255,255,0.65)' : 'rgba(37,99,235,0.50)';
  const starB  = dark ? 'rgba(255,255,255,0.42)' : 'rgba(124,58,237,0.36)';
  const gx     = dark ? 'rgba(56,189,248,0.16)'  : 'rgba(37,99,235,0.10)';
  const pFill  = dark ? 'rgba(15,23,42,0.92)'    : 'rgba(255,255,255,0.97)';
  const pStroke= dark ? 'rgba(56,189,248,0.55)'  : 'rgba(37,99,235,0.40)';
  const tBar   = dark ? 'rgba(30,41,59,0.98)'    : 'rgba(241,245,249,1)';
  const lnA    = dark ? 'rgba(255,255,255,0.22)' : 'rgba(37,99,235,0.22)';
  const lnB    = dark ? 'rgba(255,255,255,0.11)' : 'rgba(37,99,235,0.11)';
  const cFill  = dark ? 'rgba(20,30,50,0.88)'    : 'rgba(255,255,255,0.94)';

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg
        viewBox="0 0 460 400"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="UI 설계 프로세스 일러스트 — 조사, 설계, 구현, 개선"
        style={{ width: '100%', maxWidth: 500, height: 'auto', display: 'block' }}
      >
        {/* 은하수 곡선 */}
        <path d="M 18 375 Q 230 405 445 222" fill="none" stroke={gx} strokeWidth="2.5"/>

        {/* 외부 궤도 */}
        <ellipse cx="230" cy="195" rx="195" ry="153" fill="none" stroke={oc1} strokeWidth="1.4"/>
        {/* 내부 궤도 (점선) — 노트북을 감싸듯 */}
        <ellipse cx="230" cy="195" rx="138" ry="100" fill="none" stroke={oc2} strokeWidth="0.9" strokeDasharray="7 12"/>

        {/* 배경 별 */}
        <circle cx="32"  cy="42"  r="1.8" fill={star}/>
        <circle cx="90"  cy="18"  r="1.2" fill={starB}/>
        <circle cx="164" cy="7"   r="1.8" fill={star}/>
        <circle cx="400" cy="22"  r="1.8" fill={starB}/>
        <circle cx="444" cy="64"  r="1.2" fill={star}/>
        <circle cx="452" cy="210" r="1.2" fill={starB}/>
        <circle cx="8"   cy="230" r="1.2" fill={starB}/>
        <circle cx="52"  cy="370" r="1.8" fill={star}/>
        <circle cx="116" cy="388" r="1.2" fill={starB}/>
        <circle cx="362" cy="382" r="1.8" fill={star}/>
        <circle cx="430" cy="348" r="1.2" fill={starB}/>

        {/* 별자리 연결선 */}
        <line x1="32"  y1="42"  x2="90"  y2="18"  stroke={star} strokeWidth="0.5" opacity="0.45"/>
        <line x1="90"  y1="18"  x2="164" y2="7"   stroke={star} strokeWidth="0.5" opacity="0.35"/>
        <line x1="400" y1="22"  x2="444" y2="64"  stroke={star} strokeWidth="0.5" opacity="0.40"/>
        <line x1="52"  y1="370" x2="116" y2="388" stroke={star} strokeWidth="0.5" opacity="0.45"/>
        <line x1="116" y1="388" x2="362" y2="382" stroke={star} strokeWidth="0.5" opacity="0.28"/>

        {/* ── 중앙 UI 패널 (브라우저/대시보드 창) ── */}
        <rect x="84" y="65" width="292" height="188" rx="10" fill={pFill} stroke={pStroke} strokeWidth="1.8"/>
        {/* 타이틀 바 */}
        <rect x="84" y="65" width="292" height="22" rx="10" fill={tBar}/>
        <rect x="84" y="77" width="292" height="10" fill={tBar}/>
        {/* 창 컨트롤 (맥 스타일) */}
        <circle cx="100" cy="76" r="4" fill="#EF4444" opacity={dark ? 0.75 : 0.68}/>
        <circle cx="115" cy="76" r="4" fill="#F59E0B" opacity={dark ? 0.75 : 0.68}/>
        <circle cx="130" cy="76" r="4" fill="#22C55E" opacity={dark ? 0.75 : 0.68}/>
        {/* URL 바 */}
        <rect x="148" y="68" width="88" height="14" rx="3" fill={dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}/>
        <rect x="155" y="73" width="55" height="4"  rx="2" fill={lnB}/>

        {/* KPI 카드 1 — 청록 */}
        <rect x="96"  y="96" width="82" height="46" rx="5" fill={dark ? 'rgba(56,189,248,0.11)'  : 'rgba(37,99,235,0.07)'}/>
        <rect x="104" y="104" width="32" height="4"  rx="2" fill={lnB}/>
        <rect x="104" y="113" width="60" height="9"  rx="2" fill={dark ? 'rgba(56,189,248,0.52)'  : 'rgba(37,99,235,0.45)'}/>
        <rect x="104" y="129" width="26" height="3.5" rx="1.5" fill={lnB}/>

        {/* KPI 카드 2 — 보라 */}
        <rect x="187" y="96" width="82" height="46" rx="5" fill={dark ? 'rgba(167,139,250,0.11)' : 'rgba(124,58,237,0.07)'}/>
        <rect x="195" y="104" width="32" height="4"  rx="2" fill={lnB}/>
        <rect x="195" y="113" width="60" height="9"  rx="2" fill={dark ? 'rgba(167,139,250,0.52)' : 'rgba(124,58,237,0.45)'}/>
        <rect x="195" y="129" width="26" height="3.5" rx="1.5" fill={lnB}/>

        {/* KPI 카드 3 — 시안 */}
        <rect x="278" y="96" width="82" height="46" rx="5" fill={dark ? 'rgba(34,211,238,0.11)'  : 'rgba(8,145,178,0.07)'}/>
        <rect x="286" y="104" width="32" height="4"  rx="2" fill={lnB}/>
        <rect x="286" y="113" width="60" height="9"  rx="2" fill={dark ? 'rgba(34,211,238,0.52)'  : 'rgba(8,145,178,0.45)'}/>
        <rect x="286" y="129" width="26" height="3.5" rx="1.5" fill={lnB}/>

        {/* 바 차트 영역 */}
        <rect x="96"  y="152" width="162" height="90" rx="5" fill={dark ? 'rgba(255,255,255,0.03)' : 'rgba(37,99,235,0.03)'}/>
        <rect x="103" y="160" width="55"  height="4"  rx="2" fill={lnA}/>
        <rect x="108" y="199" width="14" height="28" rx="2" fill="#38BDF8" opacity={dark ? 0.60 : 0.50}/>
        <rect x="126" y="184" width="14" height="43" rx="2" fill="#A78BFA" opacity={dark ? 0.55 : 0.46}/>
        <rect x="144" y="192" width="14" height="35" rx="2" fill="#22D3EE" opacity={dark ? 0.57 : 0.48}/>
        <rect x="162" y="178" width="14" height="49" rx="2" fill="#38BDF8" opacity={dark ? 0.60 : 0.50}/>
        <rect x="180" y="189" width="14" height="38" rx="2" fill="#F59E0B" opacity={dark ? 0.55 : 0.46}/>
        <rect x="198" y="195" width="14" height="32" rx="2" fill="#A78BFA" opacity={dark ? 0.52 : 0.44}/>

        {/* 작업 목록 영역 */}
        <rect x="268" y="152" width="96" height="90" rx="5" fill={dark ? 'rgba(255,255,255,0.03)' : 'rgba(37,99,235,0.03)'}/>
        <rect x="275" y="160" width="40" height="4"  rx="2" fill={lnA}/>
        <rect x="275" y="172" width="80" height="13" rx="3" fill={dark ? 'rgba(56,189,248,0.15)'  : 'rgba(37,99,235,0.10)'}/>
        <rect x="275" y="190" width="80" height="13" rx="3" fill={dark ? 'rgba(167,139,250,0.13)' : 'rgba(124,58,237,0.08)'}/>
        <rect x="275" y="208" width="80" height="13" rx="3" fill={dark ? 'rgba(34,211,238,0.12)'  : 'rgba(8,145,178,0.08)'}/>
        <rect x="275" y="226" width="58" height="11" rx="3" fill={dark ? 'rgba(245,158,11,0.12)'  : 'rgba(180,83,9,0.08)'}/>

        {/* 모니터 스탠드 */}
        <rect x="214" y="253" width="32" height="12" rx="0" fill={dark ? 'rgba(51,65,85,0.58)'  : 'rgba(203,213,225,0.78)'}/>
        <rect x="192" y="265" width="76" height="5"  rx="2.5" fill={dark ? 'rgba(51,65,85,0.46)' : 'rgba(203,213,225,0.66)'}/>

        {/* ── 프로세스 노드 4개 (궤도 극점) ── */}

        {/* 01 조사 — 상단 cx=230 cy=42 */}
        <circle cx="230" cy="42" r="29" fill={pFill} stroke="#A78BFA" strokeWidth="2.0"/>
        <circle cx="230" cy="42" r="37" fill="none" stroke="#A78BFA" strokeWidth="0.6" opacity={dark ? 0.32 : 0.20}/>
        <text x="230" y="37" textAnchor="middle" fontSize="9"  fontWeight="700" fill="#A78BFA"                       fontFamily="Pretendard, 'Apple SD Gothic Neo', sans-serif">01</text>
        <text x="230" y="52" textAnchor="middle" fontSize="13" fontWeight="700" fill={dark ? '#C4B5FD' : '#7C3AED'} fontFamily="Pretendard, 'Apple SD Gothic Neo', sans-serif">조사</text>

        {/* 02 설계 — 우측 cx=425 cy=195 */}
        <circle cx="425" cy="195" r="29" fill={pFill} stroke="#38BDF8" strokeWidth="2.0"/>
        <circle cx="425" cy="195" r="37" fill="none" stroke="#38BDF8" strokeWidth="0.6" opacity={dark ? 0.32 : 0.20}/>
        <text x="425" y="190" textAnchor="middle" fontSize="9"  fontWeight="700" fill="#38BDF8"                       fontFamily="Pretendard, 'Apple SD Gothic Neo', sans-serif">02</text>
        <text x="425" y="205" textAnchor="middle" fontSize="13" fontWeight="700" fill={dark ? '#7DD3FC' : '#2563EB'} fontFamily="Pretendard, 'Apple SD Gothic Neo', sans-serif">설계</text>

        {/* 03 구현 — 하단 cx=230 cy=348 */}
        <circle cx="230" cy="348" r="29" fill={pFill} stroke="#22D3EE" strokeWidth="2.0"/>
        <circle cx="230" cy="348" r="37" fill="none" stroke="#22D3EE" strokeWidth="0.6" opacity={dark ? 0.32 : 0.20}/>
        <text x="230" y="343" textAnchor="middle" fontSize="9"  fontWeight="700" fill="#22D3EE"                       fontFamily="Pretendard, 'Apple SD Gothic Neo', sans-serif">03</text>
        <text x="230" y="358" textAnchor="middle" fontSize="13" fontWeight="700" fill={dark ? '#67E8F9' : '#0891B2'} fontFamily="Pretendard, 'Apple SD Gothic Neo', sans-serif">구현</text>

        {/* 04 개선 — 좌측 cx=35 cy=195 */}
        <circle cx="35" cy="195" r="29" fill={pFill} stroke="#F59E0B" strokeWidth="2.0"/>
        <circle cx="35" cy="195" r="37" fill="none" stroke="#F59E0B" strokeWidth="0.6" opacity={dark ? 0.32 : 0.20}/>
        <text x="35" y="190" textAnchor="middle" fontSize="9"  fontWeight="700" fill="#F59E0B"                        fontFamily="Pretendard, 'Apple SD Gothic Neo', sans-serif">04</text>
        <text x="35" y="205" textAnchor="middle" fontSize="13" fontWeight="700" fill={dark ? '#FCD34D' : '#D97706'}  fontFamily="Pretendard, 'Apple SD Gothic Neo', sans-serif">개선</text>

        {/* ── 떠 있는 UI 카드 (코너 장식) ── */}

        {/* 좌상단 */}
        <g opacity={dark ? 0.68 : 0.44}>
          <rect x="2"   y="34" width="68" height="46" rx="5" fill={cFill} stroke={oc1} strokeWidth="0.9"/>
          <rect x="8"   y="41" width="28" height="3.5" rx="1.5" fill={lnA}/>
          <rect x="8"   y="50" width="56" height="2.5" rx="1.2" fill={lnB}/>
          <rect x="8"   y="57" width="42" height="2.5" rx="1.2" fill={lnB}/>
          <circle cx="13" cy="70" r="2.5" fill="#38BDF8" opacity={dark ? 0.85 : 0.62}/>
          <circle cx="22" cy="70" r="2.5" fill="#A78BFA" opacity={dark ? 0.75 : 0.55}/>
          <circle cx="31" cy="70" r="2.5" fill="#F59E0B" opacity={dark ? 0.75 : 0.55}/>
        </g>

        {/* 우하단 */}
        <g opacity={dark ? 0.60 : 0.38}>
          <rect x="390" y="290" width="68" height="48" rx="5" fill={cFill} stroke={oc2} strokeWidth="0.9"/>
          <rect x="396" y="297" width="30" height="3.5" rx="1.5" fill={lnA}/>
          <rect x="396" y="306" width="56" height="2.5" rx="1.2" fill={lnB}/>
          <rect x="396" y="313" width="42" height="2.5" rx="1.2" fill={lnB}/>
          <rect x="396" y="321" width="35" height="12" rx="2" fill={dark ? 'rgba(56,189,248,0.20)'  : 'rgba(37,99,235,0.15)'}/>
          <rect x="434" y="324" width="18" height="9"  rx="2" fill={dark ? 'rgba(167,139,250,0.17)' : 'rgba(124,58,237,0.13)'}/>
        </g>
      </svg>
    </Box>
  );
};

const PortfolioStats = () => {
  const { aboutMeData } = usePortfolio();
  const [projectCount, setProjectCount] = useState(null);
  const [statsRef, isVisible] = useInViewOnce(0.1);

  useEffect(() => {
    supabase
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .eq('is_published', true)
      .then(({ count }) => setProjectCount(count ?? 0));
  }, []);

  const skillCount  = aboutMeData?.skills?.length ?? 0;
  const loaded      = projectCount !== null;
  const studyMonths = Math.floor(
    (Date.now() - new Date('2024-12-01').getTime()) / (1000 * 60 * 60 * 24 * 30.44),
  );

  const projectNum = useCountUp(projectCount ?? 0, 1000, isVisible && loaded);
  const skillNum   = useCountUp(skillCount,        1000, isVisible);
  const studyNum   = useCountUp(studyMonths,         800, isVisible);

  const stats = [
    { label: '진행 프로젝트', value: loaded ? projectNum : '—', suffix: loaded ? '개' : '' },
    { label: '활용 기술',     value: skillNum, suffix: '개' },
    { label: '학습 기간',     value: studyNum, suffix: '개월+' },
  ];

  return (
    <Box
      ref={statsRef}
      sx={(theme) => ({
        display: 'flex',
        gap: { xs: 3, sm: 4 },
        mt: 3,
        pt: 2.5,
        borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.15)' : '#E2E8F0'}`,
        justifyContent: { xs: 'center', md: 'flex-start' },
      })}
    >
      {stats.map(({ label, value, suffix }) => (
        <Box key={label} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <Typography
            component="p"
            sx={{
              color: 'primary.main',
              fontWeight: 800,
              fontSize: { xs: '1.4rem', md: '1.625rem' },
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {value}{suffix}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 500, mt: 0.5, display: 'block', fontSize: '0.7rem' }}
          >
            {label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const HeroSection = () => {
  return (
    <Box
      component="section"
      id="home"
      aria-label="소개"
      sx={(theme) => ({
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 'auto', md: '90vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: { xs: 8, sm: 10, md: 6 },
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0F172A 0%, #0D1B2A 60%, #111827 100%)'
          : 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 60%, #FFFFFF 100%)',
        '@keyframes fadeInUp': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        '@keyframes bounceDown': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(7px)' },
        },
        '@media (prefers-reduced-motion: reduce)': {
          '& *': { animationDuration: '0.01ms !important', transitionDuration: '0.01ms !important' },
        },
      })}
    >
      {/* 별 배경 */}
      <StarField count={48} />

      {/* Gradient blob 1 - 우측 상단 */}
      <Box
        aria-hidden="true"
        sx={(theme) => ({
          position: 'absolute',
          top: '-12%',
          right: '-6%',
          width: { xs: 260, md: 500 },
          height: { xs: 260, md: 500 },
          borderRadius: '50%',
          background: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle, rgba(56,189,248,0.10) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'blur(48px)',
        })}
      />

      {/* Gradient blob 2 - 좌측 하단 */}
      <Box
        aria-hidden="true"
        sx={(theme) => ({
          position: 'absolute',
          bottom: '-8%',
          left: '-6%',
          width: { xs: 200, md: 360 },
          height: { xs: 200, md: 360 },
          borderRadius: '50%',
          background: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'blur(48px)',
        })}
      />

      {/* SVG Orbit arc 장식 */}
      <Box
        component="svg"
        viewBox="0 0 800 500"
        aria-hidden="true"
        sx={(theme) => ({
          position: 'absolute',
          top: '-5%',
          right: '-10%',
          width: { xs: 300, md: 600 },
          height: 'auto',
          opacity: theme.palette.mode === 'dark' ? 0.12 : 0.06,
          zIndex: 0,
          pointerEvents: 'none',
        })}
      >
        <ellipse cx="400" cy="250" rx="360" ry="180" fill="none" stroke="#38BDF8" strokeWidth="1" />
        <ellipse cx="400" cy="250" rx="260" ry="130" fill="none" stroke="#7C3AED" strokeWidth="0.8" strokeDasharray="6 8" />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Grid container spacing={{ xs: 5, md: 8 }} sx={{ alignItems: 'center' }}>

          {/* 왼쪽: 텍스트 */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                textAlign: { xs: 'center', md: 'left' },
                animation: 'fadeInUp 0.6s ease both',
              }}
            >
              <Chip
                label="UX/UI 디자인 · 화면 설계 · 웹 구현 · AI 도구 활용"
                sx={(theme) => ({
                  bgcolor: theme.palette.mode === 'dark'
                    ? 'rgba(56,189,248,0.1)'
                    : 'rgba(37,99,235,0.08)',
                  color: 'primary.main',
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'dark'
                    ? 'rgba(56,189,248,0.22)'
                    : 'rgba(37,99,235,0.22)',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  mb: { xs: 2.5, md: 3 },
                  height: 30,
                  borderRadius: '999px',
                })}
              />

              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.85rem', sm: '2.4rem', md: '2.9rem', lg: '3.25rem' },
                  lineHeight: { xs: 1.25, md: 1.2 },
                  letterSpacing: '-0.02em',
                  color: 'text.primary',
                  mb: 1.5,
                }}
              >
                사용자의 흐름을 설계하고,{' '}
                <Box
                  component="span"
                  sx={(theme) => ({
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  })}
                >
                  웹으로 구현합니다.
                </Box>
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  mb: { xs: 2.5, md: 3 },
                }}
              >
                UX/UI 디자인 · 웹 퍼블리싱 학습자{' '}
                <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>
                  김도한
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.85,
                  maxWidth: { xs: '100%', md: 500 },
                  mx: { xs: 'auto', md: 0 },
                  mb: { xs: 3.5, md: 4.5 },
                  fontSize: { xs: '0.9rem', md: '0.975rem' },
                }}
              >
                Figma 기반 UI 설계, 앱 리디자인, AI 도구를 활용한 웹 프로토타입 제작을 중심으로
                작업하는 김도한의 포트폴리오입니다.
              </Typography>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent={{ xs: 'center', md: 'flex-start' }}
                sx={{ mb: 1.5 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => scrollToSection('projects')}
                  aria-label="프로젝트 섹션으로 이동"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    px: 3.5,
                    minHeight: 50,
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    whiteSpace: 'nowrap',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
                    },
                    '&:active': { transform: 'translateY(0)' },
                    '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
                  }}
                >
                  프로젝트 보기
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<EmailIcon />}
                  onClick={() => scrollToSection('contact')}
                  aria-label="연락처 섹션으로 이동"
                  sx={(theme) => ({
                    color: 'primary.main',
                    borderColor: theme.palette.mode === 'dark'
                      ? 'rgba(56,189,248,0.4)'
                      : 'rgba(37,99,235,0.35)',
                    px: 3.5,
                    minHeight: 50,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    whiteSpace: 'nowrap',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.07)' : 'rgba(37,99,235,0.05)',
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                    },
                    '&:active': { transform: 'translateY(0)' },
                    '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
                  })}
                >
                  연락하기
                </Button>
              </Stack>

              {/* PDF 준비 중 버튼 */}
              <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 2.5 }}>
                <Button
                  disabled
                  size="small"
                  startIcon={<PictureAsPdfIcon sx={{ fontSize: '0.8rem !important' }} />}
                  aria-label="PDF 포트폴리오 준비 중"
                  sx={(theme) => ({
                    color: 'text.disabled',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    px: 2,
                    minHeight: 32,
                    whiteSpace: 'nowrap',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.14)' : '#E2E8F0'}`,
                    borderRadius: 2,
                    '&.Mui-disabled': {
                      color: 'text.disabled',
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.12)' : '#EDF2F7',
                    },
                  })}
                >
                  PDF Portfolio — Coming Soon
                </Button>
              </Box>

              <PortfolioStats />
            </Box>
          </Grid>

          {/* 오른쪽: 우주형 UI 일러스트 + 프로세스 다이어그램 */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              aria-hidden="true"
              sx={{ animation: 'fadeInUp 0.6s ease 0.18s both' }}
            >
              <CosmicHeroIllustration />
            </Box>
          </Grid>
        </Grid>

        {/* 스크롤 유도 */}
        <Box
          component="button"
          onClick={() => window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' })}
          aria-label="아래 섹션으로 스크롤"
          sx={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            display: 'block',
            mx: 'auto',
            pt: { xs: 5, md: 6 },
            color: 'text.disabled',
            animation: 'bounceDown 1.8s ease-in-out infinite',
            transition: 'color 0.2s ease',
            '&:hover': { color: 'primary.main' },
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '4px',
              borderRadius: '4px',
            },
          }}
        >
          <KeyboardArrowDownIcon sx={{ fontSize: 28 }} />
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
