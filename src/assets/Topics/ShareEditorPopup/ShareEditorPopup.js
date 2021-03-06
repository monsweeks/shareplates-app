import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import {
  Button,
  Col,
  CopySpan,
  DateTime,
  Description,
  Form,
  FormGroup,
  Input,
  P,
  RadioButton,
  Row,
  Selector,
  SubLabel,
  TextArea,
} from '@/components';
import request from '@/utils/request';
import './ShareEditorPopup.scss';
import dialog from '@/utils/dialog';
import { MESSAGE_CATEGORY } from '@/constants/constants';

const privateYnValues = [
  {
    key: false,
    value: '누구나 참여',
  },
  {
    key: true,
    value: '액세스 코드',
  },
];

class ShareEditorPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      share: {
        id: null,
        name: '',
        description: '',
        memo: '',
        privateYn: false,
        currentChapterId: null,
        currentPageId: null,
        accessCode: null,
        accessCodeId: null,
        topicId: null,
      },
      topic: {},
      chapters: [],
      pages: [],
      accessCode: {},
    };
  }

  componentDidMount() {
    const { topicId, shareId } = this.props;
    if (shareId) {
      this.getShareInfo(topicId, shareId);
    } else {
      this.getTopicShareInfo(topicId);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { topicId } = this.props;
    const {
      share: { currentChapterId },
    } = this.state;

    if (prevState.share.currentChapterId !== currentChapterId) {
      this.getPages(topicId, currentChapterId);
    }
  }

  onChange = (field, value) => {
    const { share } = this.state;
    const next = { ...share };
    next[field] = value;

    this.setState({
      share: next,
    });
  };

  setData = (data) => {
    const { share } = this.state;
    let next;

    if (data.share) {
      next = { ...data.share };
      next.accessCode = data.accessCode.code;
      next.accessCodeId = data.accessCode.id;
    } else {
      next = { ...share };
      next.name = data.topic.name;
      next.currentChapterId = data.chapters && data.chapters.length > 0 ? data.chapters[0].id : null;
      next.accessCode = data.accessCode.code;
      next.accessCodeId = data.accessCode.id;
      next.topicId = data.topic.id;
    }

    if (data && data.chapters) {
      data.chapters.sort((a, b) => {
        return a.orderNo - b.order;
      });
    }

    this.setState({
      topic: data.topic,
      chapters: data.chapters || [],
      accessCode: data.accessCode,
      share: next,
    });
  };

  getShareInfo = (topicId, shareId) => {
    request.get(
      `/api/topics/${topicId}/shares/${shareId}/info`,
      null,
      (data) => {
        this.setData(data);
      },
      null,
      true,
    );
  };

  getTopicShareInfo = (topicId) => {
    request.get(
      `/api/topics/${topicId}/shares/prepare`,
      null,
      (data) => {
        this.setData(data);
      },
      null,
      true,
    );
  };

  getPages = (topicId, chapterId) => {
    request.get(`/api/topics/${topicId}/chapters/${chapterId}/pages`, {}, (data) => {
      const { share } = this.state;
      const next = { ...share };

      if (!data.pages.some((info) => info.id === next.currentPageId)) {
        next.currentPageId = data.pages && data.pages.length > 0 ? data.pages[0].id : null;
      }

      this.setState({
        pages: data.pages || [],
        share: next,
      });
    });
  };

  refreshAccessCode = () => {
    const { accessCode } = this.state;
    request.put(`/api/shares/codes/${accessCode.id}`, {}, (result) => {
      const { share } = this.state;
      const next = { ...share };
      next.accessCode = result.code;
      this.setState({
        accessCode: result,
        share: next,
      });
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { setOpen, onChangeShare, history, t } = this.props;
    const { share, topic } = this.state;

    if (!share.currentChapterId || !share.currentPageId) {
      dialog.setMessage(
        MESSAGE_CATEGORY.WARNING,
        t('공유를 시작할 수 없습니다.'),
        t('토픽을 시작할 수 있는 챕터와 페이지가 지정되지 않았습니다.'),
      );
      return;
    }

    if (share.id) {
      if (onChangeShare) {
        request.put(`/api/shares/${share.id}`, share, (data) => {
          setOpen(false);
          onChangeShare(data);
        });
      } else {
        request.put(`/api/shares/${share.id}/open`, share, () => {
          setOpen(false);
        });
      }
    } else {
      request.post(`/api/topics/${topic.id}/shares`, share, () => {
        setOpen(false);
        history.push('/shares');
      });
    }
  };

  render() {
    const { share, topic, chapters, pages } = this.state;
    const { t, user, setOpen, setStatusChange, shareId } = this.props;
    const lastBucket =
      share.shareTimeBuckets && share.shareTimeBuckets.length > 0
        ? share.shareTimeBuckets[share.shareTimeBuckets.length - 1]
        : {};

    return (
      <div className="share-editor-popup-wrapper">
        <Form onSubmit={this.onSubmit}>
          <Row className="scrollbar share-editor-popup-content m-0">
            <Col lg={5} className="share-col p-3">
              <SubLabel bold size="sm">
                {t('label.topic')}
              </SubLabel>
              <P className="bg-white mb-2">{topic.name}</P>
              <hr className="g-dashed mb-3" />
              <SubLabel bold size="sm">
                {t('공유 관리자')}
              </SubLabel>
              <P className="bg-white mb-2">
                <span>{user && user.name}</span>
                <span className="ml-2">{user && user.email}</span>
              </P>
              <hr className="g-dashed mb-3" />
              <SubLabel bold size="sm">
                {t('액세스 코드')}
              </SubLabel>
              <Description>{t('이 토픽이 공유되는 동안 아래 코드를 입력하여 빠르게 참여할 수 있습니다.')}</Description>
              <P className="mb-2">
                {share.accessCode}
                <span
                  className="refresh-button"
                  onClick={() => {
                    this.refreshAccessCode();
                  }}
                >
                  <i className="fal fa-retweet" />
                </span>
                <CopySpan className="refresh-button" data={share.accessCode} />
              </P>
              <Description>{t('이 토픽이 공유되는 동안 URL을 통해 토픽에 참여할 수 있습니다.')}</Description>
              <P className="mb-2">
                {`http://www.mindplates.com/shares/codes/${share.accessCode}`}
                <CopySpan
                  className="refresh-button"
                  data={`http://www.mindplates.com/shares/codes/${share.accessCode}`}
                />
              </P>
              {lastBucket.openDate && (
                <>
                  <hr className="g-dashed mb-3" />
                  <SubLabel bold size="sm">
                    {t('마지막 공유 일시')}
                  </SubLabel>
                  <P className="bg-white mb-2">
                    <DateTime value={lastBucket.openDate} /> - <DateTime value={lastBucket.closeDate} />
                  </P>
                  <hr className="d-block d-lg-none g-dashed mb-3" />
                </>
              )}
            </Col>
            <Col lg={7} className="share-col px-3 pb-3 py-0 py-lg-3 pr-lg-3 pl-lg-0">
              <hr className="d-block d-lg-none g-dashed mb-3" />
              <SubLabel bold size="sm">
                {t('label.name')}
              </SubLabel>
              <Description>
                {t(
                  '토픽을 공유할때 사용할 이름을 입력해주세요. 토픽을 공유하는 대상이나, 장소 등을 포함하면 이번 공유를 보다 잘 기억할 수 있습니다.',
                )}
              </Description>
              <FormGroup>
                <Input
                  label={t('label.name')}
                  value={share.name}
                  required
                  minLength={2}
                  maxLength={100}
                  onChange={(value) => {
                    this.onChange('name', value);
                  }}
                  simple
                  border
                  componentClassName="border-primary"
                />
              </FormGroup>
              <hr className="g-dashed mb-3" />
              <SubLabel bold size="sm">
                {t('설명')}
              </SubLabel>
              <Description>{t('토픽에 대한 설명을 입력합니다.')}</Description>
              <FormGroup>
                <TextArea
                  label={t('설명')}
                  placeholderMessage={t('message.topicDescDesc')}
                  value={share.description ? share.description : ''}
                  onChange={(value) => {
                    this.onChange('description', value);
                  }}
                  simple
                  componentClassName="border-primary"
                />
              </FormGroup>
              <hr className="g-dashed mb-3" />
              <SubLabel bold size="sm">
                {t('메모')}
              </SubLabel>
              <Description>{t('토픽을 공유하는 것과 관련된 정보를 메모할 수 있습니다.')}</Description>
              <FormGroup>
                <TextArea
                  label={t('label.desc')}
                  placeholderMessage={t('message.topicDescDesc')}
                  value={share.memo}
                  onChange={(value) => {
                    this.onChange('memo', value);
                  }}
                  simple
                  componentClassName="border-primary"
                />
              </FormGroup>
              <hr className="g-dashed mb-3" />
              <SubLabel bold size="sm">
                {t('참여 방법')}
              </SubLabel>
              <Description>
                {t(
                  '공유되는 토픽에 참여하는 방법을 선택해주세요. 공유 메뉴를 통해 누구나 참여할 수 있도록 하거나, 엑세스 코드를 입력해야만 참여할 수 있도록 설정할 수 있습니다.',
                )}
              </Description>
              <FormGroup>
                <RadioButton
                  outline
                  items={privateYnValues}
                  value={share.privateYn}
                  onClick={(value) => {
                    this.onChange('privateYn', value);
                  }}
                />
              </FormGroup>
              <hr className="g-dashed mb-3" />
              <SubLabel bold size="sm">
                {t('토픽 시작 위치')}
              </SubLabel>
              <Description>{t('공유가 시작되는 챕터와 페이지를 선택해주세요,')}</Description>
              {chapters.length > 0 && (
                <FormGroup>
                  <Selector
                    outline
                    className="mr-2"
                    items={chapters.map((chapter) => {
                      return {
                        key: chapter.id,
                        value: chapter.title,
                      };
                    })}
                    value={share.currentChapterId}
                    onChange={(value) => {
                      this.onChange('currentChapterId', value);
                    }}
                  />
                  <Selector
                    outline
                    items={pages.map((page) => {
                      return {
                        key: page.id,
                        value: page.title,
                      };
                    })}
                    value={share.currentPageId}
                    onChange={(value) => {
                      this.onChange('currentPageId', value);
                    }}
                  />
                </FormGroup>
              )}
              {chapters.length < 1 && (
                <FormGroup>
                  <P className="text-danger mb-2 text-center bg-white">{t('추가된 챕터가 없습니다.')}</P>
                </FormGroup>
              )}
              {setStatusChange && (
                <>
                  <hr className="g-dashed mb-3" />
                  <FormGroup className="mt-4 text-center">
                    <Button
                      color="danger"
                      onClick={() => {
                        dialog.setConfirm(
                          MESSAGE_CATEGORY.WARNING,
                          '공유 중지 확인',
                          '지금 공유중인 토픽을 중지하시겠습니까?',
                          () => {
                            setStatusChange(shareId);
                          },
                        );
                      }}
                    >
                      {t('공유를 중지합니다')}
                    </Button>
                  </FormGroup>
                </>
              )}
            </Col>
          </Row>
          <div className="popup-buttons bg-light">
            <Button
              className="px-4 mr-2"
              color="secondary"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
              }}
            >
              {t('취소')}
            </Button>
            <Button className="px-4" color="primary">
              {setStatusChange && t('저장')}
              {!setStatusChange && t('공유 시작')}
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

ShareEditorPopup.propTypes = {
  t: PropTypes.func,
  topicId: PropTypes.number,
  shareId: PropTypes.number,
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
  }),
  setOpen: PropTypes.func,
  setStatusChange: PropTypes.func,
  onChangeShare: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(ShareEditorPopup)));
