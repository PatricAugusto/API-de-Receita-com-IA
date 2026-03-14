const OpenAI = require("openai");

const sugerirReceitas = async (req, res) => {
  try {
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const { ingredientes } = req.body;

    // Validação básica
    if (
      !ingredientes ||
      !Array.isArray(ingredientes) ||
      ingredientes.length === 0
    ) {
      return res.status(400).json({
        erro: 'Informe ao menos um ingrediente no campo "ingredientes" (array de strings).',
      });
    }

    const listaIngredientes = ingredientes.join(", ");

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
      max_tokens: 1500,
      temperature: 0.7, // criatividade moderada
    });

    const receitas = resposta.choices[0].message.content;

    return res.status(200).json({
      ingredientes_informados: ingredientes,
      receitas,
    });
  } catch (erro) {
    console.error("Erro ao chamar a OpenAI:", erro.message);
    return res.status(500).json({
      erro: "Erro interno ao gerar receitas. Tente novamente.",
    });
  }
};

module.exports = { sugerirReceitas };
