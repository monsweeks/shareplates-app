import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import ReactTooltip from 'react-tooltip';
import LevelProperties from '@/assets/Topics/PageEditor/PageController/LevelProperties/LevelProperties';
import contentUtil from '@/utils/contentUtil';
import {
  CHAPTER_FONT_FAMILIES,
  CHAPTER_FONT_SIZES,
  DEFAULT_CHAPTER_CONTENT,
  DEFAULT_PAGE_CONTENT,
  DEFAULT_TOPIC_CONTENT,
  PAGE_FONT_FAMILIES,
  PAGE_FONT_SIZES,
  TOPIC_FONT_FAMILIES,
  TOPIC_FONT_SIZES,
} from '@/assets/Topics/PageEditor/PageController/constants';
import { BottomButton, Nav, NavItem, Popup } from '@/components';
import './LevelPropertiesPopup.scss';

const tabs = [
  { key: 'topic', value: '토픽 속성' },
  { key: 'chapter', value: '챕터 속성' },
  { key: 'page', value: '페이지 속성' },
  { key: 'preview', value: '적용 속성' },
];

class LevelPropertiesPopup extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      topicId: null,
      chapterId: null,
      pageId: null,
      topicProperties: {},
      chapterProperties: {},
      pageProperties: {},
      currentTab: 'topic',
    };
  }

  componentDidMount() {
    ReactTooltip.rebuild();
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  static getDerivedStateFromProps(props, state) {
    if (state.topicId !== props.topicId || state.chapterId !== props.chapterId || state.pageId !== props.pageId) {
      return {
        topicId: props.topicId,
        chapterId: props.chapterId,
        pageId: props.pageId,
        topicProperties: { ...props.topicProperties },
        chapterProperties: { ...props.chapterProperties },
        pageProperties: { ...props.pageProperties },
      };
    }

    return null;
  }

  onChangeTopicProperties = (key, value) => {
    const { topicProperties } = this.state;
    const next = { ...topicProperties };
    next[key] = value;
    this.setState({
      topicProperties: next,
    });
  };

  onChangeChapterProperties = (key, value) => {
    const { chapterProperties } = this.state;
    const next = { ...chapterProperties };
    next[key] = value;
    this.setState({
      chapterProperties: next,
    });
  };

  onChangePageProperties = (key, value) => {
    const { pageProperties } = this.state;
    const next = { ...pageProperties };
    next[key] = value;
    this.setState({
      pageProperties: next,
    });
  };

  render() {
    const { className, t } = this.props;

    const { topicProperties, chapterProperties, pageProperties, pageId, currentTab } = this.state;

    const { onChangeGlobalProperties, onCancel, onSetOpenLevelPropertiesPopup } = this.props;

    const mergedProperties = contentUtil.getMergedPageProperties(topicProperties, chapterProperties, pageProperties);

    return (
      <Popup title={t('글로벌 속성')} className={`level-properties-popup-wrapper ${className}`} open setOpen={onCancel}>
        <div className="level-properties-tab g-tabs border-0">
          <Nav className="tabs border-0 bg-light" tabs>
            {tabs.map((tab) => {
              return (
                <NavItem
                  key={tab.key}
                  className={currentTab === tab.key ? 'focus' : ''}
                  onClick={() => {
                    this.setState({
                      currentTab: tab.key,
                    });
                  }}
                >
                  {tab.value}
                </NavItem>
              );
            })}
          </Nav>
        </div>
        <div className="global-properties">
          <div className={`properties-item ${currentTab === 'topic' ? 'selected-tab' : ''}`}>
            <LevelProperties
              className="left-line-none"
              level="토픽"
              fontSizes={TOPIC_FONT_SIZES}
              fontFamilies={TOPIC_FONT_FAMILIES}
              onChangeProperties={this.onChangeTopicProperties}
              properties={topicProperties}
              onSetDefault={() => {
                this.setState({
                  topicProperties: DEFAULT_TOPIC_CONTENT.topicProperties,
                });
              }}
              active
              rightBorder
            />
          </div>
          <div className={`properties-item ${currentTab === 'chapter' ? 'selected-tab' : ''}`}>
            <LevelProperties
              level="챕터"
              fontSizes={CHAPTER_FONT_SIZES}
              fontFamilies={CHAPTER_FONT_FAMILIES}
              onChangeProperties={this.onChangeChapterProperties}
              properties={chapterProperties}
              onSetDefault={() => {
                this.setState({
                  chapterProperties: DEFAULT_CHAPTER_CONTENT.chapterProperties,
                });
              }}
              active
              rightBorder
            />
          </div>
          <div className={`properties-item ${currentTab === 'page' ? 'selected-tab' : ''}`}>
            <LevelProperties
              empty={!pageId}
              level="페이지"
              fontSizes={PAGE_FONT_SIZES}
              fontFamilies={PAGE_FONT_FAMILIES}
              onChangeProperties={this.onChangePageProperties}
              properties={pageProperties}
              onSetDefault={() => {
                this.setState({
                  pageProperties: DEFAULT_PAGE_CONTENT.pageProperties,
                });
              }}
              active
              rightBorder
            />
          </div>
          <div className={`properties-item ${currentTab === 'preview' ? 'selected-tab' : ''}`}>
            <LevelProperties
              readOnly
              className="right-line-none"
              level="적용"
              fontSizes={PAGE_FONT_SIZES}
              fontFamilies={PAGE_FONT_FAMILIES}
              properties={mergedProperties}
              active
            />
          </div>
        </div>
        <div className="popup-buttons p-0">
          <BottomButton
            className="text-right p-3 m-0"
            onSave={() => {
              onChangeGlobalProperties(topicProperties, chapterProperties, pageProperties);
              onSetOpenLevelPropertiesPopup(false);
            }}
            onCancel={onCancel}
          />
        </div>
      </Popup>
    );
  }
}

LevelPropertiesPopup.propTypes = {
  className: PropTypes.string,
  t: PropTypes.func,
  topicId: PropTypes.number,
  chapterId: PropTypes.number,
  pageId: PropTypes.number,
  topicProperties: PropTypes.objectOf(PropTypes.any),
  chapterProperties: PropTypes.objectOf(PropTypes.any),
  pageProperties: PropTypes.objectOf(PropTypes.any),
  onCancel: PropTypes.func,
  onChangeGlobalProperties: PropTypes.func,
  onSetOpenLevelPropertiesPopup: PropTypes.func,
};

export default withRouter(withTranslation()(LevelPropertiesPopup));
