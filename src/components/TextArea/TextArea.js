import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import './TextArea.scss';
import { DEFAULT_INPUT_VALIDATION_MESSAGE, VALIDATIONS } from '@/constants/constants';

class TextArea extends React.Component {
  control = null;

  static getDerivedStateFromProps(props, state) {
    if (JSON.stringify(props.customInputValidationMessage) !== JSON.stringify(state.customInputValidationMessage)) {
      return {
        customInputValidationMessage: props.customInputValidationMessage,
        inputValidationMessage: { ...DEFAULT_INPUT_VALIDATION_MESSAGE, ...props.customInputValidationMessage },
      };
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      focus: false,
      valid: true,
      message: null,
      customInputValidationMessage: {},
      inputValidationMessage: {},
    };
    this.control = React.createRef();
  }

  setFocus = (focus) => {
    this.setState({
      focus,
    });
  };

  setValid = (validity) => {
    const { t } = this.props;
    const { inputValidationMessage } = this.state;

    const invalids = VALIDATIONS.filter((key) => key !== 'valid' && validity[key]);
    this.setState({
      valid: invalids.length < 1,
      message: invalids.length > 0 ? t(inputValidationMessage[invalids[0]]) : null,
    });
  };

  render() {
    const {
      color,
      className,
      componentClassName,
      label,
      placeholderMessage,
      onChange,
      value,
      required,
      type,
      t,
      // eslint-disable-next-line react/prop-types
      tReady,
      simple,
      customInputValidationMessage,
      externalValidationMessage,
      ...last
    } = this.props;
    const { focus, valid, message } = this.state;

    return (
      <div
        className={`text-area-wrapper text-${color} ${className} ${focus ? 'focus' : ''} ${value ? 'has-value' : ''} ${
          valid ? 'valid' : 'in-valid'
        } ${simple ? 'simple' : ''}`}
        onClick={() => {
          this.control.current.focus();
        }}
      >
        <div className="input-info">
          {label && <div className="label">{label}</div>}
          {placeholderMessage && <div className="placeholder-message">{placeholderMessage}</div>}
          {(externalValidationMessage || message) && <div className="invalid-message">{externalValidationMessage || message}</div>}
        </div>
        <textarea
          ref={this.control}
          type={type}
          className={`${componentClassName} scrollbar`}
          {...last}
          onFocus={() => {
            this.setFocus(true);
          }}
          onBlur={() => {
            this.setFocus(false);
          }}
          onChange={(e) => {
            onChange(e.target.value);
            this.setValid(this.control.current.validity);
          }}
          value={value}
          required={required}>
          {value}</textarea>
        <div className="liner" />
      </div>
    );
  }
}

TextArea.defaultProps = {
  className: '',
  color: 'black',
  componentClassName: '',
  label: '',
  placeholderMessage: '',
  onChange: null,
  value: '',
  required: false,
  type: 'text',
  simple : false,
};

TextArea.propTypes = {
  t: PropTypes.func,
  className: PropTypes.string,
  color: PropTypes.string,
  componentClassName: PropTypes.string,
  label: PropTypes.string,
  placeholderMessage: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string,
  customInputValidationMessage: PropTypes.objectOf(PropTypes.any),
  externalValidationMessage : PropTypes.string,
  simple : PropTypes.bool,
};

export default withTranslation()(TextArea);
