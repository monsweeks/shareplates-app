import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Avatar, Button, Card, CardBody, CardHeader, Col, FormGroup, Link, RadioButton, Row } from 'components';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import LANGUAGES from '@/languages/languages';
import { addMessage } from '@/actions';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import './QuickMenu.scss';

class QuickMenu extends React.Component {
  render() {
    const {
      logout,
      t,
      user,
      addMessage: addMessageReducer,
      openQuickMenu,
      language,
      onChangeLanguage,
      setOpenQuickMenu,
    } = this.props;

    return (
      <div className={`quick-menu-wrapper ${openQuickMenu ? 'd-block' : 'd-none'}`}>
        <div
          className="overlay"
          onClick={() => {
            setOpenQuickMenu(false);
          }}
        />
        <div className="quick-menu g-no-select">
          <div className="arrow">
            <span className="arrow-marker g-border-normal" />
            <span className="arrow-hider" />
          </div>
          <Card className="g-border-normal border-0 rounded-sm">
            <CardHeader className="g-border-normal p-3 bg-white rounded-sm border-0">
              <div className="user-info">
                <div className="user-icon">
                  {!(user && user.info) && <i className="fal fa-robot" />}
                  {user && user.info && <Avatar data={JSON.parse(user.info)} />}
                </div>
                <div className="user-text">
                  <div className="name">{user && user.name}</div>
                  <div className="email">{user && user.email}</div>
                </div>
                <div className="logout-button">
                  <Button size="sm" className=" g-compact-button" color="primary" onClick={logout}>
                    {t('로그아웃')}
                  </Button>
                </div>
              </div>
              <hr className="mb-0" />
            </CardHeader>
            <CardBody className="pt-0">
              <div className="g-category-label small ">
                <i className="fal fa-chevron-circle-right" /> QUICK LINK
              </div>
              <FormGroup>
                <div className="mb-1">
                  <Link
                    underline={false}
                    effect={false}
                    componentClassName="px-2"
                    to="/users/my-info/edit"
                    onClick={() => {
                      setOpenQuickMenu(false);
                    }}
                  >
                    <i className="fal fa-sliders-v-square" /> {t('사용자 설정')}
                  </Link>
                </div>
                <div className="small px-2">{t('사용자의 아이콘과 사용자별로 특화된 설정을 관리할 수 있습니다,')}</div>
              </FormGroup>
              <FormGroup>
                <div className="mb-1">
                  <Link
                    underline={false}
                    effect={false}
                    componentClassName="px-2"
                    to="/topics/new"
                    onClick={() => {
                      setOpenQuickMenu(false);
                    }}
                  >
                    <i className="fal fa-plus" /> {t('토픽 만들기')}
                  </Link>
                </div>
                <div className="small px-2">{t('토픽을 만들고 활용해보세요.')}</div>
              </FormGroup>
              <FormGroup>
                <div className="mb-1">
                  <Link
                    underline={false}
                    effect={false}
                    componentClassName="px-2"
                    to="/"
                    onClick={(e) => {
                      e.preventDefault();
                      addMessageReducer(0, MESSAGE_CATEGORY.INFO, t('message.waitPlease'), t('message.notImplement'));
                    }}
                  >
                    <i className="fal fa-stars" /> {t('튜토리얼')}
                  </Link>
                </div>
                <div className="small px-2">{t('SHAREPLATES를 100% 활용하는 방법에 대해 알아보세요.')}</div>
              </FormGroup>
              <hr />
              <div className="g-category-label small ">
                <i className="fal fa-chevron-circle-right" /> QUICK CONFIG
              </div>
              <FormGroup className="mb-0">
                <Row>
                  <Col>
                    <span className="small px-2">언어 설정</span>
                  </Col>
                  <Col className="text-right">
                    <RadioButton
                      outline
                      items={Object.keys(LANGUAGES)
                        .sort()
                        .reverse()
                        .map((d) => {
                          return {
                            key: d,
                            value: t(d),
                          };
                        })}
                      value={language}
                      onClick={onChangeLanguage}
                    />
                  </Col>
                </Row>
              </FormGroup>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addMessage: (code, category, title, content) => dispatch(addMessage(code, category, title, content)),
  };
};

QuickMenu.propTypes = {
  t: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    info: PropTypes.string,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  addMessage: PropTypes.func,
  openQuickMenu: PropTypes.bool,
  setOpenQuickMenu: PropTypes.func,
  language: PropTypes.string,
  onChangeLanguage: PropTypes.func,
  logout: PropTypes.func,
};

export default withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(QuickMenu)));
