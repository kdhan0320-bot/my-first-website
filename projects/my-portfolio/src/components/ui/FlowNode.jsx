import { Box } from '@mui/material';

/* Route Line의 시각적 마디 — 섹션 경계에서 흐름이 이어지는 지점을 표시하는
 * 작은 cyan 점. Hero/About/Projects 각 섹션 하단(다음 섹션과 만나는 지점)에
 * 하나씩만 두고, 전 구간에서 같은 크기/스타일을 유지한다. */
const FlowNode = ({ sx }) => (
  <Box
    aria-hidden="true"
    sx={{
      display: { xs: 'none', md: 'block' },
      position: 'absolute',
      width: 8,
      height: 8,
      borderRadius: '50%',
      bgcolor: '#38BDF8',
      boxShadow: '0 0 10px 3px rgba(56,189,248,0.55)',
      pointerEvents: 'none',
      zIndex: 1,
      ...sx,
    }}
  />
);

export default FlowNode;
