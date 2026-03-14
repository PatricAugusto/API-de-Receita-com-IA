# 🍽️ API de Receitas com IA

API REST desenvolvida com Node.js e Express que utiliza a inteligência artificial da OpenAI para sugerir receitas com base nos ingredientes que o usuário tem disponíveis.

## 🚀 Tecnologias utilizadas

- **Node.js** — ambiente de execução JavaScript
- **Express** — framework para criação do servidor e rotas
- **OpenAI API** — IA para geração das receitas (modelo gpt-4o-mini)
- **dotenv** — gerenciamento seguro de variáveis de ambiente

## 📁 Estrutura do projeto
```
api-receitas/
├── src/
│   ├── server.js              # Ponto de entrada, configuração do servidor
│   ├── routes.js              # Definição das rotas da API
│   ├── receitaController.js   # Lógica de negócio e integração com OpenAI
│   └── validacoes.js          # Regras de validação das requisições
├── .env                       # Variáveis de ambiente (não versionado)
├── .gitignore
├── package.json
└── README.md
```

## ⚙️ Como rodar o projeto localmente

### Pré-requisitos

- Node.js v18 ou superior
- Uma chave de API da OpenAI ([obter aqui](https://platform.openai.com/api-keys))

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/api-receitas.git
cd api-receitas
```

2. Instale as dependências:
```bash
npm install
```

3. Crie o arquivo `.env` na raiz do projeto:
```env
OPENAI_API_KEY=sk-sua-chave-aqui
PORT=3000
```

4. Inicie o servidor:
```bash
node src/server.js
```

O servidor estará disponível em `http://localhost:3000`.

## 📡 Endpoints

### `GET /`
Verifica se a API está rodando.

**Resposta:**
```json
{
  "mensagem": "🍽️ API de Receitas com IA está rodando!"
}
```

---

### `POST /api/receitas`
Gera sugestões de receitas com base nos ingredientes informados.

**URL:** `http://localhost:3000/api/receitas`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**

| Campo          | Tipo     | Obrigatório | Descrição                                              |
|----------------|----------|-------------|--------------------------------------------------------|
| `ingredientes` | array    | ✅ Sim      | Lista de ingredientes disponíveis (máx. 20)            |
| `filtro`       | string   | ❌ Não      | Restrição alimentar (ver opções abaixo)                |
| `quantidade`   | number   | ❌ Não      | Quantidade de receitas sugeridas, entre 1 e 5 (padrão: 3) |

**Filtros disponíveis:**
- `vegetariano`
- `vegano`
- `sem glúten`
- `sem lactose`

---

## 📋 Exemplos de uso

### Requisição básica
```json
{
  "ingredientes": ["ovo", "farinha", "leite", "manteiga"]
}
```

### Requisição com filtro e quantidade
```json
{
  "ingredientes": ["tomate", "abobrinha", "alho", "azeite"],
  "filtro": "vegano",
  "quantidade": 2
}
```

### Resposta de sucesso `200`
```json
{
  "ingredientes_informados": ["ovo", "farinha", "leite"],
  "filtro": null,
  "quantidade_solicitada": 3,
  "receitas": "1. Panqueca Simples\n\nIngredientes: ..."
}
```

### Resposta de erro de validação `400`
```json
{
  "erros": [
    "Informe ao menos um ingrediente."
  ]
}
```

### Resposta de erro interno `500`
```json
{
  "erro": "Erro interno ao gerar receitas. Tente novamente."
}
```

## 🔒 Segurança

- A chave da OpenAI é armazenada em variável de ambiente e **nunca** versionada no Git
- O arquivo `.env` está listado no `.gitignore`
