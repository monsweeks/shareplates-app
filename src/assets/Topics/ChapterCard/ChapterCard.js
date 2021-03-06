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
      <div className={`chapter-card-wrapper g-no-select border-0 ${className}`}>
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
                <i className="fal fa-plus" />
              </div>
              <div className="new-text">{t('새로운 챕터')}</div>
            </div>
          </div>
        )}
        {!newCard && (
          <>
            {isWriter && (
              <div className="card-buttons">
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
            )}
            <div className="chapter-card-content">
              <div className={`mover ${isWriter ? 'mover-on' : ''}`}>
                <span className="order-no">
                  <span className="no-text">NO</span>
                  <span className="no-count">{chapter.orderNo}</span>
                </span>
                {isWriter && (
                  <span className="grap">
                    <i className="fas fa-grip-horizontal" />
                  </span>
                )}
              </div>
              <div
                draggable
                onDragStart={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className="content"
                onClick={() => {
                  if (onCardClick) {
                    onCardClick(chapter ? chapter.id : null);
                  }
                }}
              >
                <div className="page-count">
                  <span className="number">{chapter.pageCount}</span> <span className="text">PAGES</span>
                </div>
                <div
                  className="chapter-title"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    if (!newCard) {
                      this.setState({
                        isEdit: true,
                      });
                    }
                  }}
                >
                  <div>
                    <div className="title-text">{chapter.title}</div>
                    {isWriter && (
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
                    )}
                  </div>
                </div>
                {isDelete && (
                  <div
                    className="inner-popup"
                    draggable
                    onDragStart={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <div className="inner-popup-content scrollbar text-danger">
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
                )}
                {isEdit && (
                  <div
                    className="inner-popup"
                    draggable
                    onDragStart={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
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
                        className="px-3"
                        onClick={() => {
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
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default withTranslation()(ChapterCard);

ChapterCard.defaultProps = {
  className: '',
};

ChapterCard.propTypes = {
  newCard: PropTypes.bool,
  chapter: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    orderNo: PropTypes.number,
    pageCount: PropTypes.number,
  }),
  className: PropTypes.string,
  onCardClick: PropTypes.func,
  onRemoveClick: PropTypes.func,
  t: PropTypes.func,
  onChangeTitle: PropTypes.func,
  isWriter: PropTypes.bool,
};
