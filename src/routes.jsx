import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/login';
import Signup from './components/Signup/Signup';  // Importando o componente de cadastro
import PlanoContas from './components/PlanoDeContas/planoContas';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import Empresa from './components/Empresa/Empresa';
import Dashboard from './components/Dashboard/dashboard';
import Planejamento from './components/Planejamento/Planejamento'

function Main() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />  {/* Adicionando a rota para o cadastro */}

                {/* Agrupando Header, Sidebar e PlanoContas para a rota '/plano' */}
                <Route
                    path="/plano"
                    element={
                        <>
                            <PlanoContas />
                        </>
                    }
                />

                <Route path="/empresa" element={<Empresa />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/planejamento" element={<Planejamento />}/>
            </Routes>
        </Router>
    );
}

export default Main;