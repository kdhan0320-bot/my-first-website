import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import ProcessSection from '../components/sections/ProcessSection';
import SkillTreeSection from '../components/sections/SkillTreeSection';
import ContactSection from '../components/sections/ContactSection';
import SectionIndicator from '../components/common/SectionIndicator';
import { scrollToSection } from '../hooks/useScrollNav';

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    const target = location.state?.scrollTo;
    if (!target) return;
    const timer = setTimeout(() => scrollToSection(target), 150);
    return () => clearTimeout(timer);
  }, [location.state]);

  return (
    <>
      <SectionIndicator />
      <HeroSection />
      <AboutSection />
      <ProcessSection />
      <SkillTreeSection />
      <ProjectsSection />
      <ContactSection />
    </>
  );
};

export default HomePage;
