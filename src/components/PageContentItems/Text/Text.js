import React from 'react';
import PropTypes from 'prop-types';
import './Text.scss';

class Text extends React.PureComponent {
  render() {
    const { className, item } = this.props;

    console.log(item);

    return (
      <div className={`text-wrapper ${className}`}>
        <div>TEXTEXT</div>

      </div>
    );
  }
}

Text.propTypes = {
  className: PropTypes.string,
  item : PropTypes.objectOf(PropTypes.any)
};

Text.itemName = 'text';
Text.setting = {
  w: 120,
  h: 4,
};

export default Text;
