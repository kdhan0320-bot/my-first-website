import { Box, Container, Typography, TextField, Button, Grid, Divider } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const ContactSection = () => (
  <Box sx={{ bgcolor: '#111111', py: { xs: 8, md: 12 } }}>
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="overline" sx={{ color: '#888888', letterSpacing: 4, fontWeight: 600 }}>
          Contact 섹션
        </Typography>
        <Typography variant="h2" sx={{ mt: 1, color: '#FFFFFF' }}>
          여기는 Contact 섹션입니다.
        </Typography>
        <Divider sx={{ width: 60, mx: 'auto', mt: 2, borderColor: '#FFFFFF', borderWidth: 3 }} />
        <Typography variant="body2" sx={{ mt: 2, color: '#AAAAAA' }}>
          연락처, SNS, 간단한 메시지 폼이 들어갈 예정입니다.
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 4, md: 6 }}>
        <Grid item xs={12} md={5}>
          <Typography variant="h4" sx={{ color: '#FFFFFF', mb: 3 }}>연락처</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {[
              { icon: <EmailIcon />,    label: 'Email',    value: 'your@email.com' },
              { icon: <GitHubIcon />,   label: 'GitHub',   value: 'github.com/your-id' },
              { icon: <LinkedInIcon />, label: 'LinkedIn', value: 'linkedin.com/in/your-id' },
            ].map(({ icon, label, value }) => (
              <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ color: '#AAAAAA' }}>{icon}</Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#666666' }}>{label}</Typography>
                  <Typography variant="body2" sx={{ color: '#DDDDDD' }}>{value}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={7}>
          <Typography variant="h4" sx={{ color: '#FFFFFF', mb: 3 }}>메시지 보내기</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {['이름', '이메일'].map((label) => (
              <TextField
                key={label}
                label={label}
                variant="outlined"
                fullWidth
                InputLabelProps={{ style: { color: '#888888' } }}
                InputProps={{ style: { color: '#FFFFFF' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#444444' },
                    '&:hover fieldset': { borderColor: '#AAAAAA' },
                    '&.Mui-focused fieldset': { borderColor: '#FFFFFF' },
                  },
                }}
              />
            ))}
            <TextField
              label="메시지"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              InputLabelProps={{ style: { color: '#888888' } }}
              InputProps={{ style: { color: '#FFFFFF' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#444444' },
                  '&:hover fieldset': { borderColor: '#AAAAAA' },
                  '&.Mui-focused fieldset': { borderColor: '#FFFFFF' },
                },
              }}
            />
            <Button variant="contained" color="primary" size="large">
              메시지 전송
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default ContactSection;
