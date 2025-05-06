const axios = require('axios');

const produtos = [
  {
    "name": "Fone Bluetooth Inova",
    "price": 99.90,
    "description": "Fone de ouvido sem fio com cancelamento de ruído.",
    "image": "/media/fone-bluetooth.jpg"
  },
  {
    "name": "Smartwatch Fitness",
    "price": 149.90,
    "description": "Monitora batimentos, passos e qualidade do sono.",
    "image": "/media/smartwatch.jpg"
  },
  {
    "name": "Smartphone XYZ",
    "price": 799.99,
    "description": "Smartphone com câmera de alta definição e processador rápido.",
    "image": "/media/smartphone-xyz.jpg"
  },
  {
    "name": "Camiseta Estampada",
    "price": 49.90,
    "description": "Camiseta de algodão com estampa exclusiva.",
    "image": "/media/camiseta-estampada.jpg"
  },
  {
    "name": "Tênis Esportivo",
    "price": 189.90,
    "description": "Tênis confortável e de alta performance para atividades físicas.",
    "image": "/media/tenis-esportivo.jpg"
  },
  {
    "name": "Cadeira Gamer",
    "price": 499.90,
    "description": "Cadeira ergonômica ideal para longas horas de jogo.",
    "image": "/media/cadeira-gamer.jpg"
  },
  {
    "name": "Monitor LED 24\"",
    "price": 699.90,
    "description": "Monitor com resolução Full HD e taxa de atualização rápida.",
    "image": "/media/monitor-led.jpg"
  },
  {
    "name": "Kit de Maquiagem",
    "price": 120.00,
    "description": "Kit completo para maquiagem com produtos de alta qualidade.",
    "image": "/media/kit-maquiagem.jpg"
  },
  {
    "name": "Fone de Ouvido Sem Fio",
    "price": 299.90,
    "description": "Fone de ouvido sem fio com cancelamento de ruído.",
    "image": "/media/fone-sem-fio.jpg"
  },
  {
    "name": "Luminária LED",
    "price": 59.90,
    "description": "Luminária compacta com luz LED e regulagem de intensidade.",
    "image": "/media/luminaria-led.jpg"
  },
  {
    "name": "Mochila de Notebook",
    "price": 179.90,
    "description": "Mochila resistente e espaçosa para carregar seu notebook e acessórios.",
    "image": "/media/mochila-notebook.jpg"
  },
  {
    "name": "Relógio Digital",
    "price": 89.90,
    "description": "Relógio digital com design moderno e resistência à água.",
    "image": "/media/relogio-digital.jpg"
  },
  {
    "name": "Cadeira de Escritório",
    "price": 350.00,
    "description": "Cadeira confortável para o escritório com apoio lombar.",
    "image": "/media/cadeira-escritorio.jpg"
  },
  {
    "name": "Cafeteira Elétrica",
    "price": 159.90,
    "description": "Cafeteira elétrica com capacidade para até 12 xícaras.",
    "image": "/media/cafeteira.jpg"
  },
  {
    "name": "Projetor Full HD",
    "price": 899.90,
    "description": "Projetor portátil com resolução Full HD e compatibilidade com vários dispositivos.",
    "image": "/media/projetor-full-hd.jpg"
  }
];

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ2NTA3MTkxLCJpYXQiOjE3NDY1MDM1OTEsImp0aSI6IjZmY2NjNmQ1OWVmZjQwYjI5ODRiZTQyMzU5YmI0MzgwIiwidXNlcl9pZCI6Mn0.R0xyvZYXa2NydG6ywiTUJ3BBzwienjIbSHdbjpY-fAI';

async function enviarProdutos() {
  for (const produto of produtos) {
    try {
      const response = await axios.post('http://localhost:8000/products/', produto, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Produto criado:', response.data.name);
    } catch (error) {
      console.error('Erro ao criar produto:', produto.name, error.response?.data);
    }
  }
}

enviarProdutos();
