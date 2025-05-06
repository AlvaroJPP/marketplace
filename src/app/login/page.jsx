"use client";
import { useState } from "react";
import api from "@/service/api";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/users/login/", formData);
      console.log(response.data); // Veja o que está vindo aqui
      const { access, user } = response.data;

      // Salvando token e dados do usuário
      localStorage.setItem("accessToken", access);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userRole", user.role);

      alert(`Bem-vindo, ${user.name}!`);

      // Redireciona para a home
      window.location.href = "/";
    } catch (err) {
      console.error("Erro ao fazer login:", err.response ? err.response.data : err);
      setError("Email ou senha inválidos.");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Senha:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
