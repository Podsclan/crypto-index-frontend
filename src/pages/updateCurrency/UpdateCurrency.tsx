import { Button, Form, InputNumber, notification, Select, Spin } from 'antd';
import { useMutation } from 'react-query';
import axios from 'axios';
import React, { useState } from 'react';
import BACKEND_URL from '../../constants/constants';
import isError from '../../utils/errorHandling';
import Redirect from '../../components/Redirect';

import './UpdateCurrency.css';

const { Option } = Select;

export default function UpdateCurrency(): React.ReactElement {
    const token = localStorage.getItem('token');
    const brl = localStorage.getItem('BRL');
    const eur = localStorage.getItem('EUR');
    const cad = localStorage.getItem('CAD');

    const [currencyValue, setCurrencyValue] = useState(`BRL ${brl}`);
    const [redirect, setRedirect] = useState(false);

    if (!token) {
        return <Redirect to="/login"/>;
    }

    const { mutate, status } = useMutation(
        'getQuotation',
        async (values: { moeda: string, actualValue: string, newValue: string }) => await axios.post(`${BACKEND_URL}/api/crypto/btc`, {
                currency: values.moeda,
                value: values.newValue
            },
            {
                headers: {
                    'Authorization': token,
                }
            }), {
            retry: false,
            onError: (error) => {
                if (axios.isAxiosError(error)) {
                    notification.error({
                        message: 'Erro ao atualizar cotação!',
                        description: `${error.response?.data.message}`,
                    });
                } else if (isError(error)) {
                    notification.error({
                        message: 'Erro ao atualizar cotação!',
                        description: `${error.message}`,
                    });
                } else {
                    notification.error({
                        message: 'Erro ao atualizar cotação!',
                        description: `${error}`,
                    });
                }
            }
        },
    );
    if (!brl || !eur || !cad) {
        return <Redirect to="/"/>;
    }

    if (status === 'success') {
        return <Redirect to="/"/>;
    }

    const onFinish = (values: { moeda: string, actualValue: string, newValue: string }): void => {
        mutate(values);
    };

    const onOptionChange = (value: string): void => {
        switch (value) {
            case 'BRL': {
                setCurrencyValue(`BRL ${brl}`);
                break;
            }
            case 'EUR': {
                setCurrencyValue(`EUR ${eur}`);
                break;
            }
            default: {
                setCurrencyValue(`CAD ${cad}`);
                break;
            }
        }
    };

    if (redirect) {
        return <Redirect to="/"/>;
    }

    return (
        <Spin size="large" spinning={status === 'loading'}>
            <div className="update-wrapper">
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 5 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Moeda"
                        name="moeda"
                        initialValue="BRL"
                    >
                        <Select size="large" style={{ backgroundColor: 'red' }} onChange={onOptionChange}
                                defaultValue="BRL">
                            <Option value="BRL">BRL</Option>
                            <Option value="EUR">EUR</Option>
                            <Option value="CAD">CAD</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Valor atual"
                        name="actualValue"
                    >
                        <span style={{ fontSize: '20px', width: '100%' }}>{currencyValue}</span>
                    </Form.Item>

                    <Form.Item
                        label="Novo valor"
                        name="newValue"
                        rules={[{ required: true, message: 'Por favor preencha o valor!' }]}
                    >
                        <InputNumber<string>
                            size="large"
                            style={{ width: 275 }}
                            step="0.00000000000001"
                            stringMode
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button className="page-button update-button" type="primary" htmlType="submit">
                            ATUALIZAR
                        </Button>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button className="page-button back-button" type="primary" onClick={() => setRedirect(true)}>
                            VOLTAR
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    );
}