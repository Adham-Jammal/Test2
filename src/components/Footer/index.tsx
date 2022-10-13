/* eslint-disable */
import * as React from 'react';
import './index.less';
import rightAccessLogo from '../../images/rightAccessLogo.png';

const Footer = () => {
  return (
    <footer className="footer">
      Powered by
      <a href="http://rightaccess.co/" target="_blank" rel="noopener noreferrer">
        <img src={rightAccessLogo} alt="right access" />
      </a>
      - MOHRA &copy; {new Date().getFullYear()}
    </footer>
  );
};
export default Footer;
