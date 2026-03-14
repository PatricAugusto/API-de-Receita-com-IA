const express = require('express');
const router = express.Router();
const { sugerirReceitas } = require('./receitaController');

// POST /api/receitas
// Body: { "ingredientes": ["ovo", "farinha", "leite"] }
router.post('/receitas', sugerirReceitas);

module.exports = router;