import '../iconfont/iconfont.css';
import React, { Component, PropTypes } from 'react';
const Iconfont = ({ type }) => {
  return (
    <i className={'anticon iconfont icon-'+type}>
    </i>
  );
};
export default Iconfont;