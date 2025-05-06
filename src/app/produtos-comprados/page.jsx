'use client'
import React, { useEffect, useState } from 'react';
import styles from './Compras.module.css';
import api from '@/service/api';

const ProdutosComprados = ({ Id }) => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const response = await api.get('/users/minhas_compras/');
        setProdutos(response.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setErro('Não foi possível carregar os produtos.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompras();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (erro) return <p>{erro}</p>;
  if (produtos.length === 0) return <p>Nenhum produto comprado ainda.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Meus Produtos Comprados</h1>
      <div className={styles.lista}>
        {produtos.map((produto) => {
          const preco = parseFloat(produto.price);
          const precoFormatado = !isNaN(preco) ? preco.toFixed(2) : 'Preço inválido';
          const dataCompra = produto.created_at ? new Date(produto.created_at).toLocaleDateString() : 'Data não disponível';

          // Aqui usamos a mesma lógica da HomePage
          const imagemUrl = produto.image?.startsWith('http')
            ? produto.image
            : `http://localhost:8000${produto.image}`;

          return (
            <div key={produto.id} className={styles.card}>
              <img src={imagemUrl} alt={produto.name} className={styles.imagem} />
              <div className={styles.info}>
                <h2 className={styles.nome}>{produto.name}</h2>
                <p className={styles.preco}>R$ {precoFormatado}</p>
                <p className={styles.vendedor}>Vendedor: <strong>{produto.created_by}</strong></p>
                <p className={styles.data}>Comprado em: {dataCompra}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProdutosComprados;
