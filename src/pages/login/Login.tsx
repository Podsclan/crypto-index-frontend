import React from 'react';
import axios from 'axios';
import { Button, Form, Input, notification, Spin } from 'antd';
import { useMutation } from 'react-query';
import Redirect from '../../components/Redirect';
import BACKEND_URL from '../../constants/constants';
import isError from '../../utils/errorHandling';

import './Login.css';

export default function Login(): React.ReactElement {
    const { mutate, status } = useMutation(
        'getQuotation',
        async (values: { email: string, senha: string }) => axios.post(`${BACKEND_URL}/api/login`, {
            email: values.email,
            password: values.senha
        }), {
            onSuccess: (data) => {
                localStorage.setItem('token', data.data.token);
            },
            onError: (error) => {
                if (axios.isAxiosError(error)) {
                    notification.error({
                        message: 'Erro ao fazer login!',
                        description: `${error.response?.data.message}`,
                    });
                } else if (isError(error)) {
                    notification.error({
                        message: 'Erro ao fazer login!',
                        description: `${error.message}`,
                    });
                } else {
                    notification.error({
                        message: 'Erro ao fazer login!',
                        description: `${error}`,
                    });
                }
            }
        },
    );

    const token = localStorage.getItem('token');
    if (token) {
        return <Redirect to="/"/>;
    }

    const onFinish = (values: { email: string, senha: string }): void => {
        mutate(values);
    };

    return (
        <Spin size="large" spinning={status === 'loading'}>
            <div className="login-wrapper">
                <Form
                    name="basic"
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Por favor preencha o email!' }]}
                    >
                        <Input size="large"/>
                    </Form.Item>

                    <Form.Item
                        label="Senha"
                        name="senha"
                        rules={[{ required: true, message: 'Por favor preencha a senha!' }]}
                    >
                        <Input.Password size="large"/>
                    </Form.Item>

                    <Form.Item>
                        <Button className="login-button" type="primary" htmlType="submit" size="large">
                            ENTRAR
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    );
}