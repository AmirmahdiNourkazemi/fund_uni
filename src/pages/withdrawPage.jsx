// src/pages/profilePage.jsx
import React from 'react';
import WithdrawScreen from '../components/wallet/withdraw/withdrawScreen.jsx';
import '../styles/withdrawPage.css';
const WithdrawPage = () => {
  return (
    <div className="withdraw-page">
      <WithdrawScreen />
    </div>
  );
};

export default WithdrawPage;
