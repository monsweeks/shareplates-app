import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { DATETIME_FORMATS_MAP, DATETIME_FORMATS } from '@/constants/constants';

class DateTime extends React.PureComponent {
  getDateTimeFormat = (format) => {
    const { user } = this.props;
    if (user && DATETIME_FORMATS_MAP[user.dateTimeFormat]) {
      return DATETIME_FORMATS_MAP[user.dateTimeFormat][format];
    }

    return DATETIME_FORMATS.find((info) => info.default).dateTimeFormat[format];
  };

  render() {
    const { value, className, formatType } = this.props;
    return (
      <span className={`date-time-wrapper ${className}`}>
        {moment(value).format(this.getDateTimeFormat(formatType))}
      </span>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

DateTime.defaultProps = {
  className: '',
  value: null,
  formatType: 'DT', // F, DT, D, HM
};

DateTime.propTypes = {
  value: PropTypes.string,
  className: PropTypes.string,
  user: PropTypes.shape({
    dateTimeFormat: PropTypes.number,
  }),
  formatType: PropTypes.string,
};

export default connect(mapStateToProps, undefined)(DateTime);
