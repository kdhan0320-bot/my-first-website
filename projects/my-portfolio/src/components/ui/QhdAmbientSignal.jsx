import { Box } from '@mui/material';
import { HUMAN_SIGNAL, QHD_DECORATION_MIN_WIDTH } from '../../theme';

/* QHD(1920px 이상) 전용 외곽 장식 — Home 콘텐츠가 1440px(HOME_WIDE_MAX_WIDTH)로
 * 고정되면서 2560에서 생기는 좌우 여백을 채운다. Figma QHD 2560(347:383) direct
 * node ID 실측 기준(Phase 4C에서 `get_metadata`로 확보): Hero/About/Featured/
 * Selected는 겹친 원 2개 + 세로 rail + 점 4개 + fragment 2개, Contact는 원 2개 +
 * 가로/세로 path(+accent) + fragment 1~2개 + 점 3개.
 *
 * Phase 4D: circle이 세로로 늘어난 타원으로 렌더되던 버그를 고쳤다. 원인은 (1) 각
 * variant의 자식 좌표를 사람이 미리 퍼센트로 계산해 넣었는데 원(circle)만 가로세로에
 * 같은 퍼센트값을 재사용했고 — 가로 퍼센트를 세로에 그대로 쓰면 scene이 정사각형이
 * 아닌 이상(360x620처럼) 타원이 된다 — (2) 바깥 Box의 실제 렌더 height가 섹션의
 * 임의 실제 높이(`height:'100%'`)라서 scene 자체의 가로세로 비율도 고정되지 않았기
 * 때문이다. 이제 모든 좌표는 Figma 원본 픽셀(x/y/w/h)로 저장하고, `scene`(그 variant의
 * 진짜 Figma 프레임 크기)을 함께 선언해 렌더 시점에 가로는 scene.width, 세로는
 * scene.height 기준으로 각각 퍼센트를 계산한다 — 이 컴포넌트가 손 계산을 하지 않고
 * 직접 나눗셈만 하므로 앞으로도 같은 종류의 계산 실수가 재발하지 않는다. 바깥 Box도
 * `aspectRatio`로 scene 비율을 강제해, 실제 렌더 폭:높이가 항상 Figma와 같은 비율을
 * 유지한다(중앙 콘텐츠 위로 확대하지 않는다).
 *
 * Phase 5A-R: "1920에서는 필요하면 화면 밖으로 clip된다"던 이전 원칙을 폐기했다 —
 * 실제 2560 모니터에서 사용자가 잘린 장식을 확인했고, 계산상으로도 1920~2320px대
 * viewport에서는 gutter offset이 음수가 돼 장식의 일부가 실제로 화면 밖으로 잘렸다.
 * 이제는 `QHD_DECORATION_MIN_WIDTH`(2480, `theme.js`) 미만에서는 장식을 통째로
 * 숨긴다 — 부분적으로 잘린 원/선/점보다, 아예 안 보이는 쪽이 마감된 화면으로
 * 인식된다는 원칙에 따른다.
 * 항상 aria-hidden + pointer-events:none, 저대비, 본문/CTA보다 강하지 않아야 한다. */

const DARK_TONE = {
  circleStroke: 'rgba(255,253,248,0.14)',
  lineStroke: 'rgba(170,183,196,0.22)',
  fragmentBg: 'rgba(255,253,248,0.06)',
  fragmentBorder: 'rgba(170,183,196,0.22)',
};

const LIGHT_TONE = {
  circleStroke: 'rgba(12,20,32,0.08)',
  lineStroke: HUMAN_SIGNAL.paperDeep,
  fragmentBg: 'rgba(23,36,50,0.04)',
  fragmentBorder: HUMAN_SIGNAL.paperDeep,
};

const DOT_COLOR = { sage: HUMAN_SIGNAL.mutedSage, orange: HUMAN_SIGNAL.brightOrange, quiet: HUMAN_SIGNAL.steelMist };

const SCENE_SIDE = { width: 360, height: 620 }; // Hero/About/Featured/Selected 공통 Figma 프레임
const SCENE_CONTACT = { width: 560, height: 560 }; // Contact 좌/우 각 side 기준(문서 승인값)

const pctW = (px, scene) => `${(px / scene.width) * 100}%`;
const pctH = (px, scene) => `${(px / scene.height) * 100}%`;

/* Figma "Hero"(432:303, 360x620) 자식 원본 픽셀 좌표. */
const HERO_VARIANT = {
  tone: 'dark',
  scene: SCENE_SIDE,
  sizing: 'fixed',
  circles: [
    { x: 20, y: 30, w: 250, h: 250 },
    { x: 100, y: 210, w: 190, h: 190 },
  ],
  line: { orientation: 'vertical', x: 180.5, from: 10, to: 570 },
  dots: [
    { x: 175.5, y: 85.5, w: 9, h: 9, color: 'sage' },
    { x: 174.5, y: 204.5, w: 11, h: 11, color: 'orange' },
    { x: 176.5, y: 336.5, w: 7, h: 7, color: 'sage' },
    { x: 175.5, y: 475.5, w: 9, h: 9, color: 'sage' },
  ],
  fragments: [
    { x: 205, y: 120, w: 110, h: 48 },
    { x: 24, y: 390, w: 126, h: 56 },
  ],
};

