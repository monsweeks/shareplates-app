import React from 'react';
import PropTypes from 'prop-types';
import { Input as StrapInput } from 'reactstrap';
import './Input.scss';

class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focus: false,
        };
    }

    setFocus = (focus) => {
        this.setState({
            focus,
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
            ...last
        } = this.props;
        const { focus } = this.state;
        return (
            <div
                className={`input-wrapper text-${color} ${className} ${focus ? 'focus' : ''} ${
                    value ? 'has-value' : ''
                }`}
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

                <StrapInput
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
};

export default Input;
