import { useParams, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GitHubIcon from '@mui/icons-material/GitHub';
import { ALL_PROJECTS } from '../data/projectsData';
import EvidenceBadges from '../components/projects/EvidenceBadges';
import ActionIcon from '../components/ui/ActionIcon';
import { FONT_MONO, HUMAN_SIGNAL, ULTRAWIDE_CONTENT_MAX_WIDTH, HOME_WIDE_MAX_WIDTH, HOME_READING_MAX_WIDTH } from '../theme';
import { GITHUB_PROFILE_URL, CONTACT_EMAIL } from '../constants/site';

/* Human Signal Phase 3A Case Study 공통 템플릿. 대표 3개만 이 route를 갖는다
 * (지시서 확정 경로). 나머지 프로젝트는 /projects의 More Works나 외부 링크로만
 * 존재한다 — 이 페이지는 이 3개 전용이다. */
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

const SHELL_SX = {
  px: { xs: 3, sm: 6, md: 8 }, maxWidth: { xl: ULTRAWIDE_CONTENT_MAX_WIDTH + 128 }, mx: 'auto',
  '@media (min-width:1920px)': { maxWidth: HOME_WIDE_MAX_WIDTH, px: 8 },
};
// 읽기 전용 문단(Context/Decisions/Scope/AI/Result)의 reading column — QHD에서도
// 한 줄이 과도하게 길어지지 않게 상한을 둔다.
const READING_SX = { maxWidth: { md: HOME_READING_MAX_WIDTH + 120 } };

const SectionLabel = ({ index, children }) => (
  <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.75rem', letterSpacing: '0.06em', mb: 2 }}>
    {index ? `${index} / ` : ''}{children}
  </Typography>
);

/* Responsive 요약은 project data에 전용 필드가 없어, 이미 있는 is_figma_project로
 * 정확히 구분한다(추측·과장 없이 사실 그대로: Figma 프로토타입은 모바일 화면
 * 설계이지 반응형 웹 구현이 아니다). */
const deriveResponsive = (project) =>
  project.is_figma_project
    ? '모바일 전용 화면 설계(Figma 프로토타입) — 반응형 웹 구현이 아닙니다.'
    : '데스크톱 · 태블릿 · 모바일 반응형 웹(React/MUI 브레이크포인트 대응).';

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const id = SLUG_TO_ID[slug];
  const project = id ? ALL_PROJECTS.find((p) => p.id === id) : null;

  // 존재하지 않는 slug나 데이터가 없는 프로젝트는 가짜 페이지를 만들지 않고
  // 전체 프로젝트 목록으로 안전하게 돌려보낸다.
  if (!project) return <Navigate to="/projects" replace />;

  const { detail, tools = [], thumbnailUrl, liveUrl, githubUrl, figmaPrototypeUrl, categoryLabel, cardScope } = project;

  // 스마트 back: 브라우저 history가 있으면(=Home/Projects에서 들어옴) 뒤로가기로
  // 스크롤 위치까지 보존, history가 없는 직접 URL 진입/새로고침이면 /projects로
  // 이동한다. location.key === 'default'는 React Router가 진입 시 history 항목이
  // 없을 때(직접 진입) 부여하는 값이다.
  const goBack = () => {
    if (location.key === 'default') navigate('/projects');
    else navigate(-1);
  };

  const prevSlug = cycleSlug(slug, -1);
  const nextSlug = cycleSlug(slug, 1);
  const prevProject = ALL_PROJECTS.find((p) => p.id === SLUG_TO_ID[prevSlug]);
  const nextProject = ALL_PROJECTS.find((p) => p.id === SLUG_TO_ID[nextSlug]);

  const hasDecision = detail.designPoint && detail.designPoint !== '—';
  const hasAI = Boolean(detail.aiContribution);
  const implementationLine = (project.tech_stack ?? tools).join(' + ') || null;

  const SECTION_NAV = [
    hasDecision && { id: 'decisions', label: 'Decisions' },
    { id: 'scope', label: 'Scope' },
    hasAI && { id: 'ai', label: 'AI' },
    { id: 'result', label: 'Result' },
  ].filter(Boolean);

  return (
    <Box component="main" sx={{ bgcolor: HUMAN_SIGNAL.warmPaper, minHeight: '100vh' }}>
      {/* ── Detail Hero ── */}
      <Box component="section" sx={{ pt: { xs: 5, md: 7 }, pb: { xs: 5, md: 6 } }}>
        <Box sx={SHELL_SX}>
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

          <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.75rem', letterSpacing: '0.04em', mb: 1.5 }}>
            {categoryLabel}
          </Typography>
          <Typography component="h1" sx={{
            fontWeight: 750, fontSize: { xs: '2rem', sm: '2.6rem', md: '3.1rem' }, lineHeight: 1.15, letterSpacing: '-0.02em',
            color: HUMAN_SIGNAL.inkNavy, mb: 2, '@media (min-width:1920px)': { fontSize: '4rem' },
          }}>
            {project.title}
          </Typography>
          <Typography sx={{
            color: HUMAN_SIGNAL.inkText, fontSize: { xs: '1rem', md: '1.125rem' }, lineHeight: 1.65, mb: 3, maxWidth: 720,
            '@media (min-width:1920px)': { fontSize: '1.25rem' },
          }}>
            {project.description}
          </Typography>

          {(liveUrl || githubUrl || figmaPrototypeUrl) && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: { xs: 4, md: 5 } }}>
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
                <Box component="a" href={figmaPrototypeUrl} target="_blank" rel="noopener noreferrer" aria-label="Figma 프로토타입 새 탭에서 열기"
                  sx={{
                    bgcolor: HUMAN_SIGNAL.inkNavy, color: HUMAN_SIGNAL.softWhite, height: 48, px: 2.5, borderRadius: '12px',
                    display: 'inline-flex', alignItems: 'center', gap: 1, textDecoration: 'none',
                    fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap',
                    '&:focus-visible': { outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`, outlineOffset: '3px' },
                  }}>
                  프로토타입 보기 <OpenInNewIcon sx={{ fontSize: '1rem' }} />
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

          {/* actual UI hero — 프로젝트당 실제 이미지가 1장뿐이라(현재 데이터 기준),
           * 별도 "Main Screens" 섹션을 새로 만들어 같은 이미지를 반복하지 않는다
           * (지시서 15절 예외: "하나뿐인 실제 image를 억지로 gallery로 만들게 됨"에
           * 해당 — 이 Hero 이미지가 Main Screens 역할을 겸한다. project-specific
           * asset gap으로 최종 보고에 기록한다). text보다 작게 보이지 않도록 폭
           * 전체·QHD에서 큰 프레임으로 보여준다. */}
          {thumbnailUrl && (
            <Box sx={{
              borderRadius: '16px', overflow: 'hidden', bgcolor: HUMAN_SIGNAL.deepHarbor,
              border: `1px solid ${HUMAN_SIGNAL.paperDeep}`, boxShadow: '0 30px 60px rgba(12,20,32,0.18)',
              maxWidth: { xl: 1500 },
            }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: 34, px: 2, bgcolor: HUMAN_SIGNAL.softWhite }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '4px', bgcolor: HUMAN_SIGNAL.brightOrange }} />
                <Box sx={{ width: 8, height: 8, borderRadius: '4px', bgcolor: HUMAN_SIGNAL.mutedSage }} />
                <Box sx={{ width: 8, height: 8, borderRadius: '4px', bgcolor: HUMAN_SIGNAL.steelMist }} />
              </Box>
              <Box component="img" src={thumbnailUrl} alt={`${project.title} 실제 화면 — ${categoryLabel}`} loading="eager"
                sx={{ width: '100%', height: 'auto', display: 'block', bgcolor: HUMAN_SIGNAL.softWhite }} />
            </Box>
          )}
        </Box>
      </Box>

      {/* ── Summary facts rail ── */}
      <Box component="section" sx={{ bgcolor: HUMAN_SIGNAL.softWhite, py: { xs: 4, md: 5 }, borderTop: `1px solid ${HUMAN_SIGNAL.paperDeep}`, borderBottom: `1px solid ${HUMAN_SIGNAL.paperDeep}` }}>
        <Box sx={SHELL_SX}>
          <EvidenceBadges project={project} tone="onLight" sx={{ maxWidth: 720 }} />
        </Box>
      </Box>

      {/* 선택적 on-page 목차 — desktop 전용, Header와 겹치지 않는 일반 흐름 위치.
       * scrollspy 없이 단순 목차(지시서: "단순 목차도 충분"). */}
      {SECTION_NAV.length > 0 && (
        <Box sx={{ display: { xs: 'none', md: 'block' }, bgcolor: HUMAN_SIGNAL.warmPaper, py: 2 }}>
          <Box sx={{ ...SHELL_SX, display: 'flex', gap: 3 }}>
            {SECTION_NAV.map((s) => (
              <Box key={s.id} component="a" href={`#${s.id}`}
                sx={{
                  fontFamily: FONT_MONO, fontSize: '0.75rem', letterSpacing: '0.04em', color: HUMAN_SIGNAL.inkText,
                  textDecoration: 'none', minHeight: 44, display: 'inline-flex', alignItems: 'center',
                  '&:hover': { color: HUMAN_SIGNAL.burntOrange },
                  '&:focus-visible': { outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`, outlineOffset: '3px' },
                }}
              >
                {s.label}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* ── Context ── */}
      <Box component="section" sx={{ bgcolor: HUMAN_SIGNAL.warmPaper, py: { xs: 5, md: 7 } }}>
        <Box sx={SHELL_SX}>
          <SectionLabel index="01">CONTEXT</SectionLabel>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, ...READING_SX }}>
            {detail.problem && detail.problem !== '—' && (
              <Typography sx={{ color: HUMAN_SIGNAL.inkNavy, fontSize: { xs: '1rem', md: '1.0625rem' }, lineHeight: 1.7, wordBreak: 'keep-all' }}>
                {detail.problem}
              </Typography>
            )}
            {detail.goal && detail.goal !== '—' && (
              <Typography sx={{ color: HUMAN_SIGNAL.inkText, fontSize: '0.9375rem', lineHeight: 1.7, wordBreak: 'keep-all' }}>
                {detail.goal}
              </Typography>
            )}
            {detail.targetUser && detail.targetUser !== '—' && (
              <Typography sx={{ fontSize: '0.875rem', color: HUMAN_SIGNAL.inkText, lineHeight: 1.6 }}>
                <Box component="span" sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.6875rem', letterSpacing: '0.04em', mr: 1 }}>
                  대상 사용자
                </Box>
                {detail.targetUser}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* ── Key Decisions — 실제 판단이 1개뿐이면(현재 데이터 기준) 1개만 표시하고
       * 억지로 3개로 쪼개지 않는다. title=goal(방향), 왜=problem, 어떻게=designPoint —
       * 모두 실제 필드 재구성이며 새 조사·성과를 만들지 않는다. ── */}
      {hasDecision && (
        <Box id="decisions" component="section" sx={{ bgcolor: HUMAN_SIGNAL.paperDeep, py: { xs: 5, md: 7 }, scrollMarginTop: '96px' }}>
          <Box sx={SHELL_SX}>
            <SectionLabel index="02">KEY DECISIONS</SectionLabel>
            <Box sx={{ ...READING_SX, bgcolor: HUMAN_SIGNAL.softWhite, borderRadius: '16px', p: { xs: 3, md: 4 }, border: `1px solid ${HUMAN_SIGNAL.paperDeep}` }}>
              {detail.goal && detail.goal !== '—' && (
                <Typography sx={{ fontWeight: 700, fontSize: '1.0625rem', color: HUMAN_SIGNAL.inkNavy, lineHeight: 1.5, mb: 2, wordBreak: 'keep-all' }}>
                  {detail.goal}
                </Typography>
              )}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {detail.problem && detail.problem !== '—' && (
                  <Typography sx={{ fontSize: '0.9375rem', color: HUMAN_SIGNAL.inkText, lineHeight: 1.65, wordBreak: 'keep-all' }}>
                    <Box component="span" sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.6875rem', letterSpacing: '0.04em', mr: 1 }}>왜</Box>
                    {detail.problem}
                  </Typography>
                )}
                <Typography sx={{ fontSize: '0.9375rem', color: HUMAN_SIGNAL.inkText, lineHeight: 1.65, wordBreak: 'keep-all' }}>
                  <Box component="span" sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.6875rem', letterSpacing: '0.04em', mr: 1 }}>어떻게</Box>
                  {detail.designPoint}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* ── Responsive & Scope ── */}
      <Box id="scope" component="section" sx={{ bgcolor: HUMAN_SIGNAL.warmPaper, py: { xs: 5, md: 7 }, scrollMarginTop: '96px' }}>
        <Box sx={SHELL_SX}>
          <SectionLabel index={hasDecision ? '03' : '02'}>RESPONSIVE & SCOPE</SectionLabel>
          <Box sx={{
            display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: { xs: 3, md: 4 },
            ...READING_SX, maxWidth: { md: 880 },
          }}>
            <Box>
              <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.6875rem', letterSpacing: '0.04em', mb: 1 }}>RESPONSIVE</Typography>
              <Typography sx={{ fontSize: '0.9375rem', color: HUMAN_SIGNAL.inkText, lineHeight: 1.6, wordBreak: 'keep-all' }}>{deriveResponsive(project)}</Typography>
            </Box>
            {implementationLine && (
              <Box>
                <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.6875rem', letterSpacing: '0.04em', mb: 1 }}>IMPLEMENTATION</Typography>
                <Typography sx={{ fontSize: '0.9375rem', color: HUMAN_SIGNAL.inkText, lineHeight: 1.6, wordBreak: 'keep-all' }}>{implementationLine}</Typography>
              </Box>
            )}
            {project.dataUsage && (
              <Box sx={{ gridColumn: { md: '1 / -1' } }}>
                <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.6875rem', letterSpacing: '0.04em', mb: 1 }}>DATA</Typography>
                <Typography sx={{ fontSize: '0.9375rem', color: HUMAN_SIGNAL.inkText, lineHeight: 1.7, wordBreak: 'keep-all' }}>{project.dataUsage}</Typography>
              </Box>
            )}
            {detail.limitation && (
              <Box sx={{ gridColumn: { md: '1 / -1' } }}>
                <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.6875rem', letterSpacing: '0.04em', mb: 1 }}>LIMIT</Typography>
                <Typography sx={{ fontSize: '0.9375rem', color: HUMAN_SIGNAL.inkText, lineHeight: 1.7, wordBreak: 'keep-all' }}>{detail.limitation}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* ── AI Collaboration — 실제 aiContribution 데이터가 있는 프로젝트만 표시한다
       * (지시서: 있으면 반영, 없다고 임의로 "AI를 안 썼다"고 단정하지도 않는다 —
       * 데이터가 없는 프로젝트는 이 섹션 자체를 만들지 않는다). ── */}
      {hasAI && (
        <Box id="ai" component="section" sx={{ bgcolor: HUMAN_SIGNAL.deepHarbor, py: { xs: 5, md: 7 }, scrollMarginTop: '96px' }}>
          <Box sx={SHELL_SX}>
            <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.brightOrangeOnDark, fontSize: '0.75rem', letterSpacing: '0.06em', mb: 3 }}>
              AI COLLABORATION
            </Typography>
            <Box sx={{
              display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: { xs: 3, md: 4 }, mb: 3, maxWidth: { md: 960 },
            }}>
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
              {detail.aiContribution}
            </Typography>
          </Box>
        </Box>
      )}

      {/* ── Result & Limit ── */}
      <Box id="result" component="section" sx={{ bgcolor: HUMAN_SIGNAL.warmPaper, py: { xs: 5, md: 7 }, scrollMarginTop: '96px' }}>
        <Box sx={SHELL_SX}>
          <SectionLabel index={hasDecision ? '04' : '03'}>RESULT & LIMIT</SectionLabel>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, ...READING_SX }}>
            {detail.result && detail.result !== '—' && (
              <Typography sx={{ color: HUMAN_SIGNAL.inkNavy, fontSize: '0.9375rem', lineHeight: 1.7, wordBreak: 'keep-all' }}>
                {detail.result}
              </Typography>
            )}
            {cardScope && (
              <Typography sx={{ fontSize: '0.875rem', color: HUMAN_SIGNAL.inkText, lineHeight: 1.6 }}>
                <Box component="span" sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.6875rem', letterSpacing: '0.04em', mr: 1 }}>범위 요약</Box>
                {cardScope}
              </Typography>
            )}
            {detail.nextStep && (
              <Typography sx={{ fontSize: '0.875rem', color: HUMAN_SIGNAL.inkText, lineHeight: 1.6 }}>
                <Box component="span" sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.6875rem', letterSpacing: '0.04em', mr: 1 }}>다음 단계</Box>
                {detail.nextStep}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* ── Next Project / Library / Mail — Contact와 같은 Deep Harbor 마무리 톤 ── */}
      <Box component="footer" sx={{ bgcolor: HUMAN_SIGNAL.deepHarbor, py: { xs: 5, md: 6.5 } }}>
        <Box sx={SHELL_SX}>
          <Box sx={{
            display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: { xs: 4, md: 5 },
          }}>
            <Box
              component="button" type="button" onClick={() => navigate(`/projects/${prevSlug}`)}
              aria-label={`이전 프로젝트: ${prevProject?.title}`}
              sx={{
                textAlign: 'left', bgcolor: 'transparent', border: `1px solid rgba(170,183,196,0.24)`, borderRadius: '14px',
                cursor: 'pointer', p: 2.5, minHeight: 44, color: HUMAN_SIGNAL.softWhite,
                '&:hover': { borderColor: HUMAN_SIGNAL.steelMist },
                '&:focus-visible': { outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`, outlineOffset: '3px' },
              }}
            >
              <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.6875rem', letterSpacing: '0.04em', color: HUMAN_SIGNAL.brightOrangeOnDark, mb: 0.5, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                <ActionIcon variant="internal" sx={{ transform: 'rotate(180deg)' }} /> PREV
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>{prevProject?.title}</Typography>
            </Box>
            <Box
              component="button" type="button" onClick={() => navigate(`/projects/${nextSlug}`)}
              aria-label={`다음 프로젝트: ${nextProject?.title}`}
              sx={{
                textAlign: { xs: 'left', sm: 'right' }, bgcolor: 'transparent', border: `1px solid rgba(170,183,196,0.24)`, borderRadius: '14px',
                cursor: 'pointer', p: 2.5, minHeight: 44, color: HUMAN_SIGNAL.softWhite,
                '&:hover': { borderColor: HUMAN_SIGNAL.steelMist },
                '&:focus-visible': { outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`, outlineOffset: '3px' },
              }}
            >
              <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.6875rem', letterSpacing: '0.04em', color: HUMAN_SIGNAL.brightOrangeOnDark, mb: 0.5, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                NEXT <ActionIcon variant="internal" />
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>{nextProject?.title}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, borderTop: '1px solid rgba(170,183,196,0.16)', pt: 3 }}>
            {[
              { label: 'Projects Library', onClick: () => navigate('/projects') },
              { label: 'Mail', href: `mailto:${CONTACT_EMAIL}` },
              { label: 'GitHub', href: GITHUB_PROFILE_URL },
            ].map((item) => (
              <Box
                key={item.label}
                component={item.href ? 'a' : 'button'}
                type={item.href ? undefined : 'button'}
                href={item.href}
                target={item.href?.startsWith('http') ? '_blank' : undefined}
                rel={item.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                onClick={item.onClick}
                sx={{
                  bgcolor: 'transparent', border: 0, cursor: 'pointer', p: 0, minHeight: 44,
                  display: 'inline-flex', alignItems: 'center',
                  color: HUMAN_SIGNAL.softWhite, fontWeight: 500, fontSize: '0.875rem', textDecoration: 'none', fontFamily: 'inherit',
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
};

export default ProjectDetailPage;
