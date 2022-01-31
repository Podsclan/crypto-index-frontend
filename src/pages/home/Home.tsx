import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, InputNumber, List, Space, Spin } from 'antd';
import { useQuery } from 'react-query';
import BACKEND_URL from '../../constants/constants';
import Redirect from '../../components/Redirect';
import { IQuotations } from '../../interfaces/IQuotations';
import './Home.css';

const { Item } = List;

type QuotationResponse = {
    currency: string,
    value: number,
}

export default function Home(): React.ReactElement {
    const [values, setValues] = useState<QuotationResponse[]>([]);
    const [btcValue, setBtcValue] = useState(1);

    const token = localStorage.getItem('token');
    if (!token) {
        return <Redirect to="/login"/>;
    }

    const {
        isLoading,
    } = useQuery(
        'getQuotation',
        () => axios.get<IQuotations>(`${BACKEND_URL}/api/crypto/btc`, {
            headers: {
                'Authorization': token,
            }
        }),
        {
            refetchOnWindowFocus: false,
            retry: false,
            onSuccess: (data) => {
                setValues(Object.values(data.data.bpi).map(element => {
                    localStorage.setItem(element.code, element.rate);
                    return {
                        currency: element.code,
                        value: element.rate_float,
                    };
                }));
            }
        }
    );

    return <Spin size="large" spinning={values.length === 0 || isLoading}>
        <Space className="wrapper" direction="vertical" align="center">
            <Link to="/update">
                <Button className="update-home-button">Atualizar valor monetário</Button>
            </Link>
            <Card className="currency-card" title="BTC"
                  bodyStyle={{ backgroundColor: '#C4C4C4' }}>
                <InputNumber size="large" min={1} defaultValue={btcValue} bordered={false}
                             onChange={(value) => setBtcValue(value)}/>
            </Card>
            <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={values.filter(el => el.currency !== 'BTC')}
                renderItem={item => <Item>
                    <Card className="currency-card" bodyStyle={{ backgroundColor: '#C4C4C4' }}
                          title={item.currency}>
                        <span
                            className="currency-card-content">
                            {new Intl.NumberFormat('en-IN').format(item.value * btcValue)}
                        </span>
                    </Card>
                </Item>}
            />
        </Space>
    </Spin>;
}