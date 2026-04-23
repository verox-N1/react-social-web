import React from 'react';
import './Loader.css';

const Loader = ({ text = "Caricamento in corso..." }) => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p className="loader-text">{text}</p>
    </div>
  );
};

export default Loader;
