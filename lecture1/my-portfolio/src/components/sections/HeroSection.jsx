import { Box, Container, Typography, Button, Grid, Stack } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import { scrollToSection } from '../../hooks/useScrollNav';
import StarField from '../common/StarField';

const STRENGTH_KEYWORDS = ['화면 설계', '사용자 흐름 개선', 'React 웹 구현', 'AI 도구 활용'];

/* 프로세스 노드 순차 glow pulse — 01 조사 → 02 설계 → 03 구현 → 04 개선 순서로
 * animationDelay만 다르게 주어 같은 keyframes를 노드마다 다른 타이밍에 재생한다. */
const processPulse = keyframes`
  0%, 100% { filter: drop-shadow(0 0 0px currentColor); transform: scale(1); }
  8%       { filter: drop-shadow(0 0 8px currentColor) drop-shadow(0 0 16px currentColor); transform: scale(1.02); }
  24%      { filter: drop-shadow(0 0 8px currentColor) drop-shadow(0 0 16px currentColor); transform: scale(1.02); }
  36%      { filter: drop-shadow(0 0 0px currentColor); transform: scale(1); }
`;

const NODE_ANIMATION = `${processPulse} 5s ease-in-out infinite`;

const CosmicHeroIllustration = () => {
  const oc1    = 'rgba(56,189,248,0.52)';
  const oc2    = 'rgba(167,139,250,0.42)';
  const star   = 'rgba(255,255,255,0.72)';
  const starB  = 'rgba(255,255,255,0.48)';
  const gx     = 'rgba(56,189,248,0.16)';
  const pFill  = 'rgba(15,23,42,0.96)';
  const pStroke= 'rgba(56,189,248,0.68)';
  const tBar   = 'rgba(30,41,59,0.98)';
  const lnA    = 'rgba(255,255,255,0.22)';
  const lnB    = 'rgba(255,255,255,0.11)';
  const cFill  = 'rgba(20,30,50,0.88)';

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg
        viewBox="-40 -30 540 460"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="UI 설계 프로세스 일러스트 — 조사, 설계, 구현, 개선"
        style={{ width: '100%', maxWidth: 500, height: 'auto', display: 'block', overflow: 'visible' }}
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
        <circle cx="100" cy="76" r="4" fill="#EF4444" opacity="0.75"/>
        <circle cx="115" cy="76" r="4" fill="#F59E0B" opacity="0.75"/>
        <circle cx="130" cy="76" r="4" fill="#22C55E" opacity="0.75"/>
        {/* URL 바 */}
        <rect x="148" y="68" width="88" height="14" rx="3" fill="rgba(255,255,255,0.06)"/>
        <rect x="155" y="73" width="55" height="4"  rx="2" fill={lnB}/>

        {/* KPI 카드 1 — 청록 */}
        <rect x="96"  y="96" width="82" height="46" rx="5" fill="rgba(56,189,248,0.11)"/>
        <rect x="104" y="104" width="32" height="4"  rx="2" fill={lnB}/>
        <rect x="104" y="113" width="60" height="9"  rx="2" fill="rgba(56,189,248,0.52)"/>
        <rect x="104" y="129" width="26" height="3.5" rx="1.5" fill={lnB}/>

        {/* KPI 카드 2 — 보라 */}
        <rect x="187" y="96" width="82" height="46" rx="5" fill="rgba(167,139,250,0.11)"/>
        <rect x="195" y="104" width="32" height="4"  rx="2" fill={lnB}/>
        <rect x="195" y="113" width="60" height="9"  rx="2" fill="rgba(167,139,250,0.52)"/>
        <rect x="195" y="129" width="26" height="3.5" rx="1.5" fill={lnB}/>

        {/* KPI 카드 3 — 시안 */}
        <rect x="278" y="96" width="82" height="46" rx="5" fill="rgba(34,211,238,0.11)"/>
        <rect x="286" y="104" width="32" height="4"  rx="2" fill={lnB}/>
        <rect x="286" y="113" width="60" height="9"  rx="2" fill="rgba(34,211,238,0.52)"/>
        <rect x="286" y="129" width="26" height="3.5" rx="1.5" fill={lnB}/>

        {/* 바 차트 영역 */}
        <rect x="96"  y="152" width="162" height="90" rx="5" fill="rgba(255,255,255,0.03)"/>
        <rect x="103" y="160" width="55"  height="4"  rx="2" fill={lnA}/>
        <rect x="108" y="199" width="14" height="28" rx="2" fill="#38BDF8" opacity="0.60"/>
        <rect x="126" y="184" width="14" height="43" rx="2" fill="#A78BFA" opacity="0.55"/>
        <rect x="144" y="192" width="14" height="35" rx="2" fill="#22D3EE" opacity="0.57"/>
        <rect x="162" y="178" width="14" height="49" rx="2" fill="#38BDF8" opacity="0.60"/>
        <rect x="180" y="189" width="14" height="38" rx="2" fill="#F59E0B" opacity="0.55"/>
        <rect x="198" y="195" width="14" height="32" rx="2" fill="#A78BFA" opacity="0.52"/>

        {/* 작업 목록 영역 */}
        <rect x="268" y="152" width="96" height="90" rx="5" fill="rgba(255,255,255,0.03)"/>
        <rect x="275" y="160" width="40" height="4"  rx="2" fill={lnA}/>
        <rect x="275" y="172" width="80" height="13" rx="3" fill="rgba(56,189,248,0.15)"/>
        <rect x="275" y="190" width="80" height="13" rx="3" fill="rgba(167,139,250,0.13)"/>
        <rect x="275" y="208" width="80" height="13" rx="3" fill="rgba(34,211,238,0.12)"/>
        <rect x="275" y="226" width="58" height="11" rx="3" fill="rgba(245,158,11,0.12)"/>

        {/* 모니터 스탠드 */}
        <rect x="214" y="253" width="32" height="12" rx="0" fill="rgba(51,65,85,0.58)"/>
        <rect x="192" y="265" width="76" height="5"  rx="2.5" fill="rgba(51,65,85,0.46)"/>

        {/* ── 프로세스 노드 4개 (궤도 극점) ── */}

        {/* 01 조사 — 상단 cx=230 cy=42 */}
        <Box component="g" sx={{ color: '#A78BFA', animation: NODE_ANIMATION, animationDelay: '0s', transformBox: 'fill-box', transformOrigin: 'center' }}>
          <circle cx="230" cy="42" r="29" fill={pFill} stroke="#A78BFA" strokeWidth="2.0"/>
          <circle cx="230" cy="42" r="37" fill="none" stroke="#A78BFA" strokeWidth="0.6" opacity="0.32"/>
          <text x="230" y="37" textAnchor="middle" fontSize="9"  fontWeight="700" fill="#A78BFA"  fontFamily="Pretendard, 'Apple SD Gothic Neo', sans-serif">01</text>
          <text x="230" y="52" textAnchor="middle" fontSize="13" fontWeight="700" fill="#C4B5FD" fontFamily="Pretendard, 'Apple SD Gothic Neo', sans-serif">조사</text>
        </Box>

        {/* 02 설계 — 우측 cx=425 cy=195 */}
        <Box component="g" sx={{ color: '#38BDF8', animation: NODE_ANIMATION, animationDelay: '1.2s', transformBox: 'fill-box', transformOrigin: 'center' }}>
          <circle cx="425" cy="195" r="29" fill={pFill} stroke="#38BDF8" strokeWidth="2.0"/>
          <circle cx="425" cy="195" r="37" fill="none" stroke="#38BDF8" strokeWidth="0.6" opacity="0.32"/>
          <text x="425" y="190" textAnchor="middle" fontSize="9"  fontWeight="700" fill="#38BDF8" fontFamily="Pretendard, 'Apple SD Gothic Neo', sans-serif">02</text>
          <text x="425" y="205" textAnchor="middle" fontSize="13" fontWeight="700" fill="#7DD3FC" fontFamily="Pretendard, 'Apple SD Gothic Neo', sans-serif">설계</text>
        </Box>

        {/* 03 구현 — 하단 cx=230 cy=348 */}
        <Box component="g" sx={{ color: '#22D3EE', animation: NODE_ANIMATION, animationDelay: '2.4s', transformBox: 'fill-box', transformOrigin: 'center' }}>
          <circle cx="230" cy="348" r="29" fill={pFill} stroke="#22D3EE" strokeWidth="2.0"/>
          <circle cx="230" cy="348" r="37" fill="none" stroke="#22D3EE" strokeWidth="0.6" opacity="0.32"/>
          <text x="230" y="343" textAnchor="middle" fontSize="9"  fontWeight="700" fill="#22D3EE" fontFamily="Pretendard, 'Apple SD Gothic Neo', sans-serif">03</text>
          <text x="230" y="358" textAnchor="middle" fontSize="13" fontWeight="700" fill="#67E8F9" fontFamily="Pretendard, 'Apple SD Gothic Neo', sans-serif">구현</text>
        </Box>

        {/* 04 개선 — 좌측 cx=35 cy=195 */}
        <Box component="g" sx={{ color: '#A78BFA', animation: NODE_ANIMATION, animationDelay: '3.6s', transformBox: 'fill-box', transformOrigin: 'center' }}>
          <circle cx="35" cy="195" r="29" fill={pFill} stroke="#60A5FA" strokeWidth="2.0"/>
          <circle cx="35" cy="195" r="37" fill="none" stroke="#60A5FA" strokeWidth="0.6" opacity="0.32"/>
          <text x="35" y="190" textAnchor="middle" fontSize="9"  fontWeight="700" fill="#60A5FA"  fontFamily="Pretendard, 'Apple SD Gothic Neo', sans-serif">04</text>
          <text x="35" y="205" textAnchor="middle" fontSize="13" fontWeight="700" fill="#93C5FD"  fontFamily="Pretendard, 'Apple SD Gothic Neo', sans-serif">개선</text>
        </Box>

        {/* ── 떠 있는 UI 카드 (코너 장식) ── */}

        {/* 좌상단 */}
        <g opacity="0.68">
          <rect x="2"   y="34" width="68" height="46" rx="5" fill={cFill} stroke={oc1} strokeWidth="0.9"/>
          <rect x="8"   y="41" width="28" height="3.5" rx="1.5" fill={lnA}/>
          <rect x="8"   y="50" width="56" height="2.5" rx="1.2" fill={lnB}/>
          <rect x="8"   y="57" width="42" height="2.5" rx="1.2" fill={lnB}/>
          <circle cx="13" cy="70" r="2.5" fill="#38BDF8" opacity="0.85"/>
          <circle cx="22" cy="70" r="2.5" fill="#A78BFA" opacity="0.75"/>
          <circle cx="31" cy="70" r="2.5" fill="#818CF8" opacity="0.75"/>
        </g>

        {/* 우하단 */}
        <g opacity="0.60">
          <rect x="390" y="290" width="68" height="48" rx="5" fill={cFill} stroke={oc2} strokeWidth="0.9"/>
          <rect x="396" y="297" width="30" height="3.5" rx="1.5" fill={lnA}/>
          <rect x="396" y="306" width="56" height="2.5" rx="1.2" fill={lnB}/>
          <rect x="396" y="313" width="42" height="2.5" rx="1.2" fill={lnB}/>
          <rect x="396" y="321" width="35" height="12" rx="2" fill="rgba(56,189,248,0.20)"/>
          <rect x="434" y="324" width="18" height="9"  rx="2" fill="rgba(167,139,250,0.17)"/>
        </g>
      </svg>
    </Box>
  );
};

