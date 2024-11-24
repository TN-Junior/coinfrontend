import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/login';
import Signup from './components/Signup/Signup';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import PlanoContas from './components/PlanoDeContas/planoContas';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import Empresa from './components/Empresa/Empresa';
import Dashboard from './components/Dashboard/dashboard';
import Planejamento from './components/Planejamento/Planejamento';
import Pagamentos from './components/Pagamentos/Pagamento';
import NotFound from './components/NotFound/NotFound'; // Importando a página de erro 404

function Main() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/plano" element={<PlanoContas />} />
                <Route path="/pagamentos" element={<Pagamentos />} />
                <Route path="/empresa" element={<Empresa />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/planejamento" element={<Planejamento />} />
                {/* Página 404 para qualquer rota não encontrada */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default Main;
