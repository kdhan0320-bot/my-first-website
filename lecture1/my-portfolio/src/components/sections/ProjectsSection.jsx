import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent,
  Button, Chip, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Divider,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GitHubIcon from '@mui/icons-material/GitHub';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import RevealOnScroll from '../common/RevealOnScroll';
import { supabase } from '../../lib/supabase';
import { ALL_PROJECTS } from '../../data/projectsData';

/* 홈 fallback: is_featured=true → sort_order 오름차순 → 최대 3개 */
const FEATURED_FALLBACK = [...ALL_PROJECTS]
  .filter((p) => p.is_featured)
  .sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99))
  .slice(0, 3);

/* Supabase row → 공유 포맷 (detail 포함) */
const fromSupabase = (row) => ({
  id: String(row.id),
  title: row.title,
  description: row.description,
  categories: ['ai'],
  categoryLabel: row.category ?? 'AI 도구 활용 웹 구현',
  role: row.role ?? '—',
  tools: row.tech_stack ?? [],
  tags: (row.tech_stack ?? []).slice(0, 3),
  gradient: 'linear-gradient(135deg, #1E3A5F 0%, #2A5A8F 100%)',
  thumbnailUrl: row.thumbnail_url ?? null,
  liveUrl: row.demo_url ?? null,
  githubUrl: row.github_url ?? null,
  is_featured: row.is_featured ?? false,
  detail: {
    overview:    row.overview    ?? row.description,
    problem:     row.problem     ?? '—',
    goal:        row.goal        ?? '—',
    targetUser:  row.targetUser  ?? null,
    designPoint: row.designPoint ?? '—',
    process:     row.process     ?? null,
    result:      row.result      ?? null,
    nextStep:    row.nextStep    ?? '추후 케이스스터디 상세 내용을 추가할 예정입니다.',
  },
});

/* ── View Detail 모달 ── */
const DetailRow = ({ label, children }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
      {label}
    </Typography>
    {children}
  </Box>
);

