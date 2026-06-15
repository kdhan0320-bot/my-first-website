import { useState } from 'react';
import {
  Box, Container, Typography, Avatar, Grid,
  Tabs, Tab, Divider, Chip,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import WorkIcon from '@mui/icons-material/Work';
import { usePortfolio } from '../context/PortfolioContext';
import SkillsSection from '../components/sections/SkillsSection';

const toParagraphs = (text = '') => {
  if (!text) return [];
  return text
    .split('. ')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.endsWith('.') ? s : `${s}.`));
};

const InfoRow = ({ icon, label, value, note }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
    <Box sx={{ color: 'primary.main', mt: '3px', flexShrink: 0 }}>{icon}</Box>
    <Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.3 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, lineHeight: 1.6 }}>
        {value}
      </Typography>
      {note && (
        <Typography variant="caption" sx={{ color: 'primary.main', display: 'block', mt: 0.4 }}>
          → {note}
        </Typography>
      )}
    </Box>
  </Box>
);

const AboutPage = () => {
  const { aboutMeData } = usePortfolio();
  const [activeTab, setActiveTab] = useState(0);

  const { basicInfo = {}, sections = [] } = aboutMeData ?? {};
  const activeSection = sections[activeTab] ?? sections[0] ?? null;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="md">

        {/* 페이지 헤더 */}
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Typography
            sx={{
              color: 'text.secondary',
              letterSpacing: 6,
              fontWeight: 600,
              fontSize: '0.7rem',
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

        {/* 기본 정보 카드 */}
        <Box
          sx={(theme) => ({
            bgcolor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            p: { xs: 3, md: 5 },
            boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 2px 16px rgba(26,26,46,0.06)',
            mb: 4,
          })}
        >
          <Grid container spacing={{ xs: 3, md: 5 }} alignItems="flex-start">

            {/* 프로필 이미지 */}
            <Grid
              item xs={12} sm={4}
              sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}
            >
              <Avatar
                src={basicInfo.photo || undefined}
                alt={basicInfo.name}
                sx={(theme) => ({
                  width: 150,
                  height: 150,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.1)' : '#EAF6FC',
                  color: 'primary.main',
                  fontSize: '3rem',
                  fontWeight: 700,
                  border: `3px solid ${theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.2)' : '#D0EEFA'}`,
                })}
              >
                {!basicInfo.photo && (basicInfo.name?.charAt(0) ?? '')}
              </Avatar>
            </Grid>

            {/* 기본 정보 텍스트 */}
            <Grid item xs={12} sm={8}>
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, mb: 3 }}>
                <Typography variant="h2" sx={{ color: 'text.primary', fontWeight: 800, mb: 1 }}>
                  {basicInfo.name}
                </Typography>
                <Chip
                  label={basicInfo.position}
                  size="small"
                  sx={(theme) => ({
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.1)' : '#EAF6FC',
                    color: 'primary.main',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.2)' : '#B8DFF2'}`,
                    fontWeight: 600,
                    fontSize: '0.78rem',
                  })}
                />
              </Box>

              <InfoRow
                icon={<SchoolIcon sx={{ fontSize: '1.1rem' }} />}
                label="학력"
                value={basicInfo.education}
                note={basicInfo.educationNote}
              />
              <InfoRow
                icon={<LibraryBooksIcon sx={{ fontSize: '1.1rem' }} />}
                label="학습 분야"
                value={basicInfo.major}
              />
              <InfoRow
                icon={<WorkIcon sx={{ fontSize: '1.1rem' }} />}
                label="경력"
                value={basicInfo.experience}
              />

              <Divider sx={{ my: 2.5 }} />

              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', lineHeight: 1.85, fontStyle: 'italic' }}
              >
                &ldquo;{basicInfo.summary}&rdquo;
              </Typography>
            </Grid>

          </Grid>
        </Box>

        {/* 콘텐츠 섹션 탭 */}
        <Box
          sx={(theme) => ({
            bgcolor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 2px 16px rgba(26,26,46,0.06)',
            overflow: 'hidden',
          })}
        >
          <Tabs
            value={activeTab}
            onChange={(_, newVal) => setActiveTab(newVal)}
            variant="scrollable"
            scrollButtons="auto"
            sx={(theme) => ({
              borderBottom: `1px solid ${theme.palette.divider}`,
              px: { xs: 1, md: 2 },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: { xs: '0.8rem', md: '0.9rem' },
                color: 'text.secondary',
                minHeight: 56,
                '&.Mui-selected': { color: 'primary.main' },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.primary.main,
                height: 3,
              },
            })}
          >
            {sections.map((section) => (
              <Tab key={section.id} label={section.title} />
            ))}
          </Tabs>

          <Box sx={{ p: { xs: 3, md: 5 } }}>
            {activeSection && (
              <>
                <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700, mb: 3 }}>
                  {activeSection.title}
                </Typography>
                {toParagraphs(activeSection.content ?? '').map((para, idx) => (
                  <Typography
                    key={idx}
                    variant="body1"
                    sx={{ color: 'text.secondary', lineHeight: 1.95, mb: 2 }}
                  >
                    {para}
                  </Typography>
                ))}
              </>
            )}
          </Box>
        </Box>

        {/* Skills 섹션 */}
        <SkillsSection />

      </Container>
    </Box>
  );
};

export default AboutPage;
