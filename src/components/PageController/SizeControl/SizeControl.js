import React from 'react';
import PropTypes from 'prop-types';
import './SizeControl.scss';
import { Selector } from '@/components';

const units = [
  {
    key: '',
    value: '-',
  },
  {
    key: 'px',
    value: 'px',
  },
  {
    key: '%',
    value: '%',
  },
  {
    key: 'pt',
    value: 'pt',
  },
];

class SizeControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      optionValue: '',
      unitValue: '',
      focus: false,
    };
  }

  componentDidMount() {
    const { active, optionValue, unitValue } = this.props;

    if (active && optionValue) {
      this.setState({
        optionValue,
        unitValue,
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { active, optionValue, unitValue } = this.props;

    if (active && optionValue !== prevProps.optionValue) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        optionValue,
        unitValue,
      });
    }
  }

  onChange = (optionValue) => {
    this.setState({
      optionValue,
    });
  };

  onChangeUnit = (unitValue) => {
    const { unitKey, onApply } = this.props;
    this.setState(
      {
        unitValue,
      },
      () => {
        onApply(unitKey, unitValue);
      },
    );
  };

  onApply = () => {
    const { optionKey, onApply } = this.props;
    const { optionValue } = this.state;
    onApply(optionKey, optionValue);
  };

  render() {
    const { className, active, setEditing, icon, dataTip } = this.props;
    const { optionValue, unitValue, focus } = this.state;

    return (
      <div
        className={`size-control-wrapper ${className} ${active ? 'active' : 'in-active'} ${focus ? 'focus' : ''}`}
        data-tip={dataTip}
      >
        {icon && <span className="icon">{icon}</span>}
        <div>
          <input
            spellCheck={false}
            disabled={!active}
            value={optionValue}
            type="text"
            placeholder=""
            onFocus={() => {
              setEditing(true);
              this.setState({
                focus: true,
              });
            }}
            onChange={(e) => {
              this.onChange(e.target.value);
            }}
            onBlur={() => {
              this.onApply();
              setEditing(false);
              this.setState({
                focus: false,
              });
            }}
            onKeyPress={(e) => {
              e.stopPropagation();
              if (e.key === 'Enter') {
                this.onApply();
              }
            }}
          />
          <div className="separator">
            <span />
          </div>
          <Selector
            size="sm"
            separator={false}
            className="unit-selector"
            items={units}
            value={unitValue}
            onChange={this.onChangeUnit}
          />
        </div>
      </div>
    );
  }
}

SizeControl.defaultProps = {
  className: '',
};

SizeControl.propTypes = {
  className: PropTypes.string,
  active: PropTypes.bool,
  optionValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  optionKey: PropTypes.string,
  unitKey: PropTypes.string,
  unitValue: PropTypes.string,
  onApply: PropTypes.func,
  setEditing: PropTypes.func,
  icon: PropTypes.node,
  dataTip: PropTypes.string,
};

export default SizeControl;
