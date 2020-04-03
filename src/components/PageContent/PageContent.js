import React from 'react';
import { withRouter } from 'react-router-dom';
import { Responsive, WidthProvider } from 'react-grid-layout';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { getItem } from '@/components/PageContentItems';
import './PageContent.scss';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class PageContent extends React.PureComponent {
  breakpoint = 'lg';

  render() {
    const {
      className,
      pageId,
      content: { layouts, items },
    } = this.props;

    console.log(pageId, layouts, items);

    return (
      <div className={`page-content-wrapper g-no-select ${className}`}>
        <div>
          <ResponsiveReactGridLayout
            className="layout"
            breakpoints={{ lg: 1 }}
            cols={{ lg: 24 }}
            rowHeight={20}
            isResizable
            layouts={layouts}
            margin={[0, 0]}
            onBreakpointChange={(newBreakpoint) => {
              this.breakpoint = newBreakpoint;
            }}
            verticalCompact={false}
            useCSSTransforms={false}
          >
            {items.map((item) => {
              const l = layouts[this.breakpoint].find((d) => String(d.i) === String(item.id));
              return (
                <div className="page-item" key={item.id} data-grid={{ ...l }}>
                  {React.createElement(getItem(item.name), {
                    item,
                    editable : true,
                  })}
                </div>
              );
            })}
          </ResponsiveReactGridLayout>
        </div>
      </div>
    );
  }
}

PageContent.propTypes = {
  className: PropTypes.string,
  pageId: PropTypes.number,
  content: PropTypes.objectOf(PropTypes.any),
};

export default withRouter(withTranslation()(PageContent));
