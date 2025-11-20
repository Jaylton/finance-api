# Finance-api

## Descrição

API RESTful para gestão financeira pessoal, desenvolvida em NestJS e Prisma, com autenticação JWT e integração com banco de dados MySQL. Permite o controle de usuários, contas, cartões, categorias, transferências financeiras e importação de dados via CSV.

### Funcionalidades principais
- Cadastro, consulta, atualização e remoção de usuários, contas, cartões e categorias
- Controle de transferências financeiras, com filtros avançados e gráficos
- Importação de transferências via arquivo CSV
- Autenticação e proteção de rotas com JWT

## Endpoints principais

### Autenticação
- `POST /auth/login` — Login de usuário (retorna token JWT)

### Usuários (`/users`)
- `GET /users` — Lista todos os usuários (protegido)
- `GET /users/me` — Retorna o perfil do usuário autenticado
- `GET /users/:id` — Busca usuário por ID
- `POST /users` — Cria novo usuário
- `PATCH /users/:id` — Atualiza usuário

### Contas (`/accounts`)
- `GET /accounts` — Lista todas as contas
- `GET /accounts/:id` — Busca conta por ID
- `POST /accounts` — Cria nova conta
- `PATCH /accounts/:id` — Atualiza conta
- `DELETE /accounts/:id` — Remove conta

### Cartões (`/cards`)
- `GET /cards` — Lista todos os cartões
- `GET /cards/:id` — Busca cartão por ID
- `POST /cards` — Cria novo cartão
- `PATCH /cards/:id` — Atualiza cartão
- `DELETE /cards/:id` — Remove cartão

### Categorias (`/categories`)
- `GET /categories` — Lista todas as categorias (protegido)
- `GET /categories/:id` — Busca categoria por ID
- `POST /categories` — Cria nova categoria
- `PATCH /categories/:id` — Atualiza categoria
- `DELETE /categories/:id` — Remove categoria

### Transferências (`/transfers`)
- `GET /transfers` — Lista transferências com filtros por data, tipo, conta, cartão e categorias
- `GET /transfers/graphic` — Retorna dados agregados para gráficos financeiros
- `POST /transfers` — Cria nova transferência
- `PATCH /transfers/:id` — Atualiza transferência
- `DELETE /transfers/:id` — Remove transferência
- `POST /transfers/import-csv` — Importa transferências a partir de arquivo CSV

## Tecnologias utilizadas
- NestJS
- Prisma ORM
- MySQL
- JWT (autenticação)
- class-validator
- csv-parser

## Como rodar o projeto
1. Instale as dependências: `npm install`
2. Configure o arquivo `.env` com a variável `DATABASE_URL` apontando para seu banco MySQL
3. Rode as migrations: `npx prisma migrate dev`
4. Inicie a API: `npm run start:dev`

## Observações
- Algumas rotas exigem autenticação JWT (verifique o uso do `@UseGuards(JwtAuthGuard)` nos controllers)
- O projeto suporta importação de transferências via CSV, facilitando a migração de dados de outros sistemas