import React from 'react';
import './Footer.scss';
import { Link, Logo } from '@/components';

class Footer extends React.PureComponent {
  render() {
    return (
      <footer className="footer-header-wrapper ">
        <div className="flex-grow-1 copyright-col text-center text-lg-right">
          <div className="copyright">
            <div className='d-none d-md-block'>COPYRIGHT 2020 ALL RIGHT RESERVED</div>
            <div className="small">BY FUNNY-BROTHERS</div>
          </div>
        </div>
        <div className="flex-grow-0 logo-col">
          <Logo className="logo" hideText />
          <div className="light light1" />
          <div className="light light2" />
          <div className="light light3" />
        </div>
        <div className="bottom-menu flex-grow-1 text-center text-lg-left">
          <ul>
            <li>
              <Link underline={false} effect={false} componentClassName="px-2" to="/">
                CONTACT US
              </Link>
            </li>
            <li>
              <Link underline={false} effect={false} componentClassName="px-2" to="/">
                TUTORIAL
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    );
  }
}

export default Footer;
