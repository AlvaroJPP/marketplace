
'use client';
import { useEffect, useState, useMemo } from 'react';
import api from '@/service/api';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const [produtos, setProdutos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    api.get('/products/')
      .then((res) => setProdutos(res.data))
      .catch((err) => console.error('Erro ao buscar produtos:', err));
  }, []);

  // Filtra apenas produtos que ainda não foram comprados
  const produtosNaoComprados = useMemo(() => {
    return produtos.filter(p => !p.purchased_by || p.purchased_by.length === 0);
  }, [produtos]);

  // Seleciona 5 produtos aleatórios entre os que não foram comprados
  const produtosAleatorios = useMemo(() => {
    const embaralhados = [...produtosNaoComprados].sort(() => Math.random() - 0.5);
    return embaralhados.slice(0, 5);
  }, [produtosNaoComprados]);

  return (
    <div className={styles.container}>
      {/* Banner */}
      <div className={styles.banner}></div>

      {/* Categorias */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Categorias</h2>
        <div className={styles.gridCategorias}>
          {['Eletrônicos', 'Roupas', 'Livros', 'Beleza', 'Móveis', 'Esportes'].map((cat, i) => (
            <div key={i} className={styles.categoriaItem}>
              {cat}
            </div>
          ))}
        </div>
      </section>

      {/* Produtos em destaque */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Produtos em destaque</h2>
        <div className={styles.gridProdutos}>
          {produtosAleatorios.map((product) => {
            const imageUrl = product.image?.startsWith('http')
              ? product.image
              : `http://localhost:8000${product.image}`;

            return (
              <div key={product.id} className={styles.produtoCard}>
                <img src={imageUrl} alt={product.name} className={styles.produtoImagem} />
                <h3 className={styles.produtoNome}>{product.name}</h3>
                <p className={styles.produtoPreco}>R$ {Number(product.price).toFixed(2)}</p>
                <button
                  className={styles.botaoComprar}
                  onClick={() => router.push(`/produto/${product.id}`)}
                >
                  Comprar
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Novidades */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Novidades</h2>
        <div className={styles.novidades}>
          <div className={styles.novidadeItem}>
            <h3>Smartwatch XYZ</h3>
            <p>Agora você pode monitorar sua saúde de forma inteligente.</p>
          </div>
          <div className={styles.novidadeItem}>
            <h3>Smartphone Z9</h3>
            <p>O novo Z9 chegou para revolucionar seu dia a dia!</p>
          </div>
        </div>
      </section>

      {/* Carrossel de Imagens */}

      {/* Depoimentos */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Depoimentos de Clientes</h2>
        <div className={styles.depoimentos}>
          <div className={styles.depoimento}>
            <img src="https://a-static.mlcdn.com.br/800x560/fone-de-ouvido-bluetooth-sem-fio-headset-anti-ruido-original-inova/shop-aquarela/md-950bt-pto/ca4a0c34d2f4e4873427708ff158caeb.jpeg" alt="Fone de Ouvido XYZ" className={styles.produtoImg} />
            <div>
              <h3 className={styles.produtoNome}>Fone de Ouvido XYZ</h3>
              <p>"A qualidade do som é incrível! Recomendo muito esse fone."</p>
              <span className={styles.clienteNome}>– Ana Souza</span>
            </div>
          </div>
          <div className={styles.depoimento}>
            <img src="https://a-static.mlcdn.com.br/800x560/talvez-a-sua-jornada-agora-seja-so-sobre-voce-planeta-pop/vitrola/130447p/2a3e4e6f575ae72cced0523d8425f8f2.jpeg" alt="Livro 'A Jornada'" className={styles.produtoImg} />
            <div>
              <h3 className={styles.produtoNome}>Livro "A Jornada"</h3>
              <p>"Uma leitura envolvente do início ao fim. Chegou super rápido."</p>
              <span className={styles.clienteNome}>– João Pereira</span>
            </div>
          </div>
        </div>
      </section>

      {/* Promoções */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Promoções</h2>
        <div className={styles.promocoes}>
          <div className={styles.promocao}>
            <h3>Desconto de 10% em eletrônicos</h3>
            <p>Use o código ELETRONIC10 na sua compra.</p>
          </div>
          <div className={styles.promocao}>
            <h3>Frete grátis para compras acima de R$ 200,00</h3>
            <p>Não perca essa oportunidade! Frete grátis para todo o Brasil.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;