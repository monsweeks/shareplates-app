import React from 'react';
import PropTypes from 'prop-types';
import './PageListTopMenu.scss';

class PageListTopMenu extends React.PureComponent {
  render() {
    const { leftButtons, rightButtons, className } = this.props;

    return (
      <div className={`page-manager-top-control-bar-wrapper g-no-select ${className}`}>
        <div>
          <div className='left'>
            {leftButtons &&
              leftButtons.map((button) => {
                return button;
              })}
            {leftButtons && leftButtons.length > 0 && <div className="separator" />}
          </div>
          <div className='right'>
            {rightButtons &&
              rightButtons.map((button) => {
                return button;
              })}
            {rightButtons && rightButtons.length > 0 && <div className="separator" />}
          </div>
        </div>
      </div>
    );
  }
}

PageListTopMenu.defaultProps = {
  className: '',
};

PageListTopMenu.propTypes = {
  rightButtons: PropTypes.arrayOf(PropTypes.node),
  leftButtons: PropTypes.arrayOf(PropTypes.node),
  className: PropTypes.string,
};

export default PageListTopMenu;
