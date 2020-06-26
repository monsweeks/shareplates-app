import React from 'react';
import PropTypes from 'prop-types';
import './FlexOverflowSection.scss';

class FlexOverflowSection extends React.PureComponent {
  scroller = React.createRef();

  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this.scroller);
    }
  }

  componentWillUnmount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(undefined);
    }
  }

  render() {
    const { className, children, overflowX, overflowY } = this.props;

    return (
      <div className={`flex-overflow-section-wrapper ${className}`}>
        <div>
          <div
            ref={this.scroller}
            className={`${overflowX ? 'overflow-x scrollbar' : ''} ${overflowY ? 'overflow-y scrollbar' : ''}`}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
}

FlexOverflowSection.defaultProps = {
  className: '',
  overflowX: false,
};

FlexOverflowSection.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  overflowX: PropTypes.bool,
  overflowY: PropTypes.bool,
  onRef: PropTypes.func,
};

export default FlexOverflowSection;
