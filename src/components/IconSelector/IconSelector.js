import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import './IconSelector.scss';
import icon1 from './images/apple.png';
import icon2 from './images/axe.png';
import icon3 from './images/band-aid.png';
import icon4 from './images/basket.png';
import icon5 from './images/blood-drop.png';
import icon6 from './images/blood-transfusion.png';
import icon7 from './images/cardiogram.png';
import icon8 from './images/carrot.png';
import icon9 from './images/chemistry.png';
import icon10 from './images/clipboard.png';
import icon11 from './images/coffee-cup.png';
import icon12 from './images/corn.png';
import icon13 from './images/cow.png';
import icon14 from './images/dna.png';
import icon15 from './images/eggs.png';
import icon16 from './images/email.png';
import icon17 from './images/farm.png';
import icon18 from './images/farmer.png';
import icon19 from './images/fence.png';
import icon20 from './images/files.png';
import icon21 from './images/first-aid-kit.png';
import icon22 from './images/fishes.png';
import icon23 from './images/group.png';
import icon24 from './images/hospital.png';
import icon25 from './images/laptop.png';
import icon26 from './images/light-bulb.png';
import icon27 from './images/line-chart.png';
import icon28 from './images/medal.png';
import icon29 from './images/medicines.png';
import icon30 from './images/medicines-1.png';
import icon31 from './images/microscope.png';
import icon32 from './images/money.png';
import icon33 from './images/money-1.png';
import icon34 from './images/news.png';
import icon35 from './images/paper-plane.png';
import icon36 from './images/pie-chart.png';
import icon37 from './images/pig.png';
import icon38 from './images/pressure.png';
import icon39 from './images/rain.png';
import icon40 from './images/rake.png';
import icon41 from './images/scarecrow.png';
import icon42 from './images/speech-bubble.png';
import icon43 from './images/sprout.png';
import icon44 from './images/stats.png';
import icon45 from './images/stethoscope.png';
import icon46 from './images/stock.png';
import icon47 from './images/suitcase.png';
import icon48 from './images/syringe.png';
import icon49 from './images/target.png';
import icon50 from './images/test-tube.png';
import icon51 from './images/thermometer.png';
import icon52 from './images/tie.png';
import icon53 from './images/tooth.png';
import icon54 from './images/tractor.png';
import icon55 from './images/turkey.png';
import icon56 from './images/watering-can.png';
import icon57 from './images/wheat.png';
import icon58 from './images/wheelchair.png';
import icon59 from './images/world-grid.png';

import icon60 from './images/alien.png';
import icon61 from './images/asteroid.png';
import icon62 from './images/asteroid-1.png';
import icon63 from './images/astronaut.png';
import icon64 from './images/astronaut-1.png';
import icon65 from './images/atom.png';
import icon66 from './images/basketball.png';
import icon67 from './images/calendar.png';

import icon68 from './images/clock.png';
import icon69 from './images/computer.png';
import icon70 from './images/earth-globe.png';

import icon71 from './images/mars.png';
import icon72 from './images/telescope-1.png';

import icon73 from './images/moon.png';
import icon74 from './images/moon-1.png';
import icon75 from './images/mortarboard.png';
import icon76 from './images/open-book.png';
import icon77 from './images/pencil.png';
import icon78 from './images/planet-earth.png';
import icon79 from './images/rocket-ship.png';
import icon80 from './images/ursa-major.png';
import icon81 from './images/ruler.png';
import icon82 from './images/satellite.png';
import icon83 from './images/satellite-dish.png';
import icon84 from './images/saturn.png';
import icon85 from './images/school-bus.png';
import icon86 from './images/school-material.png';
import icon87 from './images/set-square.png';
import icon88 from './images/solar-system.png';
import icon89 from './images/stars.png';
import icon90 from './images/ufo.png';
import icon91 from './images/sun.png';
import icon92 from './images/telescope.png';
import { Button } from '@/components';

