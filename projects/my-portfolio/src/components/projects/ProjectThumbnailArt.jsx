/* 프로젝트별 SVG 썸네일 목업 (실제 이미지가 없을 때의 폴백) */
const THUMB_SVG = {
  'bus-redesign': (
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      {/* Before 레이블 */}
      <text x="90" y="12" textAnchor="middle" fill="white" opacity="0.35" fontSize="8" fontFamily="sans-serif">Before</text>
      {/* Before 폰 프레임 */}
      <rect x="52" y="16" width="76" height="148" rx="12" fill="white" opacity="0.07"/>
      <rect x="52" y="16" width="76" height="148" rx="12" fill="none" stroke="white" strokeWidth="1.5" opacity="0.25"/>
      <rect x="84" y="20" width="12" height="3" rx="1.5" fill="white" opacity="0.2"/>
      {/* 상태바 */}
      <rect x="56" y="26" width="68" height="10" rx="0" fill="white" opacity="0.06"/>
      <rect x="60" y="29" width="20" height="3" rx="1" fill="white" opacity="0.2"/>
      {/* 헤더 */}
      <rect x="58" y="40" width="64" height="10" rx="2" fill="white" opacity="0.12"/>
      {/* 복잡한 목록 (Before - 정보 혼잡) */}
      <rect x="58" y="56" width="64" height="4" rx="2" fill="white" opacity="0.1"/>
      <rect x="58" y="64" width="50" height="3" rx="1" fill="white" opacity="0.08"/>
      <rect x="58" y="71" width="64" height="3" rx="1" fill="white" opacity="0.08"/>
      <rect x="58" y="80" width="64" height="4" rx="2" fill="white" opacity="0.1"/>
      <rect x="58" y="88" width="45" height="3" rx="1" fill="white" opacity="0.08"/>
      <rect x="58" y="95" width="64" height="3" rx="1" fill="white" opacity="0.08"/>
      <rect x="58" y="104" width="64" height="4" rx="2" fill="white" opacity="0.1"/>
      <rect x="58" y="112" width="40" height="3" rx="1" fill="white" opacity="0.08"/>
      <rect x="58" y="119" width="64" height="3" rx="1" fill="white" opacity="0.08"/>
      <rect x="58" y="128" width="64" height="18" rx="3" fill="white" opacity="0.06"/>
      {/* 화살표 */}
      <text x="152" y="92" textAnchor="middle" fill="white" opacity="0.45" fontSize="16" fontFamily="sans-serif">→</text>
      {/* After 레이블 */}
      <text x="228" y="12" textAnchor="middle" fill="white" opacity="0.55" fontSize="8" fontFamily="sans-serif">After</text>
      {/* After 폰 프레임 */}
      <rect x="190" y="16" width="76" height="148" rx="12" fill="white" opacity="0.1"/>
      <rect x="190" y="16" width="76" height="148" rx="12" fill="none" stroke="white" strokeWidth="1.8" opacity="0.55"/>
      <rect x="222" y="20" width="12" height="3" rx="1.5" fill="white" opacity="0.3"/>
      {/* 상태바 */}
      <rect x="194" y="26" width="68" height="10" rx="0" fill="white" opacity="0.07"/>
      <rect x="198" y="29" width="20" height="3" rx="1" fill="white" opacity="0.3"/>
      {/* 헤더 */}
      <rect x="196" y="40" width="64" height="10" rx="2" fill="white" opacity="0.2"/>
      {/* 도착 정보 카드 (After - 명확) */}
      <rect x="196" y="56" width="64" height="36" rx="4" fill="white" opacity="0.18"/>
      <rect x="200" y="61" width="30" height="4" rx="2" fill="white" opacity="0.5"/>
      <rect x="200" y="70" width="50" height="8" rx="2" fill="white" opacity="0.35"/>
      <rect x="200" y="82" width="24" height="3" rx="1" fill="white" opacity="0.3"/>
      {/* 즐겨찾기 카드 */}
      <rect x="196" y="98" width="64" height="24" rx="4" fill="white" opacity="0.13"/>
      <rect x="200" y="103" width="28" height="3" rx="1" fill="white" opacity="0.4"/>
      <rect x="200" y="110" width="50" height="6" rx="2" fill="white" opacity="0.25"/>
      {/* 노선 카드 */}
      <rect x="196" y="128" width="64" height="24" rx="4" fill="white" opacity="0.1"/>
      <rect x="200" y="133" width="28" height="3" rx="1" fill="white" opacity="0.35"/>
      <rect x="200" y="140" width="45" height="6" rx="2" fill="white" opacity="0.2"/>
    </svg>
  ),
  'figma-uiux': (
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      {/* Figma 툴바 */}
      <rect x="0" y="0" width="320" height="20" rx="0" fill="white" opacity="0.06"/>
      <rect x="6" y="6" width="8" height="8" rx="2" fill="white" opacity="0.35"/>
      <rect x="18" y="7" width="20" height="6" rx="2" fill="white" opacity="0.18"/>
      <rect x="42" y="7" width="20" height="6" rx="2" fill="white" opacity="0.14"/>
      <rect x="66" y="7" width="20" height="6" rx="2" fill="white" opacity="0.14"/>
      <circle cx="290" cy="10" r="4" fill="white" opacity="0.2"/>
      <rect x="298" y="7" width="16" height="6" rx="2" fill="white" opacity="0.22"/>
      {/* 왼쪽 레이어 패널 */}
      <rect x="0" y="20" width="60" height="160" rx="0" fill="white" opacity="0.05"/>
      <rect x="6" y="26" width="48" height="5" rx="2" fill="white" opacity="0.18"/>
      <rect x="10" y="35" width="38" height="4" rx="2" fill="white" opacity="0.14"/>
      <rect x="10" y="43" width="32" height="4" rx="2" fill="white" opacity="0.12"/>
      <rect x="10" y="51" width="40" height="4" rx="2" fill="white" opacity="0.14"/>
      <rect x="10" y="59" width="28" height="4" rx="2" fill="white" opacity="0.1"/>
      <rect x="10" y="67" width="36" height="4" rx="2" fill="white" opacity="0.12"/>
      <rect x="10" y="75" width="30" height="4" rx="2" fill="white" opacity="0.1"/>
      {/* 메인 캔버스 - 프레임 1 (와이어프레임) */}
      <rect x="70" y="26" width="72" height="110" rx="3" fill="none" stroke="white" strokeWidth="0.8" opacity="0.3"/>
      <text x="106" y="24" textAnchor="middle" fill="white" opacity="0.3" fontSize="7" fontFamily="sans-serif">메인 화면</text>
      <rect x="74" y="32" width="64" height="8" rx="2" fill="white" opacity="0.14"/>
      <rect x="74" y="44" width="64" height="24" rx="2" fill="white" opacity="0.08"/>
      <rect x="74" y="72" width="30" height="6" rx="2" fill="white" opacity="0.12"/>
      <rect x="108" y="72" width="30" height="6" rx="2" fill="white" opacity="0.1"/>
      <rect x="74" y="82" width="64" height="4" rx="2" fill="white" opacity="0.1"/>
      <rect x="74" y="90" width="50" height="4" rx="2" fill="white" opacity="0.08"/>
      <rect x="74" y="100" width="64" height="14" rx="2" fill="white" opacity="0.12"/>
      <rect x="74" y="118" width="64" height="10" rx="2" fill="white" opacity="0.08"/>
      {/* 프레임 2 (컴포넌트) */}
      <rect x="152" y="26" width="72" height="52" rx="3" fill="none" stroke="white" strokeWidth="0.8" opacity="0.3"/>
      <text x="188" y="24" textAnchor="middle" fill="white" opacity="0.3" fontSize="7" fontFamily="sans-serif">컴포넌트</text>
      <rect x="156" y="32" width="64" height="8" rx="2" fill="white" opacity="0.14"/>
      <rect x="156" y="44" width="30" height="22" rx="2" fill="white" opacity="0.1"/>
      <rect x="190" y="44" width="26" height="10" rx="2" fill="white" opacity="0.12"/>
      <rect x="190" y="58" width="26" height="6" rx="2" fill="white" opacity="0.08"/>
      {/* 프레임 3 (사용자 흐름) */}
      <rect x="152" y="86" width="72" height="50" rx="3" fill="none" stroke="white" strokeWidth="0.8" opacity="0.3"/>
      <text x="188" y="84" textAnchor="middle" fill="white" opacity="0.3" fontSize="7" fontFamily="sans-serif">사용자 흐름</text>
      <rect x="156" y="92" width="18" height="12" rx="2" fill="white" opacity="0.12"/>
      <line x1="174" y1="98" x2="182" y2="98" stroke="white" strokeWidth="0.8" opacity="0.25"/>
      <rect x="182" y="92" width="18" height="12" rx="2" fill="white" opacity="0.1"/>
      <line x1="200" y1="98" x2="208" y2="98" stroke="white" strokeWidth="0.8" opacity="0.25"/>
      <rect x="208" y="92" width="12" height="12" rx="2" fill="white" opacity="0.08"/>
      <rect x="156" y="110" width="64" height="4" rx="2" fill="white" opacity="0.1"/>
      <rect x="156" y="118" width="40" height="4" rx="2" fill="white" opacity="0.08"/>
      {/* 프레임 4 (모바일) */}
      <rect x="234" y="26" width="80" height="116" rx="3" fill="none" stroke="white" strokeWidth="0.8" opacity="0.3"/>
      <text x="274" y="24" textAnchor="middle" fill="white" opacity="0.3" fontSize="7" fontFamily="sans-serif">모바일</text>
      <rect x="238" y="32" width="72" height="6" rx="2" fill="white" opacity="0.12"/>
      <rect x="238" y="42" width="72" height="32" rx="2" fill="white" opacity="0.08"/>
      <rect x="238" y="78" width="34" height="14" rx="2" fill="white" opacity="0.12"/>
      <rect x="276" y="78" width="34" height="14" rx="2" fill="white" opacity="0.1"/>
      <rect x="238" y="96" width="72" height="4" rx="2" fill="white" opacity="0.1"/>
      <rect x="238" y="104" width="55" height="4" rx="2" fill="white" opacity="0.08"/>
      <rect x="238" y="112" width="72" height="22" rx="2" fill="white" opacity="0.07"/>
      {/* 연결선 (화살표) */}
      <line x1="142" y1="81" x2="152" y2="81" stroke="white" strokeWidth="0.8" opacity="0.22" strokeDasharray="3 2"/>
      <line x1="224" y1="52" x2="234" y2="52" stroke="white" strokeWidth="0.8" opacity="0.22" strokeDasharray="3 2"/>
    </svg>
  ),
  'jobflow': (
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      {/* 사이드바 */}
      <rect x="10" y="10" width="52" height="160" rx="4" fill="white" opacity="0.07"/>
      <rect x="18" y="24" width="36" height="6" rx="3" fill="white" opacity="0.22"/>
      <rect x="18" y="40" width="28" height="4" rx="2" fill="white" opacity="0.15"/>
      <rect x="18" y="52" width="32" height="4" rx="2" fill="white" opacity="0.12"/>
      <rect x="18" y="64" width="26" height="4" rx="2" fill="white" opacity="0.1"/>
      <rect x="18" y="76" width="30" height="4" rx="2" fill="white" opacity="0.12"/>
      <rect x="18" y="88" width="26" height="4" rx="2" fill="white" opacity="0.1"/>
      {/* 상단 통계 바 */}
      <rect x="72" y="10" width="238" height="34" rx="4" fill="white" opacity="0.06"/>
      <rect x="80" y="17" width="42" height="7" rx="3" fill="white" opacity="0.22"/>
      <rect x="80" y="28" width="30" height="4" rx="2" fill="white" opacity="0.14"/>
      <rect x="136" y="17" width="42" height="7" rx="3" fill="white" opacity="0.22"/>
      <rect x="136" y="28" width="28" height="4" rx="2" fill="white" opacity="0.14"/>
      <rect x="192" y="17" width="42" height="7" rx="3" fill="white" opacity="0.22"/>
      <rect x="248" y="17" width="42" height="7" rx="3" fill="white" opacity="0.22"/>
      {/* 작업 목록 카드 */}
      <rect x="72" y="54" width="112" height="116" rx="4" fill="white" opacity="0.06"/>
      <rect x="80" y="63" width="80" height="6" rx="3" fill="white" opacity="0.2"/>
      <rect x="80" y="78" width="97" height="22" rx="3" fill="white" opacity="0.08"/>
      <rect x="80" y="106" width="97" height="22" rx="3" fill="white" opacity="0.07"/>
      <rect x="80" y="134" width="97" height="22" rx="3" fill="white" opacity="0.06"/>
      {/* 차트 카드 */}
      <rect x="194" y="54" width="116" height="116" rx="4" fill="white" opacity="0.06"/>
      <rect x="202" y="63" width="60" height="6" rx="3" fill="white" opacity="0.2"/>
      {/* 막대 차트 */}
      <rect x="208" y="128" width="12" height="30" rx="2" fill="white" opacity="0.22"/>
      <rect x="226" y="114" width="12" height="44" rx="2" fill="white" opacity="0.24"/>
      <rect x="244" y="120" width="12" height="38" rx="2" fill="white" opacity="0.2"/>
      <rect x="262" y="106" width="12" height="52" rx="2" fill="white" opacity="0.26"/>
      <rect x="280" y="116" width="12" height="42" rx="2" fill="white" opacity="0.22"/>
    </svg>
  ),
};

