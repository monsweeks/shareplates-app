import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Button } from '@/components';
import img from '@/images/404.svg';
import './NoMatch.scss';

class NoMatch extends React.PureComponent {
  render() {
    const { history, t } = this.props;
    return (
      <div className="no-match-wrapper">
        <div className="error-image">
          <img alt="404" src={img} />
        </div>
        <div className="error-message">{t('message.notFoundResource')}</div>
        <div className="error-buttons">
          <Button
            color="primary"
            onClick={() => {
              history.goBack();
            }}
          >
            {t('label.button.goBack')}
          </Button>
          <Button
            color="white"
            onClick={() => {
              history.push('/');
            }}
          >
            {t('label.button.goFirst')}
          </Button>
        </div>
      </div>
    );
  }
}

export default withTranslation()(NoMatch);

NoMatch.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    goBack: PropTypes.func,
  }),
  t: PropTypes.func,
};