/* Figma "Ambient Signal Right"(432:313, About) / "Ambient Signal Left 02"(432:323,
 * Featured) — 두 node의 자식 좌표가 완전히 동일하다(direct node ID 재확인 완료).
 * 위치만 About은 캔버스 오른쪽, Featured는 왼쪽이라 variant 1개를 두 key에서
 * 공유한다(재사용 2곳 이상 + 코드 감소 원칙). */
const ABOUT_FEATURED_VARIANT = {
  tone: 'light',
  scene: SCENE_SIDE,
  sizing: 'fixed',
  frameOpacity: 0.48,
  circles: [
    { x: 120, y: 30, w: 250, h: 250 },
    { x: 40, y: 210, w: 190, h: 190 },
  ],
  line: { orientation: 'vertical', x: 180.5, from: 10, to: 570 },
  dots: [
    { x: 175.5, y: 85.5, w: 9, h: 9, color: 'sage' },
    { x: 174.5, y: 204.5, w: 11, h: 11, color: 'orange' },
    { x: 176.5, y: 336.5, w: 7, h: 7, color: 'sage' },
    { x: 175.5, y: 475.5, w: 9, h: 9, color: 'sage' },
  ],
  fragments: [
    { x: 28, y: 120, w: 110, h: 48 },
    { x: 202, y: 390, w: 126, h: 56 },
  ],
};

/* Figma "Ambient Signal Right 02"(432:333, Selected) — About/Featured와 달리 진한
 * 쪽(큰/작은 원)이 프레임 왼쪽(캔버스 안쪽)을 향한다. */
const SELECTED_VARIANT = {
  tone: 'light',
  scene: SCENE_SIDE,
  sizing: 'fixed',
  frameOpacity: 0.48,
  circles: [
    { x: 20, y: 30, w: 250, h: 250 },
    { x: 100, y: 210, w: 190, h: 190 },
  ],
  line: { orientation: 'vertical', x: 180.5, from: 10, to: 570 },
  dots: [
    { x: 175.5, y: 85.5, w: 9, h: 9, color: 'sage' },
    { x: 174.5, y: 204.5, w: 11, h: 11, color: 'orange' },
    { x: 176.5, y: 336.5, w: 7, h: 7, color: 'sage' },
    { x: 175.5, y: 475.5, w: 9, h: 9, color: 'sage' },
  ],
  fragments: [
    { x: 205, y: 120, w: 110, h: 48 },
    { x: 24, y: 390, w: 126, h: 56 },
  ],
};

/* Figma "Contact Left"(442:166 Left* 레이어) 자식 원본 픽셀 좌표(560x560 side 기준,
 * direct node ID 실측). Deep Harbor(dark) 배경용. */
const CONTACT_LEFT_VARIANT = {
  tone: 'dark',
  scene: SCENE_CONTACT,
  sizing: 'responsive-square',
  circles: [
    { x: -58, y: 70, w: 330, h: 330 },
    { x: 92, y: 210, w: 165, h: 165 },
  ],
  line: { orientation: 'horizontal', y: 348.5, from: 90, to: 472 },
  lineAccent: { y: 349, x: 280, w: 92 },
  dots: [
    { x: 88, y: 344, w: 9, h: 9, color: 'sage' },
    { x: 368, y: 343, w: 11, h: 11, color: 'orange' },
    { x: 453, y: 344, w: 8, h: 8, color: 'quiet' },
  ],
  fragments: [
    { x: 128, y: 150, w: 118, h: 44 },
    { x: 352, y: 286, w: 112, h: 54 },
  ],
};

/* Figma "Contact Right"(442:166 Right* 레이어) — Phase 4D는 여기를 "명확한 560폭
 * scene 경계가 없어 기존 비율을 추정 유지"라고 적었지만, Phase 4E에서 `get_metadata`로
 * 442:166 프레임을 직접 재조회한 결과 Right 클러스터도 Left와 동일하게 정확한 절대
 * 좌표를 가진 실제 노드였다(프레임 자체는 x=0~2560 폭 2560, Right 클러스터는 절대
 * x 2000~2560 범위 = local 560 scene과 정확히 대응, `local x = absolute x - 2000`).
 * 이전 추정값은 x좌표가 대부분 틀렸었다(예: Terminal fragment x=310,y=266 → 실제
 * x=320,y=300). 아래는 direct node 실측값이다:
 * Right Orbit Large(442:176) x=2215 y=34 w=300 h=300 / Right Orbit Small(442:177)
 * x=2132 y=190 w=170 h=170 / Right Vertical Rail(442:178) x=2390 y=120 w=1 h=300 /
 * Right Terminal Path(442:179) x=2088 y=382 w=342 h=1 / Right Terminal Accent
 * (442:180) x=2250 y=381 w=110 h=2 / Right Terminal(442:181, fragment) x=2320 y=300
 * w=142 h=52 / Right Node Sage(442:182) x=2386 y=116 / Right Node Orange(442:183)
 * x=2354 y=377 / Right Node Quiet(442:184) x=2090 y=378. Left에는 없던 두 번째 line
 * (Terminal Path, horizontal)이 있어 `line2`로 추가했다. Soft White(light) 배경용. */
