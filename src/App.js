import React from 'react';
import {hot} from 'react-hot-loader'
import {BrowserRouter as Router, Route, Switch, withRouter} from 'react-router-dom';
import {Common, Join, Login, NoMatch, Sample,} from "pages";
import './App.scss';
import {Header} from "./layouts";

function App() {
    return (
        <div className="app-wrapper">
            <Header/>
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