import React, { Component } from 'react';
import './Join.scss';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { RegisterLayout } from '@/layouts';
import { Form, Input, FormGroup, Button, Row, Col } from '@/components';
import request from '../../utils/request';

class Join extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: Map({
                email: '',
                name: '',
                password: '',
                passwordConfirm: '',
            }),
        };
    }

    onChange = (field) => (value) => {
        const { user } = this.state;
        console.log(field, value);
        this.setState({
            user: user.set(field, value),
        });
    };

    onSubmit = (e) => {
        e.preventDefault();

        const { user } = this.state;
        request.post('/api/users', user.toJS(), (data) => {
            // eslint-disable-next-line no-console
            console.log(data);
        });
    };

    render() {
        const { t } = this.props;
        const { user } = this.state;

        return (
            <div className="join-wrapper">
                <RegisterLayout>
                    <h1 className="text-center my-4">회원가입</h1>
                    <Row>
                        <Col>
                            <Form onSubmit={this.onSubmit}>
                                <FormGroup>
                                    <Input
                                        label={t('label.email')}
                                        type="email"
                                        placeholderMessage={t('사용할 이메일 주소를 입력해주세요')}
                                        value={user.get('email')}
                                        required
                                        minLength={2}
                                        maxLength={100}
                                        onChange={this.onChange('email')}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Input
                                        label={t('label.name')}
                                        placeholderMessage={t('이름이나 별명을 알려주세요')}
                                        value={user.get('name')}
                                        required
                                        minLength={2}
                                        maxLength={100}
                                        onChange={this.onChange('name')}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Input
                                        label={t('label.password')}
                                        value={user.get('password')}
                                        type="password"
                                        required
                                        minLength={2}
                                        maxLength={100}
                                        onChange={this.onChange('password')}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Input
                                        label={t('label.passwordConfirm')}
                                        value={user.get('passwordConfirm')}
                                        type="password"
                                        required
                                        minLength={2}
                                        maxLength={100}
                                        onChange={this.onChange('passwordConfirm')}
                                    />
                                </FormGroup>
                                <FormGroup className="text-center">
                                    <Button>{t('label.join')}</Button>
                                </FormGroup>
                            </Form>
                        </Col>
                        <Col />
                    </Row>
                </RegisterLayout>
            </div>
        );
    }
}

export default withRouter(withTranslation()(Join));

Join.defaultProps = {
    t: null,
};

Join.propTypes = {
    t: PropTypes.func,
};