const CONTACT_RIGHT_VARIANT = {
  tone: 'light',
  scene: SCENE_CONTACT,
  sizing: 'responsive-square',
  circles: [
    { x: 215, y: 34, w: 300, h: 300 },
    { x: 132, y: 190, w: 170, h: 170 },
  ],
  line: { orientation: 'vertical', x: 390, from: 120, to: 420 },
  line2: { orientation: 'horizontal', y: 382.5, from: 88, to: 430 },
  lineAccent: { y: 382, x: 250, w: 110 },
  dots: [
    { x: 386, y: 116, w: 9, h: 9, color: 'sage' },
    { x: 354, y: 377, w: 11, h: 11, color: 'orange' },
    { x: 90, y: 378, w: 8, h: 8, color: 'quiet' },
  ],
  fragments: [
    { x: 320, y: 300, w: 142, h: 52 },
  ],
};

const VARIANTS = {
  'hero-left': HERO_VARIANT,
  'contact-left': CONTACT_LEFT_VARIANT,
  'contact-right': CONTACT_RIGHT_VARIANT,
  'about-right': ABOUT_FEATURED_VARIANT,
  'featured-left': ABOUT_FEATURED_VARIANT,
  'selected-right': SELECTED_VARIANT,
};

/* line/line2 공용 렌더러 — Contact Right는 Left와 달리 vertical rail(line) +
 * horizontal terminal path(line2) 두 개를 함께 쓴다(Phase 4E, get_metadata 442:166
 * 재조회로 확인). 나머지 variant는 line만 쓰고 line2는 비워둔다. */
const renderLine = (line, scene, stroke, key) => {
  if (!line) return null;
  if (line.orientation === 'vertical') {
    return (
      <Box key={key} sx={{
        position: 'absolute', left: pctW(line.x, scene), top: pctH(line.from, scene),
        bottom: `calc(100% - ${pctH(line.to, scene)})`,
        width: '1px', bgcolor: stroke,
      }} />
    );
  }
  return (
    <Box key={key} sx={{
      position: 'absolute', top: pctH(line.y, scene), left: pctW(line.from, scene),
      right: `calc(100% - ${pctW(line.to, scene)})`,
      height: '1px', bgcolor: stroke,
    }} />
  );
};

const QhdAmbientSignal = ({ variant, sx }) => {
  const spec = VARIANTS[variant];
  if (!spec) return null;
  const tone = spec.tone === 'light' ? LIGHT_TONE : DARK_TONE;
  const scene = spec.scene;

  const sizingSx = spec.sizing === 'fixed'
    ? { width: scene.width, aspectRatio: `${scene.width} / ${scene.height}` }
    : { aspectRatio: '1 / 1' }; // width는 호출부 sx(반응형 calc)에서 그대로 받는다

  return (
    <Box
      aria-hidden="true"
      data-qhd-signal={variant}
      sx={{
        position: 'absolute', top: 0, overflow: 'hidden', pointerEvents: 'none',
        opacity: spec.frameOpacity ?? 1,
        display: 'none',
        [`@media (min-width:${QHD_DECORATION_MIN_WIDTH}px)`]: { display: 'block' },
        ...sizingSx,
        ...sx,
      }}
    >
      {spec.circles.map((c, i) => (
        <Box key={i} data-qhd-shape="circle" sx={{
          position: 'absolute', left: pctW(c.x, scene), top: pctH(c.y, scene),
          width: pctW(c.w, scene), height: pctH(c.h, scene),
          borderRadius: '50%', border: `1px solid ${tone.circleStroke}`,
        }} />
      ))}
      {renderLine(spec.line, scene, tone.lineStroke, 'line')}
      {renderLine(spec.line2, scene, tone.lineStroke, 'line2')}
      {spec.lineAccent && (
        <Box sx={{
          position: 'absolute', top: pctH(spec.lineAccent.y, scene), left: pctW(spec.lineAccent.x, scene),
          width: pctW(spec.lineAccent.w, scene),
          height: '2px', bgcolor: HUMAN_SIGNAL.brightOrange, opacity: 0.5,
        }} />
      )}
      {spec.fragments.map((f, i) => (
        <Box key={i} sx={{
          position: 'absolute', left: pctW(f.x, scene), top: pctH(f.y, scene),
          width: pctW(f.w, scene), height: pctH(f.h, scene),
          borderRadius: '10px', bgcolor: tone.fragmentBg, border: `1px solid ${tone.fragmentBorder}`,
        }} />
      ))}
      {spec.dots.map((d, i) => (
        <Box key={i} sx={{
          position: 'absolute', left: pctW(d.x, scene), top: pctH(d.y, scene),
          width: d.w, height: d.h,
          borderRadius: '50%', bgcolor: DOT_COLOR[d.color], opacity: 0.85,
        }} />
      ))}
    </Box>
  );
};

export default QhdAmbientSignal;
