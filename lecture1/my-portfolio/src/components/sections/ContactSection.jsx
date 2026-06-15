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

const ContactSection = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
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
    showSnackbar('방명록이 등록되었습니다! 감사합니다 😊');
  };

  const handleDeleted = (id) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    showSnackbar('방명록이 삭제되었습니다.', 'info');
  };

  const handleUpdated = (id, changes) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...changes } : e));
    showSnackbar('방명록이 수정되었습니다.');
  };

  return (
    <Box sx={{ bgcolor: '#1A1A2E', py: { xs: 8, md: 12 } }} id="contact">
      <Container maxWidth="lg">

        {/* 섹션 헤더 */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="overline"
            sx={{ color: '#666666', letterSpacing: 4, fontWeight: 600, fontSize: '0.75rem' }}
          >
            CONTACT
          </Typography>
          <Typography variant="h2" sx={{ mt: 1, color: '#FFFFFF' }}>
            함께 이야기해요
          </Typography>
          <Divider sx={{ width: 48, mx: 'auto', mt: 2, borderColor: '#FFFFFF', borderWidth: 2 }} />
          <Typography variant="body2" sx={{ mt: 2.5, color: '#888888', maxWidth: 440, mx: 'auto', lineHeight: 1.7 }}>
            언제든 연락 주세요. 방명록도 남겨주시면 큰 힘이 됩니다 🙌
          </Typography>
        </Box>

        {/* 연락처 + 방명록 폼 */}
        <Grid container spacing={{ xs: 4, md: 8 }} sx={{ mb: { xs: 6, md: 10 } }}>

          {/* 왼쪽: 연락처 정보 */}
          <Grid item xs={12} md={4}>
            <Typography variant="h4" sx={{ color: '#FFFFFF', mb: 3 }}>연락처</Typography>

            {/* 연락처 카드 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
              {CONTACT_CARDS.map(({ icon, label, value, href }) => (
                <Card
                  key={label}
                  component="a"
                  href={href}
                  target={href.startsWith('mailto') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  sx={{
                    bgcolor: '#242450',
                    border: '1px solid #2E2E5E',
                    borderRadius: 2,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    transition: 'border-color 0.2s, background-color 0.2s, transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      borderColor: '#1578AA',
                      bgcolor: '#2A2A5A',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                    },
                    '&:hover .contact-icon': { color: '#1578AA' },
                    '&:active': { transform: 'translateY(0)' },
                    '&:focus-visible': { outline: '2px solid #1578AA', outlineOffset: '2px' },
                  }}
                >
                  <Box className="contact-icon" sx={{ color: '#777777', display: 'flex', flexShrink: 0, transition: 'color 0.2s' }}>{icon}</Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#555555', display: 'block', lineHeight: 1.2 }}>
                      {label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#DDDDDD', fontWeight: 500, lineHeight: 1.4 }}>
                      {value}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Box>

            {/* SNS 버튼 그리드 */}
            <Typography variant="h6" sx={{ color: '#CCCCCC', mb: 1.5, fontSize: '0.9rem', letterSpacing: 0.5 }}>
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
                  sx={{
                    color: '#BBBBBB',
                    borderColor: '#2A2A2A',
                    borderRadius: 2,
                    py: 1.25,
                    minHeight: 44,
                    justifyContent: 'flex-start',
                    fontSize: '0.875rem',
                    transition: 'border-color 0.2s, color 0.2s, background-color 0.2s, transform 0.2s',
                    '&:hover': {
                      borderColor: '#666666',
                      color: '#FFFFFF',
                      bgcolor: 'rgba(255,255,255,0.04)',
                      transform: 'translateY(-1px)',
                    },
                    '&:active': { transform: 'translateY(0)' },
                    '&:focus-visible': { outline: '2px solid rgba(170,170,170,0.8)', outlineOffset: '2px' },
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>
          </Grid>

          {/* 오른쪽: 방명록 폼 */}
          <Grid item xs={12} md={8}>
            <GuestbookForm onSuccess={handleSuccess} />
          </Grid>
        </Grid>

        {/* 방명록 목록 */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 4 }}>
            <Typography variant="h3" sx={{ color: '#FFFFFF' }}>방명록</Typography>
            {!loading && (
              <Typography variant="body2" sx={{ color: '#555555' }}>
                총 {entries.length}개
              </Typography>
            )}
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={36} sx={{ color: '#AAAAAA' }} />
            </Box>
          ) : entries.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="body1" sx={{ color: '#555555' }}>
                아직 방명록이 없습니다. 첫 번째 방명록을 남겨주세요! 😊
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2.5}>
              {entries.map((entry) => (
                <Grid item xs={12} sm={6} md={4} key={entry.id}>
                  <GuestbookCard
                    entry={entry}
                    onDeleted={handleDeleted}
                    onUpdated={handleUpdated}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
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
