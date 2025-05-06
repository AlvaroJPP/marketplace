import { useState } from 'react';
import styles from '@/styles/ProdutoPopup.module.css'; 
const ProdutoPopup = ({ produto, onClose, onSave }) => {
  const [novoNome, setNovoNome] = useState(produto?.name || '');  // Corrigido para 'name'
  const [novaDescricao, setNovaDescricao] = useState(produto?.description || ''); // Corrigido para 'description'
  const [novaImagem, setNovaImagem] = useState(produto?.image || '');  // Corrigido para 'image'

  const handleImagemChange = (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) {
      setNovaImagem(URL.createObjectURL(arquivo)); // Exibe a imagem em tempo real
    }
  };

  const handleSalvarAlteracoes = () => {
    onSave(novoNome, novaDescricao, novaImagem); // Passa as alterações para o componente pai
    onClose(); // Fecha o popup após salvar as alterações
  };

  const handleCancelarAlteracoes = () => {
    onClose(); // Fecha o popup sem salvar
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <h3 className={styles.popupTitle}>Editar Produto</h3>

        <div className={styles.inputGroup}>
          <label>Nome do Produto:</label>
          <input
            type="text"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Descrição:</label>
          <textarea
            value={novaDescricao}
            onChange={(e) => setNovaDescricao(e.target.value)}
            className={styles.textarea}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Imagem:</label>
          <input
            type="file"
            onChange={(e) => setNovaImagem(e.target.files[0])}
            accept="image/*"
            className={styles.input}
          />
          {novaImagem && (
            <div className={styles.previewImageContainer}>
              <img
                src={novaImagem}
                alt="Pré-visualização da imagem"
                className={styles.previewImage}
              />
            </div>
          )}
        </div>

        <div className={styles.buttonsContainer}>
          <button onClick={handleSalvarAlteracoes} className={styles.saveButton}>Salvar</button>
          <button onClick={handleCancelarAlteracoes} className={styles.cancelButton}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};
export default ProdutoPopup; // Garantir que é uma exportação default