import React, {Component} from 'react';
import './Join.scss';
import {withRouter} from 'react-router-dom';
import {Card, CardBody, CardHeader} from "reactstrap";

class Join extends Component {

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
            <div className="join-wrapper">
                <Card className='card text-white bg-primary mb-3'>
                    <CardHeader>제목</CardHeader>
                    <CardBody>바디</CardBody>
                </Card>
                <h1 className='text-primary'>가</h1>
                <h1 className='text-secondary'>가</h1>
                <span className='text-secondary'>가</span>
                <span className="font-weight-bold">가</span>
            </div>
        );
    }
}

export default withRouter(Join);