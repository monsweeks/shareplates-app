import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Card, CardBody } from '@/components';
import './PointerController.scss';

class PointerController extends React.PureComponent {
  render() {
    const { className } = this.props;

    return (
      <div className={`${className} pointer-controller-wrapper`}>
        <div className="flex-grow-1 position-relative">
          <div className="g-attach-parent pointer-layout-layout bg-gray-400 d-flex flex-column">
            <Card className="border-0 flex-grow-1">
              <CardBody />
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

PointerController.defaultProps = {
  className: '',
};

PointerController.propTypes = {
  className: PropTypes.string,
};

export default withTranslation()(PointerController);
