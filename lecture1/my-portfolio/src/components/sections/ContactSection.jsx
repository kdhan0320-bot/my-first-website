import {
  Box, Container, Typography, Grid, Button,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import RevealOnScroll from '../ui/RevealOnScroll';

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
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>

        {/* 섹션 헤더 */}
        <RevealOnScroll>
          <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
            <Typography
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '0.72rem',
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

        {/* CTA 카드 — 2열 레이아웃 */}
        <RevealOnScroll delay={0.08}>
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              bgcolor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(56,189,248,0.18)',
              borderRadius: 3,
              p: { xs: 3, md: 4 },
              mb: { xs: 4, md: 5 },
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            {/* SVG 궤도 장식 */}
            <Box
              component="svg"
              viewBox="0 0 400 200"
              aria-hidden="true"
              sx={{
                position: 'absolute',
                bottom: '-15%',
                right: '-3%',
                width: { xs: 160, md: 240 },
                height: 'auto',
                opacity: 0.04,
                pointerEvents: 'none',
              }}
            >
              <ellipse cx="200" cy="100" rx="180" ry="80" fill="none" stroke="#38BDF8" strokeWidth="1.2" />
              <ellipse cx="200" cy="100" rx="120" ry="55" fill="none" stroke="#7C3AED" strokeWidth="0.9" strokeDasharray="5 7" />
              <circle cx="20" cy="100" r="3" fill="#38BDF8" opacity="0.6" />
              <circle cx="380" cy="100" r="3" fill="#7C3AED" opacity="0.6" />
            </Box>

            <Grid container spacing={{ xs: 3, sm: 4 }} sx={{ alignItems: 'center' }}>
              {/* 왼쪽: 제목 + 설명 + 연락처 정보 */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="h3" sx={{ color: 'text.primary', fontWeight: 700, fontSize: { xs: '1.25rem', md: '1.4rem' }, mb: 1 }}>
                  함께 이야기해요
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 2.5 }}>
                  포트폴리오 검토, 피드백, 채용 관련 연락을 편하게 남겨주세요.
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
                      '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(37,99,235,0.3)' },
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
                      '&:hover': { bgcolor: 'rgba(148,163,184,0.2)', borderColor: 'primary.main', color: 'primary.main', transform: 'translateY(-2px)' },
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

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            mt: { xs: 3, md: 6 },
            pt: { xs: 3, md: 3.5 },
            borderTop: '1px solid rgba(148,163,184,0.14)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', fontWeight: 600 }}>
            Dohan.K
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 1.5 }}>
            <Box component="a" href="mailto:kdhan0320@gmail.com"
              sx={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, color: 'text.secondary', fontSize: '0.875rem', textDecoration: 'none', whiteSpace: 'nowrap', '&:hover': { color: 'primary.main' }, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '2px', borderRadius: '4px' } }}>
              kdhan0320@gmail.com
            </Box>
            <Typography component="span" sx={{ color: 'text.disabled', fontSize: '0.875rem' }}>·</Typography>
            <Box component="a" href="https://github.com/kdhan0320-bot" target="_blank" rel="noopener noreferrer"
              sx={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, color: 'text.secondary', fontSize: '0.875rem', textDecoration: 'none', whiteSpace: 'nowrap', '&:hover': { color: 'primary.main' }, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '2px', borderRadius: '4px' } }}>
              GitHub
            </Box>
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
