import React from 'react';

import './NoMatch.scss';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

class NoMatch extends React.PureComponent {
  render() {
    const { t } = this.props;

    return (
      <div className="no-match-wrapper">
        <h2>{t('message.404')}</h2>
      </div>
    );
  }
}

export default withTranslation()(NoMatch);

NoMatch.defaultProps = {
  t: null,
};

NoMatch.propTypes = {
  t: PropTypes.func,
};
