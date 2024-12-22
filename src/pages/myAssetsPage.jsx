import React from 'react';
import MyAssets from '../components/my-assets/MyAssetsWidget.jsx';
import '../styles/myAssets.css';
const myAssetsPage = () => {
  return (
    <div className="assets-page">
      <MyAssets />
    </div>
  );
};

export default myAssetsPage;
