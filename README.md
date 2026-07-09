# Biblioteca - Front-end (Trabalho 2)

SPA em React que consome a API RESTful da biblioteca (Trabalho 1), permitindo login,
gerenciamento de livros e leitores, e controle de empréstimos.

## Tecnologias

- React + Vite
- React-Router DOM (rotas e rotas protegidas)
- Axios (consumo da API, com injeção automática do token JWT)
- Bootstrap 5 + Bootstrap Icons (interface responsiva)

## Funcionalidades

- **Autenticação**: login e cadastro de usuário, com token JWT armazenado e enviado
  automaticamente em todas as requisições autenticadas. Rotas internas são protegidas
  e redirecionam para `/login` caso o usuário não esteja autenticado.
- **Livros**: listagem em cards (com busca por título/autor), cadastro, edição, exclusão
  e upload de capa (imagem).
- **Leitores**: listagem em tabela, cadastro, edição e exclusão, com validação de e-mail.
- **Empréstimos**: listagem de todos os empréstimos, registro de novo empréstimo
  (selecionando livro disponível + leitor + data de devolução) e registro de devolução.

## Como rodar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Configure a URL da API no arquivo `.env` (já vem configurado para `http://localhost:3333`,
   que é a porta padrão da API do Trabalho 1):

   ```
   VITE_API_URL=http://localhost:3333
   ```

3. Certifique-se de que a API (back-end) esteja rodando.

4. Rode o front-end em modo desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse `http://localhost:5173`, crie uma conta e faça login para acessar o sistema.

## Estrutura do projeto

```
src/
├── components/   # Componentes reutilizáveis (Navbar, Layout, BookCard, PrivateRoute)
├── contexts/      # AuthContext (gerenciamento de sessão)
├── pages/         # Páginas/telas da aplicação
├── services/      # Comunicação com a API (axios)
├── App.jsx        # Definição das rotas
└── main.jsx       # Ponto de entrada da aplicação
```
