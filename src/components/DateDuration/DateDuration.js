import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import { withTranslation } from 'react-i18next';

class DateDuration extends React.PureComponent {
  getDuration = (value, endValue, startValue) => {
    const { t } = this.props;
    let ms = moment(endValue).valueOf() - moment(startValue).valueOf();
    if (value) {
      ms = value * 1000;
    } else {
      ms = moment(endValue).valueOf() - moment(startValue).valueOf();
    }

    const minutes = Math.floor(ms / (1000 * 60));
    if (minutes > 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours}${t('시간')} ${minutes % 60}${t('분')}`;
    }
    return `${minutes}${t('분')}`;
  };

  render() {
    const { value, startValue, endValue, className, nullValue, icon } = this.props;
    return (
      <span className={`date-time-wrapper ${className}`}>
        {icon && <span className='mr-1'>{icon}</span>}
        {(value || (startValue && endValue)) && this.getDuration(value, endValue, startValue)}
        {!(value || (startValue && endValue)) && nullValue}
      </span>
    );
  }
}

DateDuration.defaultProps = {
  className: '',
  startValue: null,
  endValue: null,
  value : 0,
};

DateDuration.propTypes = {
  className: PropTypes.string,
  startValue: PropTypes.string,
  endValue: PropTypes.string,
  nullValue: PropTypes.string,
  value: PropTypes.number,
  t: PropTypes.func,
  icon : PropTypes.node,
};

export default withTranslation()(DateDuration);
