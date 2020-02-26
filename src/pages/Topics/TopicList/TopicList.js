import React from 'react';
import { DetailLayout } from '@/layouts';
import './TopicList.scss';

class TopicList extends React.PureComponent {


  render() {
    return (
      <DetailLayout className="text-center align-self-center">
        <div className='h1'>TOPIC LIST</div>
      </DetailLayout>
    );
  }
}

export default TopicList;