const ProjectDetailModal = ({ project, open, onClose }) => {
  if (!project) return null;
  const { detail, role, tools, liveUrl, githubUrl } = project;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper"
      aria-labelledby="project-detail-title"
      PaperProps={{ sx: (t) => ({ borderRadius: 3, bgcolor: 'background.paper', border: `1px solid ${t.palette.divider}` }) }}>
      <DialogTitle id="project-detail-title"
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pb: 1 }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {project.categoryLabel}
          </Typography>
          <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700, mt: 0.25 }}>{project.title}</Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="상세 정보 닫기" size="small"
          sx={(t) => ({ color: 'text.secondary', ml: 1, '&:hover': { bgcolor: t.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#F1F5F9' } })}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2.5 }}>
        <DetailRow label="작업 개요">
          <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.75 }}>{detail.overview}</Typography>
        </DetailRow>
        {detail.problem && detail.problem !== '—' && (
          <DetailRow label="문제">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.problem}</Typography>
          </DetailRow>
        )}
        {detail.goal && detail.goal !== '—' && (
          <DetailRow label="목표">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.goal}</Typography>
          </DetailRow>
        )}
        {detail.targetUser && (
          <DetailRow label="대상 사용자">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.targetUser}</Typography>
          </DetailRow>
        )}
        <DetailRow label="맡은 일">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{role}</Typography>
        </DetailRow>
        {tools.length > 0 && (
          <DetailRow label="도구">
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {tools.map((t) => (
                <Chip key={t} label={t} size="small"
                  sx={(theme) => ({
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.08)' : '#EEF4FB',
                    color: 'primary.main',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.18)' : 'rgba(30,58,95,0.18)'}`,
                    fontWeight: 600, fontSize: '0.72rem',
                  })} />
              ))}
            </Box>
          </DetailRow>
        )}
        {detail.designPoint && detail.designPoint !== '—' && (
          <DetailRow label="핵심 설계 방향">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.designPoint}</Typography>
          </DetailRow>
        )}
        {detail.process && (
          <DetailRow label="작업 과정">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.process}</Typography>
          </DetailRow>
        )}
        {detail.result && (
          <DetailRow label="결과">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.result}</Typography>
          </DetailRow>
        )}
        {detail.lesson && (
          <DetailRow label="배운 점">
            <Box sx={(t) => ({ p: 1.5, borderRadius: 1.5, bgcolor: t.palette.mode === 'dark' ? 'rgba(245,158,11,0.06)' : '#FFFBEB', border: `1px solid ${t.palette.mode === 'dark' ? 'rgba(245,158,11,0.18)' : 'rgba(245,158,11,0.25)'}` })}>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.lesson}</Typography>
            </Box>
          </DetailRow>
        )}
        {detail.aiContribution && (
          <DetailRow label="AI 도구 활용">
            <Box sx={(t) => ({ p: 1.5, borderRadius: 1.5, bgcolor: t.palette.mode === 'dark' ? 'rgba(56,189,248,0.06)' : '#EEF4FB', border: `1px solid ${t.palette.mode === 'dark' ? 'rgba(56,189,248,0.15)' : 'rgba(30,58,95,0.12)'}` })}>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.aiContribution}</Typography>
            </Box>
          </DetailRow>
        )}
        {detail.limitation && (
          <DetailRow label="한계 및 개선점">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.limitation}</Typography>
          </DetailRow>
        )}
        <DetailRow label="다음 단계">
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.nextStep}</Typography>
        </DetailRow>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        {liveUrl && (
          <Button component="a" href={liveUrl} target="_blank" rel="noopener noreferrer"
            variant="contained" size="small" endIcon={<OpenInNewIcon sx={{ fontSize: '0.8rem !important' }} />}
            sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, fontWeight: 700 }}>
            실행 화면 보기
          </Button>
        )}
        {githubUrl && (
          <Button component="a" href={githubUrl} target="_blank" rel="noopener noreferrer"
            variant="outlined" size="small" startIcon={<GitHubIcon sx={{ fontSize: '0.85rem !important' }} />}
            sx={(t) => ({ color: 'text.secondary', borderColor: t.palette.divider, '&:hover': { borderColor: 'primary.main', color: 'primary.main' } })}>
            GitHub
          </Button>
        )}
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose} size="small"
          sx={(t) => ({ color: 'text.secondary', '&:hover': { bgcolor: t.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#F1F5F9' } })}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* ── 프로젝트별 SVG 썸네일 ── */
const THUMB_SVG = {
  'bus-redesign': ( // eslint-disable-line no-unused-vars
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

/* ── 썸네일 (이미지 우선 → SVG 프리뷰 폴백) ── */
const ProjectThumbnail = ({ gradient, thumbnailUrl, title, projectId }) => (
  <Box sx={{ position: 'relative', height: { xs: 200, md: 250 }, overflow: 'hidden', flexShrink: 0, background: gradient }}>
    {thumbnailUrl ? (
      <Box component="img" src={thumbnailUrl} alt={`${title} 프로젝트 썸네일`} loading="lazy" className="thumb-img"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
        sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', padding: '8px', transition: 'transform 0.35s ease' }} />
    ) : THUMB_SVG[projectId] ? (
      THUMB_SVG[projectId]
    ) : (
      <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', userSelect: 'none' }}>
          Project Preview
        </Typography>
      </Box>
    )}
    {/* hover overlay */}
    <Box className="thumb-overlay" sx={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.32) 100%)',
      opacity: 0,
      transition: 'opacity 0.3s ease',
      pointerEvents: 'none',
    }} />
  </Box>
);

const CARD_BADGES = [
  { label: '대표 작업',    color: '#F59E0B', lightColor: '#B45309', border: 'rgba(245,158,11,0.4)' },
  { label: '케이스 스터디', color: '#7DD3FC', lightColor: '#1D4ED8', border: 'rgba(56,189,248,0.4)' },
  { label: '시안',         color: '#C4B5FD', lightColor: '#6D28D9', border: 'rgba(167,139,250,0.4)' },
];

/* ── 프로젝트 카드 ── */
const ProjectCard = ({ project, idx, onDetail }) => {
  const uniqueTools = [...new Set(project.tools)].slice(0, 3);
  const hasRole = project.role && project.role !== '—';
  const badge = CARD_BADGES[idx] ?? CARD_BADGES[1];

  return (
  <RevealOnScroll delay={Math.min(idx % 3, 2) * 0.1} y={16} sx={{ display: 'flex', flexDirection: 'column' }}>
    <Card tabIndex={0} aria-label={`${project.title} 프로젝트 카드`}
      sx={(t) => ({
        display: 'flex', flexDirection: 'column', flex: 1,
        position: 'relative',
        minHeight: { md: 500 },
        bgcolor: t.palette.mode === 'dark' ? 'rgba(30,41,59,0.85)' : '#FFFFFF',
        backdropFilter: t.palette.mode === 'dark' ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: t.palette.mode === 'dark' ? 'blur(12px)' : 'none',
        border: `1px solid ${t.palette.mode === 'dark' ? 'rgba(148,163,184,0.14)' : '#E2E8F0'}`,
        borderTop: `2px solid ${t.palette.mode === 'dark' ? 'rgba(56,189,248,0.35)' : 'rgba(37,99,235,0.25)'}`,
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderTopColor: t.palette.primary.main,
          borderColor: t.palette.mode === 'dark' ? 'rgba(56,189,248,0.35)' : 'rgba(37,99,235,0.3)',
          boxShadow: t.palette.mode === 'dark'
            ? '0 16px 40px rgba(0,0,0,0.5), 0 0 20px rgba(56,189,248,0.08)'
            : '0 16px 40px rgba(15,23,42,0.12)',
        },
        '&:hover .thumb-img': { transform: 'scale(1.05)' },
        '&:hover .thumb-overlay': { opacity: 1 },
        '&:focus-visible': { outline: `2px solid ${t.palette.primary.main}`, outlineOffset: '2px' },
      })}>

      {/* 배경 번호 */}
      <Typography component="span" aria-hidden="true"
        sx={(t) => ({
          position: 'absolute',
          bottom: 8,
          right: 14,
          fontSize: '5rem',
          fontWeight: 900,
          lineHeight: 1,
          color: t.palette.mode === 'dark' ? 'rgba(255,255,255,0.028)' : 'rgba(0,0,0,0.038)',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
          letterSpacing: '-0.04em',
        })}
      >
        0{idx + 1}
      </Typography>

      {/* 배지 */}
      <Box
        sx={(t) => ({
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 2,
          px: 1.25,
          py: 0.5,
          borderRadius: '6px',
          bgcolor: t.palette.mode === 'dark' ? 'rgba(15,23,42,0.88)' : 'rgba(255,255,255,0.93)',
          border: `1px solid ${badge.border}`,
          backdropFilter: 'blur(8px)',
          boxShadow: t.palette.mode === 'dark'
            ? '0 2px 8px rgba(0,0,0,0.35)'
            : '0 2px 8px rgba(0,0,0,0.1)',
        })}
      >
        <Typography sx={(t) => ({
          color: t.palette.mode === 'dark' ? badge.color : badge.lightColor,
          fontWeight: 700,
          fontSize: '0.75rem',
        })}>
          {badge.label}
        </Typography>
      </Box>

      <ProjectThumbnail gradient={project.gradient} thumbnailUrl={project.thumbnailUrl} title={project.title} projectId={project.id} />

      <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <Box>
          <Typography variant="caption"
            sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
            {project.categoryLabel}
            {project.isPlaceholder && (
              <Box component="span" sx={{ ml: 1, color: 'text.disabled', fontWeight: 400, fontSize: '0.6rem' }}>(준비 중)</Box>
            )}
          </Typography>
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: 'text.primary', lineHeight: 1.3 }}>
            {project.title}
          </Typography>
        </Box>

        <Typography variant="body2"
          sx={{ color: 'text.secondary', fontSize: '0.8rem', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {project.description}
        </Typography>

        {hasRole && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700, flexShrink: 0, pt: '1px', fontSize: '0.65rem', letterSpacing: '0.04em' }}>맡은 일</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.5, fontSize: '0.72rem' }}>{project.role}</Typography>
          </Box>
        )}

        {uniqueTools.length > 0 && (
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem', lineHeight: 1.5 }}>
            {uniqueTools.join(' · ')}
          </Typography>
        )}

        <Stack direction="row" sx={{ mt: 'auto', pt: 0.5, flexWrap: 'wrap', gap: 0.75 }}>
          <Button size="small" variant="outlined" onClick={() => onDetail(project)} aria-label={`${project.title} 작업 과정 보기`}
            sx={(t) => ({
              fontSize: '0.72rem', px: 1.5, minHeight: 32, color: 'primary.main',
              borderColor: t.palette.mode === 'dark' ? 'rgba(56,189,248,0.3)' : 'rgba(37,99,235,0.35)', fontWeight: 600,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': { borderColor: 'primary.main', bgcolor: t.palette.mode === 'dark' ? 'rgba(56,189,248,0.06)' : '#EFF6FF', transform: 'translateY(-1px)' },
            })}>
            작업 과정 보기
          </Button>
          {project.liveUrl && (
            <Button component="a" href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              size="small" variant="contained" endIcon={<OpenInNewIcon sx={{ fontSize: '0.75rem !important' }} />}
              aria-label={`${project.title} 실행 화면 보기`}
              sx={(t) => ({
                fontSize: '0.72rem', px: 1.5, minHeight: 32, bgcolor: 'primary.main', fontWeight: 600,
                transition: 'transform 0.2s ease',
                '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-1px)' },
              })}>
              실행 화면 보기
            </Button>
          )}
          {project.githubUrl && !project.liveUrl && (
            <Button component="a" href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              size="small" variant="outlined" startIcon={<GitHubIcon sx={{ fontSize: '0.85rem !important' }} />}
              aria-label={`${project.title} GitHub 보기`}
              sx={(t) => ({
                fontSize: '0.72rem', px: 1.5, minHeight: 32, color: 'text.secondary', borderColor: t.palette.divider,
                transition: 'transform 0.2s ease',
                '&:hover': { borderColor: 'primary.main', color: 'primary.main', transform: 'translateY(-1px)' },
              })}>
              GitHub
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  </RevealOnScroll>
  );
};

