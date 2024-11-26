import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found">
            <img 
                src="src/assets/erro!.png" 
                alt="Erro 404 - Página não encontrada" 
                className="not-found-image" 
            />

            <Link to="/Dashboard" className="go-back">Voltar ao Dashboard</Link>
        </div>
    );
};

export default NotFound;
