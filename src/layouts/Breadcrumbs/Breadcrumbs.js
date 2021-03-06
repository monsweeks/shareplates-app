import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@/components';
import './Breadcrumbs.scss';

class Breadcrumbs extends React.PureComponent {
  render() {
    const { list, className } = this.props;
    return (
      <div className={`breadcrumbs-wrapper ${className}`}>
        <ul>
          {list.map((item, inx) => {
            if (list.length - 1 === inx) {
              return (
                <li key={inx}>
                  <Link underline={false} effect={false} to={item.to}>
                    {item.name}
                  </Link>
                </li>
              );
            }
            return (
              <li key={inx}>
                <Link underline={false} effect={false} to={item.to}>
                  {item.name}
                </Link>
                <i className="arrow fal fa-chevron-right" />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Breadcrumbs;

Breadcrumbs.defaultProps = {
  className: '',
  list: [],
};

Breadcrumbs.propTypes = {
  className: PropTypes.string,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      to: PropTypes.string,
    }),
  ),
};
