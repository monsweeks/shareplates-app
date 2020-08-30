import React from 'react';
import PropTypes from 'prop-types';
import { Swipeable } from 'react-swipeable';
import { withTranslation } from 'react-i18next';
import { Tabs, TopLogo } from '@/components';
import { SharePropTypes, TopicPropTypes, UserPropTypes } from '@/proptypes';
import StatusController from '@/assets/Shares/ShareController/StatusController';
import ProgressController from '@/assets/Shares/ShareController/ProgressController';
import FunctionController from '@/assets/Shares/ShareController/FunctionController';
import PointerController from '@/assets/Shares/ShareController/PointerController';
import './ShareController.scss';

class ShareController extends React.PureComponent {
  omitEvent = false;

  constructor(props) {
    super(props);

    const { t } = props;

    this.state = {
      tab: 'pointer',
      tabs: [
        {
          value: 'status',
          name: t('관리'),
        },
        {
          value: 'process',
          name: '진행',
        },
        {
          value: 'pointer',
          name: '포인터',
        },
        {
          value: 'function',
          name: '기능',
        },
      ],
    };
  }

  onSwiped = (e) => {
    if (this.omitEvent) {
      this.omitEvent = false;
      return;
    }

    const { tab, tabs } = this.state;
    const index = tabs.findIndex((d) => d.value === tab);
    if (e.dir === 'Right') {
      if (index > 0) {
        this.setState({
          tab: tabs[index - 1].value,
        });
      } else {
        this.setState({
          tab: tabs[tabs.length - 1].value,
        });
      }
    }

    if (e.dir === 'Left') {
      if (index < tabs.length - 1) {
        this.setState({
          tab: tabs[index + 1].value,
        });
      } else {
        this.setState({
          tab: tabs[0].value,
        });
      }
    }
  };

  setOmitEvent = (value) => {
    this.omitEvent = value;
  };

  render() {
    const { className } = this.props;
    const {
      topic,
      share,
      users,
      isAdmin,
      messages,
      user,
      chapterPageList,
      currentChapterId,
      currentPageId,
      currentPage,
      projectorScrollInfo,
      startShare,
      closeShare,
      exitShare,
      stopShare,
      sendReadyChat,
      banUser,
      kickOutUser,
      allowUser,
      movePage,
      sendMoveScroll,
      setOption,
      options,
      pointer,
      setPointer,
    } = this.props;

    const { tab, tabs } = this.state;
    const index = tabs.findIndex((d) => d.value === tab);

    return (
      <div className={`share-controller-wrapper ${className}`}>
        <div className="header">
          <div className="space" />
          <TopLogo weatherEffect={false} />
          <div className="space" />
        </div>
        <div className="share-controller-top pl-2">
          <div className="marker">
            <div
              style={{
                left: `calc((100% / 4) * ${index}`,
              }}
            />
          </div>
          <Tabs
            className="tabs border-0 py-0"
            left
            tabs={tabs}
            tab={tab}
            onChange={(v) => {
              this.setState({
                tab: v,
              });
            }}
            buttonStyle
            tabColor="transparent"
          />
        </div>
        <Swipeable className="controller-content swipeable" onSwiped={this.onSwiped} delta={50}>
          <div>
            <div
              className="content-layout"
              style={{
                left: `-${index * 100}%`,
              }}
            >
              <StatusController
                className="share-controller-item"
                share={share}
                users={users}
                isAdmin={isAdmin}
                messages={messages}
                user={user}
                startShare={startShare}
                closeShare={closeShare}
                exitShare={exitShare}
                stopShare={stopShare}
                sendReadyChat={sendReadyChat}
                banUser={banUser}
                kickOutUser={kickOutUser}
                allowUser={allowUser}
              />
              <ProgressController
                share={share}
                className="share-controller-item"
                topic={topic}
                isAdmin={isAdmin}
                users={users}
                chapterPageList={chapterPageList}
                currentChapterId={currentChapterId}
                currentPageId={currentPageId}
                movePage={movePage}
                projectorScrollInfo={projectorScrollInfo}
                sendMoveScroll={sendMoveScroll}
                setOmitEvent={this.setOmitEvent}
                setOption={setOption}
                startShare={startShare}
                closeShare={closeShare}
                stopShare={stopShare}
                exitShare={exitShare}
                options={options}
              />
              <PointerController className="share-controller-item" topic={topic} share={share} currentPage={currentPage} setPointer={setPointer} pointer={pointer} />
              <FunctionController className="share-controller-item" setOption={setOption} />
            </div>
          </div>
        </Swipeable>
      </div>
    );
  }
}

ShareController.defaultProps = {
  className: '',
};

ShareController.propTypes = {
  className: PropTypes.string,
  topic: TopicPropTypes,
  share: SharePropTypes,
  users: PropTypes.arrayOf(UserPropTypes),
  isAdmin: PropTypes.bool,
  startShare: PropTypes.func,
  closeShare: PropTypes.func,
  exitShare: PropTypes.func,
  stopShare: PropTypes.func,
  t: PropTypes.func,
  messages: PropTypes.arrayOf(PropTypes.any),
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
  }),
  sendReadyChat: PropTypes.func,
  banUser: PropTypes.func,
  kickOutUser: PropTypes.func,
  allowUser: PropTypes.func,
  chapterPageList: PropTypes.arrayOf(PropTypes.any),
  currentChapterId: PropTypes.number,
  currentPageId: PropTypes.number,
  currentPage : PropTypes.objectOf(PropTypes.any),
  movePage: PropTypes.func,
  projectorScrollInfo: PropTypes.shape({
    windowHeight: PropTypes.number,
    contentViewerHeight: PropTypes.number,
    scrollTop: PropTypes.number,
  }),
  sendMoveScroll: PropTypes.func,
  setOption: PropTypes.func,
  options : PropTypes.objectOf(PropTypes.any),
  setPointer : PropTypes.func,
  pointer : PropTypes.shape({
    itemId : PropTypes.number,
    index : PropTypes.number,
    style : PropTypes.string,
    color : PropTypes.string,
  })
};

export default withTranslation()(ShareController);
