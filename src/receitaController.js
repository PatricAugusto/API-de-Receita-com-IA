const Groq = require('groq-sdk');
const { validarBodyReceitas } = require('./validacoes');

const sugerirReceitas = async (req, res) => {
  try {
    const erros = validarBodyReceitas(req.body);
    if (erros.length > 0) {
      return res.status(400).json({ erros });
    }

    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const { ingredientes, filtro, quantidade = 3 } = req.body;

    const listaIngredientes = ingredientes
      .map((i) => i.trim())
      .join(', ');

    const restricao = filtro ? `As receitas devem ser ${filtro}.` : '';

    const prompt = `Voce e um chef de cozinha experiente e criativo.
    O usuario tem os seguintes ingredientes disponiveis: ${listaIngredientes}.
    ${restricao}
    Sugira ${quantidade} receitas praticas que podem ser feitas com esses ingredientes.
    Para cada receita, forneca:
    1. Nome da receita
    2. Ingredientes necessarios (destacando quais o usuario ja tem)
    3. Modo de preparo passo a passo
    4. Tempo estimado de preparo
    5. Nivel de dificuldade (facil, medio ou dificil)
    Responda em portugues brasileiro de forma clara e organizada.`;

    const resposta = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const receitas = resposta.choices[0].message.content;

    return res.status(200).json({
      ingredientes_informados: ingredientes,
      filtro: filtro || null,
      quantidade_solicitada: quantidade,
      receitas,
    });

  } catch (erro) {
    console.error('Erro ao chamar o Groq:', erro.message);
    console.error('Status:', erro.status);

    if (erro.status === 401) {
      return res.status(500).json({
        erro: 'Chave do Groq invalida ou expirada. Verifique o arquivo .env.',
      });
    }

    if (erro.status === 429) {
      return res.status(429).json({
        erro: 'Limite de requisicoes do Groq atingido. Tente novamente em instantes.',
      });
    }

    return res.status(500).json({
      erro: 'Erro interno ao gerar receitas. Tente novamente.',
    });
  }
};

module.exports = { sugerirReceitas };