import { Box } from '@mui/material';

/* Dohan.K 배경 workmark — Hero/Navbar/Footer의 실물 LogoSymbol과 달리
 * About/Projects 배경에 아주 옅게 반복되는 D 모노그램. 텍스트 위에 올라가지
 * 않도록 항상 aria-hidden + pointer-events:none으로만 사용한다. */
const DMark = ({ size = 260, sx }) => (
  <Box
    aria-hidden="true"
    sx={{
      position: 'absolute',
      width: size,
      height: size,
      display: { xs: 'none', md: 'block' },
      pointerEvents: 'none',
      zIndex: 0,
      ...sx,
    }}
  >
    <Box
      sx={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: '1.5px solid rgba(56,189,248,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.1,
      }}
    >
      <Box
        component="span"
        sx={{
          fontSize: size * 0.52,
          fontWeight: 800,
          color: '#38BDF8',
          fontFamily: '"Pretendard", "Noto Sans KR", sans-serif',
          lineHeight: 1,
        }}
      >
        D
      </Box>
    </Box>
  </Box>
);

export default DMark;
