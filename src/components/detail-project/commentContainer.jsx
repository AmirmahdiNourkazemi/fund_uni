import React, { useState, useEffect } from 'react';
import { Paper, TextField, Button, Typography, CircularProgress, Divider, List , Box, ListItem, ListItemText, ListItemAvatar, Avatar, Snackbar, useMediaQuery } from '@mui/material';
import { User } from '@phosphor-icons/react'
import { getComments, storeComment } from '../../api/comment.js';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import JalaliDateConverter from '../../utils/PersianDateConverter';
import { Maximize, WidthFull } from '@mui/icons-material';
import SnackbarComponent from '../../utils/SnackBar.jsx';
import { captchaSiteKey } from '../../const.js';
import ReCAPTCHA from "react-google-recaptcha"; 
const BuildCommentWidget = ({ }) => {
  const { uuid } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyParentId, setReplyParentId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [showCaptcha, setShowCaptcha] = useState(false); // State to show CAPTCHA
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [countdown, setCountdown] = useState(0); // Countdown state
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); 
    const token = Cookies.get('flutter.token');
  const isMobile = useMediaQuery('(max-width: 900px)');
  const fontSize = isMobile ? '12px' : '14px';
  
  useEffect(() => {
    if (uuid && token ) {
      // setFullName(localStorage.getItem('userFullName'));
      fetchComments();

    }
  }, [uuid, token]);
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setIsButtonDisabled(false); // Re-enable button after countdown ends
    }
  }, [countdown]);

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token); // Update token with CAPTCHA verification result
  };
  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await getComments(uuid);
      if (data && data.data) {
        setComments(data.data);
      }
    } catch (error) {
      setSnackbarMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
    const handleSnackbarClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setSnackbarOpen(false);
    };
  const handleCommentSubmit = async () => {
    if (commentText.trim()) {
      setLoading(true);
      try {
        await storeComment(uuid, commentText,null ,recaptchaToken);
        setSnackbarMessage('ثبت نظر با موفقیت انجام شد');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setCommentText('');
        fetchComments(); // Refresh comments after adding
      } catch (error) {
        console.log(error.status);
        if (error.status == 423) {
          // Show CAPTCHA if recaptcha is required
          setShowCaptcha(true);
          
        }else if (error.status == 429) {
          setCountdown(60); // Set the countdown to 60 seconds
          setIsButtonDisabled(true); // Disable the button
        }
         
          setSnackbarMessage(error.data.message.toString());
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReplySubmit = async (parentId) => {
    if (replyText.trim()) {
      setLoading(true);
      try {
        await storeComment(uuid, replyText, parentId , recaptchaToken);
        setSnackbarMessage('ثبت نظر با موفقیت انجام شد');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setCommentText('');
        setReplyText('');
        setReplyParentId(null);
        fetchComments(); // Refresh comments after adding
      } catch (error) {
        if (error.status == 423) {
          // Show CAPTCHA if recaptcha is required
          setShowCaptcha(true);
          
        }else if (error.status == 429) {
          setCountdown(60); // Set the countdown to 60 seconds
          setIsButtonDisabled(true); // Disable the button
        }
         
          setSnackbarMessage(error.data.message.toString());
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReplyClick = (parentId) => {
    setReplyParentId(parentId);
  };

  return (
    <>
      {token ? (
        <>
 <Typography
          mt={isMobile ? 2 : 2}
          style={{
            fontWeight: "600",
            textAlign: "center",
            marginBottom: "10px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          نظرات
        </Typography>


         <Paper style={{ padding: '20px', borderRadius: 15, boxShadow: 3  }}>

          <TextField
            label="ثبت نظر"
            fullWidth
            multiline
            style={{ fontSize }}
            rows={4}
            variant="outlined"
            InputLabelProps={{ sx: { fontSize, textAlign: 'center', justifyContent: 'center', justifyItems: 'center', display: 'flex' } }}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            margin="normal"
          />
           {showCaptcha && (
            <Box
            
              mt={2}
              mb={2}
              sx={{ display: "flex", justifyContent: "center" , fullWidth: '100%'}}
            >
              <ReCAPTCHA
                sitekey={captchaSiteKey} // Replace with your Google reCAPTCHA site key
                onChange={handleRecaptchaChange}
              />
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCommentSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'ثبت نظر'}
          </Button>
         
          {loading ? (
            <CircularProgress sx={{ display: 'flex', justifyContent: 'center' , alignItems:'center', m:'0 auto'}} />
          ) : (
            <List>
              {comments.map((comment, index) => (
                <React.Fragment key={comment.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar><User /></Avatar>
                    </ListItemAvatar>
          
                    <ListItemText>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignContent:'space-between'}}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'space-between' }} sx={{ fontSize }}>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography component="span" sx={{ fontSize , textOverflow: "ellipsis", overflow: "hidden"  }}>{comment.user.full_name}</Typography>
                        </div>
                        <Typography component="span" sx={{ fontSize, justifyContent: 'start', display: 'flex', flexDirection: 'row' }}>{comment.body}</Typography>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography component="span" sx={{ fontSize }} > <JalaliDateConverter isoDate={comment.created_at} /> </Typography>
                        <Button onClick={() => handleReplyClick(comment.id)} sx={{ fontSize }}>پاسخ</Button>
                      </div>
                    </div>
                    </ListItemText>
                  </ListItem>
                  {comment.replies && comment.replies.map((reply) => (
                    <ListItem key={reply.id} style={{ paddingRight: 40 }} alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar><User /></Avatar>
                      </ListItemAvatar>
                     
                       <ListItemText >
                   <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', alignContent:'space-between',width:'100%'}}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignContent:'space-between',width:'100%'}}>
                        <Typography component="span" sx={{ fontSize }}>{reply.user.full_name}</Typography>
                       
                       <Typography sx={{ fontSize}}> <JalaliDateConverter isoDate={reply.created_at} /> </Typography>
                        </div>
                        <Typography component="span" sx={{ fontSize, justifyContent: 'start' }}>{reply.body}</Typography>
                   </div>
                     
                       </ListItemText>

                    
                    </ListItem>
                  ))}
                  {replyParentId === comment.id && (
                    <ListItem style={{ paddingLeft: 40, display: 'flex', flexDirection: 'column' }}>
                      <TextField
                        label="ثبت پاسخ"
                        fullWidth
                        multiline
                        rows={2}
                        variant="outlined"
                        value={replyText}
                        InputLabelProps={{ sx: { fontSize, textAlign: 'center', justifyContent: 'center', justifyItems: 'center', display: 'flex' } }}
                        onChange={(e) => setReplyText(e.target.value)}
                        margin="normal"
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ fontSize }}
                        onClick={() => handleReplySubmit(comment.id)}
                        disabled={loading}
                      >
                        {loading ? <CircularProgress size={24} /> : 'ثبت پاسخ'}
                      </Button>
                    </ListItem>
                  )}
                  {index < comments.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
             <SnackbarComponent
          open={snackbarOpen}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          severity={snackbarSeverity}
        />
          
        </Paper>
        </>
       
      ) : (
        <Typography variant="body1"></Typography>
      )}
    </>
  );
};

export default BuildCommentWidget;
