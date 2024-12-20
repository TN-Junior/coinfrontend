import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import LinePlot from './LinePlot';
import BarChart from './barchart';
import axios from 'axios';
import './dashboard.css';

const Dashboard = () => {
  const [receitas, setReceitas] = useState([]);
  const [despesas, setDespesas] = useState([]);

  useEffect(() => {
    // Fetch receitas
    axios.get('https://coin-backend-production-66e9.up.railway.app/api/contas/receitas')
      .then(response => {
        const receitaValores = response.data.map(item => item.valor);
        setReceitas(receitaValores);
      })
      .catch(error => console.error('Error fetching receitas:', error));

    // Fetch despesas
    axios.get('https://coin-backend-production-66e9.up.railway.app/api/contas/despesas')
      .then(response => {
        const despesaValores = response.data.map(item => item.valor);
        console.log(despesaValores);
        setDespesas(despesaValores);
      })
      .catch(error => console.error('Error fetching despesas:', error));
  }, []);

  return (
    <div className='ContainerEmpresa'>
      {/* Passa showSearch={false} para ocultar a barra de pesquisa */}
      <Header showSearch={false} />
      <div className='segundoContainer'>
        <Sidebar />
        <div className='chartsContainer'>
          <div className='receitas'>
          <h2>Receitas</h2>
          <LinePlot data={receitas} />
          <BarChart data={receitas}/>
          </div>
          <div className='despesas'>
          <h2>Despesas</h2>
          <LinePlot data={despesas} />
          <BarChart data={despesas}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;