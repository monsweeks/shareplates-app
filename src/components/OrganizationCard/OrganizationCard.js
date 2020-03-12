import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody } from '@/components';
import './OrganizationCard.scss';
import CircleIcon from '@/components/CircleIcon/CircleIcon';

class OrganizationCard extends React.PureComponent {
  render() {
    const { className, organization, onCardClick, onConfigClick, newCard } = this.props;

    return (
      <Card
        className={`organization-card-wrapper g-no-select ${className}`}
        onClick={() => {
          onCardClick(organization ? organization.id : null);
        }}
      >
        <CardBody>
          {!newCard && onConfigClick && (
            <span className="config-button">
              <CircleIcon
                icon={<i className="fal fa-cog" />}
                onClick={(e) => {
                  e.stopPropagation();
                  onConfigClick(organization ? organization.id : null);
                }}
              />
            </span>
          )}
          <div className="organization-card-content">
            {newCard && (
              <>
                <div className="new-organization-content">
                  <div className="new-organization-icon">
                    <i className="fal fa-plus" />
                  </div>
                  <div className="text">새로운 ORG</div>
                </div>
              </>
            )}
            {!newCard && (
              <>
                <div className="organization-title">{organization.name}</div>
                <div className="organization-description text-center">{organization.description}</div>
                <div className="organization-stats">
                  <div>
                    <div className="user-count">
                      <div className="number">{organization.userCount}</div>
                      <div className="tag">USERS</div>
                    </div>
                  </div>
                </div>
                <div className="topic-count">
                  <span className="number">{organization.topicCount}</span> <span className="tag">TOPICS</span>
                </div>
                <div className="org-role">
                  <span>{organization.role}</span>
                </div>
              </>
            )}
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default OrganizationCard;

OrganizationCard.defaultProps = {
  className: '',
  newCard: false,
};

OrganizationCard.propTypes = {
  organization: PropTypes.shape({
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
