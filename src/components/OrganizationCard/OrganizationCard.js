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
          {!newCard && (
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
                <div className="organization-summary">{organization.description}</div>
                <div className="organization-description">
                  <div className="counts">
                    <div>
                      <div>
                        <div className="level-icon">
                          <i className="fal fa-book" />
                        </div>
                        <div className="level-count">10</div>
                        <div className="tag">CHAPTERS</div>
                      </div>
                      <div>
                        <div className="level-icon">
                          <i className="fal fa-clipboard" />
                        </div>
                        <div className="level-count">10</div>
                        <div className="tag">PAGES</div>
                      </div>
                    </div>
                  </div>
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
  }),
  className: PropTypes.string,
  onCardClick: PropTypes.func,
  onConfigClick: PropTypes.func,
  newCard: PropTypes.bool,
};
