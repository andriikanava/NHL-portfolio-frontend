import React, { useContext, useState } from "react";
import "./register.css";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Для редиректа

function RegisterForm() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1️⃣ Регистрация
      await api.post("/portfolio/users/", { username, email, password });

      // 2️⃣ Логин
      await login(email, password);

      // 3️⃣ Редирект на главную
      navigate("/");

    } catch (err) {
      // Обработка ошибок
      console.error(err.response?.data || err.message);
      setError(
        err.response?.data?.email?.[0] ||
        err.response?.data?.password?.[0] ||
        "Registration error"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
    <input
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      required
    />
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
    <button type="submit">Register</button>

    {error && <div className="register-error">{error}</div>}
  </form>

  );
}

export default RegisterForm;
