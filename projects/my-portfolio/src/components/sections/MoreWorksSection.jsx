import { Box, Container, Typography } from '@mui/material';
import { ALL_PROJECTS } from '../../data/projectsData';
import ActionIcon from '../ui/ActionIcon';
import QhdAmbientSignal from '../ui/QhdAmbientSignal';
import QhdSectionIndex from '../ui/QhdSectionIndex';
import { FONT_MONO, HUMAN_SIGNAL, ULTRAWIDE_CONTENT_MAX_WIDTH, HOME_WIDE_MAX_WIDTH } from '../../theme';

/* Figma 이름은 Selected Works지만 기존 데이터 규칙(moreWorksPublished)은
 * 그대로 쓴다. 실제로 조사해서 공개 가능하다고 판단한 프로젝트만 표시하고,
 * 준비 중/공개 예정 placeholder 카드는 만들지 않는다 — 공개 항목이 없으면
 * 섹션 전체를 렌더링하지 않는다.
 *
 * 이 회차 전까지 있던 rail/Prev/Next/scroll 로직은 실제 공개 항목이 1개뿐이라
 * 한 번도 실행 검증되지 않은 채 남아 있던 코드였다 — 지금 필요 없는 기능을
 * 보존하지 않고 지웠다. 두 번째 작업이 공개되면 그때 요구사항에 맞춰 다시
 * 만든다(지금은 단일 feature 카드만 완성한다). */
const PUBLISHED_WORKS = ALL_PROJECTS.filter((p) => p.moreWorksPublished);

/* Phase 4B 재검토: burntOrange(#A84325, 전역 토큰)는 Paper Deep 위에서 4.30:1로
 * 기준(4.5:1) 미달이라 Phase 2D에서 Ink Navy로 교체했었다. 하지만 최신 Figma
 * "SELECTED WORKS" 라벨(267:56)이 실제로 쓰는 값은 burntOrange가 아니라
 * 별도의 더 어두운 orange `#9E3D22`이고, 이 값은 Paper Deep 위에서 4.78:1로
 * 기준을 통과한다(직접 재계산 확인) — Figma 값을 임의로 Ink Navy로 대체할
 * 이유가 없어져 원래 색으로 되돌린다. Warm Paper 위 라벨(ProjectsSection 등)에는
 * 쓰지 않는 Paper Deep 전용 값이라 전역 HUMAN_SIGNAL 토큰이 아닌 이 파일 지역
 * 상수로만 둔다(사용처가 한 곳뿐이라 과도한 시스템화를 피함). */
const ORANGE_ON_PAPER_DEEP = '#9E3D22';

/* Human Signal Phase 2F Hybrid: "이미지 위 그라데이션 오버레이 텍스트" 패턴을
 * 재검토한 결과, OTT 스크린샷(thumbnails/ott-service.png, 1200x675)은 상단
 * nav+CTA만 실제 UI이고 중앙~하단 대부분이 초대형 "NIGHT SIGNAL" 브랜드
 * 타이포라, 카드 높이(560~640px)에 맞춰 object-fit:cover로 확대하면 그 큰
 * 글자 중간이 어색하게 잘리고, 이를 가리려 오버레이를 강하게 걸수록 실제 UI
 * 노출은 오히려 줄어드는 모순이 있었다(ChatGPT가 최신 PNG에서 "실제 콘텐츠는
 * 상단 일부, 넓은 dark empty area"로 정확히 지적). object-fit:contain 기반
 * 좌/우 split으로 되돌려 이미지를 자르지 않고 전체를 보여준다 — 작업 지시서가
 * 명시적으로 허용한 대안이다("이미지 crop으로 해결 불가능하면 단순 60/40
 * split으로 되돌리는 것을 허용한다"). 텍스트가 이미지 위에 얹히지 않으므로
 * 겹침·가독성 문제 자체가 사라진다. */
