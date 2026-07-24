import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

/* Human Signal Phase 3C: 문자 화살표(→/↗)를 의미별로 통일된 MUI 아이콘으로
 * 대체한다. variant는 액션의 실제 동작을 나타낸다 — 텍스트 문구가 아니라
 * href/onClick 동작을 기준으로 고른다.
 * - internal: 같은 페이지 스크롤 또는 SPA 내부 라우트 이동, mailto: 액션
 * - external: 새 탭에서 여는 외부 사이트(GitHub, 라이브 데모 등)
 * - download: 파일(PDF 등) 새 탭/다운로드 */
const ICONS = {
  internal: ArrowForwardRoundedIcon,
  external: NorthEastRoundedIcon,
  download: DownloadRoundedIcon,
};

const ActionIcon = ({ variant = 'internal', sx, ...props }) => {
  const Icon = ICONS[variant] ?? ArrowForwardRoundedIcon;
  return (
    <Icon
      aria-hidden="true"
      fontSize="inherit"
      sx={{ fontSize: '1.1em', verticalAlign: 'middle', ...sx }}
      {...props}
    />
  );
};

export default ActionIcon;
