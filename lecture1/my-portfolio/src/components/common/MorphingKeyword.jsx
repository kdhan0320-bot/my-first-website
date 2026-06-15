import { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';

const KEYWORDS = [
  'UX/UI 웹디자인',
  '웹퍼블리싱',
  'React 기반 화면 구현',
  '사용자 흐름 설계',
  '서비스형 웹 화면',
];

/* 한국어 조사 자동 결정 (을/를)
   마지막 글자의 유니코드 오프셋 % 28 = 0 이면 받침 없음 → 를 */
const getParticle = (word) => {
  const code = word.charCodeAt(word.length - 1);
  if (code < 0xAC00 || code > 0xD7A3) return '을'; // 비한글 → 기본 을
  return (code - 0xAC00) % 28 === 0 ? '를' : '을';
};

/* 스크린 리더 전용 시각적 숨김 스타일 */
const SR_ONLY = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0,
};

const MorphingKeyword = () => {
  /* prefers-reduced-motion 여부 - 마운트 시 1회 확인, ref로 고정 */
  const reduced = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  ).current;

  const [idx, setIdx]       = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reduced) return; // motion 축소 환경 → 정적 텍스트 유지

    const DISPLAY_MS = 2200; // 단어 표시 시간
    const FADE_MS    = 320;  // fade 전환 시간

    let intervalId;
    let timeoutId;

    intervalId = setInterval(() => {
      setVisible(false);
      timeoutId = setTimeout(() => {
        setIdx((prev) => (prev + 1) % KEYWORDS.length);
        setVisible(true);
      }, FADE_MS);
    }, DISPLAY_MS + FADE_MS);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const keyword  = reduced ? KEYWORDS[0] : KEYWORDS[idx];
  const particle = getParticle(keyword);

  return (
    <Typography
      variant="body1"
      component="p"
      sx={{
        color: 'text.secondary',
        lineHeight: 1.85,
        fontSize: { xs: '0.9375rem', md: '1.0625rem' },
        maxWidth: { xs: '100%', md: 480 },
        mx: { xs: 'auto', md: 0 },
        mb: { xs: 3, md: 5 },
      }}
    >
      {/* ── 스크린 리더 전용 정적 텍스트 ─────────────────────────────── */}
      <Box component="span" sx={SR_ONLY}>
        저는 UX/UI 웹디자인, 웹퍼블리싱, React 기반 화면 구현을 학습합니다.
      </Box>

      {/* ── 시각 전용 (애니메이션) ── aria-hidden으로 SR 중복 낭독 방지 ── */}
      <Box component="span" aria-hidden="true">
        저는{' '}
        <Box
          component="span"
          sx={{
            color: 'primary.main',
            fontWeight: 600,
            display: 'inline-block',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(6px)',
            transition: reduced
              ? 'none'
              : 'opacity 0.32s ease, transform 0.32s ease',
          }}
        >
          {keyword}
        </Box>
        {particle} 중심으로 사용자가 이해하기 쉬운 서비스 화면을 만들어가고 있습니다.
      </Box>
    </Typography>
  );
};

export default MorphingKeyword;
