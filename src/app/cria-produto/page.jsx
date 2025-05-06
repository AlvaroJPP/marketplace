'use client';

import React, { useState } from 'react';
import styles from './CriarProduto.module.css';

const CriarProduto = () => {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [imagemPreview, setImagemPreview] = useState(null); // Para exibir no front
  const [imagemArquivo, setImagemArquivo] = useState(null); // Para enviar ao backend
  const [descricao, setDescricao] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("Você precisa estar logado.");
      return;
    }

    if (!imagemArquivo) {
      alert("Por favor, adicione uma imagem.");
      return;
    }

    const precoDecimal = parseFloat(preco).toFixed(2);

    const formData = new FormData();
    formData.append("name", nome);
    formData.append("price", Number(precoDecimal));
    formData.append("description", descricao);
    formData.append("image", imagemArquivo);

    try {
      const response = await fetch("http://localhost:8000/api/products/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Produto criado com sucesso:", data);
        alert("Produto criado com sucesso!");

        // Limpa o formulário
        setNome('');
        setPreco('');
        setDescricao('');
        setImagemPreview(null);
        setImagemArquivo(null);
      } else {
        const errData = await response.json();
        console.error("Erro ao criar produto:", errData);
        alert("Erro: " + (errData.detail || "Verifique os dados."));
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao enviar o produto.");
    }
  };

  const handleImagemChange = (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) {
      setImagemPreview(URL.createObjectURL(arquivo));
      setImagemArquivo(arquivo);
    }
  };

  const handleImagemRemover = () => {
    setImagemPreview(null);
    setImagemArquivo(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Criar Novo Produto</h1>
      <form className={styles.formulario} onSubmit={handleSubmit}>
        <div className={styles.campo}>
          <label htmlFor="nome">Nome do Produto:</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div className={styles.campo}>
          <label htmlFor="preco">Preço:</label>
          <input
            type="number"
            id="preco"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className={styles.campo}>
          <label>Imagem do Produto:</label>
          <div
            className={styles.dropZone}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) {
                setImagemPreview(URL.createObjectURL(file));
                setImagemArquivo(file);
              }
            }}
          >
            {imagemPreview && (
              <div className={styles.imagemPreviewContainer}>
                <img
                  src={imagemPreview}
                  alt="Imagem do Produto"
                  className={styles.imagemPreview}
                />
                <button
                  type="button"
                  onClick={handleImagemRemover}
                  className={styles.removerImagemBotao}
                >
                  Remover Imagem
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImagemChange}
              className={styles.inputArquivo}
            />
          </div>
        </div>

        <div className={styles.campo}>
          <label htmlFor="descricao">Descrição:</label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.botao}>Criar Produto</button>
      </form>
    </div>
  );
};

export default CriarProduto;
