import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Button } from '@/components';
import img from '@/images/under.svg';
import './UnderConstruction.scss';

class UnderConstruction extends React.PureComponent {
  render() {
    const { history, t } = this.props;
    return (
      <div className="under-construction-wrapper">
        <div className="under-content">
          <div className="error-image">
            <img alt="404" src={img} />
          </div>
          <div className="error-message">{t('message.underConstruction')}</div>
          <div className="error-buttons">
            <Button
              color="primary"
              onClick={() => {
                history.goBack();
              }}
            >
              {t('button.goBack')}
            </Button>
            <Button
              color="white"
              onClick={() => {
                history.push('/');
              }}
            >
              {t('button.goFirst')}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(UnderConstruction);

UnderConstruction.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    goBack: PropTypes.func,
  }),
  t: PropTypes.func,
};
