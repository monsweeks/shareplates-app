import React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Common, NoMatch } from 'pages';
import { EmptyHeader, Footer, Header } from '@/layouts';
import About from '@/pages/About';
import Users from '@/pages/Users';
import Topics from '@/pages/Topics';
import Grps from '@/pages/Grps';
import Shares from '@/pages/Shares';
import Admin from '@/pages/Admin';
import '@/App.scss';

// 편집 기능 개선 필요
// 스타일 저장 & 로딩 기능 (카테고리, 이름으로 많이 저장 활용할 수 있도록)
// Ctrl-Z, Ctrl-Y 취소/복원 기능
// 이미지, 텍스트 등을 한줄에 여러개 넣을 수 있도록
// 코드 삽입할 수 있도록
// 컴포넌트 복사 & 붙여넣기
// 페이지 복사 & 붙여넣기

function App() {
  return (
    <div className="app-wrapper">
      <Switch>
        <Route exact path="/shares/:shareId" component={EmptyHeader} />
        <Route component={Header} />
      </Switch>
      <article className="app-content">
        <Switch>
          <Route exact path="/" component={Shares} />
          <Route path="/users" component={Users} />
          <Route path="/about" component={About} />
          <Route path="/topics" component={Topics} />
          <Route path="/groups" component={Grps} />
          <Route path="/shares" component={Shares} />
          <Route path="/admin" component={Admin} />
          <Route component={NoMatch} />
        </Switch>
        <Common />
      </article>
      <Footer />
    </div>
  );
}

export default hot(module)(withRouter(App));
