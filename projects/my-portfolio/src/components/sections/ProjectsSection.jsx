import { useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ALL_PROJECTS } from '../../data/projectsData';
import useInViewOnce from '../../hooks/useInViewOnce';
import ActionIcon from '../ui/ActionIcon';
import { FONT_MONO, HUMAN_SIGNAL, ULTRAWIDE_CONTENT_MAX_WIDTH, HOME_WIDE_MAX_WIDTH, HOME_PROJECT_MAX_WIDTH } from '../../theme';

/* Home Featured Projects(Figma Human Signal Home v8 180:575). 대표 3개는
 * ALL_PROJECTS의 실제 데이터에서 id로 찾는다 — 프로젝트를 찾지 못하면 해당
 * 블록을 조용히 건너뛴다(가짜 카드를 만들거나 콘솔 경고를 남기지 않는다).
 * displayTitle은 Home 전용 짧은 표기이며 데이터의 정식 title을 바꾸는 게
 * 아니다. description/cardRole/cardScope는 projectsFallbackData.js의 실제
 * 필드를 그대로 쓴다.
 *
 * Human Signal Phase 2F Hybrid: 이전 회차(Phase 2C~2D)의 scene(wide/tall/vivid)
 * 구분은 실제 세 thumbnail이 전부 가로형(jobflow 800x450, bus-arrival 약
 * 1200x675 4-screen composite, feedback-hub 1200x800)이라는 사실과 맞지
 * 않았다 — 특히 bus-arrival을 세로 phone frame처럼 다루면서 실제로는 넓은
 * 4-screen composite 이미지를 좁은 세로 박스 안에 축소해 넣어 큰 dark 여백만
 * 남기는 문제가 있었다(ChatGPT가 최신 PNG에서 재확인). 세 프로젝트 모두
 * "실제 이미지 원본 비율 그대로, 프레임 폭 100%"로 통일한다 — 가짜 phone
 * frame이나 강제 세로 crop을 만들지 않는다.
 * band만 유지한다: 동일한 흰 rounded card 3회 반복(slide deck처럼 보임) 대신
 * Soft White / Paper Deep / Soft White로 번갈아지는 full-bleed 배경 표면. */
const FEATURED_IDS = [
  { id: 'jobflow', slug: 'jobflow', displayTitle: 'JobFlow', band: 'soft' },
  { id: 'bus-arrival-app', slug: 'bus-arrival', displayTitle: '버스 도착정보 앱', band: 'deep' },
  { id: 'feedback-hub', slug: 'feedback-hub', displayTitle: 'Portfolio Feedback Hub', band: 'soft' },
];

const FEATURED_BLOCKS = FEATURED_IDS
  .map((ref) => {
    const project = ALL_PROJECTS.find((p) => p.id === ref.id);
    return project ? { ...ref, project } : null;
  })
  .filter(Boolean);

/* Page Motion Rules(171:25) Featured Projects: duration 약 0.55s, 이미지가
 * 먼저(0ms) 16px 이하로 opacity+이동, copy가 80ms 뒤를 따른다. review 캡처
 * 모드에서는 애니메이션 없이 즉시 최종 상태, reduced-motion도 즉시 최종
 * 상태(index.css 전역 규칙이 duration을 0.01ms로 강제). */
const isReviewCapture =
  (typeof window !== 'undefined' && window.__PORTFOLIO_REVIEW_MODE__ === true) ||
  (typeof document !== 'undefined' && document.documentElement?.getAttribute('data-review-mode') === 'true');

