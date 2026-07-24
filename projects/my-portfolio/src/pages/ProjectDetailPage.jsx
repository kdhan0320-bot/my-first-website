import { useParams, useNavigate, useLocation, Navigate, Link as RouterLink } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GitHubIcon from '@mui/icons-material/GitHub';
import { ALL_PROJECTS } from '../data/projectsData';
import { PROJECT_DETAIL_READY } from '../data/portfolioMeta';
import ProjectMediaStage from '../components/ui/ProjectMediaStage';
import ActionIcon from '../components/ui/ActionIcon';
import DMark from '../components/brand/DMark';
import QhdAmbientSignal from '../components/ui/QhdAmbientSignal';
import QhdSectionIndex from '../components/ui/QhdSectionIndex';
import { FONT_MONO, HUMAN_SIGNAL, ULTRAWIDE_CONTENT_MAX_WIDTH, HOME_WIDE_MAX_WIDTH, HOME_READING_MAX_WIDTH } from '../theme';

const BASE = import.meta.env.BASE_URL;
const mediaUrl = (path) => `${BASE}${path}`;

/* Human Signal Phase 5D-F2: Figma Detail READY(file 53Ppn2hIgrvs9Jra3eejFs,
 * 2560=201:2 / 1440=196:5 / 1024=377:254 / 390=202:2)는 "HS/Detail Template"라는
 * 이름 그대로 교체용 템플릿 프레임이라 문구는 전부 placeholder다("프로젝트
 * 제목", "판단 01/02/03" 등). 이 페이지는 그 구조(Hero split → navy Context
 * Problem/Goal card → 교차형 Key Decisions row → primary/secondary Main
 * Screens → navy Responsive & Scope + 내부 AI Collaboration → D mark Result
 * & Limit closing)만 복구하고, 실제 문구는 전부 `PROJECT_DETAIL_READY`
 * (portfolioMeta.js)의 프로젝트별 실제 데이터를 쓴다. 섹션 큰 제목만 Figma
 * 템플릿 프레이밍을 그대로 쓰는 고정 UI chrome이다(프로젝트별 사실이 아닌
 * 일반 안내 문구). */
const SLUG_TO_ID = {
  jobflow: 'jobflow',
  'bus-arrival': 'bus-arrival-app',
  'feedback-hub': 'feedback-hub',
};
const SLUG_ORDER = ['jobflow', 'bus-arrival', 'feedback-hub'];
const cycleSlug = (slug, dir) => {
  const i = SLUG_ORDER.indexOf(slug);
  return SLUG_ORDER[(i + dir + SLUG_ORDER.length) % SLUG_ORDER.length];
};

// Figma Responsive & Scope(199:6~17 등)의 390/768/1440/2560 breakpoint 카드 4개 —
// 실제 프로젝트별 수치가 아니라 React/MUI 반응형 웹 공통 규칙을 설명하는 고정 UI
// chrome이다(SectionHeading과 같은 성격). Bus(Figma prototype)에는 쓰지 않는다.
const BREAKPOINT_CARDS = [
  { width: '390px', rule: '390·430 핵심 행동 우선' },
  { width: '768px', rule: '768·820·1024 1열 전환' },
  { width: '1440px', rule: '1366·1440 교차 레이아웃' },
  { width: '2560px', rule: '1920·2560 확장 배경' },
];

const SPLIT_MQ = '@media (min-width:900px)';

const SHELL_SX = {
  px: { xs: 3, sm: 6, md: 8 }, maxWidth: { xl: ULTRAWIDE_CONTENT_MAX_WIDTH + 128 }, mx: 'auto',
  '@media (min-width:1920px)': { maxWidth: HOME_WIDE_MAX_WIDTH, px: 8 },
};
// 읽기 전용 문단(Context/Decisions/Scope/AI/Result)의 reading column — QHD에서도
// 한 줄이 과도하게 길어지지 않게 상한을 둔다.
const READING_SX = { maxWidth: { md: HOME_READING_MAX_WIDTH + 120 } };

const SectionLabel = ({ index, children, tone = 'onLight' }) => (
  <Typography sx={{
    fontFamily: FONT_MONO, fontSize: '0.75rem', letterSpacing: '0.06em', mb: 2,
    color: tone === 'onLight' ? HUMAN_SIGNAL.burntOrange : HUMAN_SIGNAL.brightOrangeOnDark,
  }}>
    {index ? `${index} / ` : ''}{children}
  </Typography>
);

