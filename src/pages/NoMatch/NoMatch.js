import React from 'react';
import './NoMatch.scss';

class NoMatch extends React.PureComponent {
  componentDidMount() {
    setTimeout(() => {
      this.forceUpdate();
    }, 500);
  }

  getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  getBuilding = (width, height) => {
    const blocks = [];
    for (let i = 0; i < height; i += 1) {
      const floor = [];
      for (let j = 0; j < width; j += 1) {
        const no = this.getRandomNumber(1, 100);
        if (no % 10 === 0) {
          floor.push(no);
        } else if (no > (i / height) * 100) {
          floor.push(5);
        } else {
          floor.push(100);
        }
      }
      blocks.push(floor);
    }

    return blocks;
  };

  render() {
    const blockSize = 8;
    const buildings = [];
    const length = 7;
    buildings.push(this.getBuilding(this.getRandomNumber(length, length), this.getRandomNumber(5, 10)));
    buildings.push(this.getBuilding(this.getRandomNumber(length, length), this.getRandomNumber(10, 15)));
    buildings.push(this.getBuilding(this.getRandomNumber(length, length), this.getRandomNumber(20, 25)));

    return (
      <div className="no-match-wrapper">
        <div className="sky">
          <div>
            <div className="h1 m-0">404</div>
            <div className="small">or</div>
            <div>under construction</div>
          </div>
        </div>
        <div className="land container">
          <div className="buildings">
            {buildings.map((blocks, knx) => {
              return (
                <div key={knx}>
                  {blocks.map((floor, inx) => {
                    return (
                      <div key={inx}>
                        {floor.map((room, jnx) => {
                          return (
                            <div
                              className="on"
                              key={jnx}
                              style={{
                                width: `${blockSize}px`,
                                height: `${blockSize}px`,
                                opacity: room / 100,
                                transitionDelay: `0.${jnx}s`,
                              }}
                            />
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default NoMatch;
