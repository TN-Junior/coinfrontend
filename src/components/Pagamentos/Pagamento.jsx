import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Modal from 'react-modal';
import './Pagamento.css';
import { MdEditNote } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";

// Configuração do Modal
Modal.setAppElement('#root');

const Pagamentos = () => {
  const [isReceitas, setIsReceitas] = useState(true);
  const [pagamentos, setPagamentos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [pagamentoAtual, setPagamentoAtual] = useState(null);
  const [pagamentoParaDeletar, setPagamentoParaDeletar] = useState(null);
  const [novoPagamento, setNovoPagamento] = useState({
    descricao: '',
    valor: '',
    data: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadPagamentos(isReceitas);
  }, [isReceitas]);

  const toggleReceitasDespesas = () => {
    setIsReceitas(!isReceitas);
  };

  const loadPagamentos = async (isReceitas) => {
    try {
      const tipo = isReceitas ? 'RECEITA' : 'DESPESA';
      const response = await axios.get(`https://coin-backend-production-5d52.up.railway.app/api/pagamentos/${tipo}`);
      setPagamentos(response.data);
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
    }
  };

  const openModal = (pagamento = null) => {
    if (pagamento) {
      setPagamentoAtual(pagamento);
      setNovoPagamento({
        descricao: pagamento.descricao,
        valor: pagamento.valor,
        data: pagamento.data.split('T')[0],
      });
    } else {
      setPagamentoAtual(null);
      setNovoPagamento({
        descricao: '',
        valor: '',
        data: '',
      });
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setPagamentoAtual(null);
    setErrors({});
  };

  const openDeleteModal = (pagamento) => {
    setPagamentoParaDeletar(pagamento);
    setDeleteModalIsOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
    setPagamentoParaDeletar(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoPagamento((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validarCampos = () => {
    const erros = {};

    if (!novoPagamento.descricao.trim()) {
      erros.descricao = 'A descrição é obrigatória.';
    }
    if (isNaN(parseFloat(novoPagamento.valor)) || parseFloat(novoPagamento.valor) <= 0) {
      erros.valor = 'O valor deve ser um número maior que zero.';
    }
    if (!novoPagamento.data) {
      erros.data = 'A data é obrigatória.';
    }

    setErrors(erros);
    return Object.keys(erros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarCampos()) return;

    try {
      const tipo = isReceitas ? 'RECEITA' : 'DESPESA';
      const pagamento = {
        ...novoPagamento,
        tipo,
      };
      if (pagamentoAtual) {
        await axios.put(`https://coin-backend-production-5d52.up.railway.app/api/pagamentos/${pagamentoAtual.id}`, pagamento);
      } else {
        await axios.post('https://coin-backend-production-5d52.up.railway.app/api/pagamentos', pagamento);
      }
      loadPagamentos(isReceitas);
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar pagamento:', error);
    }
  };

  const confirmarDelecao = async () => {
    try {
      await axios.delete(`https://coin-backend-production-5d52.up.railway.app/api/pagamentos/${pagamentoParaDeletar.id}`);
      loadPagamentos(isReceitas);
      closeDeleteModal();
    } catch (error) {
      console.error('Erro ao excluir pagamento:', error);
    }
  };

  return (
    <>
      <div className='ContainerEmpresa'>
        <Header />
        <div className='segundoContainer'>
          <Sidebar />

          <div className='content'>
            <div className='toggle-add-container'>
              <div className='toggle-container'>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={isReceitas} 
                    onChange={toggleReceitasDespesas} 
                  />
                  <span className="slider"></span>
                </label>
                <span>{isReceitas ? 'Receitas' : 'Despesas'}</span>
              </div>
              <button className='add-button' onClick={() => openModal()}>
                Adicionar Pagamento
              </button>
            </div>

            <div className='table-container'>
              {isReceitas ? (
                <TabelaReceitas pagamentos={pagamentos} openModal={openModal} openDeleteModal={openDeleteModal} />
              ) : (
                <TabelaDespesas pagamentos={pagamentos} openModal={openModal} openDeleteModal={openDeleteModal} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para adicionar ou editar pagamento */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Pagamento"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>{pagamentoAtual ? 'Editar Pagamento' : 'Adicionar Pagamento'}</h2>
        <form onSubmit={handleSubmit} className='form-pagamento'>
          <div className='form-group'>
            <label htmlFor='descricao'>Descrição:</label>
            <input
              type='text'
              id='descricao'
              name='descricao'
              value={novoPagamento.descricao}
              onChange={handleChange}
              required
            />
            {errors.descricao && <span className="error">{errors.descricao}</span>}
          </div>
          <div className='form-group'>
            <label htmlFor='valor'>Valor:</label>
            <input
              type='number'
              id='valor'
              name='valor'
              value={novoPagamento.valor}
              onChange={handleChange}
              required
              step="0.01"
            />
            {errors.valor && <span className="error">{errors.valor}</span>}
          </div>
          <div className='form-group'>
            <label htmlFor='data'>Data:</label>
            <input
              type='date'
              id='data'
              name='data'
              value={novoPagamento.data}
              onChange={handleChange}
              required
            />
            {errors.data && <span className="error">{errors.data}</span>}
          </div>
          <div className='form-actions'>
            <button type='submit' className='submit-button'>{pagamentoAtual ? 'Salvar' : 'Adicionar'}</button>
            <button type='button' onClick={closeModal} className='cancel-button'>Cancelar</button>
          </div>
        </form>
      </Modal>

      {/* Modal de confirmação de exclusão */}
      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Confirmação"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Confirmação</h2>
        <p>Tem certeza que deseja deletar o pagamento "{pagamentoParaDeletar?.descricao}"?</p>
        <div className="modal-actions">
          <button className="delete-button" onClick={confirmarDelecao}>Sim</button>
          <button className="cancel-button" onClick={closeDeleteModal}>Não</button>
        </div>
      </Modal>
    </>
  );
};

const TabelaReceitas = ({ pagamentos, openModal, openDeleteModal }) => {
  return (
    <table className='styled-table'>
      <thead>
        <tr>
          <th>Descrição</th>
          <th>Valor</th>
          <th>Data</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {pagamentos.map((pagamento) => (
          <tr key={pagamento.id}>
            <td>{pagamento.descricao}</td>
            <td>R$ {pagamento.valor.toFixed(2)}</td>
            <td>{new Date(pagamento.data).toLocaleDateString('pt-BR')}</td>
            <td>
              <button className='editButton' onClick={() => openModal(pagamento)}><MdEditNote /></button>
              <button className='deleteButton' onClick={() => openDeleteModal(pagamento)}><MdDeleteForever /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const TabelaDespesas = ({ pagamentos, openModal, openDeleteModal }) => {
  return (
    <table className='styled-table'>
      <thead>
        <tr>
          <th>Descrição</th>
          <th>Valor</th>
          <th>Data</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {pagamentos.map((pagamento) => (
          <tr key={pagamento.id}>
            <td>{pagamento.descricao}</td>
            <td>R$ {pagamento.valor.toFixed(2)}</td>
            <td>{new Date(pagamento.data).toLocaleDateString('pt-BR')}</td>
            <td>
              <button className='editButton' onClick={() => openModal(pagamento)}><MdEditNote /></button>
              <button className='deleteButton' onClick={() => openDeleteModal(pagamento)}><MdDeleteForever /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Pagamentos;
