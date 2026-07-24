import { Box } from '@mui/material';
import { HUMAN_SIGNAL } from '../../theme';

/* Human Signal Phase 5A-F: Figma Featured card media는 "dark stage(deepHarbor)
 * 안에 살짝 회전된 soft-white browser/device frame" 구도다(QHD 208:44-97,
 * Desktop 206:47-100 등 "Media" 서브트리).실제 원본은 그 frame 안이 합성
 * wireframe rectangle(placeholder)인데, 이 페이지는 실제 프로젝트 screenshot을
 * 유지해야 하므로(figma-fidelity 규칙) wireframe 사각형을 그대로 베끼지 않고
 * stage/frame/dot-bar 구조만 재현한 뒤 내부를 실제 이미지로 채운다.
 * Bus 카드처럼 Figma가 폰 프레임 3개(Home/Search/Route)를 나란히 배치한
 * 경우도 실제 asset은 1장뿐이라 프레임 1개로 단순화한다 — 같은 이미지를
 * 여러 슬롯에 복제해 "증거"처럼 보이게 하지 않는다(DEVIATION 기록 대상). */
/* Phase 5D: Detail READY의 Decision/Main Screens 카드는 세로로 매우 긴 full-page
 * 캡처(예: feedback-list-390, 390x9453)나 세로 모바일 crop(bus-arrival-*, 275x500대)도
 * 같은 frame으로 보여줘야 한다. `aspectRatio`/`objectFit`/`objectPosition`을
 * optional prop으로 열어 호출부가 필요할 때만 기본값(16/10, contain, center)을
 * 바꾸도록 한다 — 기존 호출부(ProjectsPage 카드)는 값을 넘기지 않으므로 렌더
 * 결과가 그대로 유지된다. */
const ProjectMediaStage = ({ image, alt, rotate = 0, aspectRatio = '16 / 10', objectFit = 'contain', objectPosition = 'center', loading = 'lazy' }) => (
  <Box
    sx={{
      position: 'relative', width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      bgcolor: HUMAN_SIGNAL.deepHarbor, overflow: 'hidden', p: '6%',
    }}
  >
    <Box
      sx={{
        position: 'relative', width: '100%', maxHeight: '100%',
        transform: `rotate(${rotate}deg)`,
        bgcolor: HUMAN_SIGNAL.softWhite,
        border: `1px solid ${HUMAN_SIGNAL.paperDeep}`,
        borderRadius: '14px', overflow: 'hidden',
        boxShadow: '0 18px 40px rgba(0,0,0,0.28)',
      }}
    >
      <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center', height: '18px', px: '10px', bgcolor: HUMAN_SIGNAL.softWhite }}>
        <Box sx={{ width: 6, height: 6, borderRadius: '3px', bgcolor: HUMAN_SIGNAL.brightOrange }} />
        <Box sx={{ width: 6, height: 6, borderRadius: '3px', bgcolor: HUMAN_SIGNAL.mutedSage }} />
        <Box sx={{ width: 6, height: 6, borderRadius: '3px', bgcolor: HUMAN_SIGNAL.steelMist }} />
      </Box>
      <Box sx={{ bgcolor: HUMAN_SIGNAL.warmPaper, aspectRatio, display: 'flex' }}>
        <Box
          component="img" src={image} alt={alt} loading={loading}
          sx={{ width: '100%', height: '100%', objectFit, objectPosition }}
        />
      </Box>
    </Box>
  </Box>
);

export default ProjectMediaStage;
