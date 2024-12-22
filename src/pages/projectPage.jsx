import React, { useEffect, useState } from 'react';
import ProjectList from '../components/home/ProjectList.jsx';
import { fetchProjects } from '../api/project';
import '../styles/projectPage.css';

import Fotter from '../components/home/Fotter.jsx'
import Box from '@mui/material/Box'
const ProjectPage = () => {
    const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
  
  return (
    <div className="project-page">
     <div style={{marginTop:'90px'}}>
     <ProjectList  projects={projects} isLoading={isLoading} />
     <Box sx={{ height: '50px' }}/>
     <Fotter/>
     <Box sx={{ height: '50px' }}/>
     </div>
   
    </div>
  );
};

export default ProjectPage;
