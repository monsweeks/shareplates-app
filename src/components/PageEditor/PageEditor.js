import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import './PageEditor.scss';
import { PropertyManager } from '@/components';

class PageEditor extends React.PureComponent {
  render() {
    const { t, className, ...last } = this.props;

    console.log(t);

    return (
      <div className={`page-editor-wrapper g-no-select ${className}`}>
        <PropertyManager className="property-manager" {...last} />
        <div className="editor-content">
          <div />
        </div>
      </div>
    );
  }
}

PageEditor.propTypes = {
  t: PropTypes.func,
  className: PropTypes.string,
};

export default withRouter(withTranslation()(PageEditor));
