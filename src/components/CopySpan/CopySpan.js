import React from 'react';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';

class CopySpan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      copied: false,
    };
  }

  render() {
    const { className, icon, done, data } = this.props;
    const { copied } = this.state;

    return (
      <span
        className={className}
        onClick={() => {
          if (copy(data)) {
            this.setState(
              {
                copied: true,
              },
              () => {
                setTimeout(() => {
                  this.setState({
                    copied: false,
                  });
                }, 1000);
              },
            );
          }
        }}
      >
        {!copied && icon}
        {copied && done}
      </span>
    );
  }
}

export default CopySpan;

CopySpan.defaultProps = {
  className: '',
  icon: <i className="fal fa-clipboard" />,
  done: <i className="fal fa-clipboard-check" />,
};

CopySpan.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.node,
  done: PropTypes.node,
  data: PropTypes.string,
};
