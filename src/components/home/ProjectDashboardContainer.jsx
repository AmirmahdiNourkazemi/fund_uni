import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Divider, LinearProgress } from '@mui/material';
import { En_To_Fa, Add_Commas } from 'persian_util/build/parser';
import useMediaQuery from '@mui/material/useMediaQuery';
const ProjectDashboardContainer = ({ project }) => {
  const navigate = useNavigate();

  const calculateDayDifference = () => {
    const startDateTime = project.start_at ? new Date(project.start_at) : null;
    const finishDateTime = project.finish_at ? new Date(project.finish_at) : null;
  
    if (!startDateTime || !finishDateTime) {
      return 0;
    }
  
    return _calculateDaysDifference(startDateTime, finishDateTime);
  };
  
  const _calculateDaysDifference = (start, finish) => {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const differenceInMilliseconds = finish - start;
    return Math.floor(differenceInMilliseconds / millisecondsPerDay);
  };
  
  const daysDifference = calculateDayDifference();
  
  const calculateMonthDifference = () => {



    const startDateTime = project.start_at ? new Date(project.start_at) : null;
    const finishDateTime = project.finish_at ? new Date(project.finish_at) : null;

    if (!startDateTime || !finishDateTime) {
      return 0;
    }

    return _calculateMonthsDifference(startDateTime, finishDateTime);
  };

  const _calculateMonthsDifference = (start, finish) => {

    return (finish.getFullYear() * 12 + finish.getMonth()) - (start.getFullYear() * 12 + start.getMonth());
  };

  const monthsDifference = calculateDayDifference();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const handleInvestmentStart = () => {
    // Navigate to project detail page with UUID
    navigate(`/project/${project.uuid}`); // Use navigate instead of history.push
  };
  return (
    
    <Card style={{ width:isMobile ? '100%' : '370px',  backgroundColor: 'white' , marginTop: '10px' , borderRadius:'10px'}}>
      <CardContent>
        <img src={project.images[0]?.original_url} alt={project.title} style={{ width: '100%', height: 210, borderRadius: 10 }} />
         
        <div style={{ margin: '10px 0', display: 'flex', justifyContent: 'center' }}>

        <Typography  style={{justifyItems:'center' , justifyContent:'center',fontSize:isMobile ? "11px" : "14px" , fontWeight:'bold'}}>{project.title}</Typography>
        
        </div>
        <Divider />
        <div style={{ margin: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{fontSize:isMobile ? "12px" : "14px" , color:'GrayText'}}>پیش بینی سود سالیانه:</Typography>
          <Typography sx={{fontSize:isMobile ? "12px" : "14px" , color:'GrayText'}}>{En_To_Fa(project.expected_profit)}%</Typography>
        </div>
        
        <Divider />
        <div style={{ margin: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{fontSize:isMobile ? "12px" : "14px" , color:'GrayText'}}>دوره سرمایه گذاری:</Typography>
          <Typography sx={{fontSize:isMobile ? "12px" : "14px" , color:'GrayText'}}>{En_To_Fa('12')} ماه</Typography>
        </div>
        
        <Divider />
        <div style={{ margin: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{fontSize:isMobile ? "12px" : "14px" , color:'GrayText'}}>کل مبلغ مورد نیاز:</Typography>
          <Typography sx={{fontSize:isMobile ? "12px" : "14px" , color:'GrayText'}}>{En_To_Fa(Add_Commas(project.fund_needed.toString()))} تومان</Typography>
        </div>
        
        <Divider />
        <div style={{ margin: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{fontSize:isMobile ? "12px" : "14px" , color:'GrayText'}}>مبلغ تامین شده:</Typography>
          <Typography sx={{fontSize:isMobile ? "12px" : "14px" , color:'GrayText'}}>{En_To_Fa(Add_Commas((project.fund_achieved || 0).toString()))} تومان</Typography>
        </div>

        <LinearProgress
          variant="determinate"
          value={(project.fund_achieved / project.fund_needed) * 100}
          style={{ height: 10, borderRadius: 5, margin: '10px 0' }}
        />
        
        <Button variant="contained"  fullWidth sx={{fontSize:isMobile ? "12px" : "14px" , backgroundColor:project.status === 1 ? '#074EA0' : 'GrayText',
        '&:hover': {
          backgroundColor: project.status === 1 ? '#053a7d' : 'GrayText', // Change hover color as needed
        }, }} onClick={handleInvestmentStart}>{project.status === 1 ? 'شروع سرمایه گذاری' : 'تامین مالی شد'}</Button>
      </CardContent>
    </Card>
  );
};

export default ProjectDashboardContainer;
