import React, { useState, useEffect } from 'react';
import './Header.css'; // Estilo separado para o header
import { FaSearch } from 'react-icons/fa'; // Importando o ícone de lupa
import { useLocation } from 'react-router-dom';

const Header = ({ showSearch = true }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();

    const handleSearch = () => {
        if (searchTerm.trim()) {
            searchInTables(searchTerm);
            searchInPageContent(searchTerm);
        } else {
            console.log('Campo de pesquisa vazio');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const searchInTables = (term) => {
        const tables = document.querySelectorAll('table');
        tables.forEach((table) => {
            const rows = table.querySelectorAll('tr');
            rows.forEach((row) => {
                const cells = row.querySelectorAll('td');
                let rowContainsTerm = false;
                cells.forEach((cell) => {
                    if (cell.textContent.toLowerCase().includes(term.toLowerCase())) {
                        rowContainsTerm = true;
                    }
                });
                row.style.display = rowContainsTerm ? '' : 'none';
            });
        });
    };

    const searchInPageContent = (term) => {
        const elements = document.querySelectorAll('p, div, span, h1, h2, h3, h4, h5, h6');
        elements.forEach((element) => {
            element.style.backgroundColor = element.textContent.toLowerCase().includes(term.toLowerCase()) 
                ? '#43a3de' 
                : '';
        });
    };

    useEffect(() => {
        if (!searchTerm) {
            const elements = document.querySelectorAll('p, div, span, h1, h2, h3, h4, h5, h6');
            elements.forEach((element) => element.style.backgroundColor = '');
            const rows = document.querySelectorAll('table tr');
            rows.forEach((row) => row.style.display = '');
        }
    }, [searchTerm]);

    return (
        <div className="header">
            {/* Renderiza a barra de pesquisa apenas se showSearch for true */}
            {showSearch && (
                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="Pesquisar..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        onKeyDown={handleKeyDown}
                    />  
                    {/* <button onClick={handleSearch}>
                        <FaSearch />
                    </button> */}
                </div>
            )}
            {/*<button>Fernanda F.</button>*/}
        </div>
    );
};

export default Header;