import React from 'react';
import PropTypes from 'prop-types';
import { Swipeable } from 'react-swipeable';
import { withTranslation } from 'react-i18next';
import { Tabs } from '@/components';
import './ShareController.scss';

const tabs = [
  {
    value: 'status',
    name: '상태 관리',
  },
  {
    value: 'pointer',
    name: '포인터',
  },
  {
    value: 'process',
    name: '진행',
  },
  {
    value: 'users',
    name: '사용자',
  },
];

class ShareController extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tab: 'status',
    };
  }

  onSwiped = (e) => {
    const { tab } = this.state;
    const index = tabs.findIndex((d) => d.value === tab);
    if (e.dir === 'Right') {
      if (index > 0) {
        this.setState({
          tab: tabs[index - 1].value,
        });
      } else {
        this.setState({
          tab: tabs[tabs.length - 1].value,
        });
      }
    }

    if (e.dir === 'Left') {
      if (index < tabs.length - 1) {
        this.setState({
          tab: tabs[index + 1].value,
        });
      } else {
        this.setState({
          tab: tabs[0].value,
        });
      }
    }
  };

  render() {
    const { className } = this.props;
    const { tab } = this.state;
    const index = tabs.findIndex((d) => d.value === tab);

    return (
      <div className={`share-controller-wrapper ${className}`}>
        <div className="top pl-2">
          <div className="marker">
            <div
              style={{
                left: `calc(((100% - 1.5rem) / 4) * ${index} + (0.5rem * ${index})`,
              }}
            />
          </div>
          <Tabs
            className="tabs border-0"
            left
            tabs={tabs}
            tab={tab}
            onChange={(v) => {
              this.setState({
                tab: v,
              });
            }}
            buttonStyle
            tabColor="transparent"
          />
        </div>
        <Swipeable className="controller-content swipeable" onSwiped={this.onSwiped}>
          <div>
            <div
              className="content-layout"
              style={{
                left: `-${index * 100}%`,
              }}
            >
              <div>
                <div>상태</div>
              </div>
              <div>포인터</div>
              <div>프로세스</div>
              <div>사용자</div>
            </div>
          </div>
        </Swipeable>
      </div>
    );
  }
}

ShareController.defaultProps = {
  className: '',
};

ShareController.propTypes = {
  className: PropTypes.string,
};

export default withTranslation()(ShareController);
