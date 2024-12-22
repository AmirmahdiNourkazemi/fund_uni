import React from 'react';
import { CircularProgress, Container, Grid, Typography } from '@mui/material';
import ProjectDashboardContainer from './ProjectDashboardContainer.jsx'; // Assuming you have a component for each project
import useMediaQuery from '@mui/material/useMediaQuery';
const ProjectList = ({ projects, isLoading }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return (
    <Container id='project-section' sx={{alignItem:'center' , justifyContent:'center' , justifyItems:'center'}}>
        <div style={{ margin: '10px 0', display: 'flex', justifyContent: 'center' }}>
        <Typography variant={isMobile ? "h8" :"h5"} align='center' justifyContent={'center'} justifyItems={'center'} color={'primary'} >

طرح های درحال سرمایه گذاری

      </Typography>
        </div>
      
      {isLoading ? (
        <CircularProgress sx={{display:'flex',justifyContent:'center' , alignItems:'center', m:'0 auto'}}/>
      ) : (
    <Grid container spacing={isMobile ? 0 : 10} sx={{justifyContent:'center' , justifyItems:'center'}}>
          {projects.map((project) => (
            <Grid item key={project.id} xs={12} sm={12} md={6} lg={4}>
              <ProjectDashboardContainer project={project} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ProjectList;
