import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { ALL_PROJECTS } from '../data/projectsData';
import { FONT_MONO, HUMAN_SIGNAL, ULTRAWIDE_CONTENT_MAX_WIDTH, HOME_WIDE_MAX_WIDTH } from '../theme';
import DMark from '../components/brand/DMark';
import RevealOnScroll from '../components/ui/RevealOnScroll';
import ActionIcon from '../components/ui/ActionIcon';
import { GITHUB_PROFILE_URL, CONTACT_EMAIL } from '../constants/site';

/* Human Signal Phase 3A: /projects를 Recruiter-grade Project Library로 재설계한다.
 * Home Phase 2F Hybrid와 같은 Human Signal 팔레트·SUIT을 쓰되 Home 화면을 복제하지
 * 않는다 — 이 페이지의 역할은 "빠른 비교와 선택"이다. 이전의 "동일한 작은 dark
 * card 3개 + 긴 Archive modal 목록" 구조를 대체한다.
 *
 * 공개 규칙(작업 지시서 6절): 대표 3개만 상세 route를 갖고, More Works는
 * moreWorksPublished=true인 항목만(현재 OTT Service 1개) 노출한다. Mini SNS·
 * placeholder·내부 초안은 공개 승인 기록이 없어 이 페이지 어디에도 렌더링하지
 * 않는다(예전 Archive 모달의 "categories.includes('archive') && !isPlaceholder"
 * 기준은 Mini SNS를 승인 없이 노출시키고 있었다 — Home의 MoreWorksSection과 같은
 * moreWorksPublished 플래그 기준으로 통일한다). */
const FEATURED_REFS = [
  {
    id: 'jobflow', slug: 'jobflow', displayTitle: 'JobFlow',
    roleLine: 'Dashboard · Service UI',
    scopeLine: '실제 Supabase 저장 구조와 demo/fallback 여부를 데이터에서 그대로 표현',
  },
  {
    id: 'bus-arrival-app', slug: 'bus-arrival', displayTitle: '버스 도착정보 앱',
    roleLine: 'Mobile UI · Figma Prototype',
    scopeLine: 'Static sample / Prototype 여부를 정확히 표시',
  },
  {
    id: 'feedback-hub', slug: 'feedback-hub', displayTitle: 'Portfolio Feedback Hub',
    roleLine: 'Community UX · React/MUI · Supabase',
    scopeLine: 'Actual / Fallback 동작을 정확히 구분',
  },
];

const FEATURED_BLOCKS = FEATURED_REFS
  .map((ref) => {
    const project = ALL_PROJECTS.find((p) => p.id === ref.id);
    return project ? { ...ref, project } : null;
  })
  .filter(Boolean);

const MORE_WORKS = ALL_PROJECTS.filter((p) => p.moreWorksPublished);

const SHELL_SX = {
  px: { xs: 3, sm: 6, md: 8 }, maxWidth: { xl: ULTRAWIDE_CONTENT_MAX_WIDTH + 128 }, mx: 'auto',
  '@media (min-width:1920px)': { maxWidth: HOME_WIDE_MAX_WIDTH, px: 8 },
};

const ViewGuideItem = ({ num, desc }) => (
  <Box sx={{ flex: 1, minWidth: 160 }}>
    <Typography sx={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: '0.9375rem', color: HUMAN_SIGNAL.burntOrange, mb: 0.5 }}>
      {num}
    </Typography>
    <Typography sx={{ fontSize: '0.875rem', color: HUMAN_SIGNAL.inkText, lineHeight: 1.5 }}>{desc}</Typography>
  </Box>
);

