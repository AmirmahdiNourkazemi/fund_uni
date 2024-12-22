import React from 'react';
import Marquee from 'react-marquee-slider';
import ArmanIt from '../../assets/images/armanati.png';
import Sandogh from '../../assets/images/sandogh.png';
import Toseie from '../../assets/images/toseie.png';
import Kish from '../../assets/images/kish.png'
import Etamad from '../../assets/images/etemad.png'
import Hummers from '../../assets/images/hummers.png'
import '../../styles/Slider.css'; // Import the CSS file
import { Container, Typography, useMediaQuery } from '@mui/material';

const ImageSlider = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const images = [
        // { src: ArmanIt, alt: 'Arman It' },
        { src: Sandogh, alt: 'Sandogh' },
        { src: Toseie, alt: 'Toseie' },
        { src: Kish, alt: 'Kish' },
        { src: Etamad, alt: 'Etamad' },
        { src: Hummers, alt: 'Hummers' },
    ];

    return (
        <>
          <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center' }}>
                    <Typography  sx={{ fontSize:isMobile ? "14px" : "18px" , fontWeight: 'bold' }} align='center' justifyContent={'center'} justifyItems={'center'} color={'primary'}>
                        همکاران ما
                    </Typography>
                </div>
                <Container sx={{ color: 'white', bgcolor: 'white', boxShadow: 1, borderRadius: 5 }}>
            <div className="slider-container">
              
                <Marquee velocity={90} scatter direction="rtl" >
                    {images.map((image, index) => (
                        <div key={index} className="slider-image-container" style={{ padding: isMobile ?'0 10px' :'0 100px' }}>
                            <img src={image.src} alt={image.alt} className="slider-image" style={{ width: isMobile ? '100px' : '120px' }} />
                        </div>
                    ))}
                </Marquee>
            </div>
        </Container>
        </>
       
    );
};

export default ImageSlider;
