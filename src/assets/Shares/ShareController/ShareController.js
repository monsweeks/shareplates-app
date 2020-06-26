import React from 'react';
import PropTypes from 'prop-types';
import { Swipeable } from 'react-swipeable';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, Pill, RadioButton, Tabs } from '@/components';
import './ShareController.scss';
import { SharePropTypes } from '@/proptypes';

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
    const { className, share } = this.props;
    const { tab } = this.state;
    const index = tabs.findIndex((d) => d.value === tab);

    console.log(share);

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
              <div className="status-layout">
                <Card className="border-0 rounded-sm">
                  <CardBody>
                    <div className="h5 text-center label">{share.openYn ? 'OPENED' : 'CLOSED'}</div>
                    <hr />
                    <div className="line">
                      <div className="label">STATUS</div>
                      <div className="separator">
                        <div />
                      </div>
                      <div className="value text-right">
                        <RadioButton
                          outline
                          items={[
                            {
                              key: false,
                              value: '중지',
                            },
                            {
                              key: true,
                              value: '시작',
                            },
                          ]}
                          value={share.startedYn}
                          onClick={() => {}}
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
                <Card className="border-0 rounded-sm mt-2">
                  <CardBody>
                    <div className="line">
                      <div className="label">현재 참여인원</div>
                      <div className="separator">
                        <div />
                      </div>
                      <div className="value text-right">
                        <Pill
                          className="mr-2"
                          label="ONLINE"
                          value={share.shareUsers.filter((user) => user.status === 'ONLINE').length}
                        />
                        <Pill
                          label="OFFLINE"
                          labelClassName="bg-danger"
                          value={share.shareUsers.filter((user) => user.status === 'OFFLINE').length}
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
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
  share: SharePropTypes,
};

export default withTranslation()(ShareController);
