import React from 'react';
import { hot } from 'react-hot-loader'
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.scss';
import Button from "react-bootstrap/Button";
import Join from "./pages/Join/Join";
import Login from "./pages/Login/Login";
import NoMatch from "./pages/NoMatch/NoMatch";

function App() {
  return (

    <div className="App">
        <Router>
            <div>
                <Switch>
                    <Route exact path="/join" component={Join} />
                    <Route exact path="/login" component={Login} />
                    <Route component={NoMatch} />
                </Switch>
            </div>
        </Router>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
            <Button>버튼33333</Button>
        </a>
      </header>
    </div>
  );
}

export default hot(module)(App);