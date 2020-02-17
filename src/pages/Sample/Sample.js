import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Button} from "components";
import request from "utils/request";
import {addMessage} from "actions";
import {connect} from "react-redux";
import {withTranslation} from "react-i18next";

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

        const {t, i18n} = this.props;

        return (
            <div>
                <h2>서버 요청에 대한 샘플</h2>
                <div>
                    <Button className='mr-4' onClick={() => {
                        request.get('/api/organizations', null, (data) => {
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
                <h2>다국어 테스트</h2>
                <div>
                    <div>{t('message.hello')}</div>
                    <div>{t('n.selected', {n: 5})}</div>
                    <Button onClick={() => {i18n.changeLanguage('en-US')}}>English</Button>
                    <Button onClick={() => {i18n.changeLanguage('ko-KR')}}>Korean</Button>
                </div>
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

export default withRouter(withTranslation()(Sample));