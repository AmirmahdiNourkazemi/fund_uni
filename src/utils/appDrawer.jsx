import React from 'react';
import { Drawer, Box, Grid, Card, CardMedia, Link , useMediaQuery , Dialog , DialogTitle} from '@mui/material';
import bazzarDark from "../assets/images/mobile-coffe-dark.svg";
import myketDark from "../assets/images/myket-dark.svg";// Update with the correct path

// DrawerContent function to handle the Drawer UI
const DrawerContent = ({ toggleDrawer }) => (
    <Box
      sx={{
        width: "auto",
        padding: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "60px",
        borderRadius: "10px",
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Grid
        container
        spacing={2}
        sx={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid item xs={6} sx={{ display: "flex", justifyContent: "center" }}>
          <Link
            href="https://cafebazaar.ir/app/ir.smartfunding"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card
              sx={{
                width: 130,
                height: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CardMedia component="img" image={bazzarDark} alt="bazzar" />
            </Card>
          </Link>
        </Grid>
        <Grid item xs={6} sx={{ display: "flex", justifyContent: "center" }}>
          <Link
            href="https://myket.ir/app/ir.smartfunding"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card
              sx={{
                width: 130,
                height: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CardMedia component="img" image={myketDark} alt="myket" />
            </Card>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
  
  // Main Drawer/Modal function component
  const CustomDrawer = ({ drawerOpen, toggleDrawer }) => {
    const isMobile = useMediaQuery("(max-width: 768px)");// Detect mobile screens
  
    return (
      <>
        {isMobile ? (
          // Mobile Drawer
          <Drawer anchor="bottom" open={drawerOpen} onClose={toggleDrawer(false)}>
            <DrawerContent toggleDrawer={toggleDrawer} />
          </Drawer>
        ) : (
          // Desktop Dialog
          <Dialog open={drawerOpen} onClose={toggleDrawer(false)}>
            <DialogTitle id="alert-dialog-title">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "10px",
                  boxShadow:5,
                  border:'1px solid #E0E0E0',
                }}
              >
                دانلود از طریق بازار و مایکت
              </Box>
        </DialogTitle>
            <DrawerContent toggleDrawer={toggleDrawer} />
          </Dialog>
        )}
      </>
    );
  };
  
  export default CustomDrawer;