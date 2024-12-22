import React, { useState } from 'react';
import { Card, Typography, TextField, IconButton, Box, useMediaQuery } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { Add_Commas, En_To_Fa, Fa_To_En } from 'persian_util/build/parser';

const CalculatorContainer = ({ project }) => {
  const [investment, setInvestment] = useState('');
  const [calculatedReturn, setCalculatedReturn] = useState('0');

  const isMobile = useMediaQuery('(max-width: 900px)');
  const fontSize = isMobile ? '12px' : '14px';

  const updateCalculatedReturn = (value) => {
    const price = parseFloat(Fa_To_En(value).replace(/,/g, '')) || 0.0;
    const expected = parseFloat(project.expected_profit) / 100 + 1;
    const calculated = (price * expected).toFixed(0);
    setCalculatedReturn(calculated);
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    const numericValue = Add_Commas(Fa_To_En(value).replace(/[^0-9]/g, ''));
    setInvestment(numericValue);
    updateCalculatedReturn(numericValue);
  };

  const handleIncrease = () => {
    const value = parseFloat(Fa_To_En(investment.replace(/,/g, ''))) || 0;
    const increasedValue = value + 1000000;
    const formattedValue = En_To_Fa(increasedValue.toLocaleString());
    setInvestment(formattedValue);
    updateCalculatedReturn(formattedValue);
  };

  const handleDecrease = () => {
    const value = parseFloat(Fa_To_En(investment.replace(/,/g, ''))) || 0;
    if (value > 1000000) {
      const decreasedValue = value - 1000000;
      const formattedValue = En_To_Fa(decreasedValue.toLocaleString());
      setInvestment(formattedValue);
      updateCalculatedReturn(formattedValue);
    }
  };

  return (
    <Card style={{ padding: '20px', borderRadius: '15px', boxShadow: 3,marginBottom: '20px' }}>
      <Box mt={2}>
        <TextField
          fullWidth
          value={En_To_Fa(investment)}
          onChange={handleInputChange}
     
          variant="outlined"
          sx={{ fontSize }}
          label="مبلغ سرمایه گذاری (تومان)"
          inputProps={{ style: { textAlign: 'center', fontSize ,inputMode: 'numeric', pattern: '[0-9]*'} }}
          InputProps={{
            startAdornment: (
              <IconButton onClick={handleIncrease}>
                <AddIcon />
              </IconButton>
            ),
            endAdornment: (
              <IconButton onClick={handleDecrease}>
                <RemoveIcon />
              </IconButton>
            ),
          }}
        />
      </Box>
      <Box mt={2} display="flex" justifyContent="space-between">
        <Typography style={{ fontSize, color: 'grey' }}>
          حداقل سرمایه گذاری
        </Typography>
        <Typography style={{ fontSize, color: 'grey' }}>
          {En_To_Fa(project.min_invest.toLocaleString())} تومان
        </Typography>
      </Box>
      <Box mt={4} textAlign="right">
        <Typography style={{ fontSize, fontWeight: 'bold', color: '#074EA0' }}>
          پیش بینی برگشتی شما
        </Typography>
        <Box mt={1} textAlign="center">
          <Typography style={{ fontSize, fontWeight: 'bold', color: '#074EA0' }}>
            {En_To_Fa(parseInt(calculatedReturn).toLocaleString())} تومان
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default CalculatorContainer;
