'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from './Produto.module.css';
import api from '@/service/api';

export default function Produto() {
  const params = useParams();
  const id = params.id;

  const [produto, setProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await api.get(`/products/${id}/`);
        setProduto(response.data);
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      }
    };

    fetchProduto();
  }, [id]);

  const handleQuantidadeChange = (e) => {
    const val = Math.max(1, Math.min(parseInt(e.target.value) || 1, produto.quantity));
    setQuantidade(val);
  };

  const handleAdicionarAoCarrinho = async () => {
    try {
      await api.post('/users/adicionar-ao-carrinho/', {
        product_id: produto.id, // CORRETO: campo esperado no back-end
      });

      alert(`Adicionado ${quantidade} unidade(s) do produto ${produto.name} ao carrinho!`);
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      alert("Erro ao adicionar ao carrinho");
    }
  };

  if (!produto) {
    return <div className={styles['not-found']}>Produto não encontrado.</div>;
  }

  const price = parseFloat(produto.price) || 0;

  return (
    <div className={styles['produto-wrapper']}>
      <div className={styles['produto-container']}>
        <div className={styles['produto-imagem-container']}>
          <img
            src={produto.image || '/imagem-padrao.jpg'}
            alt={produto.name}
            className={styles['produto-imagem']}
          />
        </div>

        <div className={styles['produto-detalhes']}>
          <h1 className={styles['produto-nome']}>{produto.name}</h1>
          <p className={styles['produto-preco']}>R$ {price.toFixed(2)}</p>
          <p className={styles['produto-descricao']}>{produto.description}</p>

          <div className={styles['produto-estoque']}>
            <label htmlFor="quantidade">Quantidade:</label>
            <input
              type="number"
              id="quantidade"
              value={quantidade}
              min="1"
              max={produto.quantity}
              onChange={handleQuantidadeChange}
              className={styles['quantidade-input']}
            />
            <p className={styles['estoque-disponivel']}>{produto.quantity} em estoque</p>
          </div>

          <div className={styles['produto-vendedor']}>
            <span className={styles['vendedor-nome']}>{produto.created_by.username}</span>
            <p className={styles['vendedor-email']}>{produto.created_by.email}</p>
          </div>

          <div className={styles['produto-actions']}>
            <button className={styles['btn-carrinho']} onClick={handleAdicionarAoCarrinho}>
              Adicionar ao carrinho
            </button>
            <button className={styles['btn-comprar']}>Comprar agora</button>
          </div>
        </div>
      </div>
    </div>
  );
}
