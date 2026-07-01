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
  categoryLabel: row.category ?? 'AI Vibe Coding',
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
        <DetailRow label="Project Overview">
          <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.75 }}>{detail.overview}</Typography>
        </DetailRow>
        {detail.problem && detail.problem !== '—' && (
          <DetailRow label="Problem">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.problem}</Typography>
          </DetailRow>
        )}
        {detail.goal && detail.goal !== '—' && (
          <DetailRow label="Goal">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.goal}</Typography>
          </DetailRow>
        )}
        {detail.targetUser && (
          <DetailRow label="Target User">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.targetUser}</Typography>
          </DetailRow>
        )}
        <DetailRow label="Role">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{role}</Typography>
        </DetailRow>
        {tools.length > 0 && (
          <DetailRow label="Tools">
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
          <DetailRow label="UX/UI Point">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.designPoint}</Typography>
          </DetailRow>
        )}
        {detail.process && (
          <DetailRow label="UX/UI Process">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.process}</Typography>
          </DetailRow>
        )}
        {detail.result && (
          <DetailRow label="Result">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.result}</Typography>
          </DetailRow>
        )}
        {detail.aiContribution && (
          <DetailRow label="AI Contribution">
            <Box sx={(t) => ({ p: 1.5, borderRadius: 1.5, bgcolor: t.palette.mode === 'dark' ? 'rgba(56,189,248,0.06)' : '#EEF4FB', border: `1px solid ${t.palette.mode === 'dark' ? 'rgba(56,189,248,0.15)' : 'rgba(30,58,95,0.12)'}` })}>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.aiContribution}</Typography>
            </Box>
          </DetailRow>
        )}
        {detail.limitation && (
          <DetailRow label="Limitation & Improvement">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.limitation}</Typography>
          </DetailRow>
        )}
        <DetailRow label="Next Step">
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.nextStep}</Typography>
        </DetailRow>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        {liveUrl && (
          <Button component="a" href={liveUrl} target="_blank" rel="noopener noreferrer"
            variant="contained" size="small" endIcon={<OpenInNewIcon sx={{ fontSize: '0.8rem !important' }} />}
            sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, fontWeight: 700 }}>
            Live Demo
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
      {/* Before 폰 */}
      <rect x="58" y="16" width="76" height="132" rx="10" fill="none" stroke="white" strokeWidth="1.5" opacity="0.28"/>
      <rect x="70" y="30" width="52" height="7" rx="3" fill="white" opacity="0.2"/>
      <rect x="70" y="44" width="38" height="4" rx="2" fill="white" opacity="0.14"/>
      <rect x="70" y="56" width="52" height="22" rx="3" fill="white" opacity="0.1"/>
      <rect x="70" y="84" width="52" height="4" rx="2" fill="white" opacity="0.14"/>
      <rect x="70" y="95" width="40" height="4" rx="2" fill="white" opacity="0.11"/>
      <rect x="70" y="106" width="52" height="14" rx="2" fill="white" opacity="0.08"/>
      {/* 화살표 */}
      <text x="152" y="92" textAnchor="middle" fill="white" opacity="0.35" fontSize="14" fontFamily="sans-serif">→</text>
      {/* After 폰 */}
      <rect x="186" y="16" width="76" height="132" rx="10" fill="none" stroke="white" strokeWidth="1.5" opacity="0.55"/>
      <rect x="198" y="30" width="52" height="7" rx="3" fill="white" opacity="0.32"/>
      <rect x="198" y="44" width="32" height="4" rx="2" fill="white" opacity="0.22"/>
      <rect x="198" y="56" width="52" height="30" rx="4" fill="white" opacity="0.16"/>
      <rect x="198" y="92" width="52" height="18" rx="3" fill="white" opacity="0.13"/>
      <rect x="198" y="116" width="52" height="8" rx="2" fill="white" opacity="0.1"/>
    </svg>
  ),
  'figma-uiux': (
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      {/* 상단 컴포넌트 행 */}
      <rect x="16" y="16" width="84" height="54" rx="4" fill="none" stroke="white" strokeWidth="1" opacity="0.22"/>
      <rect x="24" y="24" width="54" height="7" rx="3" fill="white" opacity="0.18"/>
      <rect x="24" y="37" width="40" height="4" rx="2" fill="white" opacity="0.13"/>
      <rect x="24" y="48" width="58" height="4" rx="2" fill="white" opacity="0.1"/>
      <rect x="110" y="16" width="100" height="54" rx="4" fill="none" stroke="white" strokeWidth="1" opacity="0.22"/>
      <rect x="118" y="24" width="45" height="7" rx="3" fill="white" opacity="0.18"/>
      <rect x="118" y="37" width="70" height="4" rx="2" fill="white" opacity="0.13"/>
      <rect x="118" y="48" width="55" height="4" rx="2" fill="white" opacity="0.1"/>
      <rect x="220" y="16" width="84" height="54" rx="4" fill="none" stroke="white" strokeWidth="1" opacity="0.22"/>
      <rect x="228" y="24" width="50" height="7" rx="3" fill="white" opacity="0.18"/>
      <rect x="228" y="37" width="62" height="4" rx="2" fill="white" opacity="0.13"/>
      {/* 연결 화살표 */}
      <line x1="100" y1="43" x2="110" y2="43" stroke="white" strokeWidth="1" opacity="0.2"/>
      <line x1="210" y1="43" x2="220" y2="43" stroke="white" strokeWidth="1" opacity="0.2"/>
      {/* 하단 컴포넌트 행 */}
      <rect x="16" y="82" width="60" height="80" rx="4" fill="none" stroke="white" strokeWidth="1" opacity="0.18"/>
      <rect x="24" y="92" width="44" height="7" rx="3" fill="white" opacity="0.16"/>
      <rect x="24" y="106" width="36" height="4" rx="2" fill="white" opacity="0.12"/>
      <rect x="24" y="118" width="44" height="28" rx="3" fill="white" opacity="0.07"/>
      <rect x="86" y="82" width="108" height="44" rx="4" fill="none" stroke="white" strokeWidth="1" opacity="0.18"/>
      <rect x="94" y="92" width="80" height="7" rx="3" fill="white" opacity="0.16"/>
      <rect x="94" y="106" width="60" height="4" rx="2" fill="white" opacity="0.12"/>
      <rect x="204" y="82" width="100" height="44" rx="4" fill="none" stroke="white" strokeWidth="1" opacity="0.18"/>
      <rect x="212" y="92" width="65" height="7" rx="3" fill="white" opacity="0.16"/>
      <rect x="212" y="106" width="50" height="4" rx="2" fill="white" opacity="0.12"/>
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
  { label: '대표 작업',    color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  { label: '케이스 스터디', color: '#38BDF8', bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.3)' },
  { label: '시안',         color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.3)' },
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
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 2,
          px: 1.25,
          py: 0.4,
          borderRadius: '999px',
          bgcolor: badge.bg,
          border: `1px solid ${badge.border}`,
          backdropFilter: 'blur(8px)',
        }}
      >
        <Typography sx={{ color: badge.color, fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
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
          {project.githubUrl && (
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
              02 Mission Archive
            </Typography>
            <Typography variant="h2" sx={{ color: 'text.primary', fontWeight: 800 }}>Featured Projects</Typography>
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

