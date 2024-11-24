import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found">
            <h1>404 - Página Não Encontrada</h1>
            <p>Desculpe, a página que você está procurando não existe.</p>
            <Link to="/Dashboard" className="go-back">Voltar ao Dashboard</Link>
        </div>
    );
};

export default NotFound;
