import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import logo from 'images/logo.svg';
import './Logo.scss';

class Logo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            snows: [],
        };
    }

    componentDidMount() {
        const { weatherEffect } = this.props;
        if (weatherEffect) {
            const snows = new Array(this.getRandomNumber(10, 20));

            for (let i = 0; i < snows.length; i += 1) {
                snows[i] = {
                    delay: this.getRandomNumber(i, i + 2),
                    duration: this.getRandomNumber(3, 8),
                    left: this.getRandomNumber(0, 100),
                    size: this.getRandomNumber(10, 14),
                };
            }

            this.setState({
                snows,
            });
        }
    }

    getRandomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min) + min);
    };

    render() {
        const { snows } = this.state;
        return (
            <div className="logo-wrapper">
                <div className="snows">
                    {snows.map((snow, inx) => {
                        return (
                            <span
                                key={inx}
                                style={{
                                    animationDuration: `${snow.duration}s`,
                                    animationDelay: `${snow.delay}s`,
                                    left: `${snow.left}%`,
                                    fontSize: `${snow.size}px`,
                                }}
                                className="snow"
                            >
                                <i className="fal fa-snowflake" />
                            </span>
                        );
                    })}
                </div>
                <Link className="logo-link" to="/">
                    <div className="logo-img">
                        <img src={logo} alt="LOGO" />
                    </div>
                    <div className="logo-text">
                        <span>SHAREPLATES</span>
                    </div>
                    <div className="logo-path">
                        <span>
                            <i className="fal fa-home" />
                        </span>
                    </div>
                </Link>
            </div>
        );
    }
}

Logo.defaultProps = {
    weatherEffect: false,
};

Logo.propTypes = {
    weatherEffect: PropTypes.bool,
};

export default Logo;
