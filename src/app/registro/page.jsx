'use client';
import { useState } from "react";
import api from '@/service/api.js'; // Importe o axios configurado
import styles from './Registro.module.css';

export default function RegistroPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [foto, setFoto] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [statusMessage, setStatusMessage] = useState(""); // Estado para a mensagem de status

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFoto(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setFoto(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("role", formData.role);
  
    // Verifique se a foto está sendo corretamente anexada
    if (foto) {
      formDataToSend.append("profile_picture", foto);
    }
  
    try {
      const response = await api.post("/users/", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",  // Certifique-se que está usando multipart/form-data
        },
      });
      console.log("Usuário registrado com sucesso:", response.data);
      setStatusMessage("Usuário registrado com sucesso!"); // Exibe a mensagem de sucesso
    } catch (error) {
      console.error("Erro ao registrar:", error.response ? error.response.data : error);
      setStatusMessage("Erro ao registrar, tente novamente."); // Exibe a mensagem de erro
    }
  };

  return (
    <div className={styles.registroWrapper}>
      <div className={styles.registroContainer}>
        <h1>Registrar</h1>
        <form onSubmit={handleSubmit} className={styles.registroForm}>
          <input
            type="text"
            name="name"
            placeholder="Nome completo"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Seu e-mail"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="user">Usuário (comprador)</option>
            <option value="seller">Vendedor</option>
          </select>

          {/* Drag and Drop de Imagem */}
          <div
            className={`${styles.dropzone} ${dragOver ? styles.dragover : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {foto ? (
              <p>📷 Foto selecionada: {foto.name}</p>
            ) : (
              <p>Arraste uma foto aqui ou clique para selecionar</p>
            )}

            {/* Usando o label para estilizar o botão de arquivo */}
            <label htmlFor="fileInput" className={styles.fileInputLabel}>
              Selecione ou arraste uma foto
            </label>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.fileInput} // Adicione uma classe para estilizar o input de arquivo
              style={{ display: 'none' }} // Esconde o input de arquivo original
            />
          </div>

          <button type="submit" className={styles.registroButton}>
            Registrar
          </button>
        </form>

        {/* Mensagem de Status */}
        {statusMessage && (
          <div className={styles.statusMessage}>
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
}