const FeatureCard = ({ project }) => {
  const href = project.liveUrl ?? project.githubUrl ?? null;
  const isLink = Boolean(href);
  const meta = project.categoryLabel || (project.tools ?? []).join(' · ');

  return (
    <Box
      component={isLink ? 'a' : 'div'}
      href={isLink ? href : undefined}
      target={isLink ? '_blank' : undefined}
      rel={isLink ? 'noopener noreferrer' : undefined}
      aria-label={isLink ? `${project.title} 새 탭에서 열기` : undefined}
      sx={{
        display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, width: '100%',
        borderRadius: '20px', overflow: 'hidden',
        textDecoration: 'none', color: 'inherit',
        bgcolor: HUMAN_SIGNAL.deepHarbor,
        boxShadow: '0 30px 60px rgba(12,20,32,0.18)',
        cursor: isLink ? 'pointer' : 'default',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        '&:hover': isLink ? { transform: 'translateY(-3px)', boxShadow: '0 18px 40px rgba(12,20,32,0.26)' } : undefined,
        '&:active': isLink ? { transform: 'translateY(0)' } : undefined,
        '&:focus-visible': { outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`, outlineOffset: '2px', transform: 'none' },
        '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
      }}
    >
      {/* 이미지 영역 — 카드의 60%(1920+ 65%), object-fit:contain으로 실제 화면을 자르지
       * 않고 전체 노출한다(nav/CTA 같은 실제 UI가 항상 100% 보인다). */}
      <Box sx={{
        position: 'relative', width: { xs: '100%', sm: '60%' }, height: { xs: 268, sm: 420, md: 460 }, flexShrink: 0,
        bgcolor: HUMAN_SIGNAL.deepHarbor,
        '@media (min-width:1920px)': { width: '65%', height: 560 },
      }}>
        {project.thumbnailUrl ? (
          <Box component="img" src={project.thumbnailUrl} alt={`${project.title} 화면 미리보기`} loading="lazy"
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: HUMAN_SIGNAL.softWhite, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.inkNavy, fontSize: '0.875rem' }}>{project.title}</Typography>
          </Box>
        )}
      </Box>
      <Box sx={{
        p: { xs: 3, sm: 4, md: 5 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1.5,
        flex: 1, minWidth: 0, '@media (min-width:1920px)': { p: 6 },
      }}>
        <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.75rem', letterSpacing: '0.04em', color: HUMAN_SIGNAL.brightOrangeOnDark }}>
          {meta}
        </Typography>
        <Typography component="h3" sx={{
          fontWeight: 730, fontSize: { xs: '1.5rem', sm: '1.75rem' }, lineHeight: 1.25, letterSpacing: '-0.015em',
          color: HUMAN_SIGNAL.softWhite, '@media (min-width:1920px)': { fontSize: '2.5rem' },
        }}>
          {project.title}
        </Typography>
        <Typography sx={{
          fontSize: '0.9375rem', color: HUMAN_SIGNAL.steelMist, lineHeight: 1.6, wordBreak: 'keep-all',
          '@media (min-width:1920px)': { fontSize: '1.0625rem' },
        }}>
          {project.description}
        </Typography>
        {isLink && (
          <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.8125rem', fontWeight: 600, color: HUMAN_SIGNAL.brightOrangeOnDark, mt: 0.5, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
            VIEW PROJECT <ActionIcon variant="external" />
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const MoreWorksSection = () => {
  const count = PUBLISHED_WORKS.length;
  if (count === 0) return null;

  return (
    // Phase 2C에서 Paper Deep 전체 배경을 시도했다가 SELECTED WORKS 라벨의 실측
    // 대비가 기준(4.5:1) 미달이라 Warm Paper로 되돌렸었다. Phase 2D는 배경을
    // Paper Deep으로 복귀하며 라벨 색을 Ink Navy로 바꿔 대비를 해결했지만, Phase
    // 4B 재검토에서 Figma 실제 값(ORANGE_ON_PAPER_DEEP, #9E3D22)이 이미 기준을
    // 통과한다는 사실을 확인해 Figma 색으로 되돌린다(위 상수 선언부 주석 참고).
    // Selected Right 신호가 section 경계 위 123px부터 시작해 이전 Featured 섹션 위로
    // 넘어와야 한다(Figma 432:333 section-relative top -123, y=3900 - Selected 시작
    // 4023). 이 섹션 자체의 overflow:hidden(양쪽 축)을 그대로 두면 음수 top이 잘려
    // 안 보인다 — overflowX만 hidden으로 남겨 가로 스크롤은 이 섹션 선에서 막고
    // (documentElement.scrollWidth가 부모까지 전파되지 않게), overflowY는 지정하지
    // 않아 수직으로 넘치는 걸 그대로 보여준다(실제 audit:detailed로 1920/2560 둘 다
    // horizontalOverflow:false, selected-right documentTop 정상 확인 완료).
    <Box component="section" aria-label="더 많은 작업물" sx={{ position: 'relative', overflowX: 'hidden', bgcolor: HUMAN_SIGNAL.paperDeep, py: { xs: 7, md: 10 }, '@media (min-width:1920px)': { py: 12 } }}>
      {/* QHD(1920+) 전용 외곽 신호 — Figma 432:333, OTT 카드와 경쟁하지 않게 저대비. */}
      <QhdAmbientSignal variant="selected-right" sx={{ right: `calc((100vw - ${HOME_WIDE_MAX_WIDTH}px) / 2 - 440px)`, top: -123 }} />
      <QhdSectionIndex id="selected" index="03" label="SELECTED / RANGE" side="left" indexTop={117} labelTop={277} indexOffset={502} labelOffset={434} />

      <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, sm: 6, md: 8 }, maxWidth: { xl: ULTRAWIDE_CONTENT_MAX_WIDTH + 128 }, mx: 'auto',
          '@media (min-width:1920px)': { maxWidth: HOME_WIDE_MAX_WIDTH, px: 8 },
        }}
      >
        <Box sx={{ maxWidth: 640, mb: { xs: 4, md: 5 }, '@media (min-width:1920px)': { maxWidth: 900 } }}>
          <Typography sx={{ fontFamily: FONT_MONO, color: ORANGE_ON_PAPER_DEEP, fontSize: '0.75rem', letterSpacing: '0.06em', mb: 2 }}>
            SELECTED WORKS
          </Typography>
          <Typography component="h2" sx={{
            fontWeight: 750, fontSize: { xs: '1.75rem', sm: '2.2rem', md: '2.6rem' }, lineHeight: 1.2, letterSpacing: '-0.02em',
            color: HUMAN_SIGNAL.inkNavy, mb: 1.5, '@media (min-width:1920px)': { fontSize: '3.75rem' },
          }}>
            {/* 줄 끝 공백은 시각적으로 보이지 않지만 보조기술 textContent에서
             * 단어가 붙지 않게 한다(Phase 4B 접근성 재검사에서 발견). */}
            <Box component="span" sx={{ display: 'block' }}>다른 작업도, </Box>
            <Box component="span" sx={{ display: 'block' }}>같은 기준으로 정리했습니다.</Box>
          </Typography>
          {/* Phase 4B: mutedInk(#59636E)는 이 섹션 배경 Paper Deep 위에서 대비가
           * 기준(4.5:1) 미달로 확인됐다(자동 검사) — 더 어두운 inkText로 바꾼다.
           * ProjectsSection의 동일 문구 스타일은 배경이 더 밝은 Warm Paper라
           * mutedInk로도 기준을 충분히 넘어 그대로 둔다. */}
          <Typography sx={{ color: HUMAN_SIGNAL.inkText, fontSize: '0.875rem', '@media (min-width:1920px)': { fontSize: '1.125rem' } }}>
            <Box component="span" sx={{ display: 'block' }}>대표 프로젝트 밖의 반응형 퍼블리싱 작업을 </Box>
            <Box component="span" sx={{ display: 'block' }}>한눈에 확인할 수 있게 정리했습니다.</Box>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {PUBLISHED_WORKS.map((project) => <FeatureCard key={project.id} project={project} />)}
        </Box>
      </Container>
    </Box>
  );
};

export default MoreWorksSection;
