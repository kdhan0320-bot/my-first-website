import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/Download';
import SectionWrapper from '../ui/SectionWrapper';

const Row = ({ label, children }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
      {label}
    </Typography>
    <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
      {children}
    </Stack>
  </Box>
);

const VARIANTS = ['contained', 'outlined', 'text'];
const COLORS   = ['primary', 'secondary', 'error'];

const Section01 = () => {
  const handleClick = (variant, color) =>
    alert(`variant="${variant}"  color="${color}" 버튼을 클릭했습니다.`);

  return (
    <SectionWrapper number={1} title="Button" description="MUI 버튼의 variant, color, size, icon, 상태를 확인합니다.">
      <Stack spacing={4}>

        {/* variant × color 조합 — 클릭 시 알림 */}
        <Row label="Variant × Color — 클릭 시 알림창">
          {VARIANTS.map((variant) =>
            COLORS.map((color) => (
              <Button
                key={`${variant}-${color}`}
                variant={variant}
                color={color}
                onClick={() => handleClick(variant, color)}
              >
                {variant} / {color}
              </Button>
            ))
          )}
        </Row>

        <Divider />

        {/* Size */}
        <Row label="Size">
          <Button variant="contained" size="small">Small</Button>
          <Button variant="contained" size="medium">Medium</Button>
          <Button variant="contained" size="large">Large</Button>
        </Row>

        {/* Icon */}
        <Row label="Icon">
          <Button variant="contained" startIcon={<SendIcon />}>Send</Button>
          <Button variant="outlined" startIcon={<DownloadIcon />}>Download</Button>
          <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>Delete</Button>
          <Button variant="contained" endIcon={<SendIcon />}>Send</Button>
        </Row>

        {/* State */}
        <Row label="State">
          <Button variant="contained" disabled>Disabled</Button>
          <Button variant="outlined" disabled>Disabled</Button>
          <Button variant="contained" loading>Loading</Button>
          <Button variant="outlined" loading loadingIndicator="저장 중…">Loading</Button>
        </Row>

        {/* Full Width */}
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Full Width
          </Typography>
          <Button variant="contained" fullWidth onClick={() => handleClick('contained', 'primary')}>
            Full Width Button
          </Button>
        </Box>

      </Stack>
    </SectionWrapper>
  );
};

export default Section01;
