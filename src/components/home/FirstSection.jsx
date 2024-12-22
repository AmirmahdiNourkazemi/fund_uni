import React from 'react';
import { Box } from '@mui/material';
import { ArrowDownward } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import mobileBanner from '../../assets/images/banner-mobile.png';
import desktopBanner from '../../assets/images/banner.svg'
import '../../styles/FirstSection.css';
import { useNavigate } from "react-router-dom";

const FirstSection = () => {
  const isMobile = useMediaQuery('(max-width: 1215px)');
  const bannerImage = isMobile ? mobileBanner : desktopBanner;
  const navigate = useNavigate()

  return (
    <Box className="banner-container">
      <img src={bannerImage} alt="تامین مالی جمعی" className="banner-image" />
      {isMobile ? (
        <button className="buttonMobile" onClick={() => {
          navigate("#project-section");
        }}>
         <svg viewBox="0 0 448 512" className="svgIcon">
          
            <ArrowDownward/>
          </svg>
        </button>
      ) : (
        <button className="buttonDesktop" onClick={() => {
          navigate("#project-section");
        }}>
          <span className="button-content" onClick={() => {
                navigate("#project-section");
              }}>نمایش طرح ها</span>
        </button>
      )}
    </Box>
  );
};

export default FirstSection;
