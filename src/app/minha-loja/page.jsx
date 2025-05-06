'use client';
import styles from './MinhaLoja.module.css'; // Importando o CSS Módulo
import ProdutoPopup from '@/components/ProdutoPopup'; // Componente para editar produto
import api from '@/service/api';
import { useEffect, useState, useCallback } from 'react';

const MinhaLoja = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [usuarioLogado, setUsuarioLogado] = useState(null); // ID do usuário logado

  // Função para buscar produtos
  const fetchProdutos = useCallback(async () => {
    try {
      const response = await api.get('/products/');
      setProdutos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar os produtos:', error);
      setLoading(false);
    }
  }, []);

  // Função para buscar o usuário logado
  const fetchUsuarioLogado = useCallback(async () => {
    try {
      const response = await api.get('/users/');  // Ajuste para o endpoint correto que retorna o usuário logado
      setUsuarioLogado(response.data.id);
    } catch (error) {
      console.error('Erro ao carregar o usuário logado:', error);
    }
  }, []);

  useEffect(() => {
    fetchProdutos();
    fetchUsuarioLogado();
  }, [fetchProdutos, fetchUsuarioLogado]);

  const handleEditarProduto = useCallback((produto) => {
    setProdutoEditando(produto);
  }, []);

  const handleFecharPopup = () => {
    setProdutoEditando(null);
  };

  const handleSalvarAlteracoes = useCallback(async (novoNome, novaDescricao, novaImagem) => {
    try {
      const dadosAtualizados = {};
  
      // Verifica se algum campo foi alterado
      if (novoNome !== produtoEditando.name) {
        dadosAtualizados.name = novoNome;
      }
      if (novaDescricao !== produtoEditando.description) {
        dadosAtualizados.description = novaDescricao;
      }
  
      // Se a imagem foi alterada, adiciona ao FormData
      if (novaImagem && novaImagem !== produtoEditando.image) {
        dadosAtualizados.image = novaImagem;
      }
  
      // Se houve alguma alteração, envia a requisição PUT
      if (Object.keys(dadosAtualizados).length > 0) {
        const formData = new FormData();
        
        // Adiciona os dados ao FormData
        for (let key in dadosAtualizados) {
          formData.append(key, dadosAtualizados[key]);
        }
  
        console.log("Dados enviados:", dadosAtualizados);
  
        // Envia os dados com a imagem para o backend
        const response = await api.put(`/products/${produtoEditando.id}/update_product/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',  // Informando que estamos enviando um formulário com arquivos
          },
        });
  
        // Atualiza a lista de produtos com as alterações
        setProdutos(produtos.map((produto) =>
          produto.id === produtoEditando.id
            ? { ...produto, ...dadosAtualizados }
            : produto
        ));
  
        // Fecha o popup após a edição
        handleFecharPopup();
      } else {
        console.log('Nenhuma alteração detectada!');
      }
    } catch (error) {
      console.error('Erro ao salvar as alterações do produto:', error);
    }
  }, [produtoEditando, produtos]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  // Separando os produtos em categorias
  const produtosNaoVendidos = produtos.filter(produto => !produto.purchased_by || produto.purchased_by.length === 0);
  const produtosVendidos = produtos.filter(produto => produto.purchased_by && produto.purchased_by.length > 0);

  return (
    <div className={styles.lojaContainer}>
      {/* Coluna da esquerda: Produtos não vendidos */}
      <div className={styles.colunaEsquerda}>
        <div className={styles.produtosCategoria}>
          <h2 className={styles.subtitulo}>Produtos Não Vendidos</h2>
          <div className={styles.produtosLista}>
            {produtosNaoVendidos.map(produto => (
              <div key={produto.id} className={styles.produtoCard}>
                <img className={styles.imagemProduto} src={produto.image} alt={produto.name} />
                <h3 className={styles.nomeProduto}>{produto.name}</h3>
                <p className={styles.descricaoProduto}>{produto.description}</p>
                <p className={styles.precoProduto}>R$ {produto.price}</p>
                {/* Mostrar botão de editar apenas para produtos não vendidos */}
                <button 
                  className={styles.botaoEditar} 
                  onClick={() => handleEditarProduto(produto)} >
                    Editar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coluna da direita: Produtos vendidos */}
      <div className={styles.colunaDireita}>
        <div className={styles.produtosCategoria}>
          <h2 className={styles.subtitulo}>Produtos Vendidos</h2>
          <div className={styles.produtosLista}>
            {produtosVendidos.map(produto => (
              <div key={produto.id} className={styles.produtoCard}>
                <img className={styles.imagemProduto} src={produto.image} alt={produto.name} />
                <h3 className={styles.nomeProduto}>{produto.name}</h3>
                <p className={styles.descricaoProduto}>{produto.description}</p>
                <p className={styles.precoProduto}>R$ {produto.price}</p>
                {/* Não mostrar botão de editar para produtos vendidos */}
              </div>
            ))}
          </div>
        </div>
      </div>
  
      {/* Popup de edição */}
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

export default MinhaLoja;
