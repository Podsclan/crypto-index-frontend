import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import UpdateCurrency from './pages/updateCurrency/UpdateCurrency';

const queryClient = new QueryClient();

function App(): React.ReactElement {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/update" element={<UpdateCurrency/>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
};

export default App;
