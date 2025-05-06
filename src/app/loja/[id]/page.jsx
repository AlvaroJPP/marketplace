'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use o hook do Next.js para navegação
import styles from './Vendedor.module.css';

// Dados de exemplo para os vendedores
export const vendedores = [
  {
    id: '1', // Este ID será igual ao do usuário
    nome: 'LojaTech',
    descricao: 'Loja especializada em produtos de tecnologia!',
    logo: 'https://osegredo.com.br/wp-content/uploads/2023/09/a3b952d943dffc98eff5f07101f7fe6c.jpg.webp', // Logo do usuário
    banner: '/images/banner.png',
    produtos: [
      { id: 1, nome: 'Smartphone XYZ', preco: 1200.0, imagem: '/images/produto1.png' },
      { id: 2, nome: 'Laptop ABC', preco: 2500.0, imagem: '/images/produto2.png' },
    ],
  },
  // Adicione outros vendedores conforme necessário
];

export default function LojaPage() {
  const router = useRouter();
  const { id } = router.query;  // Use o hook do Next.js para capturar o id da URL
  const [vendedor, setVendedor] = useState(null);
  const [userData, setUserData] = useState(null); // Para armazenar dados do usuário

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      const storedUserId = localStorage.getItem("userId");  // Recuperar ID do usuário
      const storedUserLogo = localStorage.getItem("userLogo");  // Recuperar logo do usuário

      setUserData({ id: storedUserId, logo: storedUserLogo });
    }
  }, []);

  useEffect(() => {
    if (id && userData) {
      if (id === userData.id) {
        const vendedorEncontrado = vendedores.find((v) => v.id === id);
        if (vendedorEncontrado) {
          setVendedor({
            ...vendedorEncontrado,
            logo: userData.logo, // A imagem do usuário será o logo do vendedor
          });
        }
      }
    }
  }, [id, userData]);

  if (!vendedor) return <div className={styles.loading}>Carregando loja...</div>;

  return (
    <section className={styles.container}>
      <div className={styles.bannerContainer}>
        <img src={vendedor.banner} alt={`${vendedor.nome} banner`} className={styles.banner} />
        <img src={vendedor.logo} alt={`${vendedor.nome} logo`} className={styles.logo} />
      </div>
      <header className={styles.header}>
        <h1 className={styles.titulo}>{vendedor.nome}</h1>
        <p className={styles.descricao}>{vendedor.descricao}</p>
      </header>

      <h2 className={styles.subtitulo}>Produtos Disponíveis</h2>
      <div className={styles.produtosContainer}>
        {vendedor.produtos.map((produto) => (
          <article key={produto.id} className={styles.cardProduto}>
            <img
              src={produto.imagem}
              alt={produto.nome}
              className={styles.imagemProduto}
            />
            <div className={styles.infoProduto}>
              <h3 className={styles.produtoNome}>{produto.nome}</h3>
              <p className={styles.produtoPreco}>R$ {produto.preco.toFixed(2)}</p>
              <button className={styles.botaoCompra}>Comprar</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