// Figma의 큰 section statement — 페이지 chrome(고정 안내 문구)이며 프로젝트별
// 사실 데이터가 아니다. 프로젝트마다 결정 개수가 달라(2~3개) "세 가지"처럼
// 특정 개수를 못박는 표현은 쓰지 않는다.
const SectionHeading = ({ lines, tone = 'onLight' }) => (
  <Typography component="h2" sx={{
    fontWeight: 800, letterSpacing: '-0.02em', mb: { xs: 4, md: 5 },
    fontSize: { xs: '1.75rem', sm: '2.15rem', md: '2.6rem' },
    lineHeight: { xs: 1.25, md: 1.15 },
    color: tone === 'onLight' ? HUMAN_SIGNAL.inkNavy : HUMAN_SIGNAL.softWhite,
    '@media (min-width:1920px)': { fontSize: '3.1rem' },
  }}>
    {lines.map((line) => (
      <Box key={line} component="span" sx={{ display: 'block' }}>{line}</Box>
    ))}
  </Typography>
);

const FieldRow = ({ label, children, tone = 'onLight' }) => (
  <Typography sx={{ fontSize: '0.9375rem', color: tone === 'onLight' ? HUMAN_SIGNAL.inkText : HUMAN_SIGNAL.steelMist, lineHeight: 1.65, wordBreak: 'keep-all' }}>
    <Box component="span" sx={{ fontFamily: FONT_MONO, color: tone === 'onLight' ? HUMAN_SIGNAL.burntOrange : HUMAN_SIGNAL.brightOrangeOnDark, fontSize: '0.6875rem', letterSpacing: '0.04em', mr: 1 }}>
      {label}
    </Box>
    {children}
  </Typography>
);

const BulletList = ({ items, tone = 'onLight' }) => (
  <Box component="ul" sx={{ m: 0, pl: 2.25, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
    {items.map((item) => (
      <Typography key={item} component="li" sx={{
        fontSize: '0.875rem', lineHeight: 1.6, wordBreak: 'keep-all',
        color: tone === 'onLight' ? HUMAN_SIGNAL.inkText : HUMAN_SIGNAL.steelMist,
      }}>
        {item}
      </Typography>
    ))}
  </Box>
);

/* Bus는 Figma 프로토타입 모바일 화면 설계라 일반 웹 반응형 breakpoint 카드
 * 대신 "MOBILE PROTOTYPE / 360px"와 "RESPONSIVE: NOT APPLICABLE"을 명시한다
 * (지시서 3-C). JobFlow/Feedback Hub는 실제 React/MUI 반응형 웹이라
 * BREAKPOINT_CARDS(390/768/1440/2560) 4개 카드를 대신 보여준다. */
const ResponsiveNotApplicableField = () => (
  <Box>
    <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.brightOrangeOnDark, fontSize: '0.75rem', letterSpacing: '0.06em', mb: 1.5 }}>RESPONSIVE</Typography>
    <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.25rem', md: '1.5rem' }, color: HUMAN_SIGNAL.softWhite, lineHeight: 1.4, mb: 1.5 }}>
      NOT APPLICABLE
    </Typography>
    <Typography sx={{ fontSize: '0.9375rem', color: HUMAN_SIGNAL.steelMist, lineHeight: 1.7, wordBreak: 'keep-all' }}>
      MOBILE PROTOTYPE / 360px. 일반 웹 프로젝트의 390·768·1440·2560 반응형 대응이 아닙니다.
    </Typography>
  </Box>
);

/* Main Screens 카드 1개 — `large`면 Figma의 "Main Desktop Slot"(primary)처럼
 * 라벨을 조금 더 크게 보여준다. `extra`는 Feedback Hub 390 evidence처럼
 * 카드 하단에 controlled viewport 보조 증거를 붙일 때만 쓴다. */
