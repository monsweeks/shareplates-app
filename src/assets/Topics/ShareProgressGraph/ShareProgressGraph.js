import React from 'react';
import * as d3 from 'd3';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import './ShareProgressGraph.scss';

class ShareProgressGraph extends React.PureComponent {
  control = React.createRef();

  initialized = false;

  svg = null;

  group = null;

  scaleX = null;

  scaleY = null;

  componentDidMount() {
    const { list } = this.props;
    if (list && list.length > 0) {
      this.draw();
    }
  }

  componentDidUpdate() {
    const { list } = this.props;
    console.log(list);
    if (list && list.length > 0) {
      this.draw();
    }
  }

  draw = () => {
    const { list, max } = this.props;
    if (this.control.current) {
      const { clientWidth: width, clientHeight: height } = this.control.current;
      if (document.visibilityState === 'visible' || this.initialized === false) {
        this.initialized = true;
        this.init(this.control.current, width, height);
        this.drawGraph(width, height, list, max);
      }
    }
  };

  init = (control, width, height) => {
    if (this.svg) {
      this.svg.attr('width', width).attr('height', height);
    } else {
      this.svg = d3
        .select(control)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
      this.group = this.svg.append('g');
      this.group.append('g').attr('class', 'axis-x-group');
      this.group.append('g').attr('class', 'axis-y-group');
      this.group.append('g').attr('class', 'focus-group');
      this.group.append('g').attr('class', 'joined-group');
    }
  };

  drawGraph = (width, height, list, max) => {
    // curveCatmullRom, curveStep, curveStepBefore, curveStepAfter, curveBasis, curveCardinal, curveMonotoneX
    const curve = d3.curveCardinal;

    this.scaleX = d3
      .scaleTime()
      .domain([list[0].time, list[list.length - 1].time])
      .range([0, width]);
    this.scaleY = d3
      .scaleLinear()
      .domain([0, max])
      .range([height, 0]);

    const axisX = d3.axisBottom(this.scaleX);
    axisX.tickFormat((d) => {
      return moment(d).format('HH:mm');
    });

    const xTicks = Math.floor(width / 100);
    axisX.tickSize(-height).ticks(xTicks < 2 ? 2 : xTicks);
    this.group.select('g.axis-x-group').call(axisX);
    this.group.select('g.axis-x-group').attr('transform', `translate(0, ${height})`);

    const yTicks = Math.floor(height / 15);
    const axisY = d3.axisLeft(this.scaleY);
    axisY.tickFormat((d) => {
      if (d === 0) {
        return '';
      }
      return d;
    });
    axisY.tickSize(-width);
    axisY.ticks(yTicks < 2 ? 2 : yTicks);
    this.group.select('g.axis-y-group').call(axisY);

    this.drawArea(this.group.select('g.focus-group'), list, 'focus', curve, height);
    this.drawLine(this.group.select('g.joined-group'), list, 'joined', curve);
  };

  drawLine = (group, list, key, curve) => {
    const that = this;
    const items = group.selectAll(`.item.line.line-${key}`).data([key]);
    items.exit().remove();
    const enter = items.enter().append('path');
    const all = enter.merge(items);

    const line = d3
      .line()
      .x((d) => {
        return that.scaleX(d.time);
      })
      .y((d) => {
        return that.scaleY(d[key]);
      })
      .curve(curve)
      .defined((d) => {
        return !Number.isNaN(d[key]) && Number.isFinite(d[key]);
      });

    all
      .attr('class', `item line line-${key}`)
      .style('fill', 'none')
      .attr('d', () => {
        return line(list);
      });
  };

  drawArea = (group, list, key, curve, height) => {
    const that = this;
    const items = group.selectAll(`.item.area.area-${key}`).data([key]);
    items.exit().remove();
    const enter = items.enter().append('path');
    const all = enter.merge(items);

    const area = d3
      .area()
      .x((d) => {
        return that.scaleX(d.time);
      })
      .curve(curve)
      .y0(height)
      .y1((d) => {
        return that.scaleY(d[key]);
      })
      .defined((d) => {
        return !Number.isNaN(d[key]) && Number.isFinite(d[key]);
      });

    all.attr('class', `item area area-${key}`).attr('d', () => {
      return area(list);
    });
  };

  render() {
    const { className } = this.props;

    return (
      <div className={`share-progress-graph-wrapper w-100 h-100 g-no-select py-3 px-4 ${className}`}>
        <div className="chart-element w-100 h-100" ref={this.control} />
      </div>
    );
  }
}

export default withTranslation()(ShareProgressGraph);

ShareProgressGraph.defaultProps = {
  className: '',
};

ShareProgressGraph.propTypes = {
  className: PropTypes.string,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.number,
      focus: PropTypes.number,
      joined: PropTypes.number,
      socket: PropTypes.number,
    }),
  ),
  max: PropTypes.number,
};