// eslint-disable-next-line react-refresh/only-export-components -- 컴포넌트가 아닌 순수 헬퍼 함수
export const hasThumbnailArt = (projectId) => projectId in THUMB_SVG;

/* 실제 이미지·전용 목업이 없는 프로젝트용 — 있는 것처럼 꾸미지 않고
 * 정직한 추상 와이어프레임 패턴 + PREVIEW 워터마크만 표시 */
export const GenericPreviewArt = () => (
  <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <rect x="24" y="20" width="272" height="16" rx="3" fill="white" opacity="0.08"/>
    <circle cx="34" cy="28" r="3" fill="white" opacity="0.16"/>
    <rect x="46" y="25" width="40" height="6" rx="3" fill="white" opacity="0.1"/>
    <rect x="24" y="48" width="130" height="90" rx="4" fill="white" opacity="0.05"/>
    <rect x="34" y="58" width="60" height="6" rx="3" fill="white" opacity="0.14"/>
    <rect x="34" y="72" width="110" height="4" rx="2" fill="white" opacity="0.08"/>
    <rect x="34" y="82" width="90" height="4" rx="2" fill="white" opacity="0.08"/>
    <rect x="34" y="92" width="100" height="4" rx="2" fill="white" opacity="0.08"/>
    <rect x="166" y="48" width="130" height="42" rx="4" fill="white" opacity="0.05"/>
    <rect x="176" y="58" width="50" height="6" rx="3" fill="white" opacity="0.12"/>
    <rect x="176" y="70" width="90" height="4" rx="2" fill="white" opacity="0.08"/>
    <rect x="166" y="96" width="130" height="42" rx="4" fill="white" opacity="0.05"/>
    <rect x="176" y="106" width="50" height="6" rx="3" fill="white" opacity="0.12"/>
    <rect x="176" y="118" width="70" height="4" rx="2" fill="white" opacity="0.08"/>
    <text x="160" y="162" textAnchor="middle" fill="white" opacity="0.28" fontSize="9" letterSpacing="2" fontFamily="sans-serif">PREVIEW</text>
  </svg>
);

const ProjectThumbnailArt = ({ projectId }) => THUMB_SVG[projectId] ?? null;

export default ProjectThumbnailArt;
