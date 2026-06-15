import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import SkillTreeSection from '../components/sections/SkillTreeSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import ContactSection from '../components/sections/ContactSection';
import { scrollToSection } from '../hooks/useScrollNav';

const HomePage = () => {
  const location = useLocation();

  // 다른 페이지에서 navigate('/', { state: { scrollTo: 'skills' } }) 로 이동했을 때 처리
  useEffect(() => {
    const target = location.state?.scrollTo;
    if (!target) return;
    const timer = setTimeout(() => scrollToSection(target), 150);
    return () => clearTimeout(timer);
  }, [location.state]);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillTreeSection />
      <ProjectsSection />
      <ContactSection />
    </>
  );
};

export default HomePage;
