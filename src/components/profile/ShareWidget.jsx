import {useState}  from 'react';
import { Box, Typography, IconButton, Collapse , useMediaQuery} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SnackbarComponent from '../../utils/SnackBar.jsx';

const ShareWidget = ({ isShare, user }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const handleShare = async () => {
    const uuid = user.uuid;
    const url = `https://smartfunding.ir/login/${uuid}`;
    try {
      await navigator.share({
        title: 'اسمارت فاندینگ',
        text: 'دوست عزیز سلام \n من تجربه سرمایه گذاری در پلتفرم اسمارت فاندینگ را داشتم  با سرمایه گذاری در این پلتفرم میتوانید سود بالا با ضمانت تعهد پرداخت را تجربه کنید روی لینک زیر بزنید تا از فرصت های سرمایه گذاری با سود بالا مطلع شوید\n👇👇\n',
        url,
      });
    } catch (error) {
    }
  };

  const handleCopy = () => {
    const uuid = user.uuid;
    const url = `https://smartfunding.ir/login/${uuid}`;
    navigator.clipboard.writeText(url).then(
      () => {
        setSnackbarMessage('کپی شد');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      },
      (err) => {

      }
    );
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Collapse in={isShare} timeout="auto" unmountOnExit>
      <Box pl={4} pr={4} pb={2}>
        <Typography sx={{fontSize:isMobile ? 12 : 14 , color:'GrayText'}}>
          دوست عزیز سلام 
          من تجربه سرمایه گذاری در پلتفرم اسمارت فاندینگ را داشتم  با سرمایه گذاری در این پلتفرم میتوانید سود بالا با ضمانت تعهد پرداخت را تجربه کنید روی لینک زیر بزنید تا از فرصت های سرمایه گذاری با سود بالا مطلع شوید 👇👇
        </Typography>
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={handleShare} color="primary">
            <ShareIcon />
          </IconButton>
          <IconButton onClick={handleCopy} color="primary">
            <ContentCopyIcon />
          </IconButton>
        </Box>
      </Box>
      <SnackbarComponent
                open={snackbarOpen}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
                severity={snackbarSeverity}
            />
    </Collapse>
    
  );
};

export default ShareWidget;
