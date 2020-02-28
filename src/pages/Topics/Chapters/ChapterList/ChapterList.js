import React from 'react';
import { DetailLayout } from '@/layouts';
import './ChapterList.scss';

class ChapterList extends React.PureComponent {


  render() {
    return (
      <DetailLayout className="text-center align-self-center">
        <div className='h1'>CHAPTER LIST</div>
      </DetailLayout>
    );
  }
}

export default ChapterList;