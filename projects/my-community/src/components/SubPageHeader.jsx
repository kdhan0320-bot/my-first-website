/* eslint-disable react/prop-types -- 프로젝트 전반에서 PropTypes를 사용하지 않는 기존 컨벤션을 따름 */
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Container, IconButton, Typography, Box } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const SubPageHeader = ({ title, rightActions }) => {
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 0.5 }}>
          <IconButton edge="start" color="inherit" onClick={handleBack} aria-label="목록으로 돌아가기">
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h6"
            onClick={handleBack}
            sx={{
              flexGrow: 1, ml: 1, minWidth: 0,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              cursor: 'pointer', '&:hover': { opacity: 0.7 },
            }}
          >
            {title}
          </Typography>
          {rightActions && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
              {rightActions}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default SubPageHeader;
