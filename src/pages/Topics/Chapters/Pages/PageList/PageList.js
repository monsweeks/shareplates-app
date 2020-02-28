import React from 'react';
import { DetailLayout } from '@/layouts';
import './PageList.scss';

class PageList extends React.PureComponent {


  render() {
    return (
      <DetailLayout className="text-center align-self-center">
        <div className='h1'>PAGE LIST</div>
      </DetailLayout>
    );
  }
}

export default PageList;