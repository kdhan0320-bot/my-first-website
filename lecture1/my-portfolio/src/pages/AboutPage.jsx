import { Box, Container, Typography, Grid } from '@mui/material';

const WORK_STANDARDS = [
  { label: '정보 구조', desc: '흩어진 요구사항을 화면 흐름과 섹션 구조로 정리합니다.' },
  { label: '화면 설계', desc: 'Figma로 와이어프레임과 컴포넌트 기준을 잡습니다.' },
  { label: '웹 구현', desc: 'React/MUI, HTML/CSS, JavaScript로 반응형 화면을 구현합니다.' },
  { label: '검증', desc: '모바일·태블릿·PC 화면, 링크, 접근성 요소를 확인합니다.' },
];

const TOOL_SCOPE = [
  { label: 'HTML/CSS', desc: '시맨틱 구조, 반응형 레이아웃, 기본 접근성' },
  { label: 'JavaScript', desc: '상태 변화, 이벤트 처리, UI 인터랙션' },
  { label: 'React/MUI', desc: '컴포넌트 기반 화면 구성, 카드/모달/레이아웃 구현' },
  { label: 'Figma', desc: '와이어프레임, 화면 흐름, 컴포넌트 구조 정리' },
  { label: 'GitHub', desc: '코드 관리, 배포 링크 관리' },
  { label: 'Supabase', desc: '프로젝트 목록 조회 또는 제한적 데이터 구조 이해' },
  { label: 'AI Tools', desc: '문장 정리, 코드 오류 점검, 개선안 비교 보조' },
];

const CURRENT_LIMITS = [
  '실제 사용자 테스트와 정량 성과 데이터는 아직 부족합니다.',
  '프로젝트별 구현 범위와 한계를 명확히 구분해 설명하고 있습니다.',
  '반응형, 접근성, 프로젝트 설명력을 계속 보완하고 있습니다.',
];

const SectionHeader = ({ title }) => (
  <Typography variant="h2" sx={{ color: 'text.primary', fontWeight: 800, fontSize: { xs: '1.4rem', md: '1.6rem' }, mb: 2.5 }}>
    {title}
  </Typography>
);

const AboutPage = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="md">

        {/* 페이지 헤더 */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            sx={{
              color: 'text.secondary',
              letterSpacing: 6,
              fontWeight: 600,
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              mb: 1.5,
            }}
          >
            ABOUT ME
          </Typography>
          <Typography
            variant="h1"
            sx={{ color: 'text.primary', fontWeight: 800, fontSize: { xs: '2rem', md: '2.5rem' } }}
          >
            소개
          </Typography>
          <Box sx={{ width: 44, height: 3, bgcolor: 'primary.main', mx: 'auto', mt: 2, borderRadius: 2 }} />
        </Box>

        {/* Lead 문장 */}
        <Box
          sx={{
            maxWidth: 720,
            mx: 'auto',
            mb: { xs: 5, md: 6 },
            p: { xs: 3, md: 4 },
            bgcolor: 'rgba(56,189,248,0.05)',
            border: '1px solid rgba(56,189,248,0.18)',
            borderLeft: '4px solid',
            borderLeftColor: 'primary.main',
            borderRadius: '0 12px 12px 0',
          }}
        >
          <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.85, fontWeight: 500 }}>
            사용자 흐름을 정리하고, 화면 설계와 웹 구현까지 연결하는 신입 UX/UI·웹퍼블리싱 지원자{' '}
            <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>
              김도한
            </Box>
            입니다.
          </Typography>
        </Box>

        {/* 섹션 1: 작업 기준 */}
        <Box sx={{ mb: { xs: 5, md: 6 } }}>
          <SectionHeader title="작업 기준" />
          <Grid container spacing={2}>
            {WORK_STANDARDS.map((item) => (
              <Grid key={item.label} size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, p: 2.5, height: '100%', bgcolor: '#111827', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 2.5 }}>
                  <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0, mt: '9px', opacity: 0.85 }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.875rem' }}>
                    <Box component="span" sx={{ color: 'text.primary', fontWeight: 700 }}>{item.label}</Box>
                    {': '}{item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* 섹션 2: 사용 도구와 활용 범위 */}
        <Box sx={{ mb: { xs: 5, md: 6 } }}>
          <SectionHeader title="사용 도구와 활용 범위" />
          <Box sx={{ bgcolor: '#111827', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 2.5, p: { xs: 2.5, md: 3 } }}>
            {TOOL_SCOPE.map((tool, i) => (
              <Box
                key={tool.label}
                sx={{
                  display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 0.5, sm: 2 },
                  py: 1.5,
                  borderTop: i === 0 ? 'none' : '1px solid rgba(148,163,184,0.12)',
                }}
              >
                <Typography sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem', width: { sm: 140 }, flexShrink: 0 }}>
                  {tool.label}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  {tool.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* 섹션 3: 현재 한계와 보완 방향 */}
        <Box>
          <SectionHeader title="현재 한계와 보완 방향" />
          <Box sx={{ bgcolor: '#111827', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 2.5, p: { xs: 2.5, md: 3 }, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {CURRENT_LIMITS.map((text) => (
              <Box key={text} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'text.disabled', flexShrink: 0, mt: '9px' }} />
                <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  {text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

      </Container>
    </Box>
  );
};

export default AboutPage;
