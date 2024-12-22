import React from 'react';
import { Card, Typography, Divider, Button, Box , useMediaQuery} from '@mui/material';
import { FilePdf  as PictureAsPdfIcon } from '@phosphor-icons/react';

const AttachmentsContainer = ({ attachments }) => {
  if (attachments.length === 0) {
    return null; // Return null if there are no attachments
  }
  const isMobile = useMediaQuery('(max-width: 900px)');
  const fontSize = isMobile ? '12px' : '14px';
  return (
    <Box mt={isMobile ? 2 : 2}>
      <Typography style={{fontWeight: '600',  textAlign: 'center' , marginBottom:'10px'}}>
        اسناد طرح
      </Typography>
      <Card style={{ padding: '20px', borderRadius: '15px', boxShadow: 3 }}>
        {attachments.map((attachment, index) => (
          <div key={index}>
            <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
              <Button 
                variant="text" 
                color="primary" 
                onClick={() => window.open(attachment.original_url, '_blank')}
                style={{  fontSize, textTransform: 'none' }}
              >
                {attachment.name}
              </Button>
              <PictureAsPdfIcon size={25} color='#074EA0' />
            </Box>
            {index < attachments.length - 1 && <Divider />}
          </div>
        ))}
      </Card>
    </Box>
  );
};

export default AttachmentsContainer;
