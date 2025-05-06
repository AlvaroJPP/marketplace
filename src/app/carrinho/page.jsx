'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/service/api';
import styles from './Carrinho.module.css';

const CarrinhoPage = () => {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCarrinho = async () => {
      try {
        const response = await api.get('/users/get_cart/');
        setItens(response.data.cart); // Certifique-se de que 'cart' está correto
      } catch (error) {
        console.error('Erro ao buscar carrinho:', error);
        setError('Erro ao buscar carrinho. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchCarrinho();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  const calcularSubtotal = (item) => {
    const price = Number(item.price);
    const quantity = item.quantity ?? 1;
    return price * quantity;
  };

  const total = itens.reduce((acc, item) => acc + calcularSubtotal(item), 0);

  const handleFinalizarCompra = async () => {
    try {
      await api.post('/products/buy/', {
        ids: itens.map(item => item.id),
      });

      alert('Compra finalizada com sucesso!');
      router.push('/');
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      alert('Erro ao finalizar compra. Tente novamente.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Seu Carrinho</h1>

      <div className={styles.itens}>
        {itens.length > 0 ? (
          itens.map((item) => {
            const price = Number(item.price);
            const quantity = item.quantity ?? 1;

            // Lógica de URL da imagem unificada
            const imageUrl = item.image?.startsWith('http')
              ? item.image
              : `http://localhost:8000${item.image}`;

            return (
              <div key={item.id} className={styles.item}>
                <img src={imageUrl} alt={item.name} className={styles.imagem} />
                <div className={styles.info}>
                  <h3>{item.name}</h3>
                  <p>Quantidade: {quantity}</p>
                  <p>Preço unitário: R$ {price.toFixed(2)}</p>
                </div>
                <div className={styles.subtotal}>
                  <span>Subtotal:</span>
                  <strong>R$ {(price * quantity).toFixed(2)}</strong>
                </div>
              </div>
            );
          })
        ) : (
          <p>Seu carrinho está vazio.</p>
        )}
      </div>

      {itens.length > 0 && (
        <div className={styles.resumo}>
          <h2>Total: R$ {total.toFixed(2)}</h2>
          <button className={styles.botao} onClick={handleFinalizarCompra}>
            Finalizar Compra
          </button>
        </div>
      )}
    </div>
  );
};

export default CarrinhoPage;
