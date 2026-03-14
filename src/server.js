const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Rotas
app.use('/api', routes);

// Rota raiz para confirmar que o servidor está vivo
app.get('/', (req, res) => {
  res.json({ mensagem: '🍽️ API de Receitas com IA está rodando!' });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});