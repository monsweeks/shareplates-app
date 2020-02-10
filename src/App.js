import React from 'react';
import {hot} from 'react-hot-loader'
import {BrowserRouter as Router, Route, Switch, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {
    addRequest,
    clearAllMessage,
    pushMessage,
    setAlert,
    setConfig,
    setControlVisibility,
    setCounterInfo,
    setSupported,
    setUserData,
    setUserId
} from './actions';
import logo from './logo.svg';
import './App.scss';
import Button from "react-bootstrap/Button";
import Join from "./pages/Join/Join";
import Login from "./pages/Login/Login";
import NoMatch from "./pages/NoMatch/NoMatch";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

function App(props) {


    console.log(props.control);

    if (!props.control.Message) {
        props.setControlVisibility('Message', true);
    }
    return (

        <div className="App">
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/join" component={Join}/>
                        <Route exact path="/login" component={Login}/>
                        <Route component={NoMatch}/>
                    </Switch>
                </div>
            </Router>
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
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
                    <FontAwesomeIcon icon={faCoffee} />
                    <Button>버튼33333><i className="fas fa-coffee"/></Button>

                </a>
            </header>
        </div>
    );
}

let mapStateToProps = (state) => {
    return {
        control: state.control,
        counterInfo: state.counterInfo,
        messages: state.message.messages,
        bgColor: state.style.bgColor,
        config: state.config,
        user: state.user,
        supported: state.supported,
        objects: state.target.objects,
        alert: state.alert
    };
};

let mapDispatchToProps = (dispatch) => {
    return {
        setControlVisibility: (name, value) => dispatch(setControlVisibility(name, value)),
        clearAllMessage: () => dispatch(clearAllMessage()),
        addRequest: () => dispatch(addRequest()),
        setConfig: (config) => dispatch(setConfig(config)),
        setUserId: (origin, id, token, time) => dispatch(setUserId(origin, id, token, time)),
        setUserData: (userData) => dispatch(setUserData(userData)),
        pushMessage: (category, title, content) => dispatch(pushMessage(category, title, content)),
        setCounterInfo: (families, objTypes) => dispatch(setCounterInfo(families, objTypes)),
        setSupported: (supported) => dispatch(setSupported(supported)),
        setAlert: (alert) => dispatch(setAlert(alert))
    };
};

App = connect(mapStateToProps, mapDispatchToProps)(App);

export default hot(module)(withRouter(App));