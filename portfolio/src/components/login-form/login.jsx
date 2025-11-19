import React, { useContext, useState } from "react";
import "./login.css";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Для редиректа

function LoginForm() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
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
        err.response?.data["detail"]
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "10px", width: "300px" }}
    >
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
      <button type="submit">Login</button>
      <a href="/register" class="register-btn">Register</a>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}

export default LoginForm;
