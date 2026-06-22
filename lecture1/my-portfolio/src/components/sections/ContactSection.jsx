import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card,
  Button, CircularProgress, Alert, Snackbar,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import DownloadIcon from '@mui/icons-material/Download';
import { supabase } from '../../lib/supabase';
import GuestbookForm from '../guestbook/GuestbookForm';
import GuestbookCard from '../guestbook/GuestbookCard';
import RevealOnScroll from '../common/RevealOnScroll';

const CONTACT_CARDS = [
  {
    icon: <EmailIcon />,
    label: 'Email',
    value: 'kdhan0320@gmail.com',
    href: 'mailto:kdhan0320@gmail.com',
  },
  {
    icon: <GitHubIcon />,
    label: 'GitHub',
    value: 'github.com/kdhan0320-bot',
    href: 'https://github.com/kdhan0320-bot',
  },
];

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
    <Box component="section" id="contact" aria-label="연락처" sx={{ bgcolor: 'background.default', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">

        {/* 섹션 헤더 */}
        <RevealOnScroll>
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Typography
              sx={{ color: 'text.secondary', letterSpacing: 6, fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1.5 }}
            >
              CONTACT
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, color: 'text.primary', fontWeight: 800 }}>
              함께 이야기해요
            </Typography>
            <Box sx={{ width: 44, height: 3, bgcolor: 'primary.main', mx: 'auto', mt: 2, borderRadius: 2 }} />
            <Typography variant="body2" sx={{ mt: 2.5, color: 'text.secondary', maxWidth: 440, mx: 'auto', lineHeight: 1.7 }}>
              채용, 협업, 피드백 등 어떤 이야기든 환영합니다. 편하게 연락해 주세요.
            </Typography>
          </Box>
        </RevealOnScroll>

        {/* 연락처 + 방명록 폼 */}
        <RevealOnScroll delay={0.1}>
          <Grid container spacing={{ xs: 4, md: 8 }} sx={{ mb: { xs: 6, md: 10 } }} id="guestbook">

            {/* 왼쪽: 연락처 정보 */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h4" sx={{ color: 'text.primary', mb: 3 }}>연락처</Typography>

              {/* 연락처 카드 */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
                {CONTACT_CARDS.map(({ icon, label, value, href }) => (
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
                      transition: 'border-color 0.2s, background-color 0.2s, transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        bgcolor: theme.palette.highlight.background,
                        transform: 'translateY(-3px)',
                        boxShadow: theme.palette.mode === 'dark' ? '0 8px 24px rgba(0,0,0,0.35)' : '0 8px 24px rgba(26,26,46,0.1)',
                      },
                      '&:hover .contact-icon': { color: theme.palette.primary.main },
                      '&:active': { transform: 'translateY(0)' },
                      '&:focus-visible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: '2px' },
                    })}
                  >
                    <Box className="contact-icon" sx={{ color: 'text.secondary', display: 'flex', flexShrink: 0, transition: 'color 0.2s' }}>{icon}</Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2 }}>
                        {label}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, lineHeight: 1.4 }}>
                        {value}
                      </Typography>
                    </Box>
                  </Card>
                ))}
              </Box>

              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 3 }}>
                웹디자인과 UX/UI를 기반으로, 사용자가 이해하기 쉬운 디지털 경험을 만드는 디자이너로 성장하고 있습니다.
              </Typography>

              {/* Portfolio PDF 버튼 (준비 중) */}
              <Button
                disabled
                startIcon={<DownloadIcon />}
                variant="outlined"
                fullWidth
                aria-label="포트폴리오 PDF 준비 중"
                sx={{
                  fontWeight: 600,
                  minHeight: 44,
                  justifyContent: 'flex-start',
                  pl: 2,
                  opacity: 0.55,
                  cursor: 'default',
                }}
              >
                PDF Portfolio — Coming Soon
              </Button>
            </Grid>

            {/* 오른쪽: 방명록 폼 */}
            <Grid size={{ xs: 12, md: 8 }}>
              <GuestbookForm onSuccess={handleSuccess} />
            </Grid>
          </Grid>
        </RevealOnScroll>

        {/* 방명록 목록 (보조 섹션) */}
        <RevealOnScroll delay={0.05}>
          <Box sx={(theme) => ({ pt: 4, borderTop: `1px solid ${theme.palette.divider}` })}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Guestbook</Typography>
              {!loading && entries.length > 0 && (
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  {entries.length}개
                </Typography>
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
                      <GuestbookCard
                        entry={entry}
                        onDeleted={handleDeleted}
                        onUpdated={handleUpdated}
                      />
                    </Grid>
                  ))}
                </Grid>
                {hasMore && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                      variant="outlined"
                      onClick={() => setVisibleCount((prev) => prev + GUESTBOOK_PAGE_SIZE)}
                      sx={{ minHeight: 44, px: 4 }}
                    >
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
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          sx={{ fontWeight: 500 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactSection;
