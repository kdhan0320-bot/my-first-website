import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid,
  Button, CircularProgress, Alert, Snackbar, Collapse,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ForumIcon from '@mui/icons-material/Forum';
import { supabase } from '../../lib/supabase';
import GuestbookForm from '../guestbook/GuestbookForm';
import GuestbookCard from '../guestbook/GuestbookCard';
import RevealOnScroll from '../common/RevealOnScroll';
import StarField from '../common/StarField';

const GUESTBOOK_PAGE_SIZE = 3;

const ContactSection = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(GUESTBOOK_PAGE_SIZE);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [guestbookOpen, setGuestbookOpen] = useState(false);

  const loadEntries = async () => {
    const { data } = await supabase
      .from('guestbook')
      .select('id, author_name, message, email, email_public, emoji, created_at')
      .order('created_at', { ascending: false });
    setEntries(data || []);
    setLoading(false);
  };

  useEffect(() => { loadEntries(); }, []);

  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  const handleSuccess = () => {
    loadEntries();
    setVisibleCount(GUESTBOOK_PAGE_SIZE);
    showSnackbar('방명록이 등록되었습니다.');
  };

  const handleDeleted = (id) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    showSnackbar('방명록이 삭제되었습니다.', 'info');
  };

  const handleUpdated = (id, changes) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...changes } : e));
    showSnackbar('방명록이 수정되었습니다.');
  };

  const visibleEntries = entries.slice(0, visibleCount);
  const hasMore = visibleCount < entries.length;

  return (
    <Box
      component="section"
      id="contact"
      aria-label="연락처"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.default',
        py: { xs: 5, md: 7 },
      }}
    >
      {/* 옅은 별 배경 — 전체 콘셉트 통일 */}
      <StarField count={18} sx={{ opacity: 0.5 }} />

      {/* 상단 구분선 */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.25), rgba(124,58,237,0.25), transparent)',
        }}
      />

      {/* 배경 blob */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: '20%',
          right: '-8%',
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
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
                opacity: 0.12,
                pointerEvents: 'none',
              }}
            >
              <ellipse cx="200" cy="100" rx="180" ry="80" fill="none" stroke="#38BDF8" strokeWidth="1.2" />
              <ellipse cx="200" cy="100" rx="120" ry="55" fill="none" stroke="#7C3AED" strokeWidth="0.9" strokeDasharray="5 7" />
              <circle cx="20" cy="100" r="3" fill="#38BDF8" opacity="0.6" />
              <circle cx="380" cy="100" r="3" fill="#7C3AED" opacity="0.6" />
            </Box>

            <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
              {/* 왼쪽: 제목 + 설명 + 연락처 정보 */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h3" sx={{ color: 'text.primary', fontWeight: 700, fontSize: { xs: '1.25rem', md: '1.4rem' }, mb: 1 }}>
                  함께 이야기해요
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 2.5 }}>
                  채용, 협업, 피드백과 관련된 이야기를 편하게 남겨주세요.
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
                        textDecoration: 'none',
                        color: 'text.secondary',
                        fontSize: '0.82rem',
                        transition: 'color 0.2s',
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      <Box sx={{ color: 'inherit', display: 'flex', flexShrink: 0 }}>{icon}</Box>
                      <Typography variant="body2" sx={{ color: 'inherit', fontWeight: 500 }}>{label}</Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>

              {/* 오른쪽: 버튼 */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: { xs: 'stretch', md: 'flex-end' } }}>
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
                    variant="outlined"
                    startIcon={<GitHubIcon sx={{ fontSize: '20px !important' }} />}
                    aria-label="GitHub 프로필 보기"
                    sx={{
                      color: 'text.primary',
                      borderColor: 'rgba(148,163,184,0.3)',
                      height: 48,
                      width: { xs: '100%', sm: 220 },
                      borderRadius: '13px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      transition: 'transform 0.2s ease',
                      '&:hover': { borderColor: 'primary.main', color: 'primary.main', transform: 'translateY(-2px)' },
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

        {/* 방명록 — 티저 카드 + 접힘/펼침 */}
        <RevealOnScroll delay={0.1}>
          <Box sx={{ mt: 2 }}>
            {/* 티저 카드 */}
            <Box
              onClick={() => setGuestbookOpen((prev) => !prev)}
              role="button"
              tabIndex={0}
              aria-expanded={guestbookOpen}
              onKeyDown={(e) => e.key === 'Enter' && setGuestbookOpen((prev) => !prev)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                px: { xs: 2, md: 2.5 },
                py: 1.5,
                borderRadius: 2,
                border: '1px solid rgba(56,189,248,0.18)',
                bgcolor: 'rgba(255,255,255,0.03)',
                cursor: 'pointer',
                transition: 'border-color 0.2s, background-color 0.2s',
                '&:hover': {
                  borderColor: 'rgba(56,189,248,0.38)',
                  bgcolor: 'rgba(56,189,248,0.05)',
                },
                '&:focus-visible': { outline: `2px solid ${'#38BDF8'}`, outlineOffset: '2px' },
              }}
            >
              {/* 아이콘 */}
              <Box sx={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: 'rgba(56,189,248,0.12)',
                color: 'primary.main',
              }}>
                <ForumIcon sx={{ fontSize: 16 }} />
              </Box>

              {/* 텍스트 */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: 'text.primary', lineHeight: 1.3 }}>
                  방명록 남기기
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                  짧은 피드백이나 응원을 남길 수 있어요.
                </Typography>
              </Box>

              {/* 오른쪽: 개수 + 토글 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                {!loading && entries.length > 0 && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
                    방문자 의견 {entries.length}개
                  </Typography>
                )}
                <KeyboardArrowDownIcon sx={{
                  fontSize: '1.1rem',
                  color: 'text.secondary',
                  transition: 'transform 0.25s ease',
                  transform: guestbookOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }} />
              </Box>
            </Box>

            {/* 접힘/펼침 콘텐츠 */}
            <Collapse in={guestbookOpen} timeout={300}>
              <Box
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  mb: 3,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'rgba(255,255,255,0.02)',
                }}
              >
                <GuestbookForm onSuccess={handleSuccess} />
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : entries.length > 0 ? (
                <>
                  <Grid container spacing={2}>
                    {visibleEntries.map((entry) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={entry.id}>
                        <GuestbookCard entry={entry} onDeleted={handleDeleted} onUpdated={handleUpdated} />
                      </Grid>
                    ))}
                  </Grid>
                  {hasMore && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                      <Button variant="outlined" size="small" onClick={() => setVisibleCount((prev) => prev + GUESTBOOK_PAGE_SIZE)} sx={{ px: 3 }}>
                        더보기
                      </Button>
                    </Box>
                  )}
                </>
              ) : null}
            </Collapse>
          </Box>
        </RevealOnScroll>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            mt: { xs: 5, md: 6 },
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
          <Typography sx={{ color: 'text.secondary', fontSize: '0.78rem', fontWeight: 600 }}>
            Dohan.K
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 1.5 }}>
            <Box component="a" href="mailto:kdhan0320@gmail.com"
              sx={{ color: 'text.secondary', fontSize: '0.78rem', textDecoration: 'none', whiteSpace: 'nowrap', '&:hover': { color: 'primary.main' } }}>
              kdhan0320@gmail.com
            </Box>
            <Typography component="span" sx={{ color: 'text.disabled', fontSize: '0.78rem' }}>·</Typography>
            <Box component="a" href="https://github.com/kdhan0320-bot" target="_blank" rel="noopener noreferrer"
              sx={{ color: 'text.secondary', fontSize: '0.78rem', textDecoration: 'none', whiteSpace: 'nowrap', '&:hover': { color: 'primary.main' } }}>
              GitHub
            </Box>
          </Box>
          <Typography sx={{ color: 'text.disabled', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
            © 2026 Kim Dohan
          </Typography>
        </Box>

      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} sx={{ fontWeight: 500 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactSection;
