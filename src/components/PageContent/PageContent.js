import React from 'react';
import { withRouter } from 'react-router-dom';
import { Responsive, WidthProvider } from 'react-grid-layout';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { getItem } from '@/components/PageContentItems';
import './PageContent.scss';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class PageContent extends React.Component {
  breakpoint = 'lg';

  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
    };
  }

  render() {
    const {
      className,
      content: { layouts, items },
      onLayoutChange,
      selectedItemId,
      setSelectedItem,
      editable,
    } = this.props;

    const { dragging } = this.state;

    return (
      <div
        className={`page-content-wrapper g-no-select ${className}`}
        onClick={() => {
          setSelectedItem(null, {});
        }}
      >
        <div>
          <ResponsiveReactGridLayout
            onLayoutChange={onLayoutChange}
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
            onDragStart={() => {
              this.setState({
                dragging: true,
              });
            }}
            onResizeStart={() => {
              this.setState({
                dragging: true,
              });
            }}
            onDragStop={() => {
              this.setState({
                dragging: false,
              });
            }}
            onResizeStop={() => {
              this.setState({
                dragging: false,
              });
            }}
          >
            {items.map((item) => {
              const l = layouts[this.breakpoint].find((d) => String(d.i) === String(item.id));
              const selected = item.id === selectedItemId;
              return (
                <div className={`page-item ${selected ? 'selected' : ''}`} key={item.id} data-grid={{ ...l }}>
                  {React.createElement(getItem(item.name), {
                    item,
                    editable,
                    selected,
                    setSelectedItem,
                    showLayout: dragging,
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

PageContent.defaultProps = {
  className: '',
};

PageContent.propTypes = {
  className: PropTypes.string,
  content: PropTypes.objectOf(PropTypes.any),
  onLayoutChange: PropTypes.func,
  selectedItemId: PropTypes.string,
  setSelectedItem: PropTypes.func,
  editable: PropTypes.bool,
};

export default withRouter(withTranslation()(PageContent));
