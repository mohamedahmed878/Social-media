import React from 'react';

const AppLoader = () => (
  <div className="app-loader" role="status" aria-label="جاري التحميل">
    <div className="rail-logo">جيرة</div>
    <div className="dots-loader">
      <span />
      <span />
      <span />
    </div>
  </div>
);

export default AppLoader;