const revealSx = (show, skip, delay) => ({
  opacity: show ? 1 : 0,
  transform: show ? 'translateY(0)' : { xs: 'translateY(9px)', lg: 'translateY(16px)' },
  transition: skip ? 'none' : `opacity 0.55s ease-out ${delay}s, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
});

const BAND_BG = { soft: HUMAN_SIGNAL.softWhite, deep: HUMAN_SIGNAL.paperDeep };

/* 실제 화면(원본 비율 그대로, 프레임 폭 100%) — scene별 특수 처리·강제 crop
 * 없음. 세 thumbnail 전부 가로형이라 하나의 구조로 충분하다. */
const Stage = ({ project, motionSx }) => (
  <Box sx={{ gridArea: 'stage', width: '100%', minWidth: 0, alignSelf: 'stretch', display: 'flex', alignItems: 'center', ...motionSx }}>
    <Box sx={{
      width: '100%', borderRadius: '16px', overflow: 'hidden',
      bgcolor: HUMAN_SIGNAL.deepHarbor, border: `1px solid ${HUMAN_SIGNAL.paperDeep}`,
      boxShadow: '0 24px 50px rgba(12,20,32,0.18)',
    }}>
      {project.thumbnailUrl ? (
        <>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: 32, px: 1.75, bgcolor: HUMAN_SIGNAL.softWhite }}>
            <Box sx={{ width: 7, height: 7, borderRadius: '4px', bgcolor: HUMAN_SIGNAL.brightOrange }} />
            <Box sx={{ width: 7, height: 7, borderRadius: '4px', bgcolor: HUMAN_SIGNAL.mutedSage }} />
            <Box sx={{ width: 7, height: 7, borderRadius: '4px', bgcolor: HUMAN_SIGNAL.steelMist }} />
          </Box>
          <Box component="img" src={project.thumbnailUrl} alt={`${project.title} 화면 미리보기`} loading="lazy"
            sx={{ width: '100%', height: 'auto', display: 'block', bgcolor: HUMAN_SIGNAL.softWhite }} />
        </>
      ) : (
        <Box sx={{ aspectRatio: '16 / 9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.steelMist, fontSize: '0.875rem' }}>
            {project.title}
          </Typography>
        </Box>
      )}
    </Box>
  </Box>
);

/* 390~1024: copy summary(eyebrow/title/desc) → actual image → PROOF/ACTUAL
 * SCOPE → CTA 순서로 보이게 stackedAreas를 구성한다(work order 지정 순서).
 * DOM 순서는 모든 브레이크포인트에서 index/type → title → description →
 * PROOF → ACTUAL SCOPE → thumbnail → CTA로 고정하고(접근성 읽기 순서),
 * grid-template-areas로만 시각 위치를 바꾼다 — 실제 렌더 순서는 그대로 두고
 * stacked 전용 area만 이미지를 proof/scope보다 앞에 배치한다.
 * 2560: visual 68~72% / copy 28~32%. 1440: visual 60~65% / copy 35~40%
 * (Phase 2D의 scene별 비율 차등은 세 thumbnail이 실제로는 비슷한 가로 비율이라
 * 더 이상 필요 없어 하나의 비율로 통일한다). */
const ProjectBlock = ({ block, index }) => {
  const { project, slug, displayTitle, band } = block;
  const stageFirst = index % 2 === 0;
  const navigate = useNavigate();

  const prefersReduced = useRef(
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false,
  );
  // 세 프로젝트 block을 한꺼번에 애니메이션하지 않는다 — block마다 독립된
  // IntersectionObserver를 붙여, 각 block이 뷰포트에 처음 들어올 때만 1회 실행한다.
  const [ref, isVisible] = useInViewOnce(0.15);
  const show = isReviewCapture || prefersReduced.current || isVisible;
  const skip = isReviewCapture || prefersReduced.current;

  const stackedAreas = '"eyebrow" "title" "desc" "stage" "proof" "scope" "cta"';
  const crossAreas = stageFirst
    ? '"stage eyebrow" "stage title" "stage desc" "stage proof" "stage scope" "stage cta"'
    : '"eyebrow stage" "title stage" "desc stage" "proof stage" "scope stage" "cta stage"';
  const crossColumns = stageFirst ? 'minmax(0, 5fr) minmax(0, 3fr)' : 'minmax(0, 3fr) minmax(0, 5fr)';
  const qhdColumns = stageFirst ? 'minmax(0, 7fr) minmax(0, 3fr)' : 'minmax(0, 3fr) minmax(0, 7fr)';
  // Paper Deep(band='deep') 위 작은 텍스트에 Burnt Orange를 쓰면 대비가 4.36:1로
  // 기준(4.5:1) 미달이었다(MoreWorksSection에서 이미 재현·수정한 것과 동일한 문제,
  // 이번엔 ProjectsSection의 bus-arrival 블록에서 재발 — detailed audit로 확인).
  // Soft White(band='soft') 위에서는 Burnt Orange가 안전하므로 band에 따라 라벨
  // 색만 바꾼다(레이아웃·문구는 그대로).
  const labelColor = band === 'deep' ? HUMAN_SIGNAL.inkNavy : HUMAN_SIGNAL.burntOrange;
  // PROOF(핵심 역량, 최대 2개)와 ACTUAL SCOPE(범위 문장)를 분리해서 보여준다 —
  // 한 줄로 합치면 technical metadata처럼 읽힌다는 재검토 결과에 따라 되돌린다.
  // 사실 데이터(cardRole/cardScope)는 변경하지 않는다.
  const proofItems = (project.cardRole ?? []).slice(0, 2);

  return (
    <Box
      ref={ref}
      component="section"
      sx={{
        position: 'relative', bgcolor: BAND_BG[band],
        // full-bleed: 부모 Container의 padding/max-width와 무관하게 뷰포트 전체 폭으로
        // 배경을 확장한다.
        width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw',
        borderTop: `1px solid ${HUMAN_SIGNAL.paperDeep}`,
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, sm: 6, md: 8 }, maxWidth: { xl: ULTRAWIDE_CONTENT_MAX_WIDTH + 128 }, mx: 'auto',
          py: { xs: 5, md: 7 },
          '@media (min-width:1920px)': { maxWidth: HOME_WIDE_MAX_WIDTH, px: 8, py: 9 },
        }}
      >
        <Box sx={{ position: 'relative', maxWidth: { xl: HOME_PROJECT_MAX_WIDTH }, mx: 'auto' }}>
          {/* 큰 low-opacity index — 순수 장식, 스크린리더에는 노출하지 않는다. */}
          <Typography
            aria-hidden="true"
            sx={{
              position: 'absolute', top: { xs: -8, md: -16 }, right: { xs: 0, md: 8 },
              fontFamily: FONT_MONO, fontWeight: 700, color: HUMAN_SIGNAL.inkNavy, opacity: 0.06,
              fontSize: { xs: '4rem', md: '6rem', lg: '7rem' }, lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </Typography>

          <Box
            sx={{
              position: 'relative',
              display: 'grid',
              gridTemplateAreas: { xs: stackedAreas, lg: crossAreas },
              gridTemplateColumns: { xs: '1fr', lg: crossColumns },
              gridTemplateRows: { lg: 'auto auto 1fr auto auto auto' },
              columnGap: { lg: 6 },
              rowGap: { xs: 3, lg: 1.5 },
              '@media (min-width:1920px)': { gridTemplateColumns: qhdColumns, columnGap: 8 },
            }}
          >
            <Typography sx={{ gridArea: 'eyebrow', fontFamily: FONT_MONO, color: labelColor, fontSize: '0.75rem', letterSpacing: '0.04em', ...revealSx(show, skip, 0.08) }}>
              {String(index + 1).padStart(2, '0')} · {project.categoryLabel}
            </Typography>

            <Typography component="h3" sx={{
              gridArea: 'title', fontWeight: 730, fontSize: { xs: '1.5rem', lg: '1.875rem' }, lineHeight: 1.25, letterSpacing: '-0.015em',
              color: HUMAN_SIGNAL.inkNavy, wordBreak: 'keep-all', ...revealSx(show, skip, 0.08),
              '@media (min-width:1920px)': { fontSize: '2.5rem' },
            }}>
              {displayTitle}
            </Typography>

            <Typography sx={{
              gridArea: 'desc', color: HUMAN_SIGNAL.inkText, fontSize: '0.9375rem', lineHeight: 1.7, wordBreak: 'keep-all', ...revealSx(show, skip, 0.08),
              '@media (min-width:1920px)': { fontSize: '1.0625rem' },
            }}>
              {project.description}
            </Typography>

            {proofItems.length > 0 && (
              <Typography sx={{
                gridArea: 'proof', fontSize: '0.875rem', lineHeight: 1.6, color: HUMAN_SIGNAL.inkNavy, wordBreak: 'keep-all',
                pt: 1.75, borderTop: `1px solid ${HUMAN_SIGNAL.paperDeep}`, ...revealSx(show, skip, 0.08),
              }}>
                <Box component="span" sx={{ fontFamily: FONT_MONO, fontWeight: 700, color: labelColor, fontSize: '0.6875rem', letterSpacing: '0.04em', mr: 1 }}>
                  PROOF
                </Box>
                {proofItems.join(' · ')}
              </Typography>
            )}

            {project.cardScope && (
              <Typography sx={{
                gridArea: 'scope', fontSize: '0.875rem', lineHeight: 1.6, color: HUMAN_SIGNAL.inkText, wordBreak: 'keep-all',
                ...revealSx(show, skip, 0.08),
              }}>
                <Box component="span" sx={{ fontFamily: FONT_MONO, fontWeight: 700, color: labelColor, fontSize: '0.6875rem', letterSpacing: '0.04em', mr: 1 }}>
                  ACTUAL SCOPE
                </Box>
                {project.cardScope}
              </Typography>
            )}

            <Stage project={project} motionSx={revealSx(show, skip, 0)} />

            <Box sx={{ gridArea: 'cta', alignSelf: 'end', mt: { xs: 1, lg: 0 }, ...revealSx(show, skip, 0.08) }}>
              <Box
                component="button"
                type="button"
                onClick={() => navigate(`/projects/${slug}`)}
                aria-label={`${displayTitle} 상세 보기`}
                sx={{
                  bgcolor: HUMAN_SIGNAL.inkNavy, color: HUMAN_SIGNAL.softWhite, border: 0,
                  cursor: 'pointer', height: 48, minWidth: 160, px: 2.5, borderRadius: '12px',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                  fontWeight: 500, fontSize: '0.875rem', fontFamily: 'inherit',
                  transition: 'transform 160ms ease, box-shadow 160ms ease',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(12,20,32,0.28)' },
                  '&:active': { transform: 'translateY(0)' },
                  '&:focus-visible': {
                    outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`, outlineOffset: '3px',
                    opacity: 1, transform: 'none', animation: 'none',
                  },
                  '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
                  '@media (min-width:1920px)': { height: 56, fontSize: '1rem', minWidth: 190 },
                }}
              >
                프로젝트 상세 <ActionIcon variant="internal" sx={{ color: HUMAN_SIGNAL.brightOrangeOnDark }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

const ProjectsSection = () => {
  const navigate = useNavigate();

  return (
    <Box component="section" id="projects" aria-label="프로젝트" sx={{ bgcolor: HUMAN_SIGNAL.warmPaper, py: { xs: 7, md: 9 }, '@media (min-width:1920px)': { py: 10 } }}>
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, sm: 6, md: 8 }, maxWidth: { xl: ULTRAWIDE_CONTENT_MAX_WIDTH + 128 }, mx: 'auto',
          '@media (min-width:1920px)': { maxWidth: HOME_WIDE_MAX_WIDTH, px: 8 },
        }}
      >
        <Box sx={{ mb: { xs: 5, md: 5 } }}>
          <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.75rem', letterSpacing: '0.06em', mb: 2 }}>
            FEATURED PROJECTS
          </Typography>
          <Typography component="h2" sx={{
            fontWeight: 750, fontSize: { xs: '1.75rem', sm: '2.2rem', md: '2.6rem' }, lineHeight: 1.2, letterSpacing: '-0.02em',
            color: HUMAN_SIGNAL.inkNavy, maxWidth: 760, mb: 1.5,
            '@media (min-width:1920px)': { fontSize: '3.75rem', maxWidth: 1100 },
          }}>
            <Box component="span" sx={{ display: 'block' }}>세 가지 작업에서,</Box>
            <Box component="span" sx={{ display: 'block' }}>서로 다른 문제를 풀었습니다.</Box>
          </Typography>
          <Typography sx={{ color: HUMAN_SIGNAL.inkText, fontSize: '0.9375rem', '@media (min-width:1920px)': { fontSize: '1.125rem' } }}>
            세 작업은 서로 다른 문제와 구현 범위를 보여줍니다.
          </Typography>
        </Box>
      </Container>

      {/* Project scene band 3개 — full-bleed, Container 밖(섹션 직속)에서 렌더링한다. */}
      {FEATURED_BLOCKS.map((block, i) => (
        <ProjectBlock key={block.id} block={block} index={i} />
      ))}

      <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, sm: 6, md: 8 }, maxWidth: { xl: ULTRAWIDE_CONTENT_MAX_WIDTH + 128 }, mx: 'auto',
          '@media (min-width:1920px)': { maxWidth: HOME_WIDE_MAX_WIDTH, px: 8 },
        }}
      >
        <Box sx={{ mt: { xs: 6, md: 7 } }}>
          <Box
            component="button"
            type="button"
            onClick={() => navigate('/projects')}
            aria-label="전체 프로젝트 페이지로 이동"
            sx={{
              bgcolor: HUMAN_SIGNAL.softWhite, color: HUMAN_SIGNAL.inkNavy, border: `1px solid ${HUMAN_SIGNAL.paperDeep}`, cursor: 'pointer',
              height: 54, minWidth: 220, px: 2.5, borderRadius: '16px',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1,
              fontWeight: 500, fontSize: '0.9375rem', fontFamily: 'inherit',
              transition: 'transform 160ms ease, border-color 160ms ease',
              '&:hover': { transform: 'translateY(-2px)', borderColor: HUMAN_SIGNAL.inkNavy },
              '&:active': { transform: 'translateY(0)' },
              '&:focus-visible': { outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`, outlineOffset: '3px', transform: 'none' },
              '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
            }}
          >
            전체 프로젝트 보기 <ActionIcon variant="internal" sx={{ color: HUMAN_SIGNAL.burntOrange }} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProjectsSection;