const HeroSection = () => {
  return (
    <Box
      component="section"
      id="home"
      aria-label="소개"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 'auto', md: '90vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: { xs: 8, sm: 10, md: 6 },
        bgcolor: 'background.default',
        background: 'radial-gradient(ellipse 120% 80% at 50% -10%, rgba(56,189,248,0.05) 0%, transparent 55%), #0B1020',
        '@keyframes fadeInUp': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        '@media (prefers-reduced-motion: reduce)': {
          '& *': { animationDuration: '0.01ms !important', transitionDuration: '0.01ms !important' },
        },
      }}
    >
      {/* 은하수 밴드 — 굵은 stroke + blur로 은은한 성운 띠 표현 */}
      <Box
        component="svg"
        viewBox="0 0 1200 700"
        preserveAspectRatio="none"
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.55,
          filter: 'blur(34px)',
        }}
      >
        <path d="M -60 620 Q 360 700 660 480 T 1260 160" fill="none" stroke="#38BDF8" strokeWidth="90" strokeLinecap="round" opacity="0.22" />
        <path d="M -60 660 Q 400 720 700 540 T 1260 240" fill="none" stroke="#A78BFA" strokeWidth="60" strokeLinecap="round" opacity="0.18" />
      </Box>

      {/* 은하수 곡선 — 선명한 라인 레이어 (Hero 전체 폭) */}
      <Box
        component="svg"
        viewBox="0 0 1200 700"
        preserveAspectRatio="none"
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.3,
        }}
      >
        <path d="M -40 560 Q 340 660 620 460 T 1240 180" fill="none" stroke="#38BDF8" strokeWidth="2.5" />
        <path d="M -40 620 Q 380 700 660 520 T 1240 260" fill="none" stroke="#A78BFA" strokeWidth="1.6" opacity="0.7" />
      </Box>

      {/* 별 배경 */}
      <StarField count={72} />

      {/* Gradient blob 1 - 우측 상단 */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: '-14%',
          right: '-8%',
          width: { xs: 300, md: 580 },
          height: { xs: 300, md: 580 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.16) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'blur(52px)',
        }}
      />

      {/* Gradient blob 2 - 좌측 하단 */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-8%',
          width: { xs: 230, md: 420 },
          height: { xs: 230, md: 420 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'blur(52px)',
        }}
      />

      {/* SVG Orbit arc 장식 */}
      <Box
        component="svg"
        viewBox="0 0 800 500"
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: '-5%',
          right: '-10%',
          width: { xs: 300, md: 600 },
          height: 'auto',
          opacity: 0.12,
          zIndex: 0,
          pointerEvents: 'none',
        }}
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
              {/* 강점 키워드 — 클릭 불가 텍스트 나열 (버튼처럼 보이지 않게) */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  alignItems: 'center',
                  gap: 0,
                  mb: { xs: 2, md: 2.5 },
                }}
              >
                {STRENGTH_KEYWORDS.map((keyword, i) => (
                  <Box key={keyword} sx={{ display: 'flex', alignItems: 'center' }}>
                    {i > 0 && (
                      <Typography component="span" sx={{ color: 'text.disabled', mx: 1.2, fontSize: '0.78rem' }}>·</Typography>
                    )}
                    <Typography
                      component="span"
                      sx={{
                        color: 'primary.main',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        letterSpacing: '0.02em',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {keyword}
                    </Typography>
                  </Box>
                ))}
              </Box>

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
                Figma로 설계하고 React로 구현하는{' '}
                <Box
                  component="span"
                  sx={{
                    display: 'block',
                    background: 'linear-gradient(90deg, #38BDF8 0%, #A78BFA 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  UX/UI · 웹 퍼블리싱 포트폴리오
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
                사용자 흐름을 정리하고, 화면 설계부터 웹 구현까지 이어가는
                신입 UX/UI·웹 퍼블리싱 포트폴리오입니다.
              </Typography>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent={{ xs: 'center', md: 'flex-start' }}
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
                  sx={{
                    color: 'primary.main',
                    borderColor: 'rgba(56,189,248,0.4)',
                    px: 3.5,
                    minHeight: 50,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    whiteSpace: 'nowrap',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(56,189,248,0.07)',
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                    },
                    '&:active': { transform: 'translateY(0)' },
                    '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
                  }}
                >
                  연락하기
                </Button>
              </Stack>
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
      </Container>
    </Box>
  );
};

export default HeroSection;
