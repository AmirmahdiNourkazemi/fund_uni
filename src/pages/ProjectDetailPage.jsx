// src/pages/ProjectDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProject } from '../api/project'; // Assuming this function fetches project data
import DetailScreen from '../components/detail-project/DetailScreen.jsx'; // Assuming you have a DetailScreen component

const ProjectDetailPage = () => {
  const { uuid } = useParams(); // Accessing UUID parameter from URL
  const [project, setProject] = useState(null);

//   useEffect(() => {
//     const fetchProjectData = async () => {
//       try {
//         const projectData = await getProject(uuid); // Fetch project details based on UUID
//         setProject(projectData);
//       } catch (error) {
//         console.error('Error fetching project:', error);
//       }
//     };

//     fetchProjectData();
//   }, [uuid]); // Fetch project data when UUID changes

  return (
    <div style={{ backgroundColor:'#F9F9F9'}}>
         <DetailScreen />
      {/* <h2>Project Detail Page</h2>
      {project ? (
        <DetailScreen /> // Pass fetched project data to DetailScreen component
      ) : (
        <p>Loading project details...</p>
      )} */}
    </div>
  );
};

export default ProjectDetailPage;
