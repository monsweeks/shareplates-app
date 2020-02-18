import React, {Component} from 'react';
import './Logo.scss';
import logo from 'images/logo.svg';

class Logo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            snows: []
        };
    }

    componentDidMount() {
        const snows = new Array(this.getRandomNumber(10, 20));

        for (let i = 0; i < snows.length; i++) {
            snows[i] = {
                delay: this.getRandomNumber(i, i + 2),
                duration: this.getRandomNumber(3, 8),
                left: this.getRandomNumber(0, 200),
                size: this.getRandomNumber(10, 14)
            }
        }

        this.setState({
            snows
        });
    }

    getRandomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min) + min);
    };

    render() {
        return (
            <div className="logo-wrapper">
                {this.state.snows.map((snow, inx) => {
                    return <span key={inx} style={
                        {
                            'animation-duration': snow.duration + 's',
                            'animation-delay': snow.delay + 's',
                            left: snow.left,
                            fontSize: snow.size + 'px'
                        }
                    } className='snow'><i className="fal fa-snowflake"/></span>;
                })}
                <div className='logo-img'><img src={logo}/></div>
                <div className='logo-text'><span>SHAREPLATES</span></div>
            </div>
        );
    }
}

export default Logo;