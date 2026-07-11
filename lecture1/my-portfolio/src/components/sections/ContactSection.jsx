import {
  Box, Container, Typography, Grid, Button, Stack,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import RevealOnScroll from '../ui/RevealOnScroll';
import LogoSymbol from '../ui/LogoSymbol';

const ContactSection = () => {
  return (
    <Box
      component="section"
      id="contact"
      aria-label="연락처"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.default',
        pt: { xs: 4, md: 5 },
        pb: { xs: 4, md: 5 },
        /* Contact는 마지막 섹션이라 콘텐츠가 짧으면 문서 최대 스크롤이 "헤더 밑에 상단 정렬"에
         * 필요한 거리보다 작아져, scrollToSection이 브라우저 clamp로 목표보다 훨씬 아래에서
         * 멈추는 문제가 있었다. 최소 뷰포트 비율을 확보해 항상 스크롤 여유 공간이 있게 한다. */
        minHeight: { xs: 'auto', sm: '85vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Projects Flow Path를 받는 소프트 글로우 — Flow Motion이 Contact/Footer 도착점으로 모여드는 느낌의 시작점 */}
      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          top: '-4%', left: '50%', transform: 'translateX(-50%)',
          width: 280, height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(56,189,248,0.13) 0%, transparent 72%)',
          filter: 'blur(52px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {/* 배경 리듬 — Projects의 blueprint grid와 구분되는 저채도 radial glow, 정적 배치 */}
      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          top: '-6%', left: '-8%',
          width: 360, height: 360,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(129,140,248,0.1) 0%, transparent 70%)',
          filter: 'blur(56px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>

        {/* 섹션 헤더 */}
        <RevealOnScroll>
          <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
            <Typography
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '0.875rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                '&::before': { content: '""', display: 'block', width: 28, height: 1, bgcolor: 'primary.main', opacity: 0.45 },
                '&::after':  { content: '""', display: 'block', width: 28, height: 1, bgcolor: 'primary.main', opacity: 0.45 },
              }}
            >
              03 연락처
            </Typography>
          </Box>
        </RevealOnScroll>

        {/* CTA 카드 — 2열 레이아웃, 마지막 인상 섹션답게 위계를 명확히 강화 */}
        <RevealOnScroll delay={0.08}>
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              bgcolor: 'rgba(255,255,255,0.045)',
              border: '1px solid rgba(148,163,184,0.16)',
              borderLeft: '4px solid',
              borderLeftColor: 'primary.main',
              borderRadius: '0 12px 12px 0',
              p: { xs: 3, md: 4.5 },
              mb: { xs: 4, md: 5 },
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            {/* Flow Stream 끝자락 — Hero/About과 이어지는 정적 glow, 무한 반복 없음 */}
            <Box
              aria-hidden="true"
              sx={{
                display: { xs: 'none', md: 'block' },
                position: 'absolute',
                top: '-40%', right: '-10%',
                width: 420, height: 420,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(56,189,248,0.19) 0%, transparent 70%)',
                filter: 'blur(50px)',
                pointerEvents: 'none',
              }}
            />

            <Grid container spacing={{ xs: 3, sm: 4 }} sx={{ alignItems: 'center', position: 'relative' }}>
              {/* 왼쪽: 제목 + 설명 + 연락처 정보 */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="h3" sx={{ color: 'text.primary', fontWeight: 800, fontSize: { xs: '1.5rem', md: '1.75rem' }, mb: 1.25 }}>
                  함께 이야기해요
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 1 }}>
                  포트폴리오 검토, 피드백, 채용 관련 연락을 편하게 남겨주세요.
                </Typography>
                <Typography sx={{ color: 'text.primary', fontWeight: 700, fontSize: '1.0625rem', lineHeight: 1.7, mb: 2.5 }}>
                  정리된 화면과 구현 가능한 구조로 이야기하겠습니다.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {[
                    { icon: <EmailIcon fontSize="small" />, label: 'kdhan0320@gmail.com', href: 'mailto:kdhan0320@gmail.com' },
                    { icon: <GitHubIcon fontSize="small" />, label: 'github.com/kdhan0320-bot', href: 'https://github.com/kdhan0320-bot' },
                  ].map(({ icon, label, href }) => (
                    <Box
                      key={label}
                      component="a"
                      href={href}
                      target={href.startsWith('mailto') ? '_self' : '_blank'}
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        minHeight: 44,
                        textDecoration: 'none',
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                        transition: 'color 0.2s',
                        '&:hover': { color: 'primary.main' },
                        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '2px', borderRadius: '4px' },
                      }}
                    >
                      <Box sx={{ color: 'inherit', display: 'flex', flexShrink: 0 }}>{icon}</Box>
                      <Typography variant="body2" sx={{ color: 'inherit', fontWeight: 500 }}>{label}</Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>

              {/* 오른쪽: 버튼 */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: { xs: 'stretch', sm: 'flex-end' } }}>
                  <Button
                    component="a"
                    href="mailto:kdhan0320@gmail.com"
                    variant="contained"
                    startIcon={<EmailIcon sx={{ fontSize: '20px !important' }} />}
                    aria-label="이메일 보내기"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      height: 48,
                      width: { xs: '100%', sm: 220 },
                      borderRadius: '13px',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-3px)', boxShadow: '0 10px 26px rgba(37,99,235,0.42)' },
                      '&:active': { transform: 'translateY(0)' },
                    }}
                  >
                    이메일 보내기
                  </Button>
                  <Button
                    component="a"
                    href="https://github.com/kdhan0320-bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    disableElevation
                    startIcon={<GitHubIcon sx={{ fontSize: '20px !important' }} />}
                    aria-label="GitHub 프로필 보기"
                    sx={{
                      bgcolor: 'rgba(148,163,184,0.12)',
                      color: 'text.primary',
                      border: '1px solid rgba(148,163,184,0.28)',
                      height: 48,
                      width: { xs: '100%', sm: 220 },
                      borderRadius: '13px',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      transition: 'transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease',
                      '&:hover': { bgcolor: 'rgba(148,163,184,0.24)', borderColor: 'primary.main', color: 'primary.main', transform: 'translateY(-3px)', boxShadow: '0 10px 26px rgba(0,0,0,0.28)' },
                      '&:active': { transform: 'translateY(0)' },
                    }}
                  >
                    GitHub
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </RevealOnScroll>

        {/* CTA 카드와 Footer를 잇는 정적 Flow Path 세그먼트 — 두 영역이 분리된 카드처럼 끊기지 않게 함 */}
        <Box
          aria-hidden="true"
          sx={{
            display: { xs: 'none', md: 'block' },
            width: '1px', height: 28, mx: 'auto',
            background: 'linear-gradient(180deg, transparent, rgba(56,189,248,0.4))',
            pointerEvents: 'none',
          }}
        />

        {/* Footer — 링크 없이 Dohan.K 브랜드 마감(도착점). Contact 카드와 내용 중복 없음 */}
        <Box
          component="footer"
          sx={{
            position: 'relative',
            mt: { xs: 3, md: 4 },
            pt: { xs: 3.5, md: 4.5 },
            borderTop: '1px solid rgba(148,163,184,0.14)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -1, left: '18%', right: '18%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.5), transparent)',
            },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-end' },
            justifyContent: 'space-between',
            gap: 1.5,
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          {/* 왼쪽: 브랜드 블록 — 아주 약한 glow로 마무리 존재감만 보강 */}
          <Box sx={{ position: 'relative' }}>
            <Box
              aria-hidden="true"
              sx={{
                position: 'absolute',
                top: '50%', left: { xs: '50%', sm: 0 },
                transform: { xs: 'translate(-50%, -50%)', sm: 'translateY(-50%)' },
                width: 170, height: 74,
                background: 'radial-gradient(ellipse, rgba(56,189,248,0.22) 0%, transparent 72%)',
                filter: 'blur(20px)',
                pointerEvents: 'none',
              }}
            />
            <Stack direction="row" alignItems="center" spacing={1.25} sx={{ position: 'relative', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              <LogoSymbol size={32} />
              <Typography sx={{ color: 'text.primary', fontSize: '1.85rem', fontWeight: 800, letterSpacing: '0.03em' }}>
                Dohan.K
              </Typography>
            </Stack>
            <Typography sx={{ position: 'relative', color: 'text.disabled', fontSize: '0.875rem', mt: 0.5, ml: { sm: '40px' } }}>
              Design to Web Interface
            </Typography>
          </Box>

          <Typography sx={{ color: 'text.disabled', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
            © 2026 Kim Dohan
          </Typography>
        </Box>

      </Container>
    </Box>
  );
};

export default ContactSection;
