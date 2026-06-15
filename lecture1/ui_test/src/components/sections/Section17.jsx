import { Box, Typography } from '@mui/material';
import SectionWrapper from '../ui/SectionWrapper';

const NAV_ITEMS = ['홈', '소개', '상품', '연락처', '설정'];

const Section17 = () => {
  return (
    <SectionWrapper
      number={17}
      title="Flex Navigation"
      description="flexbox로 만든 네비게이션 바입니다. justify-content: space-between으로 로고와 메뉴를 양 끝에 배치합니다."
    >
      {/* 네비게이션 바 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: '60px',
          bgcolor: '#2d3748',
          px: 3,
          borderRadius: 1,
        }}
      >
        {/* 로고 박스 */}
        <Box>
          <Typography
            sx={{
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '20px',
            }}
          >
            MyWebsite
          </Typography>
        </Box>

        {/* 메뉴 박스 */}
        <Box sx={{ display: 'flex', gap: '15px' }}>
          {NAV_ITEMS.map((item) => (
            <Typography
              key={item}
              sx={{
                color: '#a0aec0',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': {
                  color: '#ffffff',
                },
              }}
            >
              {item}
            </Typography>
          ))}
        </Box>
      </Box>
    </SectionWrapper>
  );
};

export default Section17;
