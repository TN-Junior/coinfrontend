import React, { useState, useEffect } from "react";
import axios from "axios";
import "../PlanoDeContas/planoContas.css";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";

const AccountPlan = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [accounts, setAccounts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [form, setForm] = useState({
    conta: "",
    status: "",
    categoria: "",
    valor: "",
    vencimento: "",
  });
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://coin-backend-qrd3.onrender.com/api/planocontas"
      );
      setAccounts(response.data);
    } catch (error) {
      console.error("Erro ao buscar contas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const filteredAccounts = accounts.filter(
    (account) =>
      selectedCategory === "Todos" ||
      account.categoria.toLowerCase() === selectedCategory.toLowerCase()
  );

  const handleAddAccount = () => {
    setForm({
      conta: "",
      status: "",
      categoria: "",
      valor: "",
      vencimento: "",
    });
    setErrors({});
    setIsEditMode(false);
    setIsPopupOpen(true);
  };

  const handleEditAccount = (account) => {
    setForm(account);
    setCurrentId(account.id);
    setErrors({});
    setIsEditMode(true);
    setIsPopupOpen(true);
  };

  const handleDeleteAccount = async (id) => {
    try {
      await axios.delete(
        `https://coin-backend-qrd3.onrender.com/api/planocontas/${id}`
      );
      fetchAccounts();
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
    }
  };

  const validateFields = () => {
    const errors = {};

    if (!form.conta.trim())
      errors.conta = "A descrição da conta é obrigatória.";
    if (!form.status.trim()) errors.status = "O status é obrigatório.";
    if (!form.categoria.trim()) errors.categoria = "A categoria é obrigatória.";
    if (
      !form.valor ||
      isNaN(parseFloat(form.valor)) ||
      parseFloat(form.valor) <= 0
    )
      errors.valor = "O valor deve ser um número maior que zero.";
    if (!form.vencimento)
      errors.vencimento = "A data de vencimento é obrigatória.";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    try {
      if (isEditMode) {
        await axios.put(
          `https://coin-backend-qrd3.onrender.com/api/planocontas/${currentId}`,
          form
        );
      } else {
        await axios.post(
          "https://coin-backend-qrd3.onrender.com/api/planocontas",
          form
        );
      }
      fetchAccounts();
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Erro ao salvar conta:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="ContainerGeral">
      <Sidebar />
      <Header />
      <div className="ContainerPlanos">
        <section className="plan-section">
          <div className="text-button">
            <h2>Plano de Contas</h2>
            <button onClick={handleAddAccount}>+</button>
          </div>

          <div className="menu">
            <button
              className={selectedCategory === "Receita" ? "active" : ""}
              onClick={() => setSelectedCategory("Receita")}
            >
              Receitas
            </button>
            <button
              className={selectedCategory === "Despesa" ? "active" : ""}
              onClick={() => setSelectedCategory("Despesa")}
            >
              Despesas
            </button>
            <button
              className={selectedCategory === "Todos" ? "active" : ""}
              onClick={() => setSelectedCategory("Todos")}
            >
              Todos
            </button>
          </div>

          <div className="table-content">
            <table>
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Status</th>
                  <th>Categoria</th>
                  <th>Valor</th>
                  <th>Vencimento</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.length > 0 ? (
                  filteredAccounts.map((account) => (
                    <tr key={account.id}>
                      <td>{account.conta}</td>
                      <td className={`status ${account.status.toLowerCase()}`}>
                        {account.status}
                      </td>
                      <td>{account.categoria}</td>
                      <td>{account.valor}</td>
                      <td>{account.vencimento}</td>
                      <td>
                        <button onClick={() => handleEditAccount(account)}>
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteAccount(account.id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">Nenhuma conta encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>{isEditMode ? "Editar Conta" : "Adicionar Conta"}</h3>
            <input
              name="conta"
              value={form.conta}
              onChange={handleChange}
              placeholder="Conta"
            />
            {errors.conta && <span className="error">{errors.conta}</span>}

            <input
              name="status"
              value={form.status}
              onChange={handleChange}
              placeholder="Status"
            />
            {errors.status && <span className="error">{errors.status}</span>}

            <input
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              placeholder="Categoria"
            />
            {errors.categoria && (
              <span className="error">{errors.categoria}</span>
            )}

            <input
              name="valor"
              value={form.valor}
              onChange={handleChange}
              placeholder="Valor"
            />
            {errors.valor && <span className="error">{errors.valor}</span>}

            <input
              name="vencimento"
              type="date"
              value={form.vencimento}
              onChange={handleChange}
              placeholder="Vencimento"
            />
            {errors.vencimento && (
              <span className="error">{errors.vencimento}</span>
            )}

            <div className="popup-actions">
              <button onClick={handleSubmit}>
                {isEditMode ? "Atualizar" : "Salvar"}
              </button>
              <button onClick={() => setIsPopupOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPlan;
