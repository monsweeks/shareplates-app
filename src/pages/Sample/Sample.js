import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Button} from "components";
import request from "utils/request";
import {addMessage} from "actions";
import {connect} from "react-redux";

class Sample extends Component {

    constructor(props) {
        super(props);

        this.state = {
            control: {
                id: "",
                password: "",
                message: null
            }
        };
    }


    render() {
        return (
            <div>
                <Button className='mr-4' onClick={() => {
                    request.get('http://localhost:8080/api/organizations', null, (data) => {
                        console.log(data);
                    });
                }}>GET ORG LIST</Button>
                <Button className='mr-4' onClick={() => {
                    request.get('http://localhost:8080/api/noexist', null, (data) => {
                        console.log(data);
                    });
                }}>404 에러 테스트</Button>
                <Button className='mr-4' onClick={() => {
                    request.get('http://localhost:8080/api/noexist', null, (data) => {
                        console.log(data);
                    }, (error, response) => {
                        console.log(error);
                        console.log(response);
                    });
                }}>404 에러 테스트 (에러 개별 처리)</Button>
            </div>
        );
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        addMessage: (code, category, title, content) => dispatch(addMessage(code, category, title, content)),
    };
};

Sample = connect(undefined, mapDispatchToProps)(Sample);

export default withRouter(Sample);