/* ── 메인 섹션 ── */
const ProjectsSection = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(FEATURED_FALLBACK);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setProjects(data.slice(0, 3).map(fromSupabase));
        }
        /* error 또는 빈 배열이면 FEATURED_FALLBACK 유지 */
      })
      .catch(() => {});
  }, []);

  return (
    <Box
      component="section"
      id="projects"
      aria-label="프로젝트"
      sx={(theme) => ({
        position: 'relative',
        overflow: 'hidden',
        bgcolor: theme.palette.mode === 'dark' ? '#0F172A' : 'background.default',
        py: { xs: 7, md: 9 },
      })}
    >
      {/* 상단 구분선 */}
      <Box
        aria-hidden="true"
        sx={(theme) => ({
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: 1,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, transparent, rgba(56,189,248,0.25), rgba(124,58,237,0.25), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(37,99,235,0.15), rgba(124,58,237,0.15), transparent)',
        })}
      />

      {/* 배경 orbit ring */}
      <Box
        component="svg"
        viewBox="0 0 900 560"
        aria-hidden="true"
        sx={(theme) => ({
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '105%',
          height: 'auto',
          pointerEvents: 'none',
          opacity: theme.palette.mode === 'dark' ? 0.055 : 0.04,
        })}
      >
        <ellipse cx="450" cy="280" rx="430" ry="250" fill="none" stroke="#38BDF8" strokeWidth="1.5" />
        <ellipse cx="450" cy="280" rx="300" ry="175" fill="none" stroke="#A78BFA" strokeWidth="1" strokeDasharray="8 14" />
      </Box>

      <Container maxWidth="lg">

        <RevealOnScroll>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              sx={(theme) => ({
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '0.72rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                '&::before': { content: '""', display: 'block', width: 28, height: 1, bgcolor: 'primary.main', opacity: 0.45 },
                '&::after':  { content: '""', display: 'block', width: 28, height: 1, bgcolor: 'primary.main', opacity: 0.45 },
              })}
            >
              02 대표 작업
            </Typography>
            <Typography variant="h2" sx={{ color: 'text.primary', fontWeight: 800 }}>주요 프로젝트</Typography>
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary', maxWidth: 480, mx: 'auto' }}>
              문제 발견부터 화면 설계, 구현까지 이어진 대표 작업입니다.
            </Typography>
          </Box>
        </RevealOnScroll>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {projects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} idx={idx}
              onDetail={(p) => { setSelectedProject(p); setModalOpen(true); }} />
          ))}
        </Box>

        <RevealOnScroll delay={0.1}>
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/projects')}
              aria-label="전체 프로젝트 페이지로 이동"
              sx={(t) => ({
                fontWeight: 600,
                px: 4,
                minHeight: 44,
                color: 'primary.main',
                borderColor: t.palette.mode === 'dark' ? 'rgba(56,189,248,0.28)' : 'rgba(30,58,95,0.35)',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: t.palette.mode === 'dark' ? 'rgba(56,189,248,0.06)' : '#EEF4FB',
                },
              })}
            >
              모든 프로젝트 보기
            </Button>
          </Box>
        </RevealOnScroll>

      </Container>
      <ProjectDetailModal project={selectedProject} open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
};

export default ProjectsSection;

