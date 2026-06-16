import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Divider, Card,
  Button, CircularProgress, Alert, Snackbar,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
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

const SNS_BUTTONS = [
  { icon: <GitHubIcon />, label: 'GitHub', href: 'https://github.com/kdhan0320-bot' },
  { icon: <EmailIcon />,  label: 'Email',  href: 'mailto:kdhan0320@gmail.com' },
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
      .select('id, author_name, message, affiliation, email, email_public, emoji, keyword, star_rating, created_at')
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
    <Box sx={{ bgcolor: 'background.default', py: { xs: 8, md: 12 } }} id="contact">
      <Container maxWidth="lg">

        {/* 섹션 헤더 */}
        <RevealOnScroll>
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Typography
              variant="overline"
              sx={{ color: 'text.secondary', letterSpacing: 4, fontWeight: 600, fontSize: '0.75rem' }}
            >
              CONTACT
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, color: 'text.primary' }}>
              함께 이야기해요
            </Typography>
            <Divider sx={{ width: 48, mx: 'auto', mt: 2, borderColor: 'primary.main', borderWidth: 2 }} />
            <Typography variant="body2" sx={{ mt: 2.5, color: 'text.secondary', maxWidth: 440, mx: 'auto', lineHeight: 1.7 }}>
              언제든 연락 주세요. 방명록도 남겨주시면 큰 힘이 됩니다.
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

              {/* SNS 버튼 그리드 */}
              <Typography variant="h6" sx={{ color: 'text.primary', mb: 1.5, fontSize: '0.9rem', letterSpacing: 0.5 }}>
                소셜 미디어
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
                {SNS_BUTTONS.map(({ icon, label, href }) => (
                  <Button
                    key={label}
                    component="a"
                    href={href}
                    target={href.startsWith('mailto') ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    variant="outlined"
                    startIcon={icon}
                    sx={(theme) => ({
                      color: 'text.secondary',
                      borderColor: theme.palette.divider,
                      py: 1.25,
                      minHeight: 44,
                      justifyContent: 'flex-start',
                      fontSize: '0.875rem',
                      transition: 'border-color 0.2s, color 0.2s, background-color 0.2s, transform 0.2s',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        bgcolor: theme.palette.highlight.background,
                        transform: 'translateY(-1px)',
                      },
                      '&:active': { transform: 'translateY(0)' },
                      '&:focus-visible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: '2px' },
                    })}
                  >
                    {label}
                  </Button>
                ))}
              </Box>
            </Grid>

            {/* 오른쪽: 방명록 폼 */}
            <Grid size={{ xs: 12, md: 8 }}>
              <GuestbookForm onSuccess={handleSuccess} />
            </Grid>
          </Grid>
        </RevealOnScroll>

        {/* 방명록 목록 */}
        <RevealOnScroll delay={0.05}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 4 }}>
              <Typography variant="h3" sx={{ color: 'text.primary' }}>방명록</Typography>
              {!loading && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  총 {entries.length}개
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
