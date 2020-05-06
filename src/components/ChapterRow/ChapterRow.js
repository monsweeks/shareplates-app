import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Button, Input } from '@/components';
import './ChapterRow.scss';

class ChapterRow extends React.Component {
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

  stopPropagation = (e) => {
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
    const { newCard, className, chapter, t, isWriter } = this.props;
    const { isEdit, isDelete, title } = this.state;

    return (
      <div className={`chapter-row-wrapper g-no-select border-0 ${className}`}>
        {newCard && (
          <div
            className="new-card-content"
            onClick={() => {
              if (onCardClick) {
                onCardClick(chapter ? chapter.id : null);
              }
            }}
          >
            <div>
              <div>
                <i className="fal fa-plus" /> <span className="new-text">{t('새로운 챕터')}</span>
              </div>
            </div>
          </div>
        )}
        {!newCard && (
          <div>
            {isWriter && (
              <div className="grab">
                <div>
                  <i className="fas fa-grip-vertical" />
                </div>
              </div>
            )}
            <div className="order-no">
              <div>
                <span className="no-text d-none">NO</span>
                <span className="no-count">{chapter.orderNo}</span>
              </div>
            </div>
            <div
              className="title"
              onDoubleClick={(e) => {
                e.stopPropagation();
                this.setState({
                  isEdit: true,
                });
              }}
              onClick={() => {
                if (onCardClick) {
                  onCardClick(chapter ? chapter.id : null);
                }
              }}
            >
              <div>{chapter.title}</div>
            </div>
            <div className="page-count">
              <span className="number">{chapter.pageCount}</span> <span className="text">PAGES</span>
            </div>
            {isWriter && (
              <div className="buttons">
                <div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      this.setState({
                        isEdit: true,
                      });
                    }}
                    className="edit-button"
                  >
                    <i className="fal fa-pen-nib" />
                  </Button>
                  <Button
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
              </div>
            )}
            {isDelete && (
              <div
                className="inner-popup"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="inner-popup-content">
                  <div className="warning-message text-danger">
                    <div>챕터 및 챕터에 포함된 페이지도 함께 삭제됩니다.</div>
                  </div>
                  <div className="buttons">
                    <Button
                      size="sm"
                      className="px-3"
                      onClick={() => {
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
                      onClick={() => {
                        onRemoveClick(chapter ? chapter.id : null);
                      }}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {isEdit && (
              <div
                className="inner-popup"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="inner-popup-content">
                  <div className="chapter-name-text">{t('챕터 이름')}</div>
                  <div className="chapter-name-input">
                    <Input
                      label={t('label.name')}
                      value={title}
                      required
                      minLength={2}
                      maxLength={100}
                      onChange={this.onChange}
                      onEnter={this.onApply}
                      onESC={() => {
                        this.setState({
                          isEdit: false,
                        });
                      }}
                      simple
                      border
                      componentClassName="border-primary"
                    />
                  </div>
                  <div className="buttons">
                    <Button
                      size="sm"
                      className="px-2 px-sm-3"
                      onClick={() => {
                        this.setState({
                          isEdit: false,
                        });
                      }}
                    >
                      취소
                    </Button>
                    <Button
                      className="ml-1 px-2 px-sm-3"
                      size="sm"
                      color="primary"
                      onClick={() => {
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
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default withTranslation()(ChapterRow);

ChapterRow.defaultProps = {
  className: '',
};

ChapterRow.propTypes = {
  newCard: PropTypes.bool,
  chapter: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    orderNo: PropTypes.number,
    pageCount : PropTypes.number,
  }),
  className: PropTypes.string,
  onCardClick: PropTypes.func,
  onRemoveClick: PropTypes.func,
  t: PropTypes.func,
  onChangeTitle: PropTypes.func,
  isWriter: PropTypes.bool,
};
