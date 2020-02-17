import React, {Component} from 'react';
import './Join.scss';
import {withRouter} from 'react-router-dom';
import {Button, Form, FormFeedback, FormGroup, FormText, Input, Label} from "reactstrap";
import {RegisterLayout} from "layouts";
import {withTranslation} from "react-i18next";
import {Map} from 'immutable';
import request from "../../utils/request";

class Join extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: Map({
                email: "",
                name: "",
                password: "",
                passwordConfirm: "",
            }),
        };
    }

    onChange = (e) => {
        const {user} = this.state;
        this.setState({
            user: user.set(e.target.id, e.target.value)
        });
    };

    onSubmit = (e) => {

        console.log(this.state.user.toJS());
        e.preventDefault();
        request.post('/api/users', this.state.user.toJS(), (data) => {
            console.log(data);
        });
    };

    render() {

        const {t} = this.props;
        const {user} = this.state;

        return (
            <div className="join-wrapper">
                <RegisterLayout>
                    <h1>회원가입</h1>
                    <Form onSubmit={this.onSubmit}>
                        <FormGroup>
                            <div>
                                <Label for="email">{t('label.email')}</Label>
                                <FormFeedback className='float-right ml-2 my-0 d-inline mt-2 w-auto'>필수 입력
                                    값입니다</FormFeedback>
                            </div>
                            <Input id="email" value={this.state.user.get('email')} required minLength={2}
                                   maxLength={100}
                                   onChange={this.onChange}/>
                            <FormText>사용할 이메일을 입력해주세요. 입력된 이메일 주소를 이용하여 로그인할 수 있습니다.</FormText>
                        </FormGroup>
                        <FormGroup>
                            <div>
                                <Label for="name">{t('label.name')}</Label>
                                <FormFeedback className='float-right ml-2 my-0 d-inline mt-2 w-auto'>필수 입력
                                    값입니다</FormFeedback>
                            </div>
                            <Input id="name" value={user.get('name')} required minLength={2} maxLength={100}
                                   onChange={this.onChange}/>
                            <FormText>이름을 입력해주세요.</FormText>
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">{t('label.password')}</Label>
                            <Input id="password" value={user.get('password')} type="password" name="password" required
                                   minLength={2} maxLength={100}
                                   placeholder="Password" onChange={this.onChange}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="passwordConfirm">{t('label.passwordConfirm')}</Label>
                            <Input id="passwordConfirm" value={user.get('passwordConfirm')} type="password" required
                                   minLength={2} maxLength={100}
                                   name="password"
                                   placeholder="Password" onChange={this.onChange}/>
                        </FormGroup>
                        <Button>{t('label.join')}</Button>
                    </Form>
                </RegisterLayout>
            </div>
        );
    }
}

export default withRouter(withTranslation()(Join));