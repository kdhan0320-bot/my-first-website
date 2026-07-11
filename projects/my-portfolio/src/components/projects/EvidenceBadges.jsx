import { Box, Typography } from '@mui/material';

/* Evidence Badge — 실제 데이터 필드(status/limitation/is_figma_project)에서만
 * 배지를 도출한다. 검증되지 않은 성과나 기능은 절대 표시하지 않는다.
 * 카드가 아니라 상세 모달 상단에만 노출해 카드 본문은 짧게 유지한다. */
const deriveBadges = (project) => {
  const badges = [];
  if (project?.status === 'complete') {
    badges.push(project.is_figma_project ? '설계 완료' : '구현 완료');
  }
  if (project?.detail?.limitation) {
    badges.push('한계 명시');
  }
  badges.push('반응형 확인');
  return badges.slice(0, 3);
};

const EvidenceBadges = ({ project }) => {
  const badges = deriveBadges(project);
  if (badges.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2 }}>
      {badges.map((label) => {
        /* emerald는 검증/완료 의미에만 제한적으로 사용 — 나머지 배지는 중립 slate 톤 유지 */
        const isComplete = label === '구현 완료' || label === '설계 완료';
        return (
          <Box
            key={label}
            sx={{
              px: 1.1, py: 0.35,
              borderRadius: 999,
              bgcolor: isComplete ? 'rgba(52,211,153,0.1)' : 'rgba(148,163,184,0.08)',
              border: isComplete ? '1px solid rgba(52,211,153,0.32)' : '1px solid rgba(148,163,184,0.22)',
            }}
          >
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: isComplete ? '#34D399' : 'text.secondary', letterSpacing: '0.02em' }}>
              {label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default EvidenceBadges;
