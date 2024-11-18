import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";
import axios from "axios";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [emailTouched, setEmailTouched] = useState(false); // Novo estado para saber se o campo foi tocado
  const [passwordTouched, setPasswordTouched] = useState(false); // Novo estado para saber se o campo foi tocado
  const navigate = useNavigate();

  // Animação de queda
  const springProps = useSpring({
    from: { transform: "translateY(-100%)" },
    to: { transform: "translateY(0%)" },
    config: { tension: 170, friction: 20 },
  });

  // Função de validação de email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|br)$/; // Verifica domínios comuns
    return emailRegex.test(email);
  };

  // Função de validação da senha
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Função para atualizar e validar o campo de email em tempo real
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailTouched(true); // Marca que o campo foi tocado

    if (value && !validateEmail(value)) {
      setEmailValid(false); // Email é inválido
    } else {
      setEmailValid(true); // Email é válido ou o campo está vazio
    }
  };

  // Função para atualizar e validar o campo de senha em tempo real
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordTouched(true); // Marca que o campo foi tocado

    if (value && !validatePassword(value)) {
      setPasswordValid(false); // Senha é inválida
      setPasswordError("A senha deve ter pelo menos 6 caracteres.");
    } else {
      setPasswordValid(true); // Senha é válida ou o campo está vazio
      setPasswordError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("https://auth-coin.onrender.com/auth/login", {
        email,
        password,
      });

      console.log("Login bem-sucedido:", response.data);

      localStorage.setItem("token", response.data.token);
      navigate(response.data.redirect_url);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError(error.response.data.message);
      } else {
        setError("Erro ao se conectar com o servidor. Tente novamente mais tarde.");
      }
      console.error("Erro ao fazer login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <h1 className="coin-title">Coin</h1>
      <animated.div style={springProps} className="login-content">
        <div className="login-box">
          <form className="formm" onSubmit={handleLogin}>
            <div>
              <input
                className={`emailinput ${emailTouched && email ? (emailValid ? "input-success" : "input-error") : ""}`}
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => setEmailTouched(true)} // Marca o campo como tocado quando o usuário sai dele
              />
            </div>
            <div>
              <input
                className={`password-input ${passwordTouched && password ? (passwordValid ? "input-success" : "input-error") : ""}`}
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => setPasswordTouched(true)} // Marca o campo como tocado quando o usuário sai dele
              />
              {passwordTouched && passwordError && <div className="error-message">{passwordError}</div>}
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                "Entrar"
              )}
            </button>
            <div className="forgot-password">
              <a href="/forgot-password" className="forgot-password-link">
                Esqueci a senha
              </a>
              <a className="signup-link" href="/signup">Cadastre-se agora</a>
            </div>
          </form>
        </div>
      </animated.div>
    </div>
  );
}

export default Login;
