import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Table.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

function Table() {
  const [contas, setContas] = useState([]);
  const [novaConta, setNovaConta] = useState({
    conta: '',
    status: '',
    categoria: '',
    valor: '0,00',
    vencimento: '',
    pagamento: ''
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [contaSelecionada, setContaSelecionada] = useState(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todas');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    carregarContas();
  }, []);

  const carregarContas = async () => {
    try {
      const response = await axios.get('https://coin-backend-production-5d52.up.railway.app/api/contas');
      setContas(response.data);
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "conta") {
      const formattedValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
      setNovaConta({
        ...novaConta,
        conta: formattedValue
      });
    } else if (name === "valor") {
      const formattedValue = formatCurrency(value);
      setNovaConta({
        ...novaConta,
        valor: formattedValue
      });
    } else {
      setNovaConta({
        ...novaConta,
        [name]: value
      });
    }
  };

  const formatCurrency = (value) => {
    const cleanValue = value.replace(/\D/g, "");
    const numberValue = parseFloat(cleanValue) / 100;
    return numberValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).replace("R$", "");
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const validarCampos = () => {
    const erros = {};

    if (!novaConta.conta.trim()) {
      erros.conta = 'A descrição da conta é obrigatória.';
    }
    if (!novaConta.status.trim()) {
      erros.status = 'O status é obrigatório.';
    }
    if (!novaConta.categoria.trim()) {
      erros.categoria = 'A categoria é obrigatória.';
    }
    if (isNaN(parseFloat(novaConta.valor.replace(".", "").replace(",", "."))) || parseFloat(novaConta.valor.replace(".", "").replace(",", ".")) <= 0) {
      erros.valor = 'O valor deve ser maior que zero e válido.';
    }
    if (!novaConta.vencimento.trim()) {
      erros.vencimento = 'A data de vencimento é obrigatória.';
    }
    if (novaConta.pagamento && isNaN(Date.parse(novaConta.pagamento))) {
      erros.pagamento = 'A data de pagamento deve ser válida.';
    }

    setErrors(erros);
    return Object.keys(erros).length === 0;
  };

  const adicionarOuEditarConta = async () => {
    if (!validarCampos()) return;
    try {
      const valorEmNumero = parseFloat(novaConta.valor.replace(".", "").replace(",", "."));
      const contaParaEnviar = { ...novaConta, valor: valorEmNumero };
      if (isEditing) {
        const response = await axios.put(`https://coin-backend-production-5d52.up.railway.app/api/contas/${editId}`, contaParaEnviar);
        setContas(contas.map(conta => (conta.id === editId ? response.data : conta)));
      } else {
        const response = await axios.post('https://coin-backend-production-5d52.up.railway.app/api/contas', contaParaEnviar);
        setContas([...contas, response.data]);
      }
      resetForm();
      carregarContas();
    } catch (error) {
      console.error('Erro ao adicionar ou editar conta:', error);
    }
  };

  const resetForm = () => {
    setNovaConta({ conta: '', status: '', categoria: '', valor: '0,00', vencimento: '', pagamento: '' });
    setErrors({});
    setShowModal(false);
    setIsEditing(false);
    setEditId(null);
    setContaSelecionada(null);
  };

  const editarConta = (conta) => {
    setNovaConta({
      conta: conta.conta,
      status: conta.status,
      categoria: conta.categoria,
      valor: conta.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
      vencimento: conta.vencimento,
      pagamento: conta.pagamento
    });
    setEditId(conta.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const confirmarDelecao = () => {
    deletarConta(contaSelecionada.id);
    setShowDeleteConfirm(false);
  };

  const cancelarDelecao = () => {
    setShowDeleteConfirm(false);
  };

  const deletarConta = async (id) => {
    try {
      await axios.delete(`https://coin-backend-production-5d52.up.railway.app/api/contas/${id}`);
      setContas(contas.filter(conta => conta.id !== id));
      setContaSelecionada(null);
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
    }
  };

  const selecionarConta = (conta) => {
    setContaSelecionada(conta);
  };

  const contasFiltradas = contas.filter(conta => {
    if (categoriaSelecionada === 'Todas') {
      return true;
    }
    return conta.categoria === categoriaSelecionada;
  });

  return (
    <div className="empresa-page">
      <div className="empresa-header">
        <h2>Planejamento</h2>
        <button className="add-button" onClick={() => setShowModal(true)}>+</button>
      </div>

      <div className="categoria-menu">
        <button
          className={`categoria-button ${categoriaSelecionada === 'Todas' ? 'active' : ''}`}
          onClick={() => setCategoriaSelecionada('Todas')}
        >
          Todas
        </button>
        <button
          className={`categoria-button ${categoriaSelecionada === 'Despesas' ? 'active' : ''}`}
          onClick={() => setCategoriaSelecionada('Despesas')}
        >
          Despesas
        </button>
        <button
          className={`categoria-button ${categoriaSelecionada === 'Receitas' ? 'active' : ''}`}
          onClick={() => setCategoriaSelecionada('Receitas')}
        >
          Receitas
        </button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEditing ? "Editar Conta" : "Adicionar Nova Conta"}</h3>
            <input
              type="text"
              name="conta"
              placeholder="Conta (ex: Descrição)"
              value={novaConta.conta}
              onChange={handleInputChange}
            />
            {errors.conta && <span className="error">{errors.conta}</span>}
            <input
              type="text"
              name="status"
              placeholder="Status (ex: Pendente)"
              value={novaConta.status}
              onChange={handleInputChange}
            />
            {errors.status && <span className="error">{errors.status}</span>}
            <select
              name="categoria"
              className='select'
              value={novaConta.categoria}
              onChange={handleInputChange}
            >
              <option value="">Selecione a Categoria</option>
              <option value="Despesas">Despesas</option>
              <option value="Receitas">Receitas</option>
            </select>
            {errors.categoria && <span className="error">{errors.categoria}</span>}
            <input
              className='inputSpace'
              type="text"
              name="valor"
              placeholder="Valor (ex: 1.000,50)"
              value={novaConta.valor}
              onChange={handleInputChange}
            />
            {errors.valor && <span className="error">{errors.valor}</span>}
            <input
              className='inputSpace'
              type="date"
              name="vencimento"
              placeholder="Vencimento"
              value={novaConta.vencimento}
              onChange={handleInputChange}
            />
            {errors.vencimento && <span className="error">{errors.vencimento}</span>}
            <input
              className='inputSpace'
              type="date"
              name="pagamento"
              placeholder="Data de Pagamento"
              value={novaConta.pagamento}
              onChange={handleInputChange}
            />
            <div className="modal-actions">
              <button className="save-button" onClick={adicionarOuEditarConta}>{isEditing ? "Salvar Alterações" : "Adicionar"}</button>
              <button className="cancel-button" onClick={resetForm}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirmação</h3>
            <p>Tem certeza que deseja deletar esta conta?</p>
            <div className="modal-actions">
              <button className="delete-button" onClick={confirmarDelecao}>Sim</button>
              <button className="cancel-button" onClick={cancelarDelecao}>Não</button>
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="empresa-table">
          <thead>
            <tr className='Title'>
              <th>Descrição</th>
              <th>Status</th>
              <th>Categoria</th>
              <th>Valor</th>
              <th>Vencimento</th>
              <th>Data de Pagamento</th>
            </tr>
          </thead>
          <tbody>
            {contasFiltradas.map((conta) => (
              <tr key={conta.id} onClick={() => selecionarConta(conta)} className={contaSelecionada?.id === conta.id ? 'selected' : ''}>
                <td>{conta.conta}</td>
                <td>{conta.status}</td>
                <td>{conta.categoria}</td>
                <td>{`R$ ${parseFloat(conta.valor).toFixed(2)}`}</td>
                <td>{formatDate(conta.vencimento)}</td>
                <td>{formatDate(conta.pagamento)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {contaSelecionada && (
        <div className="actions-container">
          <button className="edit-button" onClick={() => editarConta(contaSelecionada)}>
            <FontAwesomeIcon icon={faEdit} /> Editar
          </button>
          <button className="delete-button" onClick={() => setShowDeleteConfirm(true)}>
            <FontAwesomeIcon icon={faTrash} /> Deletar
          </button>
        </div>
      )}
    </div>
  );
}

export default Table;
