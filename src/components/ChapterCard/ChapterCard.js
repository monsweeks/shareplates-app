import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Button, Input } from '@/components';
import './ChapterCard.scss';

class ChapterCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEdit: false,
      isDelete: false,
      title: '',
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { isEdit } = this.state;
    const { chapter } = this.props;
    if (!prevState.isEdit && isEdit) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        title: chapter.title,
      });
    }
  }

  stopProgation = (e) => {
    e.stopPropagation();
  };

  onChange = (value) => {
    this.setState({
      title: value,
    });
  };

  onApply = (e) => {
    const { chapter, onChangeTitle } = this.props;
    const { title } = this.state;
    if (e) e.stopPropagation();
    if (onChangeTitle) {
      onChangeTitle(chapter.id, title);
    }

    this.setState({
      isEdit: false,
    });
  };

  render() {
    const { onCardClick, onRemoveClick, onChangeTitle } = this.props;
    const { className, chapter, t } = this.props;
    const { isEdit, isDelete, title } = this.state;

    return (
      <div className={`chapter-card-wrapper g-no-select border-0 ${className}`}>
        <div className="card-buttons">
          <Button
            onTouchStart={this.stopProgation}
            onMouseDown={this.stopProgation}
            onClick={(e) => {
              e.stopPropagation();
              this.setState({
                isDelete: !isDelete,
              });
            }}
            className="remove-button"
          >
            <i className="fal fa-times" />
          </Button>
        </div>
        <div className="chapter-card-content">
          <div className="mover">
            <span className="order-no">
              <span className="no-text">NO</span>
              <span className="no-count">{chapter.orderNo}</span>
            </span>
            <span className="grap">
              <i className="fas fa-grip-horizontal" />
            </span>
          </div>
          <div
            className="content"
            onTouchStart={this.stopProgation}
            onMouseDown={this.stopProgation}
            onClick={() => {
              if (onCardClick) {
                onCardClick(chapter ? chapter.id : null);
              }
            }}
          >
            <div className="chapter-title">
              <div>
                {chapter.title}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    this.setState({
                      isEdit: true,
                    });
                  }}
                  className="edit"
                >
                  <i className="fal fa-pen-nib" />
                </Button>
              </div>
            </div>
            {isDelete && (
              <div className="inner-popup">
                <div className="inner-popup-content scrollbar text-danger">
                  <div>챕터 및 챕터에 포함된 페이지도 함께 삭제됩니다.</div>
                </div>
                <div className="buttons">
                  <Button
                    size="sm px-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.setState({
                        isDelete: false,
                      });
                    }}
                  >
                    취소
                  </Button>
                  <Button
                    className="ml-1 px-3"
                    size="sm"
                    color="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveClick(chapter ? chapter.id : null);
                    }}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            )}
            {isEdit && (
              <div className="inner-popup">
                <div className="inner-popup-content scrollbar">
                  <div className="chapter-name-text">{t('챕터 이름')}</div>
                  <Input
                    className="chapter-name-input"
                    label={t('label.name')}
                    value={title}
                    required
                    minLength={2}
                    maxLength={100}
                    onChange={this.onChange}
                    onEnter={this.onApply}
                    simple
                    border
                    componentClassName="border-primary"
                  />
                </div>
                <div className="buttons">
                  <Button
                    size="sm px-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.setState({
                        isEdit: false,
                      });
                    }}
                  >
                    취소
                  </Button>
                  <Button
                    className="ml-1 px-3"
                    size="sm"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onChangeTitle) {
                        onChangeTitle(chapter.id, title);
                      }

                      this.setState({
                        isEdit: false,
                      });
                    }}
                  >
                    확인
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(ChapterCard);

ChapterCard.defaultProps = {
  className: '',
};

ChapterCard.propTypes = {
  chapter: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    orderNo: PropTypes.number,
  }),
  className: PropTypes.string,
  onCardClick: PropTypes.func,
  onRemoveClick: PropTypes.func,
  t: PropTypes.func,
  onChangeTitle: PropTypes.func,
};
