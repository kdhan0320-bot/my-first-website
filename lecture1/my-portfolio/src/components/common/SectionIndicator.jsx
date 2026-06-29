import { useState, useEffect } from 'react';
import { Box, Tooltip } from '@mui/material';
import { scrollToSection } from '../../hooks/useScrollNav';

const SECTIONS = [
  { id: 'home',     label: 'Home'     },
  { id: 'about',    label: 'About'    },
  { id: 'process',  label: 'Process'  },
  { id: 'skills',   label: 'Skills'   },
  { id: 'projects', label: 'Projects' },
  { id: 'contact',  label: 'Contact'  },
];

const ACTIVE_OFFSET = 140;

const SectionIndicator = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    let ticking = false;

    const update = () => {
      let current = 'home';
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= ACTIVE_OFFSET) {
          current = id;
        }
      }
      setActiveSection(current);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <Box
      component="nav"
      aria-label="섹션 인디케이터"
      sx={{
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.75,
        position: 'fixed',
        right: { md: 18, lg: 28 },
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 900,
      }}
    >
      {SECTIONS.map(({ id, label }) => {
        const isActive = activeSection === id;
        return (
          <Tooltip key={id} title={label} placement="left" arrow>
            <Box
              component="button"
              onClick={() => scrollToSection(id)}
              aria-label={`${label} 섹션으로 이동`}
              sx={(t) => ({
                width: isActive ? 10 : 7,
                height: isActive ? 10 : 7,
                borderRadius: '50%',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.25s ease',
                bgcolor: isActive
                  ? t.palette.primary.main
                  : t.palette.mode === 'dark'
                    ? 'rgba(148,163,184,0.32)'
                    : 'rgba(15,23,42,0.2)',
                boxShadow: isActive
                  ? t.palette.mode === 'dark'
                    ? `0 0 8px ${t.palette.primary.main}66`
                    : `0 0 6px ${t.palette.primary.main}55`
                  : 'none',
                '&:hover': {
                  bgcolor: t.palette.primary.main,
                  transform: 'scale(1.4)',
                },
                '&:focus-visible': {
                  outline: `2px solid ${t.palette.primary.main}`,
                  outlineOffset: '3px',
                },
                '@media (prefers-reduced-motion: reduce)': {
                  transition: 'none',
                },
              })}
            />
          </Tooltip>
        );
      })}
    </Box>
  );
};

export default SectionIndicator;
