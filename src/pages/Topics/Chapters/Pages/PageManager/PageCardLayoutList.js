import React from 'react';
import PropTypes from 'prop-types';
import { PageCard } from '@/components';
import './PageCardLayoutList.scss';

class PageCardLayoutList extends React.Component {
  draggingCardOrder = null;

  somethingMoved = false;

  constructor(props) {
    super(props);
    this.state = {
      draggingPageId: null,
    };
  }

  onDragStart = (id, orderNo) => {
    this.draggingCardOrder = orderNo;
    this.somethingMoved = false;
    this.setState({
      draggingPageId: id,
    });
  };

  onDragEnd = () => {
    this.draggingCardOrder = null;

    this.setState({
      draggingPageId: null,
    });

    const { updatePageOrders } = this.props;
    if (this.somethingMoved) {
      updatePageOrders();
    }

    this.somethingMoved = false;
  };

  onDragOver = (id, orderNo, e) => {
    e.stopPropagation();
    e.preventDefault();

    const { movePage } = this.props;
    const { draggingPageId } = this.state;

    if (draggingPageId !== id) {
      this.somethingMoved = true;
      movePage(draggingPageId, id, this.draggingCardOrder < orderNo);
      this.draggingCardOrder = orderNo;
    }
  };

  render() {
    const { updatePageTitle, deletePage, pages, isWriter, onPageClick, selectedId } = this.props;
    const { draggingPageId } = this.state;

    return (
      <div className="page-card-layout-list-wrapper">
        {pages !== false && pages.length > 0 && (
          <div className="page-list">
            {pages.map((page) => {
              return (
                <div
                  key={page.id}
                  draggable={isWriter}
                  onDragStart={(e) => {
                    this.onDragStart(page.id, page.orderNo, e);
                  }}
                  onDragEnd={(e) => {
                    this.onDragEnd(page.id, e);
                  }}
                  onDragOver={(e) => {
                    this.onDragOver(page.id, page.orderNo, e);
                  }}
                  className={page.id === draggingPageId ? 'dragging' : ''}
                >
                  <PageCard
                    className={`${page.id === selectedId ? 'selected' : ''} ${page.dirty ? 'dirty' : ''}`}
                    page={page}
                    onCardClick={(pageId) => {
                      onPageClick(pageId);
                    }}
                    onRemoveClick={(pageId) => {
                      deletePage(pageId);
                    }}
                    onChangeTitle={updatePageTitle}
                    isWriter={isWriter}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

PageCardLayoutList.propTypes = {
  updatePageTitle: PropTypes.func,
  updatePageOrders: PropTypes.func,
  deletePage: PropTypes.func,
  pages: PropTypes.arrayOf(PropTypes.any),
  movePage: PropTypes.func,
  isWriter: PropTypes.bool,
  onPageClick: PropTypes.func,
  selectedId: PropTypes.number,
};

export default PageCardLayoutList;
