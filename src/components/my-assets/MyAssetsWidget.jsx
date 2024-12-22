import  { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Box , useMediaQuery } from '@mui/material';
import { fetchUser } from '../../api/profile.js'; // Assuming your API function
import ShowAllAssetsWidget from './showAllAssetsWidget'; // Assuming your ShowAllAssetsWidget component
import SaveMoneyImg from '../../assets/images/save-money.png';
import SalaryImg from '../../assets/images/salary.png';
import { useNavigate } from 'react-router-dom';
import { En_To_Fa, Add_Commas } from 'persian_util/build/parser'; // Import Persian utility functions
import Lottie from 'lottie-react';
import empty from '../../assets/images/empty.json'
const MyAssets = () => {
  const [profileState, setProfileState] = useState({ loading: true, profile: null, error: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await fetchUser();
        setProfileState({ loading: false, profile, error: null });
      } catch (error) {
        if (error.message === 'Unauthenticated.' || error.message === 'No token found') {
          navigate('/login',{ state: { from: '/myassets' } });
          localStorage.clear();
        }
        setProfileState({ loading: false, profile: null, error: error.message });
      }
    };

    fetchProfile();
  }, []);

  const { loading, profile, error } = profileState;
  const isMobile = useMediaQuery('(max-width: 900px)');
  const fontSize = isMobile ? '12px' : '14px';
  if (loading) {
    return (
      <Container style={{ textAlign: 'center', marginTop: isMobile ? '50%' : '20%' , height:'100vh'}}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container style={{ textAlign: 'center', marginTop: '50%' }}>
        <Typography sx={{fontSize}}>{error}</Typography>
      </Container>
    );
  }

  if (!Array.isArray(profile.projects) || profile.projects.length === 0) {
    return (
     <div style={{ display:'flex',flexDirection:'column'}}>
       <Container style={{ textAlign: 'center' }}>
        <Lottie animationData={empty} loop={true} style={{width:isMobile ?'200px' :'300px'}}/>
        <Typography sx={{fontSize , mt:2}}>شما خریدی انجام نداده اید</Typography>
      </Container>
     </div>
    );
  }

  let totalInvestments = 0;
  let totalReceived = 0;

  profile.projects.forEach(project => {
    project.transactions.forEach(transaction => {
      if (transaction.type === 1) {
        totalInvestments += transaction.amount;
      } else if ([2, 3, 4, 6].includes(transaction.type)) {
        totalReceived += transaction.amount;
      }
    });
  });

  return (
    <Container style={{padding:isMobile ?'0 0px': '0 90px'}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop:'100px'}}>
        <Container sx={{   textAlign: 'center',
    padding: '20px',
 
    borderRadius: '8px',
    flex: 1,
    maxWidth: '300px',backgroundColor:'white' }} >
          <img src={SaveMoneyImg} alt="Save Money" style={{ height: '60px', marginBottom: '10px' }} />
          <Typography sx={{fontSize}}>{En_To_Fa(Add_Commas(totalReceived.toFixed(0)))} تومان</Typography>
          <Typography sx={{fontSize}}>مجموع دریافتی های من</Typography>
        </Container>
        <Box sx={{width:10}}></Box>
        <Container sx={{   textAlign: 'center',
    padding: '20px',
   
    borderRadius: '8px',
    flex: 1,
    maxWidth: '300px',backgroundColor:'white'}}>
          <img src={SalaryImg} alt="Salary" style={{ height: '60px', marginBottom: '10px' }} />
          <Typography sx={{fontSize}}>{En_To_Fa(Add_Commas(totalInvestments.toFixed(0))) } تومان</Typography>
          <Typography sx={{fontSize}}>مجموع سرمایه گذاری های من</Typography>
        </Container>
      </Box>
      <Typography  style={{ marginTop: '20px', marginRight:'10px'}}>سرمایه گذاری ها</Typography>
      <Container>
        {profile.projects.map((project, index) => (
          <ShowAllAssetsWidget key={index} unit={project} user={profile.user} />
        ))}
      </Container>
      <Box sx={{ height: '80px' }}></Box>
    </Container>
  );
};

export default MyAssets;