const images = [
  icon1,
  icon2,
  icon3,
  icon4,
  icon5,
  icon6,
  icon7,
  icon8,
  icon9,
  icon10,
  icon11,
  icon12,
  icon13,
  icon14,
  icon15,
  icon16,
  icon17,
  icon18,
  icon19,
  icon20,
  icon21,
  icon22,
  icon23,
  icon24,
  icon25,
  icon26,
  icon27,
  icon28,
  icon29,
  icon30,
  icon31,
  icon32,
  icon33,
  icon34,
  icon35,
  icon36,
  icon37,
  icon38,
  icon39,
  icon40,
  icon41,
  icon42,
  icon43,
  icon44,
  icon45,
  icon46,
  icon47,
  icon48,
  icon49,
  icon50,
  icon51,
  icon52,
  icon53,
  icon54,
  icon55,
  icon56,
  icon57,
  icon58,
  icon59,
  icon60,
  icon61,
  icon62,
  icon63,
  icon64,
  icon65,
  icon66,
  icon67,
  icon68,
  icon69,
  icon70,
  icon71,
  icon72,
  icon73,
  icon74,
  icon75,
  icon76,
  icon77,
  icon78,
  icon79,
  icon80,
  icon81,
  icon82,
  icon83,
  icon84,
  icon85,
  icon86,
  icon87,
  icon88,
  icon89,
  icon90,
  icon91,
  icon92,
];

class IconSelector extends React.Component {
  control = null;

  constructor(props) {
    super(props);
    this.state = {
      imageRowCount: 16,
      imagePagingCount: 0,
      rowCount: 2,
    };

    this.control = React.createRef();
  }

  componentDidMount() {
    this.setState({
      imageRowCount: Math.floor(this.control.current.offsetWidth / 55),
    });
  }

  render() {
    const { iconIndex, className, onChange } = this.props;
    const { imageRowCount, imagePagingCount, rowCount } = this.state;

    return (
      <div className={`icon-selector-wrapper g-no-select ${className}`}>
        <div>
          <div className="current-images">
            {iconIndex === null && <div className="image-item no-image" />}
            {iconIndex !== null && (
              <div className="image-item">
                <img src={images[iconIndex]} alt="" />
              </div>
            )}
            <div className="text-center">
              <Button
                color="primary"
                size="sm"
                onClick={() => {
                  if (onChange) {
                    onChange(null);
                  }
                }}
              >
                사용안함
              </Button>
            </div>
          </div>
          <div
            className="paging"
            onClick={() => {
              if (imagePagingCount >= 1) {
                this.setState({
                  imagePagingCount: imagePagingCount - 1,
                });
              }
            }}
          >
            <i className="fal fa-chevron-left" />
          </div>
          <div className="image-list" ref={this.control}>
            {images
              .filter((image, inx) => {
                if (
                  inx > imageRowCount * rowCount * imagePagingCount - 1 &&
                  inx < imageRowCount * rowCount * (imagePagingCount + 1)
                ) {
                  return true;
                }

                return false;
              })
              .map((image, inx) => {
                return (
                  <div
                    key={inx}
                    className={`image-item ${
                      imageRowCount * rowCount * imagePagingCount + inx === iconIndex ? 'selected' : ''
                    }`}
                    onClick={() => {
                      if (onChange) {
                        onChange(imageRowCount * rowCount * imagePagingCount + inx);
                      }
                    }}
                  >
                    <img src={image} alt="" />
                  </div>
                );
              })}
          </div>
          <div
            className="paging"
            onClick={() => {
              if (images.length > imageRowCount * rowCount * (imagePagingCount + 1)) {
                this.setState({
                  imagePagingCount: imagePagingCount + 1,
                });
              }
            }}
          >
            <i className="fal fa-chevron-right" />
          </div>
        </div>
        <div className="small text-uppercase text-right w-100 d-block">
          ICON FROM
          <a href="https://www.flaticon.com/kr/authors/wissawa-khamsriwath" title="Wissawa Khamsriwath">
            Wissawa Khamsriwath
          </a>{' '}
          from{' '}
          <a href="https://www.flaticon.com/kr/" title="Flaticon">
            {' '}
            www.flaticon.com
          </a>
        </div>
      </div>
    );
  }
}

IconSelector.defaultProps = {
  className: '',
};

IconSelector.propTypes = {
  className: PropTypes.string,
  iconIndex: PropTypes.number,
  onChange: PropTypes.func,
};

export default withTranslation()(IconSelector);
