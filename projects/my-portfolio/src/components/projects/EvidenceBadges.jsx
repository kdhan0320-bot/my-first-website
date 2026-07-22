import { Box, Typography } from '@mui/material';
import { FONT_MONO, HUMAN_SIGNAL } from '../../theme';

/* Human Signal Phase 3A: pill 배지 나열("구현 완료"/"한계 명시"/"반응형 고려") 대신
 * ROLE/PLATFORM/TOOLS/DATA·SCOPE/STATUS로 구성된 compact summary rail로 바꾼다.
 * 실제 데이터 필드에서만 값을 만들고, 값이 없는 항목은 아예 표시하지 않는다
 * (지시서 8-3: "실제 데이터가 있는 항목만 표시한다" — 기간·인원·성과 수치는
 * 데이터가 없으므로 만들지 않는다). 파일 이름은 유지 규칙(삭제·이름변경 금지)에
 * 따라 그대로 두고 내부 구현만 바꿨다. */

const derivePlatform = (project) => {
  if (project?.is_figma_project) return 'Figma Prototype';
  if (project?.tools?.includes('React')) return 'Web (React/MUI)';
  if (project?.tools?.length) return 'Web';
  return null;
};

/* status='complete'일 때만 표시 — 'in_progress' 항목은 실제로 완료되지 않은
 * 상태를 완료처럼 보여주지 않기 위해 STATUS 자체를 비운다. */
const deriveStatusLabel = (project) => {
  if (project?.status !== 'complete') return null;
  return project.is_figma_project ? '설계 완료 · Figma Prototype' : '구현 완료';
};

const deriveTools = (project) => {
  const tools = project?.tools ?? [];
  if (tools.length === 0) return null;
  const shown = tools.slice(0, 3);
  const rest = tools.length - shown.length;
  return rest > 0 ? `${shown.join(' · ')} 외 ${rest}` : shown.join(' · ');
};

const FACT_DEFS = [
  { label: 'ROLE', get: (p) => p?.role || null },
  { label: 'PLATFORM', get: derivePlatform },
  { label: 'TOOLS', get: deriveTools },
  { label: 'DATA / SCOPE', get: (p) => p?.cardScope || null },
  { label: 'STATUS', get: deriveStatusLabel },
];

const TONES = {
  onLight: { label: HUMAN_SIGNAL.burntOrange, value: HUMAN_SIGNAL.inkText, divider: HUMAN_SIGNAL.paperDeep },
  onDark: { label: HUMAN_SIGNAL.brightOrangeOnDark, value: HUMAN_SIGNAL.steelMist, divider: 'rgba(170,183,196,0.2)' },
};

const EvidenceBadges = ({ project, tone = 'onLight', sx }) => {
  const colors = TONES[tone] ?? TONES.onLight;
  const facts = FACT_DEFS.map((d) => ({ label: d.label, value: d.get(project) })).filter((f) => f.value);
  if (facts.length === 0) return null;

  return (
    <Box component="dl" sx={{ display: 'flex', flexDirection: 'column', gap: 0, m: 0, ...sx }}>
      {facts.map((f) => (
        <Box
          key={f.label}
          sx={{
            display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 0.25, sm: 2 },
            py: 1.25, borderTop: `1px solid ${colors.divider}`,
          }}
        >
          <Typography component="dt" sx={{ fontFamily: FONT_MONO, fontSize: '0.6875rem', letterSpacing: '0.04em', color: colors.label, minWidth: 118, flexShrink: 0 }}>
            {f.label}
          </Typography>
          <Typography component="dd" sx={{ fontSize: '0.875rem', color: colors.value, lineHeight: 1.55, m: 0, wordBreak: 'keep-all' }}>
            {f.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default EvidenceBadges;
