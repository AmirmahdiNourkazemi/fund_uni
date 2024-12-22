import React from 'react';
import { Box } from '@mui/material';
import profitImage from '../../assets/images/profit.png';
import growthImage from '../../assets/images/growth.png';
import bankImage from '../../assets/images/bank.png';
import InvestmentItem from './InvestmentItem';  // Make sure to import the new component
import useMediaQuery from '@mui/material/useMediaQuery';
import '../../styles/SecondSection.css';

const SecondSection = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <Box sx={{ overflowX: 'hidden', display: 'flex', flexDirection: isMobile ? 'column':'row', alignItems: 'center', gap: 4 , mt: 2 , justifyContent: 'center'}}>
            <Box sx={{  display: 'flex', justifyContent: 'center' }}>
                <InvestmentItem
                    imageSrc={profitImage}
                    title="چرا تامین مالی جمعی؟"
                    description="سرمایه گذاری در طرح های تامین مالی جمعی، علاوه بر دریافت سود سه ماه یکبار غالبا با رشد اصل سرمایه همراه است و معمولا سود دریافتی فراتر از سود بانکی و اوراق با درامد ثابت می باشد."
                />
            </Box>
            <Box sx={{  display: 'flex', justifyContent: 'center' }}>
                <InvestmentItem
                    imageSrc={growthImage}
                    title="مزایای تامین مالی جمعی"
                    description="شما با سرمایه گذاری در طرح ها، در ایجاد یا توسعه کسب و کار مشارکت کرده اید و علاوه بر ارزش معنوی این کار در منافع مالی حاصل از اجرای طرح نیز شریک هستید."
                />
            </Box>
            <Box sx={{  display: 'flex', justifyContent: 'center' , mb:isMobile ? 2 : 0}}>
                <InvestmentItem
                    imageSrc={bankImage}
                    title="معافیت تامین مالی جمعی"
                    description="گواهی شراکت در طرح‌های تامین مالی جمعی که توسط شرکت فرابورس صادر می‌شود، اوراق بهادار رسمی کشور بوده و مطابق قوانین موجود برای این اوراق، معاف از هر گونه مالیات است."
                />
            </Box>
        </Box>
    );
};

export default SecondSection;
