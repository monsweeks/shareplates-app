import React from 'react';
import './PageTitle.scss';
import PropTypes from 'prop-types';
import { Breadcrumbs } from '@/layouts';
import { Button } from '@/components';

class PageTitle extends React.PureComponent {
  render() {
    const { children, className, list, border, marginBottom } = this.props;
    const { onList, onEdit, onDelete, onSave, onCancel } = this.props;
    return (
      <div className={`page-title-wrapper ${className} ${border ? 'has-border' : ''} ${marginBottom ? 'mb-3' : ''}`}>
        <h1>
          <span className="icon">
            <i className="fal fa-star" />
          </span>
          <span className="text">{children}</span>
        </h1>
        <span className="page-title-button">
            {onDelete && (
              <Button className='mr-3' color="danger" onClick={onDelete}>
                <i className="fal fa-trash-alt" />
              </Button>
            )}
          {onCancel && (
            <Button color="secondary" onClick={onCancel}>
              <i className="fal fa-arrow-alt-left" />
            </Button>
          )}
          {onList && (
            <Button color="secondary" onClick={onList}>
              <i className="fal fa-list-alt" />
            </Button>
          )}
          {onEdit && (
            <Button type="submit" color="primary" onClick={onEdit}>
              <i className="fal fa-pencil-alt" />
            </Button>
          )}
          {onSave && (
            <Button type="submit" color="primary" onClick={onSave}>
              <i className="fal fa-save" />
            </Button>
          )}
          </span>
        <span className="breadcrumbs">
          <Breadcrumbs list={list} />
        </span>
      </div>
    );
  }
}

export default PageTitle;

PageTitle.defaultProps = {
  className: '',
  border: false,
  marginBottom : true,
};

PageTitle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      to: PropTypes.string,
    }),
  ),
  border: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onList: PropTypes.func,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  marginBottom : PropTypes.bool,
};
