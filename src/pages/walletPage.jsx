import React from 'react';
import '../styles/walletPage.css';
import TrackDeposit from '../components/wallet/deposit/trackDeposit.jsx';
const WalletPage = () => {
  return (
    <div className="wallet-page">
      <TrackDeposit />
    </div>
  );
};

export default WalletPage;
