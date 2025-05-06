'use client';

import React, { useState, useEffect } from 'react';
import styles from './ClientLoja.module.css';

// Dados fictícios
const vendedores = [
  {
    id: '1',
    nome: 'LojaTech',
    descricao: 'Loja especializada em produtos de tecnologia!',
    produtos: [
      { id: 1, nome: 'Smartphone XYZ', preco: 1200.0, imagem: '/images/produto1.png' },
      { id: 2, nome: 'Laptop ABC', preco: 2500.0, imagem: '/images/produto2.png' },
    ],
  },
  {
    id: '2',
    nome: 'ModaExpress',
    descricao: 'Moda de alta qualidade para todos!',
    produtos: [
      { id: 3, nome: 'Camisa Casual', preco: 79.9, imagem: '/images/produto3.png' },
      { id: 4, nome: 'Jaqueta Jeans', preco: 199.9, imagem: '/images/produto4.png' },
    ],
  },
];

export default function ClientLoja({ vendedorId }) {
  const [vendedor, setVendedor] = useState(null);

  useEffect(() => {
    const v = vendedores.find((v) => v.id === vendedorId);
    setVendedor(v);
  }, [vendedorId]);

  if (!vendedor) return <div>Carregando...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>{vendedor.nome}</h1>
      <p className={styles.descricao}>{vendedor.descricao}</p>
      <h2 className={styles.subtitulo}>Produtos Disponíveis</h2>
      <div className={styles.produtosContainer}>
        {vendedor.produtos.map((p) => (
          <div key={p.id} className={styles.cardProduto}>
            <img src={p.imagem} alt={p.nome} className={styles.imagemProduto} />
            <div className={styles.infoProduto}>
              <h3>{p.nome}</h3>
              <p>R$ {p.preco.toFixed(2)}</p>
              <button className={styles.botaoCompra}>Comprar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
