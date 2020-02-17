import React from 'react';
import {hot} from 'react-hot-loader'
import {BrowserRouter as Router, Route, Switch, withRouter} from 'react-router-dom';
import {Common, Join, Login, NoMatch, Sample,} from "pages";
import './App.scss';
import NavLink from "reactstrap/es/NavLink";

function App() {
    return (
        <div className="app-wrapper">
            <header className='app-header'>
                <NavLink href='/join'>회원가입</NavLink>
                <NavLink href='/sample'>기능 샘플</NavLink>
            </header>
            <article className='app-content'>
                <Router>
                    <Switch>
                        <Route exact path="/sample" component={Sample}/>
                        <Route exact path="/join" component={Join}/>
                        <Route exact path="/login" component={Login}/>
                        <Route component={NoMatch}/>
                    </Switch>
                </Router>
                <Common/>
            </article>
        </div>
    );
}

export default hot(module)(withRouter(App));