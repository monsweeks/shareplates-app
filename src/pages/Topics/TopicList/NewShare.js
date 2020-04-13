import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import {
  Button,
  Col,
  CopySpan,
  Description,
  Form,
  FormGroup,
  Input,
  P,
  Row,
  Selector,
  SubLabel,
  TextArea,
} from '@/components';
import RadioButton from '@/components/RadioButton/RadioButton';
import request from '@/utils/request';
import './NewShare.scss';

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

class NewShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      share: {
        name: '',
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
    const { topicId } = this.props;
    this.getShareInfo(topicId);
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

  getShareInfo = (topicId) => {
    request.get(
      `/api/shares/topics/${topicId}`,
      null,
      (data) => {
        const { share } = this.state;
        const next = { ...share };

        next.name = data.topic.name;
        next.currentChapterId = data.chapters && data.chapters.length > 0 ? data.chapters[0].id : null;
        next.accessCode = data.accessCode.code;
        next.accessCodeId = data.accessCode.id;
        next.topicId = data.topic.id;

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
      },
      null,
      true,
    );
  };

  getPages = (topicId, chapterId) => {
    request.get(`/api/topics/${topicId}/chapters/${chapterId}/pages`, {}, (data) => {
      const { share } = this.state;
      const next = { ...share };
      next.currentPageId = data.pages && data.pages.length > 0 ? data.pages[0].id : null;

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
    const { setOpen } = this.props;
    const { share } = this.state;

    request.post('/api/shares', share, () => {
      setOpen(false);
    });
  };

  render() {
    const { share, topic, chapters, pages } = this.state;
    const { t, user, setOpen } = this.props;

    return (
      <div className="new-share-wrapper">
        <Form onSubmit={this.onSubmit}>
          <Row className="p-3">
            <Col lg={5}>
              <SubLabel bold size="sm">
                {t('label.topic')}
              </SubLabel>
              <P>{topic.name}</P>
              <hr className="g-dashed mb-3" />
              <SubLabel bold size="sm">
                {t('공유 관리자')}
              </SubLabel>
              <P>
                <span>{user && user.name}</span>
                <span className="ml-2">{user && user.email}</span>
              </P>
              <hr className="g-dashed mb-3" />
              <SubLabel bold size="sm">
                {t('액세스 코드')}
              </SubLabel>
              <Description>{t('이 토픽이 공유되는 동안 아래 코드를 입력하여 빠르게 참여할 수 있습니다.')}</Description>
              <P>
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
              <P>
                {`http://www.mindplates.com/shares/codes/${share.accessCode}`}
                <CopySpan
                  className="refresh-button"
                  data={`http://www.mindplates.com/shares/codes/${share.accessCode}`}
                />
              </P>
              <hr className="d-block d-lg-none g-dashed mb-3" />
            </Col>
            <Col lg={7}>
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
                  onChange={(e) => {
                    this.onChange('name', e.target.value);
                  }}
                  simple
                  border
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
            </Col>
          </Row>
          <div className="popup-buttons p-3">
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
              {t('선택')}
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

NewShare.propTypes = {
  t: PropTypes.func,
  topicId: PropTypes.number,
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    info: PropTypes.string,
  }),
  setOpen: PropTypes.func,
};

export default withTranslation()(connect(mapStateToProps, undefined)(NewShare));
