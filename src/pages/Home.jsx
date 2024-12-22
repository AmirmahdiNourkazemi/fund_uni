// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import FirstSection from '../components/home/FirstSection.jsx';
import SecondSection from '../components/home/SecondSection.jsx';
import ProjectList from '../components/home/ProjectList.jsx';
import { fetchProjects } from '../api/project';
import '../styles/Home.css';  
import Slider from '../components/home/slider.jsx';
import {Box} from '@mui/material';
import Footer from '../components/home/Fotter.jsx';
import { useLocation } from 'react-router-dom';
import ProjectHome from '../components/home/projectsHome.jsx';
import MobileContainer from '../components/home/mobileContainer.jsx';
const Home = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const getProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (error) {
       
      } finally {
        setIsLoading(false);
      }
    };

    getProjects();
  }, []);
  
  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);
  return (
    <div className="home">
      {/* <Header /> */}
      <FirstSection />
      <SecondSection />
      <ProjectHome  projects={projects} isLoading={isLoading} />
      <MobileContainer/>
      <Slider/>
      <Box sx={{ height: 40 }} />
      <Footer/>
      <Box sx={{ height: 80 }} />

    </div>

  );
};

export default Home;
