import React from 'react';
import { Button, CircularProgress, Container, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import useMediaQuery from '@mui/material/useMediaQuery';
import ProjectDashboardContainer from './ProjectDashboardContainer';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const ProjectHome = ({ projects, isLoading }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <Container 
      id='project-section' 
      sx={{ 
        alignItem: 'center', 
        justifyContent: 'center', 
        justifyItems: 'center', 
        position: 'relative', // Added to make container relative for the button
        paddingBottom: '40px'  // Padding to ensure space for the button
      }}
    >
      <div style={{ margin: '10px 0', display: 'flex', justifyContent: 'center' }}>
        <Typography 
          variant={isMobile ? "h8" : "h6"} 
          align='center' 
          justifyContent={'center'} 
          justifyItems={'center'} 
          color={'primary'}
        >
          طرح های سرمایه گذاری
        </Typography>
      </div>

      {isLoading ? (
        <CircularProgress sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', m: '0 auto' }} />
      ) : (
        <>
          <Grid 
            container 
            spacing={isMobile ? 0 : 0} 
            sx={{ 
              justifyContent: 'center', 
              justifyItems: 'center' 
            }}
          >
            {projects.slice(0, 3).map((project) => ( // Show top 3 projects
              <Grid item key={project.id} xs={12} sm={12} md={6} lg={4}>
                <ProjectDashboardContainer project={project} />
              </Grid>
            ))}
          </Grid>

          {/* "View More" Button */}
          <div 
            style={{ 
              position: 'absolute',  // Make the button position relative to the container
              left:isMobile ? '0px' :'25px',
              paddingTop:'10px',         // Adjust position relative to the bottom
              width: '100%',          // Make sure button is centered
              display: 'flex', 
              justifyContent: isMobile ? 'center' :'end' 
            }}
          >
            <Button 
              variant="outlined" 
              color="primary" 
              endIcon={<ArrowBack />}
              onClick={() => navigate('/projects')} // Navigate to "/projects" on click
            >
              مشاهده بیشتر طرح ها
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default ProjectHome;
