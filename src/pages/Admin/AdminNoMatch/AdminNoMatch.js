import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { EmptyMessage } from '@/components';

class AdminNoMatch extends React.PureComponent {
  render() {
    const { t } = this.props;
    return (
      <div className="d-flex h-100">
        <EmptyMessage
          className="h5"
          message={
            <div>
              <div>{t('메뉴를 선택 선택해주세요')}</div>
            </div>
          }
        />
      </div>
    );
  }
}

AdminNoMatch.propTypes = {
  t: PropTypes.func,
};

export default withTranslation()(AdminNoMatch);
