const OpenAI = require("openai");
const {validarBodyReceitas} = require('./validacoes');

const sugerirReceitas = async (req, res) => {
  try {
    const erros = validarBodyReceitas(req.body);
    if(erro.length > 0){
      return res.status(400).json({ erros });
    }

    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const { ingredientes, filtro, quantidade = 3 } = req.body;

    const listaIngredientes = ingredientes.map((i) => i.trim()).join(', ');

    const restricao = filtro ? `As receitas devem ser ${filtro}.` : '';

    // Prompt enviado para a OpenAI
    const prompt = `Você é um chef de cozinha experiente e criativo.
    O usuário tem os seguintes ingredientes disponíveis: ${listaIngredientes}.
    Sugira 3 receitas práticas que podem ser feitas com esses ingredientes.
    Para cada receita, forneça:
    1. Nome da receita
    2. Ingredientes necessários (destacando quais o usuário já tem)
    3. Modo de preparo passo a passo
    4. Tempo estimado de preparo
    Responda em português brasileiro de forma clara e organizada.`;

    const resposta = await client.chat.completions.create({
      model: "gpt-4o-mini", // modelo mais econômico e muito capaz
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.7, // criatividade moderada
    });

    const receitas = resposta.choices[0].message.content;

    return res.status(200).json({
      ingredientes_informados: ingredientes,
      filtro: filtro || null,
      quantidade_solicitada: quantidade,
      receitas,
    });
  } catch (erro) {
    // Erro especifico de auth da OpenAi
    if(erro.status === 401){
      return res.status(500).json({
        erro: 'Chave da OpenAi inválida ou expirada. Verifique o arquivo .env.',
      });
    }

    if(erro.status === 429){
      return res.status(429).json({
        erro: 'Limite de requisições da OpenAi atingido. Tente novamente em instantes.',
      }); 
    }

    console.error('Error ao chamar a OpenAI:', erro.message);
    return res.status(500).json({
      erro: 'Erro interno ao gerar receitas. Tente Novamente',
    });
  }
};

module.exports = { sugerirReceitas };
