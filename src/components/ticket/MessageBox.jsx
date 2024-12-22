import React, { useState, useEffect } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  MenuItem,
  Badge,
  Snackbar,
  useMediaQuery,
  Divider,
  Fab,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowForward, Add, Delete, Refresh } from '@mui/icons-material';
import moment from 'moment-jalaali';
import axios from 'axios';
import { getTickets, closeTicket } from '../../api/ticket.js'; // Ensure the API functions are correctly imported
import JalaliDateConverter from '../../utils/PersianDateConverter.jsx';
import { Plus } from '@phosphor-icons/react';
import { En_To_Fa } from 'persian_util/build/parser/index.js';

const toPersianDigit = (num) => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  return num.toString().replace(/\d/g, (d) => persianDigits[d]);
};

const MessageBox = () => {
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const isMobile = useMediaQuery('(max-width: 900px)');
  const fontSize = isMobile ? '12px' : '14px';
  const navigate = useNavigate();
  useEffect(() => {
    fetchTickets();
  }, [currentPage]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await getTickets(10, currentPage); // Adjust perPage and page as needed
      setTickets(sortTickets(data.data));
      setTotalPages(data.last_page);
      setPagination(data);
    } catch (error) {
      if (error === 'Unauthenticated.' || error === 'No token found') {
        navigate('/login',{ state: { from: '/messagebox' } });
        localStorage.clear();
      }
      // console.error('Failed to fetch tickets:', error);
    }
    setLoading(false);
  };

  const sortTickets = (tickets) => {
    return tickets.sort((a, b) => {
      if (a.status === b.status) return 0;
      if (a.status === 1) return -1;
      if (b.status === 1) return 1;
      if (a.status === 2) return -1;
      if (b.status === 2) return 1;
      return 0;
    });
  };

  const handleRefresh = () => {
    fetchTickets();
  };
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const handleDialogOpen = (ticket) => {
    setSelectedTicket(ticket);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTicket(null);
  };

  const handleCloseTicket = async () => {
    if (selectedTicket) {
      try {
        await closeTicket(selectedTicket.uuid);
        fetchTickets();
        setSnackbarMessage('تیکت با موفقیت بسته شد');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Failed to close ticket:', error);
      }
    }
    handleDialogClose();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (

   <Box  sx={{width:"100%"}}>
<Container sx={{borderRadius:'10px' , backgroundColor:'#f2f2f2',mt:isMobile? 12:15 ,display:'flex',flexDirection:'column'}}>
   
   
   <Typography variant='h7' sx={{lineHeight:isMobile?2:4 ,display:'flex',justifyContent:'center'}}>
   تیکت ها
   </Typography>
{
  tickets.length === 0 ?  <Button
  onClick={()=>{
    navigate('/ticket')
  }}
  variant="contained"
  color="primary"
  startIcon={<Add />}
  sx={{ mt: 2 }}
>
  تیکت جدید
</Button> : null
}

     {loading ? (
       <CircularProgress sx={{ mt: 2 }} />
     ) : (
       <List >
         {tickets.map((ticket,index) => (
            <React.Fragment key={ticket.uuid}>
           <ListItem
             key={ticket.uuid}
             button
             onClick={()=>{
              navigate(`/chat/${ticket.uuid}`);
             }
             }
             sx={{
               bgcolor: ticket.status === 3 ? '#f2f2f2' : 'white',fontSize , cursor:ticket.status === 3 ? 'unset' : 'pointer'
             }}
           >
          
               <ListItemText/>
           <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', alignContent:'space-between',width:'100%'}}>
                       <Typography component="span" sx={{ fontSize }}>{`عنوان: ${ticket.title}`}</Typography>
                      
                      <Typography sx={{fontSize, mt:2}}> <JalaliDateConverter isoDate={ticket.created_at} /> </Typography>
                       </div>
             <Typography sx={{fontSize,width:'60px'}}>
               {ticket.status === 1
                 ? 'جدید'
                 : ticket.status === 2
                 ? 'پاسخ داده شده'
                 : 'بسته شده'}
             </Typography>
             {ticket.status !== 3 && (
               <IconButton
                 edge="end"
                 onClick={(e) => {
                   e.stopPropagation();
                   handleDialogOpen(ticket);
                 }}
               >
                 <Delete />
               </IconButton>
             )}
         
           </ListItem>
           {index < tickets.length - 1 && <Divider />}
           
           </React.Fragment>  ),)}
         
       </List>
       
     )}

<Fab
size='large'
onClick={()=>{
  navigate('/ticket')
}}
about='تیکت جدید'
       color="primary"
       aria-label="add"
       variant="extended"
       sx={{
         position: 'fixed',
         bottom:isMobile ? 55 : 10,
         left: 16,
       }}
     >
       <Typography sx={{fontSize:'10px',mr:1}}>تیکت جدید</Typography>
       <Plus size={19}/>
     </Fab>
     <Dialog open={dialogOpen} onClose={handleDialogClose}>
       <DialogTitle>{'بستن تیکت'}</DialogTitle>
       <DialogContent>
         <DialogContentText>
           {'آیا مطمئن هستید که می‌خواهید تیکت را ببندید؟'}
         </DialogContentText>
       </DialogContent>
       <DialogActions>
         <Button onClick={handleDialogClose} color="primary">
           خیر
         </Button>
         <Button onClick={handleCloseTicket} color="primary" autoFocus>
           بله
         </Button>
       </DialogActions>
     </Dialog>

     <Snackbar
       open={snackbarOpen}
       autoHideDuration={6000}
       onClose={handleSnackbarClose}
       message={snackbarMessage}
     />
      <div style={{ display: 'flex', justifyContent: 'center' , justifyItems:'Start' , justifySelf:'Start' , alignItems:'center' }}>
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={pagination.prev_page_url === null}
                sx={{ mx: 1 }}
              >
                صفحه قبل
              </Button>
              <Typography sx={{ mx: 0 , fontSize}}>{En_To_Fa(currentPage.toString())} / {En_To_Fa(totalPages.toString())}</Typography>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={pagination.next_page_url === null}
                sx={{ mx: 1 }}
              >
             صفحه بعد
              </Button>
            </div>
   </Container>

<Box sx={{height:'90px'}}></Box>
   </Box>
    
   
  );
};

export default MessageBox;
