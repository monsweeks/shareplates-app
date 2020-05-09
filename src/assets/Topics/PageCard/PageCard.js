import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Button, Input } from '@/components';
import './PageCard.scss';

class PageCard extends React.Component {
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
    const { page } = this.props;
    if (!prevState.isEdit && isEdit) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        title: page.title,
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
    const { page, onChangeTitle } = this.props;
    const { title } = this.state;
    if (e) e.stopPropagation();
    if (onChangeTitle) {
      onChangeTitle(page.id, title);
    }

    this.setState({
      isEdit: false,
    });
  };

  render() {
    const { onCardClick, onRemoveClick, onChangeTitle } = this.props;
    const { className, page, t, isWriter } = this.props;
    const { isEdit, isDelete, title } = this.state;

    return (
      <div className={`page-card-wrapper g-no-select ${className}`}>
        {isWriter && (
          <div className="card-buttons">
            <Button
              onTouchStart={this.stopPropagation}
              onMouseDown={this.stopPropagation}
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
        <div className="selected-arrow" />
        <div className="page-card-content">
          <div
            className={`mover ${isWriter ? 'mover-on' : ''}`}
            onTouchStart={isWriter ? null : this.stopPropagation}
            onMouseDown={isWriter ? null : this.stopPropagation}
          >
            <span className="order-no">{page.orderNo}</span>
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
            onTouchStart={this.stopPropagation}
            onMouseDown={this.stopPropagation}
            onClick={(e) => {
              e.stopPropagation();
              if (onCardClick) {
                onCardClick(page ? page.id : null);
              }
            }}
          >
            <div
              className="page-title"
              onDoubleClick={(e) => {
                e.stopPropagation();
                this.setState({
                  isEdit: true,
                });
              }}
            >
              <div>
                {page.title}
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
                onClick={(e) => e.stopPropagation()}
              >
                <div className="inner-popup-content scrollbar text-danger">
                  <div>페이지가 삭제됩니다.</div>
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
                      onRemoveClick(page ? page.id : null);
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
                onClick={(e) => e.stopPropagation()}
              >
                <div className="inner-popup-content scrollbar">
                  <div className="page-name-text">{t('페이지 이름1')}</div>
                  <Input
                    className="page-name-input"
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
                        onChangeTitle(page.id, title);
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

export default withTranslation()(PageCard);

PageCard.defaultProps = {
  className: '',
};

PageCard.propTypes = {
  page: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    orderNo: PropTypes.number,
  }),
  className: PropTypes.string,
  onCardClick: PropTypes.func,
  onRemoveClick: PropTypes.func,
  t: PropTypes.func,
  onChangeTitle: PropTypes.func,
  isWriter: PropTypes.bool,
};
