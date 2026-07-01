import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card,
  Button, CircularProgress, Alert, Snackbar, Stack,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import { supabase } from '../../lib/supabase';
import GuestbookForm from '../guestbook/GuestbookForm';
import GuestbookCard from '../guestbook/GuestbookCard';
import RevealOnScroll from '../common/RevealOnScroll';

const GUESTBOOK_PAGE_SIZE = 3;

const ContactSection = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(GUESTBOOK_PAGE_SIZE);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
      sx={(theme) => ({
        position: 'relative',
        overflow: 'hidden',
        bgcolor: theme.palette.mode === 'dark' ? '#1E293B' : 'background.paper',
        py: { xs: 7, md: 9 },
      })}
    >
      {/* 상단 구분선 */}
      <Box
        aria-hidden="true"
        sx={(theme) => ({
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: 1,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, transparent, rgba(56,189,248,0.25), rgba(124,58,237,0.25), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(37,99,235,0.15), rgba(124,58,237,0.15), transparent)',
        })}
      />

      {/* 배경 blob */}
      <Box
        aria-hidden="true"
        sx={(theme) => ({
          position: 'absolute',
          top: '20%',
          right: '-8%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        })}
      />

      <Container maxWidth="lg">

        {/* 섹션 헤더 */}
        <RevealOnScroll>
          <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
            <Typography
              sx={(theme) => ({
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '0.72rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                '&::before': { content: '""', display: 'block', width: 28, height: 1, bgcolor: 'primary.main', opacity: 0.45 },
                '&::after':  { content: '""', display: 'block', width: 28, height: 1, bgcolor: 'primary.main', opacity: 0.45 },
              })}
            >
              03 Contact
            </Typography>
            <Typography variant="h2" sx={{ color: 'text.primary', fontWeight: 800 }}>
              함께 이야기해요
            </Typography>
          </Box>
        </RevealOnScroll>

        {/* CTA 카드 */}
        <RevealOnScroll delay={0.08}>
          <Box
            sx={(theme) => ({
              position: 'relative',
              overflow: 'hidden',
              bgcolor: theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.04)'
                : 'rgba(37,99,235,0.03)',
              border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.18)' : 'rgba(37,99,235,0.15)'}`,
              borderRadius: 3,
              p: { xs: 4, md: 6 },
              mb: { xs: 6, md: 8 },
              textAlign: 'center',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            })}
          >
            {/* SVG 궤도 장식 */}
            <Box
              component="svg"
              viewBox="0 0 400 200"
              aria-hidden="true"
              sx={(theme) => ({
                position: 'absolute',
                bottom: '-20%',
                right: '-5%',
                width: { xs: 200, md: 320 },
                height: 'auto',
                opacity: theme.palette.mode === 'dark' ? 0.1 : 0.05,
                pointerEvents: 'none',
              })}
            >
              <ellipse cx="200" cy="100" rx="180" ry="80" fill="none" stroke="#38BDF8" strokeWidth="1" />
              <ellipse cx="200" cy="100" rx="120" ry="55" fill="none" stroke="#7C3AED" strokeWidth="0.8" strokeDasharray="5 7" />
            </Box>

            {/* 포인트 dot */}
            <Box
              sx={(theme) => ({
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                mx: 'auto',
                mb: 2,
                boxShadow: theme.palette.mode === 'dark' ? '0 0 10px rgba(56,189,248,0.6)' : 'none',
              })}
            />

            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, maxWidth: 460, mx: 'auto', mb: 4 }}>
              채용, 협업, 피드백과 관련된 이야기를 편하게 남겨주세요.
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              alignItems={{ xs: 'stretch', sm: 'center' }}
            >
              <Button
                component="a"
                href="mailto:kdhan0320@gmail.com"
                variant="contained"
                startIcon={<EmailIcon />}
                aria-label="이메일 보내기"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  minHeight: 48,
                  fontWeight: 700,
                  px: 3,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(37,99,235,0.3)' },
                  '&:active': { transform: 'translateY(0)' },
                }}
              >
                Email
              </Button>

              <Button
                component="a"
                href="https://github.com/kdhan0320-bot"
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                startIcon={<GitHubIcon />}
                aria-label="GitHub 프로필 보기"
                sx={(theme) => ({
                  color: 'text.primary',
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.3)' : '#CBD5E1',
                  minHeight: 48,
                  fontWeight: 600,
                  px: 3,
                  whiteSpace: 'nowrap',
                  transition: 'transform 0.2s ease',
                  '&:hover': { borderColor: 'primary.main', color: 'primary.main', transform: 'translateY(-2px)' },
                  '&:active': { transform: 'translateY(0)' },
                })}
              >
                GitHub
              </Button>

            </Stack>
          </Box>
        </RevealOnScroll>

        {/* 방명록 폼 + 목록 */}
        <RevealOnScroll delay={0.1}>
          <Grid container spacing={{ xs: 4, md: 6 }} sx={{ mb: { xs: 6, md: 8 } }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 700, mb: 1 }}>연락처</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 3 }}>
                웹디자인과 UX/UI를 기반으로, 사용자가 이해하기 쉬운 디지털 경험을 만드는 디자이너로 성장하고 있습니다.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[
                  { icon: <EmailIcon fontSize="small" />, label: 'Email', value: 'kdhan0320@gmail.com', href: 'mailto:kdhan0320@gmail.com' },
                  { icon: <GitHubIcon fontSize="small" />, label: 'GitHub', value: 'github.com/kdhan0320-bot', href: 'https://github.com/kdhan0320-bot' },
                ].map(({ icon, label, value, href }) => (
                  <Card
                    key={label}
                    component="a"
                    href={href}
                    target={href.startsWith('mailto') ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    sx={(theme) => ({
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      transition: 'border-color 0.2s, background-color 0.2s, transform 0.2s',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.05)' : '#EFF6FF',
                        transform: 'translateY(-2px)',
                      },
                      '&:hover .contact-icon': { color: 'primary.main' },
                      '&:focus-visible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: '2px' },
                    })}
                  >
                    <Box className="contact-icon" sx={{ color: 'text.secondary', display: 'flex', flexShrink: 0, transition: 'color 0.2s' }}>{icon}</Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2 }}>{label}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, lineHeight: 1.4 }}>{value}</Typography>
                    </Box>
                  </Card>
                ))}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Box
                sx={(theme) => ({
                  p: { xs: 2.5, sm: 3 },
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                })}
              >
                <GuestbookForm onSuccess={handleSuccess} />
              </Box>
            </Grid>
          </Grid>
        </RevealOnScroll>

        {/* 방명록 목록 */}
        <RevealOnScroll delay={0.05}>
          <Box sx={(theme) => ({ pt: 4, borderTop: `1px solid ${theme.palette.divider}` })}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Guestbook</Typography>
              {!loading && entries.length > 0 && (
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>{entries.length}개</Typography>
              )}
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={36} />
              </Box>
            ) : entries.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  아직 방명록이 없습니다. 첫 번째 방명록을 남겨주세요!
                </Typography>
              </Box>
            ) : (
              <>
                <Grid container spacing={2.5}>
                  {visibleEntries.map((entry) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={entry.id}>
                      <GuestbookCard entry={entry} onDeleted={handleDeleted} onUpdated={handleUpdated} />
                    </Grid>
                  ))}
                </Grid>
                {hasMore && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button variant="outlined" onClick={() => setVisibleCount((prev) => prev + GUESTBOOK_PAGE_SIZE)} sx={{ minHeight: 44, px: 4 }}>
                      더보기
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Box>
        </RevealOnScroll>

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
