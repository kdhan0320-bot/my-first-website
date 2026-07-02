import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card,
  Button, CircularProgress, Alert, Snackbar, Collapse,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
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
      sx={(theme) => ({
        position: 'relative',
        overflow: 'hidden',
        bgcolor: theme.palette.mode === 'dark' ? '#1E293B' : 'background.paper',
        py: { xs: 5, md: 7 },
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
          width: 260,
          height: 260,
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
          <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
            <Typography
              sx={(theme) => ({
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
              })}
            >
              03 연락처
            </Typography>
          </Box>
        </RevealOnScroll>

        {/* CTA 카드 — 2열 레이아웃 */}
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
              p: { xs: 3, md: 4 },
              mb: { xs: 4, md: 5 },
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
                bottom: '-15%',
                right: '-3%',
                width: { xs: 160, md: 240 },
                height: 'auto',
                opacity: theme.palette.mode === 'dark' ? 0.12 : 0.07,
                pointerEvents: 'none',
              })}
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
                      sx={(theme) => ({
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        textDecoration: 'none',
                        color: 'text.secondary',
                        fontSize: '0.82rem',
                        transition: 'color 0.2s',
                        '&:hover': { color: 'primary.main' },
                      })}
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
                    startIcon={<EmailIcon />}
                    aria-label="이메일 보내기"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      minHeight: 44,
                      fontWeight: 700,
                      px: 3,
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
                    startIcon={<GitHubIcon />}
                    aria-label="GitHub 프로필 보기"
                    sx={(theme) => ({
                      color: 'text.primary',
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.3)' : '#CBD5E1',
                      minHeight: 44,
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
                  <Button
                    disabled
                    size="small"
                    startIcon={<PictureAsPdfIcon sx={{ fontSize: '0.8rem !important' }} />}
                    aria-label="PDF 포트폴리오 준비 중"
                    sx={(theme) => ({
                      color: 'text.disabled',
                      fontSize: '0.78rem',
                      fontWeight: 500,
                      px: 2,
                      minHeight: 32,
                      whiteSpace: 'nowrap',
                      alignSelf: { xs: 'flex-start', md: 'flex-end' },
                      border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.14)' : '#E2E8F0'}`,
                      borderRadius: 2,
                      '&.Mui-disabled': {
                        color: 'text.disabled',
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.12)' : '#EDF2F7',
                      },
                    })}
                  >
                    PDF 포트폴리오 준비 중
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </RevealOnScroll>

        {/* 방명록 — 접힘/펼침 보조 영역 */}
        <RevealOnScroll delay={0.1}>
          <Box sx={(theme) => ({ pt: 3, borderTop: `1px solid ${theme.palette.divider}` })}>
            {/* 토글 버튼 */}
            <Button
              variant="text"
              size="small"
              endIcon={
                <KeyboardArrowDownIcon
                  sx={{
                    fontSize: '1rem !important',
                    transition: 'transform 0.25s ease',
                    transform: guestbookOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              }
              onClick={() => setGuestbookOpen((prev) => !prev)}
              sx={(theme) => ({
                color: 'text.disabled',
                fontSize: '0.78rem',
                fontWeight: 600,
                px: 0,
                mb: 1,
                '&:hover': { color: 'text.secondary', bgcolor: 'transparent' },
              })}
            >
              방명록{!loading && entries.length > 0 ? ` (${entries.length})` : ''}
            </Button>

            {/* 접힘/펼침 콘텐츠 */}
            <Collapse in={guestbookOpen} timeout={300}>
              <Box
                sx={(theme) => ({
                  p: { xs: 2, sm: 2.5 },
                  mb: 3,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                })}
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
