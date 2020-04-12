import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import RadioButton from '@/components/RadioButton/RadioButton';
import './ListControlBar.scss';

class ListControlBar extends React.PureComponent {
  render() {
    const { t } = this.props;
    const { viewType, onChangeViewType, buttons, title, className } = this.props;

    return (
      <div className={`list-control-bar-wrapper g-no-select ${className}`}>
        <div>
          <div className="text">{title}</div>
          <div className="options">
            {buttons &&
              buttons.map((button) => {
                return button;
              })}
            {buttons.length > 0 && <div className="separator" />}
            <div className="order-col option">
              <span className="label small">{t('표시 옵션')}</span>
              <RadioButton
                circle
                size="lg"
                items={[
                  {
                    key: 'card',
                    value: <i className="fal fa-th-large" />,
                    tooltip: t('카드'),
                  },
                  {
                    key: 'list',
                    value: <i className="fal fa-list-alt" />,
                    tooltip: t('리스트'),
                  },
                ]}
                value={viewType}
                onClick={onChangeViewType}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ListControlBar.defaultProps = {
  className: '',
};

ListControlBar.propTypes = {
  viewType: PropTypes.string,
  onChangeViewType: PropTypes.func,
  t: PropTypes.func,
  buttons: PropTypes.arrayOf(PropTypes.node),
  title: PropTypes.node,
  className: PropTypes.string,
};

export default withRouter(withTranslation()(ListControlBar));
