import React from 'react';
import PropTypes from 'prop-types';
import './Input.scss';

const VALIDATIONS = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'tooLong',
    'tooShort',
    'rangeUnderflow',
    'rangeOverflow',
    'stepMismatch',
    'badInput',
    'customError',
    'valid',
];
class Input extends React.Component {
    control = null;

    constructor(props) {
        super(props);
        this.state = {
            focus: false,
            valid: true,
        };
        this.control = React.createRef();
    }

    setFocus = (focus) => {
        this.setState({
            focus,
        });
    };

    setValid = (validity) => {
        const invalids = VALIDATIONS.filter((key) => key !== 'valid' && validity[key]);
        console.log(invalids);
        this.setState({
            valid: invalids.length < 1,
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
            ...last
        } = this.props;
        const { focus, valid } = this.state;
        return (
            <div
                className={`input-wrapper text-${color} ${className} ${focus ? 'focus' : ''} ${
                    value ? 'has-value' : ''
                } ${valid ? 'valid' : 'in-valid'}`}
            >
                <div className="input-info">
                    {label && <div className="label">{label}</div>}
                    {placeholderMessage && <div className="placeholder-message">{placeholderMessage}</div>}
                </div>
                {required && (
                    <div className="required-symbol">
                        <i className="fal fa-asterisk" />
                    </div>
                )}

                <input
                    ref={this.control}
                    type={type}
                    className={componentClassName}
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
                    required={required}
                />
                <div className="liner" />
            </div>
        );
    }
}

Input.defaultProps = {
    className: '',
    color: 'black',
    componentClassName: '',
    label: '',
    placeholderMessage: '',
    onChange: null,
    value: '',
    required: false,
    type: 'text',
};

Input.propTypes = {
    className: PropTypes.string,
    color: PropTypes.string,
    componentClassName: PropTypes.string,
    label: PropTypes.string,
    placeholderMessage: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
    required: PropTypes.bool,
    type: PropTypes.string,
};

export default Input;
