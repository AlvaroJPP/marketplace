const Purchased = () => {
    const purchases = []; // Carregar os produtos comprados
  
    return (
      <div className="purchased">
        <h1>Produtos Comprados</h1>
        {purchases.length > 0 ? (
          purchases.map((purchase) => (
            <div key={purchase.id}>
              <h3>{purchase.productName}</h3>
              <p>Vendido por: {purchase.sellerName}</p>
              <p>Data da compra: {purchase.date}</p>
            </div>
          ))
        ) : (
          <p>Você ainda não comprou nenhum produto.</p>
        )}
      </div>
    );
  };
  
  export default Purchased;
  