const ScreenCard = ({ s, large = false, extra, sx }) => (
  <Box sx={sx}>
    <Box sx={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: s.media.aspectRatio ?? '16 / 10' }}>
      <ProjectMediaStage image={mediaUrl(s.media.src)} alt={s.media.alt} aspectRatio={s.media.aspectRatio ?? '16 / 10'} objectFit={s.media.objectFit ?? 'contain'} objectPosition={s.media.objectPosition ?? 'center'} />
    </Box>
    <Typography sx={{
      fontFamily: FONT_MONO, color: HUMAN_SIGNAL.inkNavy, fontWeight: 700, letterSpacing: '0.02em', mt: 1.5,
      fontSize: large ? { xs: '0.9375rem', md: '1rem' } : '0.8125rem',
    }}>
      {s.label}
    </Typography>
    {extra && (
      <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <Box sx={{ width: extra.frameWidth ?? 160, flexShrink: 0, aspectRatio: extra.aspectRatio }}>
          <ProjectMediaStage
            image={mediaUrl(extra.src)} alt={extra.alt}
            aspectRatio={extra.aspectRatio} objectFit={extra.objectFit} objectPosition={extra.objectPosition}
          />
        </Box>
        <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.inkText, fontSize: '0.6875rem', lineHeight: 1.5, pt: 0.5 }}>
          {extra.caption}
        </Typography>
      </Box>
    )}
  </Box>
);

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const id = SLUG_TO_ID[slug];
  const project = id ? ALL_PROJECTS.find((p) => p.id === id) : null;
  const ready = slug ? PROJECT_DETAIL_READY[slug] : null;

  // 존재하지 않는 slug, 데이터가 없는 프로젝트, Detail READY presentation 데이터가
  // 없는 경우 모두 가짜 페이지를 만들지 않고 전체 프로젝트 목록으로 돌려보낸다.
  if (!project || !ready) return <Navigate to="/projects" replace />;

  const { tools = [], liveUrl, githubUrl, figmaPrototypeUrl, categoryLabel } = project;

  // 스마트 back: 브라우저 history가 있으면(=Home/Projects에서 들어옴) 뒤로가기로
  // 스크롤 위치까지 보존, history가 없는 직접 URL 진입/새로고침이면 /projects로
  // 이동한다. location.key === 'default'는 React Router가 진입 시 history 항목이
  // 없을 때(직접 진입) 부여하는 값이다.
  const goBack = () => {
    if (location.key === 'default') navigate('/projects');
    else navigate(-1);
  };

  const nextSlug = cycleSlug(slug, 1);
  const nextProject = ALL_PROJECTS.find((p) => p.id === SLUG_TO_ID[nextSlug]);

  // AI Collaboration은 현재 로컬 프로젝트 데이터에 실제 aiContribution 필드가
  // 있을 때만 표시한다(지시서: 없다고 "AI를 안 썼다"고 단정하지도 않는다 —
  // 데이터가 없는 프로젝트는 이 섹션 자체를 만들지 않는다. Bus는 필드 자체가 없다).
  const hasAI = Boolean(project.detail.aiContribution);
  const implementationLine = (project.tech_stack ?? tools).join(' + ') || null;
  // JobFlow/Bus는 primary(첫 화면 크게) + secondary(나머지 작게) 위계, Feedback
  // Hub만 List/Detail을 같은 무게로 보여준다(portfolioMeta.js의 명시적 신호).
  const mainScreensEqual = ready.mainScreensLayout === 'equal';
  const secondaryScreens = ready.mainScreens.slice(1);

  // Figma Hero Meta/TYPE·ROLE·TOOLS·DATA 카드 4개(196:25~36 등) — 값이 있는
  // 필드만 표시한다. TYPE은 EvidenceBadges의 derivePlatform과 같은 판단 기준
  // (Figma 프로젝트인지 실제 React/MUI 웹인지)을 쓴다.
  const typeLabel = project.is_figma_project
    ? 'Figma Prototype'
    : tools.includes('React') ? 'Web (React/MUI)' : (tools.length ? 'Web' : null);
  const toolsShort = tools.length ? tools.slice(0, 3).join(' · ') : null;
  const metaFacts = [
    { label: 'TYPE', value: typeLabel },
    { label: 'ROLE', value: project.role || null },
    { label: 'TOOLS', value: toolsShort },
    { label: 'DATA', value: project.cardScope || null },
  ].filter((f) => f.value);

  return (
    <Box sx={{ bgcolor: HUMAN_SIGNAL.warmPaper, minHeight: '100vh' }}>
      {/* ── Detail Hero (split: 카피 왼쪽 / navy media stage 오른쪽, 390은 카피 →
       * CTA → media 순서로 자연스럽게 stack된다) ── */}
      <Box component="section" sx={{ position: 'relative', overflow: 'hidden', pt: { xs: 5, md: 7 }, pb: { xs: 5, md: 6 } }}>
        {/* 지시서 3-F3-3: Figma Hero(201:3)의 BG/Sage Halo는 y=-80(섹션 상단 위로
         * bleed, overflow:hidden에 실제로 잘림)에서 시작한다 — left는 Home Hero-left와
         * 동일한 공식(gutter offset 470px)을 그대로 유지해 기존 배치와 어긋나지
         * 않게 하고, top만 살짝 음수로 올려 Figma의 상단 bleed에 한 단계 더
         * 접근한다. */}
        <QhdAmbientSignal
          variant="hero-left"
          sx={{ left: `calc((100vw - ${HOME_WIDE_MAX_WIDTH}px) / 2 - 470px)`, top: -30 }}
        />
        <Box sx={{ ...SHELL_SX, position: 'relative' }}>
          <Box
            component="button"
            type="button"
            onClick={goBack}
            aria-label="전체 프로젝트 목록으로 이동"
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.75, mb: { xs: 3, md: 4 },
              bgcolor: 'transparent', border: 0, cursor: 'pointer', p: 0, minHeight: 44,
              fontFamily: FONT_MONO, fontSize: '0.75rem', color: HUMAN_SIGNAL.inkText, fontWeight: 600,
              '&:hover': { color: HUMAN_SIGNAL.burntOrange },
              '&:focus-visible': { outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`, outlineOffset: '3px' },
            }}
          >
            <ActionIcon variant="internal" sx={{ transform: 'rotate(180deg)' }} /> 전체 프로젝트
          </Box>

          <Box sx={{ [SPLIT_MQ]: { display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: { md: 6, xl: 9 }, alignItems: 'center' } }}>
            {/* 좌측 — 카피 + CTA */}
            <Box>
              <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.75rem', letterSpacing: '0.04em', mb: 1.5 }}>
                {categoryLabel}
              </Typography>
              <Typography component="h1" sx={{
                fontWeight: 750, fontSize: { xs: '2rem', sm: '2.6rem', md: '3.1rem' }, lineHeight: { xs: 1.22, md: 1.15 }, letterSpacing: '-0.02em',
                color: HUMAN_SIGNAL.inkNavy, mb: 2, '@media (min-width:1920px)': { fontSize: '4rem' },
              }}>
                {project.title}
              </Typography>
              <Typography sx={{
                color: HUMAN_SIGNAL.inkText, fontSize: { xs: '1.0625rem', md: '1.125rem' }, lineHeight: 1.7, mb: 3, maxWidth: 560,
                '@media (min-width:1920px)': { fontSize: '1.25rem' },
              }}>
                {ready.hero.summary}
              </Typography>

              {/* Figma Hero Meta/TYPE·ROLE·TOOLS·DATA 카드 4개(196:25~36) — 카피
               * 영역의 일부로 CTA 위에 온다(390은 2×2, 900px+는 한 줄 4개). */}
              {metaFacts.length > 0 && (
                <Box sx={{
                  display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5, mb: 3, maxWidth: 560,
                  [SPLIT_MQ]: { gridTemplateColumns: `repeat(${metaFacts.length}, 1fr)` },
                }}>
                  {metaFacts.map((f) => (
                    <Box key={f.label} sx={{ bgcolor: HUMAN_SIGNAL.softWhite, border: `1px solid ${HUMAN_SIGNAL.paperDeep}`, borderRadius: '14px', p: 1.75 }}>
                      <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.6875rem', letterSpacing: '0.06em', mb: 0.75 }}>
                        {f.label}
                      </Typography>
                      <Typography sx={{ fontSize: '0.8125rem', color: HUMAN_SIGNAL.inkNavy, lineHeight: 1.5, wordBreak: 'keep-all' }}>
                        {f.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {(liveUrl || githubUrl || figmaPrototypeUrl) && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {liveUrl && (
                    <Box component="a" href={liveUrl} target="_blank" rel="noopener noreferrer" aria-label="실행 화면 새 탭에서 열기"
                      sx={{
                        bgcolor: HUMAN_SIGNAL.inkNavy, color: HUMAN_SIGNAL.softWhite, height: 48, px: 2.5, borderRadius: '12px',
                        display: 'inline-flex', alignItems: 'center', gap: 1, textDecoration: 'none',
                        fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap',
                        '&:focus-visible': { outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`, outlineOffset: '3px' },
                      }}>
                      실행 화면 보기 <OpenInNewIcon sx={{ fontSize: '1rem' }} />
                    </Box>
                  )}
                  {figmaPrototypeUrl && (
                    <Box component="a" href={figmaPrototypeUrl} target="_blank" rel="noopener noreferrer" aria-label="Figma 화면 새 탭에서 열기"
                      sx={{
                        bgcolor: HUMAN_SIGNAL.inkNavy, color: HUMAN_SIGNAL.softWhite, height: 48, px: 2.5, borderRadius: '12px',
                        display: 'inline-flex', alignItems: 'center', gap: 1, textDecoration: 'none',
                        fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap',
                        '&:focus-visible': { outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`, outlineOffset: '3px' },
                      }}>
                      Figma 화면 보기 <OpenInNewIcon sx={{ fontSize: '1rem' }} />
                    </Box>
                  )}
                  {githubUrl && (
                    <Box component="a" href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub 새 탭에서 열기"
                      sx={{
                        bgcolor: 'transparent', color: HUMAN_SIGNAL.inkNavy, border: `1px solid ${HUMAN_SIGNAL.paperDeep}`, height: 48, px: 2.5, borderRadius: '12px',
                        display: 'inline-flex', alignItems: 'center', gap: 1, textDecoration: 'none',
                        fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap',
                        '&:hover': { borderColor: HUMAN_SIGNAL.inkNavy },
                        '&:focus-visible': { outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`, outlineOffset: '3px' },
                      }}>
                      <GitHubIcon sx={{ fontSize: '1rem' }} /> GitHub
                    </Box>
                  )}
                </Box>
              )}
            </Box>

            {/* 우측 — navy media stage(Figma "Hero Media Stage" 구조: 어두운 무대 위
             * 실제 evidence PNG 프레임 1~2장 + 하단 caption + 저대비 D mark). */}
            <Box sx={{ mt: { xs: 4, md: 0 } }}>
              <Box sx={{
                position: 'relative', overflow: 'hidden', bgcolor: HUMAN_SIGNAL.deepHarbor,
                borderRadius: '20px', p: { xs: 2, sm: 2.5, md: 3 },
              }}>
                <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 2 }}>
                  {ready.hero.media.map((m) => (
                    <Box key={m.src} sx={{
                      borderRadius: '14px', overflow: 'hidden',
                      flex: m.frameWidth ? '0 0 auto' : '1 1 260px',
                      width: m.frameWidth ?? undefined,
                      minWidth: m.frameWidth ? undefined : 220,
                    }}>
                      <Box sx={{ aspectRatio: m.aspectRatio ?? '16 / 10' }}>
                        <ProjectMediaStage
                          image={mediaUrl(m.src)} alt={m.alt} loading="eager"
                          aspectRatio={m.aspectRatio ?? '16 / 10'}
                          objectFit={m.objectFit ?? 'contain'}
                          objectPosition={m.objectPosition ?? 'center'}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Typography sx={{ position: 'relative', zIndex: 1, fontFamily: FONT_MONO, color: HUMAN_SIGNAL.steelMist, fontSize: '0.75rem', mt: 2 }}>
                  {ready.hero.mediaLabel}
                </Typography>
                <Box sx={{ position: 'absolute', right: -12, bottom: -12, width: 96, height: 96, opacity: 0.12, pointerEvents: 'none' }} aria-hidden="true">
                  <DMark size="100%" tone="onDark" sx={{ width: '100%', height: '100%' }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── 01 / Context — navy full-width + Problem/Goal card ── */}
      <Box component="section" sx={{ position: 'relative', overflow: 'hidden', bgcolor: HUMAN_SIGNAL.inkNavy, py: { xs: 6, md: 9 } }}>
        {/* Figma Context(201:51)의 BG/Orange Arc(y=360)·BG/D Watermark(y=300)는 620px
         * 섹션의 아래쪽 절반에 몰려 있다(원래 top:18%는 근사값으로 위쪽에 치우쳐
         * 있었다) — 기존 contact-left shape/scene은 그대로 두고 top만 조정한다. */}
        <QhdAmbientSignal
          variant="contact-left"
          sx={{ right: `calc((100vw - ${HOME_WIDE_MAX_WIDTH}px) / 2 - 40px)`, left: 'auto', top: '55%', width: 340 }}
        />
        <QhdSectionIndex id="context" index="01" label="CONTEXT / PROBLEM" side="left" indexTop="16%" labelTop="44%" indexOffset={502} labelOffset={436} indexColor={HUMAN_SIGNAL.softWhite} />
        <Box sx={{ ...SHELL_SX, position: 'relative' }}>
          <SectionLabel index="01" tone="onDark">CONTEXT</SectionLabel>
          <SectionHeading tone="onDark" lines={['무엇이 복잡했고,', '어떤 판단이 더 빨라졌는가']} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: { xs: 3, md: 4 } }}>
            <Box sx={{ bgcolor: HUMAN_SIGNAL.deepHarbor, borderRadius: '20px', p: { xs: 3, md: 4 } }}>
              <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.brightOrangeOnDark, fontSize: '0.6875rem', letterSpacing: '0.04em', mb: 2 }}>PROBLEM</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.375rem', md: '1.5rem' }, color: HUMAN_SIGNAL.softWhite, lineHeight: 1.45, letterSpacing: '-0.01em', wordBreak: 'keep-all' }}>
                {ready.context.problem}
              </Typography>
            </Box>
            <Box sx={{ position: 'relative', bgcolor: HUMAN_SIGNAL.softWhite, borderRadius: '20px', p: { xs: 3, md: 4 } }}>
              <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.6875rem', letterSpacing: '0.04em', mb: 2 }}>GOAL</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.375rem', md: '1.5rem' }, color: HUMAN_SIGNAL.inkNavy, lineHeight: 1.45, letterSpacing: '-0.01em', wordBreak: 'keep-all' }}>
                {ready.context.goal}
              </Typography>
              <Box aria-hidden="true" sx={{ position: 'absolute', right: 24, bottom: 24, display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                <Box sx={{ width: 18, height: 18, borderRadius: '6px', bgcolor: HUMAN_SIGNAL.mutedSage }} />
                <Box sx={{ width: 9, height: 9, borderRadius: '3px', bgcolor: HUMAN_SIGNAL.brightOrange }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── 02 / Key Decisions — 프로젝트별 2~3개, media/설명 교차형 full-width row ── */}
      <Box id="decisions" component="section" sx={{ position: 'relative', overflow: 'hidden', bgcolor: HUMAN_SIGNAL.warmPaper, py: { xs: 6, md: 9 }, scrollMarginTop: '96px' }}>
        <QhdSectionIndex id="decisions" index="02" label="DECISIONS / EVIDENCE" side="right" indexTop="7%" labelTop="18%" indexOffset={210} labelOffset={140} />
        <Box sx={{ ...SHELL_SX, position: 'relative' }}>
          <SectionLabel index="02">KEY DECISIONS</SectionLabel>
          <SectionHeading lines={['핵심 설계 판단을,', '화면 증거와 함께 보여줍니다.']} />
          {/* 지시서 3-F3-4: 이전 구현은 부모 flex의 gap과 각 항목의 pt가 같은 값으로
           * 중복 적용돼(예: md에서 56px+56px=112px) DECISION 사이 간격이 의도한
           * 값의 2배였다 — 부모 gap을 없애고 각 항목의 pt(+구분선)만으로 간격을
           * 준다(i===0은 pt:0이라 첫 항목 앞에는 여전히 간격이 없다). */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {ready.decisions.map((d, i) => (
              <Box key={d.title} sx={{
                display: 'flex', flexDirection: { xs: 'column', md: i % 2 === 0 ? 'row' : 'row-reverse' },
                alignItems: 'center', gap: { xs: 3, md: 5 },
                pt: i === 0 ? 0 : { xs: 5, md: 7 },
                borderTop: i === 0 ? 'none' : `1px solid ${HUMAN_SIGNAL.paperDeep}`,
              }}>
                <Box sx={{ flex: { md: '1 1 55%' }, width: '100%', borderRadius: '18px', overflow: 'hidden', aspectRatio: d.media.aspectRatio ?? '16 / 10' }}>
                  <ProjectMediaStage image={mediaUrl(d.media.src)} alt={d.media.alt} aspectRatio={d.media.aspectRatio ?? '16 / 10'} objectFit={d.media.objectFit ?? 'contain'} objectPosition={d.media.objectPosition ?? 'center'} />
                </Box>
                <Box sx={{ flex: { md: '1 1 45%' }, width: '100%', display: 'flex', flexDirection: 'column', gap: 1.75 }}>
                  <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.6875rem', letterSpacing: '0.04em' }}>
                    DECISION {String(i + 1).padStart(2, '0')}
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.375rem', md: '1.5rem' }, color: HUMAN_SIGNAL.inkNavy, lineHeight: 1.4, wordBreak: 'keep-all' }}>
                    {d.title}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <FieldRow label="선택">{d.choice}</FieldRow>
                    <FieldRow label="이유">{d.reason}</FieldRow>
                    <FieldRow label="검증">{d.verification}</FieldRow>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ── 03 / Main Screens — primary + secondary 위계(Feedback Hub만 동일 비중).
       * Figma(197:82/201:118)는 앞뒤 beige Key Decisions/navy Scope와 다른 Soft
       * White 배경 + border-radius를 쓴다 — 페이지 기본 배경(warmPaper)과 색이
       * 갈려 상하단 모서리가 둥근 독립 카드로 보인다(지시서 3-D). ── */}
      <Box id="screens" component="section" sx={{ position: 'relative', overflow: 'hidden', bgcolor: HUMAN_SIGNAL.softWhite, borderRadius: { xs: '20px', md: '24px' }, py: { xs: 6, md: 9 }, scrollMarginTop: '96px' }}>
        <QhdSectionIndex id="screens" index="03" label="SCREENS / PROOF" side="left" indexTop="14%" labelTop="37%" indexOffset={502} labelOffset={436} />
        <Box sx={{ ...SHELL_SX, position: 'relative' }}>
          <SectionLabel index="03">MAIN SCREENS</SectionLabel>
          <SectionHeading lines={['실제 화면을 크게 보여주고,', '설명은 짧게 남깁니다.']} />
          {/* 지시서 3-F3-1: Feedback Hub Main Screens는 Figma 기준 Post List/Post
           * Detail 2개여야 한다 — 이전에는 첫 카드에 responsiveEvidence(390px
           * 세로 캡처)를 extra로 붙여 시각적으로 세 번째 화면처럼 보이고 넓은
           * 빈 공간을 만들었다. 390px 확인 사실은 Responsive & Scope에 이미
           * 있으므로 여기서는 extra를 더 이상 전달하지 않는다(데이터 자체는
           * portfolioMeta.js에 그대로 남겨 evidence mapping을 유지한다). */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {mainScreensEqual ? (
              ready.mainScreens.map((s) => (
                <ScreenCard
                  key={s.label} s={s} large
                  sx={{ flex: { md: '1 1 0' } }}
                />
              ))
            ) : (
              <>
                <ScreenCard
                  s={ready.mainScreens[0]} large
                  sx={{ flex: { md: '1 1 60%' } }}
                />
                {secondaryScreens.length > 0 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: { md: '1 1 38%' } }}>
                    {secondaryScreens.map((s) => <ScreenCard key={s.label} s={s} />)}
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* ── 04 / Responsive & Scope — navy section, Bus는 N/A 카드, 나머지는
       * breakpoint 카드 + Actual/Demo·Static/Not Included 카드 + 조건부 내부
       * AI Collaboration 카드까지 한 섹션 안에 통합한다. ── */}
      <Box id="scope" component="section" sx={{ position: 'relative', overflow: 'hidden', bgcolor: HUMAN_SIGNAL.inkNavy, py: { xs: 6, md: 9 }, scrollMarginTop: '96px' }}>
        <QhdSectionIndex id="scope" index="04" label="SCOPE / READY" side="right" indexTop="14%" labelTop="34%" indexOffset={210} labelOffset={140} indexColor={HUMAN_SIGNAL.softWhite} />
        <Box sx={{ ...SHELL_SX, position: 'relative' }}>
          <SectionLabel index="04" tone="onDark">RESPONSIVE &amp; SCOPE</SectionLabel>
          <SectionHeading tone="onDark" lines={['반응형과 구현 범위를,', '같은 화면에서 구분합니다.']} />

          {ready.responsiveNotApplicable ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: implementationLine ? 'repeat(2, 1fr)' : '1fr' }, gap: 3, mb: { xs: 4, md: 5 } }}>
              <Box sx={{ bgcolor: HUMAN_SIGNAL.deepHarbor, borderRadius: '18px', p: { xs: 3, md: 4 } }}>
                <ResponsiveNotApplicableField />
              </Box>
              {implementationLine && (
                <Box sx={{ bgcolor: HUMAN_SIGNAL.deepHarbor, borderRadius: '18px', p: { xs: 3, md: 4 } }}>
                  <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.brightOrangeOnDark, fontSize: '0.75rem', letterSpacing: '0.06em', mb: 1.5 }}>IMPLEMENTATION</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.0625rem', md: '1.1875rem' }, color: HUMAN_SIGNAL.softWhite, lineHeight: 1.5, wordBreak: 'keep-all' }}>{implementationLine}</Typography>
                </Box>
              )}
            </Box>
          ) : (
            <>
              {/* Figma Responsive/390·768·1440·2560 카드 4개(199:6~17) 복구 —
               * JobFlow/Feedback Hub는 실제 React/MUI 반응형 웹이라 breakpoint별
               * 규칙을 그대로 보여준다. Figma는 2560(QHD) 카드만 Soft White로
               * 밝게 강조하고 나머지 3개는 Deep Harbor다(199:15~17) — 지시서
               * 3-F3-2에 따라 그 대비를 그대로 복구한다. */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: { xs: 2, md: 3 }, mb: { xs: 3, md: 4 } }}>
                {BREAKPOINT_CARDS.map((b) => {
                  const isQhd = b.width === '2560px';
                  return (
                    <Box key={b.width} sx={{ bgcolor: isQhd ? HUMAN_SIGNAL.softWhite : HUMAN_SIGNAL.deepHarbor, borderRadius: '16px', p: { xs: 2.25, md: 3 } }}>
                      <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.125rem', md: '1.25rem' }, color: isQhd ? HUMAN_SIGNAL.inkNavy : HUMAN_SIGNAL.softWhite, letterSpacing: '-0.01em', mb: 1 }}>
                        {b.width}
                      </Typography>
                      <Typography sx={{ fontSize: '0.8125rem', color: isQhd ? HUMAN_SIGNAL.inkText : HUMAN_SIGNAL.steelMist, lineHeight: 1.6, wordBreak: 'keep-all' }}>
                        {b.rule}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
              {implementationLine && (
                <Box sx={{ bgcolor: HUMAN_SIGNAL.deepHarbor, borderRadius: '18px', p: { xs: 3, md: 4 }, mb: { xs: 4, md: 5 } }}>
                  <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.brightOrangeOnDark, fontSize: '0.75rem', letterSpacing: '0.06em', mb: 1.5 }}>IMPLEMENTATION</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.0625rem', md: '1.1875rem' }, color: HUMAN_SIGNAL.softWhite, lineHeight: 1.5, wordBreak: 'keep-all' }}>{implementationLine}</Typography>
                </Box>
              )}
            </>
          )}

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: { xs: 4, md: 5 } }}>
            <Box sx={{ bgcolor: HUMAN_SIGNAL.softWhite, borderRadius: '18px', p: { xs: 3, md: 3.5 } }}>
              <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.deepSage, fontSize: '0.6875rem', letterSpacing: '0.04em', mb: 1.5 }}>ACTUAL</Typography>
              <BulletList items={ready.scope.actual} />
            </Box>
            <Box sx={{ bgcolor: HUMAN_SIGNAL.deepHarbor, borderRadius: '18px', p: { xs: 3, md: 3.5 } }}>
              <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.brightOrangeOnDark, fontSize: '0.6875rem', letterSpacing: '0.04em', mb: 1.5 }}>DEMO / STATIC</Typography>
              <BulletList items={ready.scope.demoStatic} tone="onDark" />
            </Box>
            <Box sx={{ bgcolor: HUMAN_SIGNAL.deepHarbor, borderRadius: '18px', p: { xs: 3, md: 3.5 } }}>
              <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.brightOrangeOnDark, fontSize: '0.6875rem', letterSpacing: '0.04em', mb: 1.5 }}>NOT INCLUDED</Typography>
              <BulletList items={ready.scope.notIncluded} tone="onDark" />
            </Box>
          </Box>

          {/* AI Collaboration — 실제 aiContribution 데이터가 있는 프로젝트만
           * 표시한다(Bus는 필드 자체가 없어 렌더되지 않는다). Figma처럼 별도
           * 섹션이 아니라 이 navy 섹션 안의 카드 1개로 통합한다. */}
          {hasAI && (
            <Box id="ai" sx={{ bgcolor: HUMAN_SIGNAL.deepHarbor, borderRadius: '20px', p: { xs: 3, md: 4 }, scrollMarginTop: '96px' }}>
              <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.brightOrangeOnDark, fontSize: '0.75rem', letterSpacing: '0.06em', mb: 3 }}>
                AI COLLABORATION
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: { xs: 3, md: 4 }, mb: 3 }}>
                <Box>
                  <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.mutedSage, fontSize: '0.6875rem', letterSpacing: '0.04em', mb: 1 }}>사용자</Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: HUMAN_SIGNAL.steelMist, lineHeight: 1.6 }}>요구사항 · 범위 · 디자인 선택 · 최종 판단</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.mutedSage, fontSize: '0.6875rem', letterSpacing: '0.04em', mb: 1 }}>AI</Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: HUMAN_SIGNAL.steelMist, lineHeight: 1.6 }}>초안 · 구현 보조 · 검사 보조</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.mutedSage, fontSize: '0.6875rem', letterSpacing: '0.04em', mb: 1 }}>검증</Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: HUMAN_SIGNAL.steelMist, lineHeight: 1.6 }}>diff · build · lint · responsive · browser QA</Typography>
                </Box>
              </Box>
              <Typography sx={{ fontSize: '0.9375rem', color: HUMAN_SIGNAL.softWhite, lineHeight: 1.7, wordBreak: 'keep-all', ...READING_SX }}>
                {project.detail.aiContribution}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* ── 05 / Result & Limit — D mark + closing heading + Done/Limit card + Next CTA ── */}
      <Box id="result" component="section" sx={{ position: 'relative', overflow: 'hidden', bgcolor: HUMAN_SIGNAL.warmPaper, py: { xs: 6, md: 9 }, scrollMarginTop: '96px' }}>
        <QhdSectionIndex id="result" index="05" label="RESULT / LIMIT" side="left" indexTop="18%" labelTop="45%" indexOffset={502} labelOffset={436} />
        <Box sx={{ ...SHELL_SX, position: 'relative' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, gap: { xs: 3, md: 5 }, mb: { xs: 4, md: 5 } }}>
            <Box aria-hidden="true" sx={{ width: { xs: 56, md: 84 }, height: { xs: 56, md: 84 }, flexShrink: 0 }}>
              <DMark size="100%" tone="onLight" sx={{ width: '100%', height: '100%' }} />
            </Box>
            <Box>
              <SectionLabel index="05">RESULT &amp; LIMIT</SectionLabel>
              <SectionHeading lines={['완료한 범위와 남은 한계를,', '같은 무게로 보여줍니다.']} />
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: { xs: 3, md: 4 }, mb: { xs: 4, md: 5 } }}>
            <Box sx={{ bgcolor: HUMAN_SIGNAL.softWhite, border: `1px solid ${HUMAN_SIGNAL.paperDeep}`, borderRadius: '18px', p: { xs: 3, md: 4 } }}>
              <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.6875rem', letterSpacing: '0.04em', mb: 1.5 }}>DONE</Typography>
              <Typography sx={{ color: HUMAN_SIGNAL.inkNavy, fontWeight: 600, fontSize: { xs: '1rem', md: '1.0625rem' }, lineHeight: 1.7, wordBreak: 'keep-all' }}>
                {ready.resultLimit.done}
              </Typography>
            </Box>
            <Box sx={{ bgcolor: HUMAN_SIGNAL.deepHarbor, borderRadius: '18px', p: { xs: 3, md: 4 } }}>
              <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.brightOrangeOnDark, fontSize: '0.6875rem', letterSpacing: '0.04em', mb: 1.5 }}>LIMIT</Typography>
              <Typography sx={{ color: HUMAN_SIGNAL.softWhite, fontWeight: 600, fontSize: { xs: '1rem', md: '1.0625rem' }, lineHeight: 1.7, wordBreak: 'keep-all' }}>
                {ready.resultLimit.limit}
              </Typography>
            </Box>
          </Box>

          <Box
            component={RouterLink} to={`/projects/${nextSlug}`}
            aria-label={`다음 프로젝트: ${nextProject?.title}`}
            sx={{
              bgcolor: HUMAN_SIGNAL.inkNavy, color: HUMAN_SIGNAL.softWhite, height: 56, px: 3, borderRadius: '14px',
              display: 'inline-flex', alignItems: 'center', gap: 1, textDecoration: 'none',
              fontWeight: 700, fontSize: '0.9375rem',
              '&:focus-visible': { outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`, outlineOffset: '3px' },
            }}
          >
            다음 프로젝트 <ActionIcon variant="internal" sx={{ color: HUMAN_SIGNAL.brightOrangeOnDark }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectDetailPage;
