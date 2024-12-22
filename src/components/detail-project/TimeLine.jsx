import React from 'react';
import { Paper, Typography, useMediaQuery } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import CheckCircleIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Close';
import JalaliDateConverter from '../../utils/PersianDateConverter';
import { grey } from '@mui/material/colors';

const TimeLine = ({ project }) => {
  const isMobile = useMediaQuery('(max-width: 900px)');
  const fontSize = isMobile ? '9px' : '10px';

  const isTimePassed = (date) => {
    return new Date() > new Date(Date.parse(date));
  };

  const iconStyle = { color: 'inherit' };

  const getConnectorColor = (currentDate, nextDate) => {
    return isTimePassed(currentDate) && isTimePassed(nextDate) ? '#074EA0' : grey[500];
  };
  if (project.time_table === null) {
    return <div></div>
  }
  return (
    <Paper style={{ padding: '10px' }} sx={{ borderRadius: 5, boxShadow: 3, marginBottom: '20px' }}>
      <Timeline >
        {project.time_table &&
        
        project.time_table.map((item, index) => (
          <TimelineItem key={index}>
            <TimelineOppositeContent
              sx={{ m: 'auto 0', fontSize }}
              align="right"
              variant="body2"
              // color="text.secondary"
            >
              <JalaliDateConverter isoDate={item.date} />
            </TimelineOppositeContent>
            <TimelineSeparator>
              {index > 0 && (
                <TimelineConnector
                  sx={{ bgcolor: getConnectorColor(project.time_table[index - 1].date, item.date) }}
                />
              )}
              <TimelineDot
                sx={{
                  backgroundColor: 'unset',
                  scale: '0.9',
                  borderColor: isTimePassed(item.date) ? '#074EA0' : '#a6a6a6',
                }}
              >
                {isTimePassed(item.date) ? (
                  <CheckCircleIcon sx={{ color: '#074EA0' }} />
                ) : (
                  <CancelIcon sx={{ color: 'grey' }} />
                )}
              </TimelineDot>
              {index < project.time_table.length - 1 && (
                <TimelineConnector
                  sx={{ bgcolor: getConnectorColor(item.date, project.time_table[index + 1].date) }}
                />
              )}
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Typography variant="h6" component="span" style={{ fontSize }}>
                {item.title}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Paper>
  );
};

export default TimeLine;
