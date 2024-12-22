import React from 'react';
import { Container, Typography, Grid } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

const InvestmentItem = ({ imageSrc, title, description }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <Container className='section' sx={{
            boxSizing: 'border-box',
            display: 'flex',
            borderRadius: '10px',
            // mt: isMobile ? 3 : 4,
            height: isMobile ? '240px' : '320px',
            width: '350px',
            maxWidth: '800px',
            mx: 'auto',
            overflow: 'hidden',
            margin: isMobile ? '0 auto' : '25px auto',
        }}>
            <Grid container alignItems='center' justifyContent='center' spacing={0} sx={{   }}>
                <Grid item>
                    <Container sx={{ background: '#f8f8f8', borderRadius: '50px', width: '100px', display: 'flex', justifyContent: 'center' }}>
                        <img src={imageSrc} alt="کراد فاندینگ" width={90} />
                    </Container>
                </Grid>
                <Grid xs={12} sm={12}>
                    <Grid item xs direction="column" spacing={0} justifyItems={'center'} justifyContent={'center'}>
                        <Grid item>
                            <Typography variant='h1' fontSize={isMobile ? '12px' : '14px'} sx={{marginBottom:'10px'}}>
                                {title}
                            </Typography>
                            <Typography variant='h1' sx={{color: 'GrayText',lineHeight:'22px'}}
                              fontSize={isMobile ? '12px' : '14px'}>
                                {description}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default InvestmentItem;