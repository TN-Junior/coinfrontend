import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import "./Empresa.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdEditNote } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";

const Empresa = () => {
  const [empresas, setEmpresas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [filtroSituacao, setFiltroSituacao] = useState("Todas");
  const [formValues, setFormValues] = useState({
    cnpj: "",
    nome: "",
    situacaoCadastral: "Ativa",
  });
  const [errors, setErrors] = useState({});

  const filtrarEmpresas = (empresas, filtro) => {
    if (filtro === "Todas") {
      return empresas;
    }
    return empresas.filter(
      (empresa) =>
        empresa.situacaoCadastral.toLowerCase() === filtro.toLowerCase()
    );
  };

  useEffect(() => {
    axios
      .get("https://coin-backend-production-5d52.up.railway.app/api/empresas")
      .then((response) => {
        setEmpresas(response.data);
      })
      .catch((error) => {
        console.error("Houve um erro ao buscar os dados das empresas:", error);
      });
  }, []);

  const openModal = (empresa = null) => {
    if (empresa) {
      setEditMode(true);
      setSelectedEmpresa(empresa);
      setFormValues({
        cnpj: empresa.cnpj,
        nome: empresa.nome,
        situacaoCadastral: empresa.situacaoCadastral,
      });
    } else {
      setEditMode(false);
      setFormValues({
        cnpj: "",
        nome: "",
        situacaoCadastral: "Ativa", 
      });
    }
    setModalOpen(true);
    setErrors({});
  };
  
  const closeModal = () => {
    setModalOpen(false);
    setSelectedEmpresa(null);
    setErrors({});
  };

  const formatCNPJ = (value) => {
    const cleanValue = value.replace(/\D/g, "");
    return cleanValue
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: name === "cnpj" ? formatCNPJ(value) : value,
    });
  };

  const isValidCNPJ = (cnpj) => {
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    return cnpjRegex.test(cnpj);
  };

  const validateFields = () => {
    const errors = {};

    if (!formValues.cnpj) {
      errors.cnpj = "O CNPJ é obrigatório.";
    } else if (!isValidCNPJ(formValues.cnpj)) {
      errors.cnpj = "Por favor, insira um CNPJ no formato XX.XXX.XXX/0001-XX.";
    }
    if (!formValues.nome.trim()) {
      errors.nome = "O nome da empresa é obrigatório.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateFields()) return;

    if (editMode && selectedEmpresa) {
      axios
        .put(
          `https://coin-backend-production-5d52.up.railway.app/api/empresas/${selectedEmpresa.id}`,
          formValues
        )
        .then((response) => {
          setEmpresas(
            empresas.map((emp) =>
              emp.id === selectedEmpresa.id ? response.data : emp
            )
          );
          closeModal();
        })
        .catch((error) => {
          console.error("Erro ao editar a empresa:", error);
        });
    } else {
      axios
        .post("https://coin-backend-production-5d52.up.railway.app/api/empresas", formValues)
        .then((response) => {
          setEmpresas([...empresas, response.data]);
          closeModal();
        })
        .catch((error) => {
          console.error("Erro ao criar a empresa:", error);
        });
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`https://coin-backend-production-5d52.up.railway.app/api/empresas/${id}`)
      .then(() => {
        setEmpresas(empresas.filter((empresa) => empresa.id !== id));
      })
      .catch((error) => {
        console.error("Erro ao excluir a empresa:", error);
      });
  };

  return (
    <>
      <div className="ContainerEmpresa">
        <Header />
        <div className="segundoContainer">
          <Sidebar />
          <div className="content">
            <div className="miniHeader">
              <h2>Empresas</h2>
              <div className="filter-container">
                <select
                  className="filter"
                  value={filtroSituacao}
                  onChange={(e) => setFiltroSituacao(e.target.value)}
                >
                  <option value="Todas">Todas</option>
                  <option value="Ativa">Ativa</option>
                  <option value="Inativa">Inativa</option>
                </select>
              </div>
              <button className="add-button" onClick={() => openModal()}>
                Adicionar Empresa
              </button>
            </div>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>CNPJ</th>
                  <th>Empresa</th>
                  <th>Situação Cadastral</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrarEmpresas(empresas, filtroSituacao).length > 0 ? (
                  filtrarEmpresas(empresas, filtroSituacao).map((empresa) => (
                    <tr key={empresa.id}>
                      <td>{empresa.cnpj}</td>
                      <td>{empresa.nome}</td>
                      <td>{empresa.situacaoCadastral}</td>
                      <td>
                        <button
                          className="editButton"
                          onClick={() => openModal(empresa)}
                        >
                          <MdEditNote />
                        </button>
                        <button
                          className="deleteButton"
                          onClick={() => handleDelete(empresa.id)}
                        >
                          <MdDeleteForever />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">Nenhuma empresa disponível.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="titleAddEdit">
              {editMode ? "Editar Empresa" : "Adicionar Empresa"}
            </h2>
            <form className="formGroup">
              <div>
                <label>CNPJ:</label>
                <input
                  type="text"
                  name="cnpj"
                  value={formValues.cnpj}
                  onChange={handleInputChange}
                />
                {errors.cnpj && <span className="error">{errors.cnpj}</span>}
              </div>
              <div>
                <label>Empresa:</label>
                <input
                  type="text"
                  name="nome"
                  value={formValues.nome}
                  onChange={handleInputChange}
                />
                {errors.nome && <span className="error">{errors.nome}</span>}
              </div>
              <div className="situacaoCadastral">
                <label>Situação Cadastral:</label>
                <select
                  className="selectAtiva"
                  name="situacaoCadastral"
                  value={formValues.situacaoCadastral}
                  onChange={handleInputChange}
                >
                  <option value="Ativa">Ativa</option>
                  <option value="Inativa">Inativa</option>
                </select>
              </div>
              <div className="form-actions">
                <button className="addBtn" type="button" onClick={handleSave}>
                  {editMode ? "Salvar Alterações" : "Adicionar Empresa"}
                </button>
                <button
                  className="cancelarBtn"
                  type="button"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Empresa;
