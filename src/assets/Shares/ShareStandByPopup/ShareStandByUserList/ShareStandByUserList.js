import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Col, EmptyMessage, Row } from '@/components';
import ShareStandByUserCard from './ShareStandByUserCard/ShareStandByUserCard';
import './ShareStandByUserList.scss';

class ShareStandByUserList extends React.PureComponent {
  render() {
    const { t, className, users } = this.props;

    return (
      <div className={`${className} share-stand-by-user-list-wrapper`}>
        {users.length > 0 && (
          <div className="member-user">
            <div>
              <Row>
                {users
                  .filter((u) => u.shareRoleCode === 'ADMIN')
                  .map((user) => {
                    return (
                      <Col key={user.id} className="col" lg={3} md={6} sm={6} xs={12}>
                        <ShareStandByUserCard user={user} message={user.message} isAdmin />
                      </Col>
                    );
                  })}
                {users
                  .filter((u) => u.shareRoleCode === 'MEMBER')
                  .map((user) => {
                    return (
                      <Col key={user.id} className="col" lg={3} md={6} sm={6} xs={12}>
                        <ShareStandByUserCard user={user} message={user.message} />
                      </Col>
                    );
                  })}
              </Row>
            </div>
          </div>
        )}
        {users.length < 1 && (
          <div className="member-empty">
            <EmptyMessage
              className="h5"
              message={
                <div>
                  <div>{t('참여 중인 사용자가 없습니다.')}</div>
                </div>
              }
            />
          </div>
        )}
      </div>
    );
  }
}

ShareStandByUserList.defaultProps = {
  className: '',
};

ShareStandByUserList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
      name: PropTypes.string,
      shareRoleCode: PropTypes.string,
      message: PropTypes.string,
    }),
  ),
  t: PropTypes.func,
  className: PropTypes.string,
};

export default withRouter(withTranslation()(ShareStandByUserList));
