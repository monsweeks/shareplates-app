import React from 'react';
import {hot} from 'react-hot-loader'
import {BrowserRouter as Router, Route, Switch, withRouter} from 'react-router-dom';
import {Common, Join, Login, NoMatch, Sample,} from "pages";
import './App.scss';

function App() {
    return (
        <div className="App">
            <div>
                <Router>
                    <div>
                        <Switch>
                            <Route exact path="/sample" component={Sample}/>
                            <Route exact path="/join" component={Join}/>
                            <Route exact path="/login" component={Login}/>
                            <Route component={NoMatch}/>
                        </Switch>
                    </div>
                </Router>
            </div>
            <Common/>
        </div>
    );
}

export default hot(module)(withRouter(App));