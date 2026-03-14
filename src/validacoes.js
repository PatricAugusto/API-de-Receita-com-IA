const validarBodyReceitas = (body) => {
  const erros = [];

  // Verifica se ingredientes existe e é array
  if (!body.ingredientes || !Array.isArray(body.ingredientes)) {
    erros.push('O campo "ingredientes" é obrigatório e deve ser um array.');
  } else {
    // Verifica se o array não está vazio
    if (body.ingredientes.length === 0) {
      erros.push('Informe ao menos um ingrediente.');
    }

    // Verifica se todos os itens são strings não vazias
    const invalidos = body.ingredientes.filter(
      (i) => typeof i !== 'string' || i.trim() === ''
    );
    if (invalidos.length > 0) {
      erros.push('Todos os ingredientes devem ser textos não vazios.');
    }

    // Limite de ingredientes
    if (body.ingredientes.length > 20) {
      erros.push('Informe no máximo 20 ingredientes por vez.');
    }
  }

  // Valida filtro opcional
  const filtrosPermitidos = ['vegetariano', 'vegano', 'sem glúten', 'sem lactose'];
  if (body.filtro && !filtrosPermitidos.includes(body.filtro)) {
    erros.push(`Filtro inválido. Use um dos seguintes: ${filtrosPermitidos.join(', ')}.`);
  }

  // Valida quantidade de receitas opcional
  if (body.quantidade !== undefined) {
    if (!Number.isInteger(body.quantidade) || body.quantidade < 1 || body.quantidade > 5) {
      erros.push('O campo "quantidade" deve ser um número inteiro entre 1 e 5.');
    }
  }

  return erros;
};

module.exports = { validarBodyReceitas };