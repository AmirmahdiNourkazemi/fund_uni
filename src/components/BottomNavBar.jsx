import React, { useEffect } from 'react';
import { BottomNavigation, BottomNavigationAction, useMediaQuery } from '@mui/material';
import { HandCoins, HouseSimple, User, Wallet } from "@phosphor-icons/react";
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNavBar = () => {
    const isMobile = useMediaQuery('(max-width: 900px)');
    const navigate = useNavigate();
    const location = useLocation();
    const [value, setValue] = React.useState(1);
    const [valueNum, setNumValue] = React.useState(0);

    // Synchronize value with the current path
    useEffect(() => {
        if (location.pathname === '/') {
            setValue(1); // طرح ها
        } else if (location.pathname === '/profile') {
            setValue(0); // پروفایل
        }else if (location.pathname === '/myassets') {
            setValue(2); // پروفایل
        }
    }, [location.pathname]);

    if (!isMobile) {
        return null;
    }

    return (
        <BottomNavigation
            value={value}
            
            onChange={(event, newValue) => {
                setNumValue(newValue);
                setValue(newValue);
                navigate(newValue === 0 ? '/profile' : newValue ===1 ? '/' :  newValue ===2 ? '/myassets' : '/wallet');
            }}
            sx={{
                position: 'fixed',
                bottom: 0,
                width: '100%',
                bgcolor:'#F9F9F9' ,
                height: '50px',
                zIndex: 1000,
                borderRadius: '0px',
                boxShadow: 6,
                
            }}
            showLabels
        >
            
            <BottomNavigationAction
                label="پروفایل"
                icon={
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        width: '45px', 
                        height: '24px', 
                        borderRadius: '32%', 
                        backgroundColor: value === 0 ? '#cee4fd' : null 
                    }}>
                        <User size={22} color={value === 0 ? '#074EA0' : 'inherit'} />
                    </div>
                }
                sx={{
                    '& .MuiBottomNavigationAction-label': { fontSize: '10px' },
                    '&.Mui-selected': {
                        color: '#074EA0',
                    },
                    '&.Mui-selected .MuiBottomNavigationAction-label': {
                        fontWeight: 'bold',
                    },
                    '& .MuiTouchRipple-root': {
                        display: 'none',
                    },
                    '& .MuiBottomNavigationAction-root': {
                        outline: 'none',
                        boxShadow: 'none',
                    },
                    '& .MuiBottomNavigationAction-root:hover': {
                        backgroundColor: 'transparent',
                    },
                    '& .MuiBottomNavigationAction-root:focus': {
                        outline: 'none',
                        boxShadow: 'none',
                    },
                }}
            />

<BottomNavigationAction
                label="طرح ها"
                icon={
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        width: '45px', 
                        height: '24px', 
                        borderRadius: '32%', 
                        backgroundColor: value === 1 ? '#cee4fd' : null 
                    }}>
                        <HouseSimple size={22} color={value === 1 ? '#074EA0' : 'inherit'} />
                    </div>
                }
                sx={{
                    '& .MuiBottomNavigationAction-label': { fontSize: '10px' },
                    '&.Mui-selected': {
                        color: '#074EA0',
                    },
                    '&.Mui-selected .MuiBottomNavigationAction-label': {
                        fontWeight: 'bold',
                    },
                    '& .MuiTouchRipple-root': {
                        display: 'none',
                    },
                    '& .MuiBottomNavigationAction-root': {
                        outline: 'none',
                        boxShadow: 'none',
                    },
                    '& .MuiBottomNavigationAction-root:hover': {
                        backgroundColor: 'transparent',
                    },
                    '& .MuiBottomNavigationAction-root:focus': {
                        outline: 'none',
                        boxShadow: 'none',
                    },
                }}
            />
             <BottomNavigationAction
                label="دارایی ها"
                icon={
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        width: '45px', 
                        height: '24px', 
                        borderRadius: '32%', 
                        backgroundColor: value === 2 ? '#cee4fd' : null 
                    }}>
                        <HandCoins size={22} color={value === 2 ? '#074EA0' : 'inherit'} />
                    </div>
                }
                sx={{
                    '& .MuiBottomNavigationAction-label': { fontSize: '10px' },
                    '&.Mui-selected': {
                        color: '#074EA0',
                    },
                    '&.Mui-selected .MuiBottomNavigationAction-label': {
                        fontWeight: 'bold',
                    },
                    '& .MuiTouchRipple-root': {
                        display: 'none',
                    },
                    '& .MuiBottomNavigationAction-root': {
                        outline: 'none',
                        boxShadow: 'none',
                    },
                    '& .MuiBottomNavigationAction-root:hover': {
                        backgroundColor: 'transparent',
                    },
                    '& .MuiBottomNavigationAction-root:focus': {
                        outline: 'none',
                        boxShadow: 'none',
                    },
                }}
            />
            {/* <BottomNavigationAction
                label="کیف پول"
                icon={
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        width: '45px', 
                        height: '24px', 
                        borderRadius: '32%', 
                        backgroundColor: value === 3 ? '#cee4fd' : null 
                    }}>
                        <Wallet size={22} color={value === 3 ? '#074EA0' : 'inherit'} />
                    </div>
                }
                sx={{
                    '& .MuiBottomNavigationAction-label': { fontSize: '10px' },
                    '&.Mui-selected': {
                        color: '#074EA0',
                    },
                    '&.Mui-selected .MuiBottomNavigationAction-label': {
                        fontWeight: 'bold',
                    },
                    '& .MuiTouchRipple-root': {
                        display: 'none',
                    },
                    '& .MuiBottomNavigationAction-root': {
                        outline: 'none',
                        boxShadow: 'none',
                    },
                    '& .MuiBottomNavigationAction-root:hover': {
                        backgroundColor: 'transparent',
                    },
                    '& .MuiBottomNavigationAction-root:focus': {
                        outline: 'none',
                        boxShadow: 'none',
                    },
                }}
            /> */}
        </BottomNavigation>
    );
};

export default BottomNavBar;
