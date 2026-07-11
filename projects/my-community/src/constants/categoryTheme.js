import FactCheckOutlined from '@mui/icons-material/FactCheckOutlined';
import DesignServicesOutlined from '@mui/icons-material/DesignServicesOutlined';
import ViewQuiltOutlined from '@mui/icons-material/ViewQuiltOutlined';
import WorkOutlineOutlined from '@mui/icons-material/WorkOutlineOutlined';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import ChatBubbleOutlineOutlined from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ForumOutlined from '@mui/icons-material/ForumOutlined';
import GridViewOutlined from '@mui/icons-material/GridViewOutlined';

/* 카테고리별 아이콘/라벨/썸네일 그라디언트 — 칩 아이콘과 카드 썸네일이 같은 소스를 공유한다 */
export const CATEGORY_THEME = {
  '전체': {
    icon: GridViewOutlined,
    label: '전체',
    gradient: 'linear-gradient(135deg, #64748B 0%, #94A3B8 100%)',
  },
  '포트폴리오 피드백': {
    icon: FactCheckOutlined,
    label: 'Portfolio Review',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
  },
  'Figma': {
    icon: DesignServicesOutlined,
    label: 'Figma Feedback',
    gradient: 'linear-gradient(135deg, #6D28D9 0%, #BE185D 100%)',
  },
  'UX/UI': {
    icon: ViewQuiltOutlined,
    label: 'UX/UI Review',
    gradient: 'linear-gradient(135deg, #0891B2 0%, #2563EB 100%)',
  },
  '취업 준비': {
    icon: WorkOutlineOutlined,
    label: 'Job Prep',
    gradient: 'linear-gradient(135deg, #059669 0%, #2563EB 100%)',
  },
  'AI Coding': {
    icon: AutoAwesomeOutlined,
    label: 'AI Coding',
    gradient: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
  },
  '자유게시판': {
    icon: ChatBubbleOutlineOutlined,
    label: 'Community Talk',
    gradient: 'linear-gradient(135deg, #475569 0%, #64748B 100%)',
    accent: 'rgba(245,158,11,0.35)',
  },
};

export const DEFAULT_CATEGORY_THEME = {
  icon: ForumOutlined,
  label: 'Feedback',
  gradient: 'linear-gradient(135deg, #64748B 0%, #94A3B8 100%)',
};

export const getCategoryTheme = (category) => CATEGORY_THEME[category] || DEFAULT_CATEGORY_THEME;