const ProjectsHero = ({ onGoHome }) => (
  <Box component="section" sx={{ bgcolor: HUMAN_SIGNAL.warmPaper, pt: { xs: 6, md: 9 }, pb: { xs: 5, md: 6 } }}>
    <Box sx={SHELL_SX}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 3, mb: { xs: 4, md: 5 } }}>
        <Box>
          <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.75rem', letterSpacing: '0.06em', mb: 2 }}>
            PROJECT LIBRARY
          </Typography>
          <Typography component="h1" sx={{
            fontWeight: 750, fontSize: { xs: '1.875rem', sm: '2.4rem', md: '2.9rem' }, lineHeight: 1.2, letterSpacing: '-0.02em',
            color: HUMAN_SIGNAL.inkNavy, maxWidth: 720, mb: 1.5,
            '@media (min-width:1920px)': { fontSize: '3.75rem', maxWidth: 980 },
          }}>
            작업을 역할과 구현 범위로 정리했습니다.
          </Typography>
          <Typography sx={{ color: HUMAN_SIGNAL.inkText, fontSize: '0.9375rem', lineHeight: 1.65, maxWidth: 560, '@media (min-width:1920px)': { fontSize: '1.0625rem' } }}>
            대표 3개는 서로 다른 역할과 구현 범위를 보여줍니다. 나머지 공개 작업은
            Selected Works에서 확인할 수 있습니다.
          </Typography>
        </Box>
        <Box
          component="button"
          type="button"
          onClick={onGoHome}
          aria-label="Home으로 돌아가기"
          sx={{
            bgcolor: 'transparent', border: `1px solid ${HUMAN_SIGNAL.paperDeep}`, cursor: 'pointer',
            height: 48, px: 2.5, borderRadius: '14px', flexShrink: 0,
            display: 'inline-flex', alignItems: 'center', gap: 1,
            color: HUMAN_SIGNAL.inkNavy, fontWeight: 500, fontSize: '0.875rem', fontFamily: 'inherit',
            transition: 'border-color 160ms ease, color 160ms ease',
            '&:hover': { borderColor: HUMAN_SIGNAL.inkNavy },
            '&:focus-visible': { outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`, outlineOffset: '3px' },
          }}
        >
          <ActionIcon variant="internal" sx={{ transform: 'rotate(180deg)' }} /> Home으로 돌아가기
        </Box>
      </Box>

      {/* Compact View Guide — 큰 dark 문서 카드 대신 3항목 요약 행. 숫자는 현재
       * 공개 데이터에서 계산하고 고정하지 않는다. */}
      <Box sx={{
        display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 5 },
        pt: { xs: 3, md: 3.5 }, borderTop: `1px solid ${HUMAN_SIGNAL.paperDeep}`,
      }}>
        <ViewGuideItem num={`${FEATURED_BLOCKS.length} FEATURED`} desc="실제 역할이 다른 대표 프로젝트" />
        <ViewGuideItem num={`${MORE_WORKS.length} MORE WORK`} desc="공개 승인된 추가 작업" />
        <ViewGuideItem num="SCOPE" desc="Actual · Demo · Static · Fallback 구분" />
      </Box>
    </Box>
  </Box>
);

/* Featured wide editorial row — Home ProjectsSection과 같은 full-bleed band 기법을
 * 쓰되(scene band), 카드 문구는 이 페이지 전용 role/scope 요약(30초 비교용)으로
 * 압축한다. Home의 긴 PROOF 문장을 그대로 반복하지 않는다. */
const FeaturedRow = ({ block, index, onOpen }) => {
  const { project, slug, displayTitle, roleLine, scopeLine } = block;
  const mediaFirst = index % 2 === 0;
  const bandBg = index % 2 === 0 ? HUMAN_SIGNAL.softWhite : HUMAN_SIGNAL.paperDeep;
  const labelColor = index % 2 === 0 ? HUMAN_SIGNAL.burntOrange : HUMAN_SIGNAL.inkNavy;

  const areas = mediaFirst ? '"media copy"' : '"copy media"';

  return (
    <RevealOnScroll y={14} duration={0.5}>
      <Box component="section" sx={{
        bgcolor: bandBg, width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', position: 'relative',
        borderTop: `1px solid ${HUMAN_SIGNAL.paperDeep}`,
      }}>
        <Box sx={{ ...SHELL_SX, py: { xs: 5, md: 6.5 } }}>
          <Box sx={{
            display: 'grid', gridTemplateAreas: { xs: '"media" "copy"', lg: areas },
            gridTemplateColumns: { xs: '1fr', lg: mediaFirst ? 'minmax(0,3fr) minmax(0,2fr)' : 'minmax(0,2fr) minmax(0,3fr)' },
            alignItems: 'center',
            columnGap: { lg: 6 }, rowGap: { xs: 3, lg: 0 },
            '@media (min-width:1920px)': { gridTemplateColumns: mediaFirst ? 'minmax(0,2fr) minmax(0,1fr)' : 'minmax(0,1fr) minmax(0,2fr)', columnGap: 8 },
          }}>
            {/* copy — eyebrow/title/desc/facts/cta를 하나의 flex column으로 묶어 이미지
             * 높이에 맞춰 세로 중앙 정렬한다(따로따로 1fr row에 나눠 desc와 CTA 사이에
             * 빈 공간이 생기던 문제를 없앤다 — QHD "내부 dead space 없음" 기준). */}
            <Box sx={{ gridArea: 'copy', display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 480 }}>
              <Typography sx={{ fontFamily: FONT_MONO, color: labelColor, fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                {String(index + 1).padStart(2, '0')} · {project.categoryLabel}
              </Typography>
              <Typography component="h2" sx={{
                fontWeight: 730, fontSize: { xs: '1.375rem', lg: '1.75rem' }, lineHeight: 1.25, letterSpacing: '-0.015em',
                color: HUMAN_SIGNAL.inkNavy, wordBreak: 'keep-all', '@media (min-width:1920px)': { fontSize: '2.25rem' },
              }}>
                {displayTitle}
              </Typography>
              <Typography sx={{
                color: HUMAN_SIGNAL.inkText, fontSize: '0.9375rem', lineHeight: 1.65, wordBreak: 'keep-all',
                '@media (min-width:1920px)': { fontSize: '1.0625rem' },
              }}>
                {project.description}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Typography sx={{ fontSize: '0.875rem', color: HUMAN_SIGNAL.inkNavy, lineHeight: 1.5 }}>
                  <Box component="span" sx={{ fontFamily: FONT_MONO, color: labelColor, fontSize: '0.6875rem', letterSpacing: '0.04em', mr: 1 }}>역할</Box>
                  {roleLine}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: HUMAN_SIGNAL.inkText, lineHeight: 1.5 }}>
                  <Box component="span" sx={{ fontFamily: FONT_MONO, color: labelColor, fontSize: '0.6875rem', letterSpacing: '0.04em', mr: 1 }}>범위</Box>
                  {scopeLine}
                </Typography>
              </Box>

              <Box sx={{ mt: 0.5 }}>
                <Box
                  component="button"
                  type="button"
                  onClick={() => onOpen(slug)}
                  aria-label={`${displayTitle} 상세 보기`}
                  sx={{
                    bgcolor: HUMAN_SIGNAL.inkNavy, color: HUMAN_SIGNAL.softWhite, border: 0,
                    cursor: 'pointer', height: 46, minWidth: 150, px: 2.25, borderRadius: '12px',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                    fontWeight: 500, fontSize: '0.875rem', fontFamily: 'inherit',
                    transition: 'transform 160ms ease, box-shadow 160ms ease',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(12,20,32,0.24)' },
                    '&:active': { transform: 'translateY(0)' },
                    '&:focus-visible': { outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`, outlineOffset: '3px', transform: 'none' },
                    '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
                  }}
                >
                  상세 보기 <ActionIcon variant="internal" sx={{ color: HUMAN_SIGNAL.brightOrangeOnDark }} />
                </Box>
              </Box>
            </Box>

            {/* 실제 화면 — Home ProjectsSection과 같은 chrome-bar 프레임, 원본 비율 그대로. */}
            <Box sx={{ gridArea: 'media', width: '100%', minWidth: 0 }}>
              <Box sx={{
                width: '100%', borderRadius: '16px', overflow: 'hidden',
                bgcolor: HUMAN_SIGNAL.deepHarbor, border: `1px solid ${HUMAN_SIGNAL.paperDeep}`,
                boxShadow: '0 24px 50px rgba(12,20,32,0.16)',
              }}>
                {project.thumbnailUrl ? (
                  <>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: 30, px: 1.75, bgcolor: HUMAN_SIGNAL.softWhite }}>
                      <Box sx={{ width: 7, height: 7, borderRadius: '4px', bgcolor: HUMAN_SIGNAL.brightOrange }} />
                      <Box sx={{ width: 7, height: 7, borderRadius: '4px', bgcolor: HUMAN_SIGNAL.mutedSage }} />
                      <Box sx={{ width: 7, height: 7, borderRadius: '4px', bgcolor: HUMAN_SIGNAL.steelMist }} />
                    </Box>
                    <Box component="img" src={project.thumbnailUrl} alt={`${displayTitle} 실제 화면`} loading="lazy"
                      sx={{ width: '100%', height: 'auto', display: 'block', bgcolor: HUMAN_SIGNAL.softWhite }} />
                  </>
                ) : (
                  <Box sx={{ aspectRatio: '16 / 9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.steelMist, fontSize: '0.875rem' }}>{displayTitle}</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </RevealOnScroll>
  );
};

/* More Works — 현재 OTT Service 1개. object-fit:contain 60/40 split(Home
 * MoreWorksSection과 동일 원칙: 실제 화면을 자르거나 오버레이로 가리지 않는다). */
const MoreWorkRow = ({ project }) => {
  const href = project.liveUrl ?? project.githubUrl ?? null;
  const isLink = Boolean(href);
  const scopeLabel = project.tools?.every((t) => ['HTML', 'CSS', 'JavaScript'].includes(t))
    ? 'Static · Frontend Demo'
    : (project.categoryLabel || null);

  return (
    <Box
      component={isLink ? 'a' : 'div'}
      href={isLink ? href : undefined}
      target={isLink ? '_blank' : undefined}
      rel={isLink ? 'noopener noreferrer' : undefined}
      aria-label={isLink ? `${project.title} 새 탭에서 열기` : undefined}
      sx={{
        display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, width: '100%',
        borderRadius: '20px', overflow: 'hidden', textDecoration: 'none', color: 'inherit',
        bgcolor: HUMAN_SIGNAL.deepHarbor, boxShadow: '0 24px 50px rgba(12,20,32,0.16)',
        cursor: isLink ? 'pointer' : 'default',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        '&:hover': isLink ? { transform: 'translateY(-3px)', boxShadow: '0 16px 34px rgba(12,20,32,0.24)' } : undefined,
        '&:active': isLink ? { transform: 'translateY(0)' } : undefined,
        '&:focus-visible': { outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`, outlineOffset: '2px', transform: 'none' },
        '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
      }}
    >
      <Box sx={{ position: 'relative', width: { xs: '100%', sm: '62%' }, height: { xs: 240, sm: 380 }, flexShrink: 0, bgcolor: HUMAN_SIGNAL.deepHarbor }}>
        {project.thumbnailUrl ? (
          <Box component="img" src={project.thumbnailUrl} alt={`${project.title} 화면 미리보기`} loading="lazy"
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: HUMAN_SIGNAL.softWhite, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.inkNavy, fontSize: '0.875rem' }}>{project.title}</Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ p: { xs: 3, sm: 4 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1.25, flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.75rem', letterSpacing: '0.04em', color: HUMAN_SIGNAL.brightOrangeOnDark }}>
          {scopeLabel}
        </Typography>
        <Typography component="h3" sx={{ fontWeight: 730, fontSize: '1.375rem', color: HUMAN_SIGNAL.softWhite }}>
          {project.title}
        </Typography>
        <Typography sx={{ fontSize: '0.9375rem', color: HUMAN_SIGNAL.steelMist, lineHeight: 1.6, wordBreak: 'keep-all' }}>
          {project.description}
        </Typography>
        {isLink && (
          <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.8125rem', fontWeight: 600, color: HUMAN_SIGNAL.brightOrangeOnDark, mt: 0.5, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
            VIEW PROJECT <ActionIcon variant="external" />
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const ProjectsFooter = () => (
  <Box component="footer" sx={{ bgcolor: HUMAN_SIGNAL.deepHarbor, py: { xs: 5, md: 6.5 } }}>
    <Box sx={SHELL_SX}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <DMark size={30} tone="onDark" />
          <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.steelMist, fontSize: '0.6875rem', letterSpacing: '0.04em' }}>
            DOHAN KIM · HUMAN SIGNAL
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, sm: 3 } }}>
          {[
            { label: 'Home', href: '#/' },
            { label: 'Mail', href: `mailto:${CONTACT_EMAIL}` },
            { label: 'GitHub', href: GITHUB_PROFILE_URL },
          ].map((item) => (
            <Box key={item.label} component="a" href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              sx={{
                color: HUMAN_SIGNAL.softWhite, fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none',
                minHeight: 44, display: 'inline-flex', alignItems: 'center',
                '&:hover': { color: HUMAN_SIGNAL.brightOrangeOnDark },
                '&:focus-visible': { outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`, outlineOffset: '3px' },
              }}
            >
              {item.label}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  </Box>
);

const ProjectsPage = () => {
  const navigate = useNavigate();
  const openDetail = (slug) => navigate(`/projects/${slug}`);

  return (
    <Box component="main" sx={{ bgcolor: HUMAN_SIGNAL.warmPaper, minHeight: '100vh' }}>
      <ProjectsHero onGoHome={() => navigate('/')} />

      {FEATURED_BLOCKS.map((block, i) => (
        <FeaturedRow key={block.id} block={block} index={i} onOpen={openDetail} />
      ))}

      {MORE_WORKS.length > 0 && (
        <Box component="section" aria-label="더 많은 작업물" sx={{ bgcolor: HUMAN_SIGNAL.paperDeep, py: { xs: 6, md: 8 } }}>
          <Box sx={SHELL_SX}>
            <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.inkNavy, fontSize: '0.75rem', letterSpacing: '0.06em', mb: 3 }}>
              MORE WORK
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {MORE_WORKS.map((project) => <MoreWorkRow key={project.id} project={project} />)}
            </Box>
          </Box>
        </Box>
      )}

      <ProjectsFooter />
    </Box>
  );
};

export default ProjectsPage;
