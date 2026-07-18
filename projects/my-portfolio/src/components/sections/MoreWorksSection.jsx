import { Box, Container, Typography } from '@mui/material';
import { ALL_PROJECTS } from '../../data/projectsData';
import { FONT_MONO, COLORS } from '../../theme';

/* 실제로 공개 가능하다고 조사·판단한 프로젝트만 보여준다(`moreWorksPublished:
 * true`). 준비 중/공개 예정/빈 슬롯 카드는 절대 만들지 않는다 — 공개 항목이
 * 없으면 섹션 전체를 렌더링하지 않는다. */
const PUBLISHED_WORKS = ALL_PROJECTS.filter((p) => p.moreWorksPublished);

const WorkCard = ({ project, index }) => {
  const href = project.liveUrl ?? project.githubUrl ?? null;
  const isLink = Boolean(href);
  const meta = project.categoryLabel || (project.tools ?? []).join(' · ');
  return (
    <Box
      component={isLink ? 'a' : 'div'}
      href={isLink ? href : undefined}
      target={isLink ? '_blank' : undefined}
      rel={isLink ? 'noopener noreferrer' : undefined}
      aria-label={isLink ? `${project.title} 새 탭에서 열기` : undefined}
      sx={{
        display: 'flex', flexDirection: 'column', gap: 2.25,
        height: 260, p: 2.75, borderRadius: '14px',
        textDecoration: 'none', minWidth: 0,
        bgcolor: COLORS.deepSlate,
        border: '1px solid #33404D',
        cursor: isLink ? 'pointer' : 'default',
        transition: 'transform 0.2s ease',
        '&:hover': isLink ? { transform: 'translateY(-3px)' } : undefined,
        '&:focus-visible': { outline: '2px solid', outlineColor: COLORS.warmIvory, outlineOffset: '2px' },
      }}
    >
      <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.6875rem', color: 'primary.main' }}>
        {String(index + 1).padStart(2, '0')}
      </Typography>
      <Typography component="h3" sx={{ fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.3, color: COLORS.warmIvory }}>
        {project.title}
      </Typography>
      <Typography sx={{ fontSize: '0.8125rem', color: COLORS.lightSecondary }}>
        {meta}
      </Typography>
      <Box sx={{ flex: 1 }} />
      {isLink && (
        <Typography sx={{ fontFamily: FONT_MONO, fontSize: { xs: '0.75rem', md: '0.6875rem' }, fontWeight: 600, color: 'primary.main' }}>
          VIEW PROJECT →
        </Typography>
      )}
    </Box>
  );
};

const MoreWorksSection = () => {
  if (PUBLISHED_WORKS.length === 0) return null;

  const count = PUBLISHED_WORKS.length;

  return (
    <Box component="section" aria-label="더 많은 작업물" sx={{ bgcolor: 'primary.main', py: { xs: 7, md: count === 1 ? 8 : 12 } }}>
      <Container maxWidth={false} sx={{ px: { xs: 3, sm: 6, md: 8 } }}>
        <Typography sx={{ fontFamily: FONT_MONO, color: COLORS.inkBlack, fontSize: '0.75rem', letterSpacing: '0.04em', mb: 2 }}>
          04 / MORE WORKS
        </Typography>
        <Typography component="h2" sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2.2rem', md: '2.9rem' }, lineHeight: 1.25, color: COLORS.inkBlack, mb: 1.5 }}>
          <Box component="span" sx={{ display: 'block' }}>대표작 외 작업을</Box>
          <Box component="span" sx={{ display: 'block' }}>빠르게 탐색합니다.</Box>
        </Typography>
        <Typography sx={{ color: '#252B32', fontSize: '0.875rem', mb: { xs: 4, md: count === 1 ? 4.5 : 6 }, maxWidth: 620 }}>
          자동 무한 재생이 아니라 사용자가 스크롤하고 선택하는 큰 썸네일 목록입니다.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: `repeat(${Math.min(count, 3)}, minmax(280px, 380px))` },
            justifyContent: { xs: 'stretch', sm: 'flex-start' },
            gap: { xs: 2.5, sm: 3.5 },
          }}
        >
          {PUBLISHED_WORKS.map((project, i) => <WorkCard key={project.id} project={project} index={i} />)}
        </Box>
      </Container>
    </Box>
  );
};

export default MoreWorksSection;
