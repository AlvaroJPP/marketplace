'use client';

import React, { useState } from 'react';
import ProdutoPopup from '@/components/ProdutoPopup';
import styles from './MeusProdutos.module.css'; // Corrigido para usar o CSS Module

const MeusProdutos = () => {
  const [produtos, setProdutos] = useState([
    {
      id: 1,
      nome: 'Smartphone ABC',
      preco: 1299.99,
      imagem: 'https://http2.mlstatic.com/D_NQ_NP_808550-MLU75292967345_032024-O.webp',
      descricao: 'Smartphone com excelente desempenho e câmeras de alta qualidade.',
    },
    {
      id: 2,
      nome: 'Camisa Casual',
      preco: 89.90,
      imagem: 'https://http2.mlstatic.com/D_NQ_NP_808550-MLU75292967345_032024-O.webp',
      descricao: 'Camisa casual confortável e de alta qualidade.',
    },
    {
      id: 3,
      nome: 'Camisa Casual',
      preco: 89.90,
      imagem: 'https://http2.mlstatic.com/D_NQ_NP_808550-MLU75292967345_032024-O.webp',
      descricao: 'Camisa casual confortável e de alta qualidade.',
    },
    {
      id: 4,
      nome: 'Camisa Casual',
      preco: 89.90,
      imagem: 'https://http2.mlstatic.com/D_NQ_NP_808550-MLU75292967345_032024-O.webp',
      descricao: 'Camisa casual confortável e de alta qualidade.',
    },
    {
      id: 5,
      nome: 'Camisa Casual',
      preco: 89.90,
      imagem: 'https://http2.mlstatic.com/D_NQ_NP_808550-MLU75292967345_032024-O.webp',
      descricao: 'Camisa casual confortável e de alta qualidade.',
    },
    {
      id: 6,
      nome: 'Camisa Casual',
      preco: 89.90,
      imagem: 'https://http2.mlstatic.com/D_NQ_NP_808550-MLU75292967345_032024-O.webp',
      descricao: 'Camisa casual confortável e de alta qualidade.',
    },
  ]);
  
  const [produtoEditando, setProdutoEditando] = useState(null);

  const handleEditarProduto = (produto) => {
    setProdutoEditando(produto);
  };

  const handleFecharPopup = () => {
    setProdutoEditando(null); // Fecha o pop-up
  };

  const handleSalvarAlteracoes = (novoNome, novaDescricao, novaImagem) => {
    setProdutos(produtos.map((produto) =>
      produto.id === produtoEditando.id
        ? { ...produto, nome: novoNome, descricao: novaDescricao, imagem: novaImagem }
        : produto
    ));
    handleFecharPopup(); // Fecha o pop-up após salvar
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Meus Produtos Criados</h1>

      <div className={styles.listaProdutos}>
        {produtos.map((produto) => (
          <div key={produto.id} className={styles.card}>
            <img src={produto.imagem} alt={produto.nome} className={styles.imagem} />
            <div className={styles.info}>
              <h2 className={styles.nome}>{produto.nome}</h2>
              <p className={styles.descricao}>{produto.descricao}</p>
              <button className={styles.botaoEditar} onClick={() => handleEditarProduto(produto)}>Editar</button>
            </div>
          </div>
        ))}
      </div>

      {produtoEditando && (
        <ProdutoPopup
          produto={produtoEditando}
          onClose={handleFecharPopup}
          onSave={handleSalvarAlteracoes}
        />
      )}
    </div>
  );
};

export default MeusProdutos;
