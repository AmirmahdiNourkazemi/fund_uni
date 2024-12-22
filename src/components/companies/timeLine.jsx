import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import img1 from '../../assets/images/company-1.png'
import img2 from '../../assets/images/company-2.png'
import img3 from '../../assets/images/company-3.png'
import img4 from '../../assets/images/company-4.png'
import arrow from '../../assets/images/arrow.svg'
const timelineData = [
  {
    image: img1,
    title: 'ارسال طرح توسط متقاضی',
    text: 'متقاضی سرمایه بایستی طرح کسب و کار خود را مطابق با فرمت مشخص به همراه سایر اسناد و مدارک درخواستی به عامل (سکو) ارسال نماید',
  },
  {
    image: img2,
    title: 'ارزیابی طرح، تایید و عقد قرارداد',
    text: 'عامل طرح و مستندات ارسالی را بررسی نموده و به متقاضی بازخورد می دهد و پس از تایید طرح نهایی توسط عامل/نهاد مالی، قرارداد بین متقاضی و عامل منعقد می گردد',
  },
  {
    image: img3,
    title: 'تایید فرابورس و دریافت نماد',
    text: 'طرح تایید شده توسط عامل به فرابورس ارسال می گردد و پس از تایید، نماد اختصای طرح توسط فرابورس صادر می شود',
  },
  {
    image: img4,
    title: 'انتشار فراخوان و جمع‌آوری وجوه',
    text: 'فراخوان جذب سرمایه در سایت سکو منتشر می شود و در مدت مشخص شده به جمع آوری وجوه و تامین مالی از سرمایه گذاران اقدام می شود',
  },
];

const Timeline = () => {
  const isMobile = useMediaQuery('(max-width: 900px)');
  const fontSize = isMobile ? '12px' : '14px';
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize:fontSize,
        mb: 4,
        maxWidth:isMobile ? null : '700px',
        margin: '0 auto',
        position:'relative'
      }}
    >
      {timelineData.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: isMobile ? 4 : 0,
            textAlign: 'center',
            fontSize:fontSize,
            backgroundColor:'#f2f2f2',
             borderRadius:'20px',
             marginRight:2,
             my:2,
             p:5
          }}
        >
          <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px' }} />
          <Typography variant='h6'  sx={{ mt: 2 , letterSpacing:0.1 , wordSpacing:-2}}>{item.title}</Typography>
          <Typography  sx={{ mt: 1 ,fontSize}}>{item.text}</Typography>
        </Box>
       
      ))}
       <div style={{position:'absolute' , left:'720px' , bottom:'700px' ,display:isMobile ? 'none' : 'block'}}>
            <img src={arrow} alt="" />
        </div>
        <div style={{position:'absolute' , right:'725px' , bottom:'450px',display:isMobile ? 'none' : 'block' }}>
            <img src={arrow} alt="" style={{  transform: 'rotateY(180deg)' }} />
        </div>
        <div style={{position:'absolute' , left:'725px' , bottom:'150px',display:isMobile ? 'none' : 'block'}}>
            <img src={arrow} alt="" />
        </div>
    </Box>
  );
};

export default Timeline;