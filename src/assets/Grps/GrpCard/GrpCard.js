import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, CircleIcon } from '@/components';
import './GrpCard.scss';

class GrpCard extends React.PureComponent {
  render() {
    const { t, className } = this.props;
    const { grp, onCardClick, onConfigClick, newCard } = this.props;

    return (
      <Card
        className={`grp-card-wrapper g-no-select ${className}`}
        onClick={() => {
          onCardClick(grp ? grp.id : null);
        }}
      >
        <CardBody>
          {!newCard && onConfigClick && (
            <span className="config-button">
              <CircleIcon
                icon={<i className="fal fa-cog" />}
                onClick={(e) => {
                  e.stopPropagation();
                  onConfigClick(grp ? grp.id : null);
                }}
              />
            </span>
          )}
          <div className="grp-card-content">
            {newCard && (
              <>
                <div className="new-grp-content">
                  <div className="new-grp-icon">
                    <i className="fal fa-plus" />
                  </div>
                  <div className="text">{t('label.newGrp')}</div>
                </div>
              </>
            )}
            {!newCard && (
              <>
                <div className="grp-title">{grp.name}</div>
                <div className="grp-description text-center">{grp.description}</div>
                <div className="grp-stats">
                  <div>
                    <div className="user-count">
                      <div className="number">{grp.userCount}</div>
                      <div className="tag">USERS</div>
                    </div>
                  </div>
                </div>
                <div className="topic-count">
                  <span className="number">{grp.topicCount}</span> <span className="tag">TOPICS</span>
                </div>
                <div className="org-role">
                  <span>{grp.role}</span>
                </div>
              </>
            )}
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default withTranslation()(GrpCard);

GrpCard.defaultProps = {
  className: '',
  newCard: false,
};

GrpCard.propTypes = {
  t: PropTypes.func,
  grp: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    users: PropTypes.arrayOf(PropTypes.any),
    privateYn: PropTypes.bool,
    userCount: PropTypes.number,
    topicCount: PropTypes.number,
    role: PropTypes.string,
  }),
  className: PropTypes.string,
  onCardClick: PropTypes.func,
  onConfigClick: PropTypes.func,
  newCard: PropTypes.bool,
};
