import React from 'react';
import loading from "../../assets/cat.gif";

const Loader = () => {
  const imgStyle = {
    width: '300px',
    height: '300px'
  };

  return (
    <div>
      <img src={loading} alt="loader" style={imgStyle} />
    </div>
  );
}

export default Loader;
