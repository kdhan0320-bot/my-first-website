import { Box, Container, Typography } from '@mui/material';
import { ALL_PROJECTS } from '../../data/projectsData';
import { PROJECT_GITHUB_URL } from '../../data/portfolioMeta';
import { FONT_MONO, COLORS } from '../../theme';

/* Figma 05_More_Works(42:185) 그대로. 카드 1·2는 실제 링크를 연결하고, 카드 3은
 * Figma 자체가 미확정 placeholder("공개 범위 확인 후 추가")로 표시하고 있어
 * 가짜 프로젝트를 채우지 않고 그 문구 그대로 두고 링크를 비활성 처리한다. */
const ottService = ALL_PROJECTS.find((p) => p.id === 'ott-service');

const WORK_CARDS = [
  {
    number: '01',
    title: 'WEB PORTFOLIO',
    meta: 'React/MUI · Responsive',
    href: PROJECT_GITHUB_URL,
    light: true,
  },
  {
    number: '02',
    title: 'OTT SERVICE',
    meta: 'UI / Web Publishing',
    href: ottService?.liveUrl ?? ottService?.githubUrl ?? null,
    light: false,
  },
  {
    number: '03',
    title: 'OTHER WORKS',
    meta: '공개 범위 확인 후 추가',
    href: null,
    light: true,
  },
];

const WorkCard = ({ card }) => {
  const isLink = Boolean(card.href);
  return (
    <Box
      component={isLink ? 'a' : 'div'}
      href={isLink ? card.href : undefined}
      target={isLink ? '_blank' : undefined}
      rel={isLink ? 'noopener noreferrer' : undefined}
      aria-label={isLink ? `${card.title} 새 탭에서 열기` : undefined}
      sx={{
        display: 'flex', flexDirection: 'column', gap: 2.25,
        height: 260, p: 2.75, borderRadius: '14px',
        textDecoration: 'none', minWidth: 0,
        bgcolor: card.light ? COLORS.warmIvory : COLORS.deepSlate,
        border: card.light ? 'none' : '1px solid #33404D',
        cursor: isLink ? 'pointer' : 'default',
        transition: 'transform 0.2s ease',
        '&:hover': isLink ? { transform: 'translateY(-3px)' } : undefined,
        '&:focus-visible': { outline: '2px solid', outlineColor: COLORS.inkBlack, outlineOffset: '2px' },
      }}
    >
      <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.6875rem', color: card.light ? COLORS.inkBlack : 'primary.main' }}>
        {card.number}
      </Typography>
      <Typography component="h3" sx={{ fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.3, color: card.light ? COLORS.inkBlack : COLORS.warmIvory }}>
        {card.title}
      </Typography>
      <Typography sx={{ fontSize: '0.8125rem', color: card.light ? COLORS.darkSecondary : COLORS.lightSecondary }}>
        {card.meta}
      </Typography>
      <Box sx={{ flex: 1 }} />
      {isLink && (
        <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.6875rem', fontWeight: 600, color: card.light ? COLORS.inkBlack : 'primary.main' }}>
          VIEW PROJECT →
        </Typography>
      )}
    </Box>
  );
};

const MoreWorksSection = () => (
  <Box component="section" aria-label="더 많은 작업물" sx={{ bgcolor: 'primary.main', py: { xs: 7, md: 12 } }}>
    <Container maxWidth={false} sx={{ px: { xs: 3, sm: 6, md: 8 } }}>
      <Typography sx={{ fontFamily: FONT_MONO, color: COLORS.inkBlack, fontSize: '0.75rem', letterSpacing: '0.04em', mb: 2 }}>
        04 / MORE WORKS
      </Typography>
      <Typography component="h2" sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2.2rem', md: '2.9rem' }, lineHeight: 1.25, color: COLORS.inkBlack, mb: 1.5 }}>
        <Box component="span" sx={{ display: 'block' }}>대표작 외 작업을</Box>
        <Box component="span" sx={{ display: 'block' }}>빠르게 탐색합니다.</Box>
      </Typography>
      <Typography sx={{ color: '#252B32', fontSize: '0.875rem', mb: { xs: 4, md: 6 }, maxWidth: 620 }}>
        자동 무한 재생이 아니라 사용자가 스크롤하고 선택하는 큰 썸네일 목록입니다.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: { xs: 2.5, sm: 3.5 } }}>
        {WORK_CARDS.map((card) => <WorkCard key={card.number} card={card} />)}
      </Box>
    </Container>
  </Box>
);

export default MoreWorksSection;
