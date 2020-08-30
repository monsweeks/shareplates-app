import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import './PointerController.scss';
import { PageContent } from '@/assets';
import { PointerPropTypes, SharePropTypes } from '@/proptypes';
import { Button } from '@/components';

const colors = [
  {
    key: 'red',
    color: '#FF3030',
  },
  {
    key: 'black',
    color: '#333',
  },
  {
    key: 'blue',
    color: '#009cdc',
  },
];

class PointerController extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      style: 'underline',
      color: 'red',
    };
  }

  setPointer = (itemId, index1, index2) => {
    const { style, color } = this.state;
    const { setPointer } = this.props;

    setPointer(itemId, index1, index2, style, color);
  };

  render() {
    const { className, share, currentPage, pointer } = this.props;
    const { style, color } = this.state;

    return (
      <div className={`${className} pointer-controller-wrapper`}>
        <div className="pointer-controller flex-grow-0 position-relative mx-3 mt-3 p-2">
          <div className="colors">
            {colors.map((item) => {
              return (
                <Button
                  key={item.key}
                  onClick={() => {
                    this.setState({
                      color: item.key,
                    });
                  }}
                  size="sm"
                  color={color === item.key ? 'yellow' : 'gray'}
                  className="g-circle-icon-button"
                >
                  <div style={{ backgroundColor: item.color }} className={`color ${item.key}`} />
                </Button>
              );
            })}
          </div>
          <div className="separator">
            <div />
          </div>
          <div className="styles">
            <Button
              onClick={() => {
                this.setState({
                  style: 'underline',
                });
              }}
              size="sm"
              color={style === 'underline' ? 'yellow' : 'gray'}
              className="g-circle-icon-button"
            >
              <i className="fas fa-underline" />
            </Button>
            <Button
              onClick={() => {
                this.setState({
                  style: 'fill',
                });
              }}
              size="sm"
              color={style === 'fill' ? 'yellow' : 'gray'}
              className="g-circle-icon-button ml-2"
            >
              <i className="fas fa-fill-drip" />
            </Button>
            <Button
              onClick={() => {
                this.setState({
                  style: 'rect',
                });
              }}
              size="sm"
              color={style === 'rect' ? 'yellow' : 'gray'}
              className="g-circle-icon-button ml-2"
            >
              <i className="fal fa-rectangle-landscape" />
            </Button>
          </div>
          <div className="others">
            <Button
              onClick={() => {
                this.setPointer(null, null, null);
              }}
              size="sm"
              color="white"
              outline
              className="g-circle-icon-button"
            >
              <i className="fal fa-times" />
            </Button>
          </div>
        </div>
        <div className="flex-grow-1 position-relative m-3 pointer-content">
          <div className="g-attach-parent pointer-layout-layout d-flex flex-column scrollbar">
            {share.startedYn && currentPage && (
              <PageContent
                pointer={pointer}
                onPointer={this.setPointer}
                content={JSON.parse(currentPage.content)}
                setPageContent={this.setPageContent}
                onLayoutChange={this.onLayoutChange}
                setSelectedItem={this.setSelectedItem}
                onChangeValue={this.onChangeValue}
                setEditing={this.setEditing}
                movePage={this.movePage}
              />
            )}
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
  share: SharePropTypes,
  currentPage: PropTypes.objectOf(PropTypes.any),
  pointer: PointerPropTypes,
  setPointer: PropTypes.func,
};

export default withTranslation()(PointerController);
