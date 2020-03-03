import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Link } from 'components';
import { withTranslation } from 'react-i18next';
import './Menu.scss';
import { connect } from 'react-redux';

class Menu extends React.PureComponent {
  render() {
    const { t, pathname, menus, openMenu, setOpen, pageColor } = this.props;

    return (
      <div className="menu-wrapper align-self-center justify-content-center align-middle">
        <Button
          className="d-inline-block d-md-none menu-open-button"
          color="primary"
          onClick={() => {
            setOpen(!openMenu);
          }}
        >
          <i className="fas fa-bars" />
        </Button>
        {menus.map((menu) => {
          let alias = '';
          if (pathname.indexOf('/pages') > -1) {
            alias = '/pages';
          } else if (pathname.indexOf('/chapters') > -1) {
            alias = '/chapters';
          } else if (pathname.indexOf('/topics') > -1) {
            alias = '/topics';
          } else if (pathname === '/') {
            alias = '/topics';
          }

          return (
            <Link
              underline={false}
              key={menu.text}
              className={`${
                alias === menu.to || pathname === menu.to ? 'selected' : ''
              } d-none d-md-inline-block menu-item`}
              to={menu.to}
              effect={false}
            >
              <div
                className="current-arrow"
              >
                <span style={{
                  backgroundColor: pageColor,
                }} />
              </div>
              <div className="icon">
                <span>
                  <i className={menu.icon} />
                </span>
              </div>
              <div className="text">
                <span>{t(menu.text)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    pageColor: state.control.pageColor,
  };
};

Menu.propTypes = {
  t: PropTypes.func,
  pathname: PropTypes.string,
  menus: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      text: PropTypes.string,
      to: PropTypes.string,
    }),
  ),
  openMenu: PropTypes.bool,
  setOpen: PropTypes.func,
  pageColor: PropTypes.string,
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(Menu)));
