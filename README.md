# Sistema de Login com Next.js, Shadcn-UI e Autenticação Twitch

Este projeto implementa um sistema de login usando Next.js, componentes Shadcn-UI, Next-Auth para autenticação (com provedor Twitch) e Prisma para gerenciamento do banco de dados.

## Funcionalidades

- Interface moderna com componentes Shadcn-UI
- Autenticação social via Twitch
- Sessões de usuário persistentes com Prisma + MySQL (Railway)
- Suporte a TypeScript
- Design responsivo

## Pré-requisitos

- Node.js 18+ instalado
- Uma conta de desenvolvedor Twitch
- Uma conta no Railway para banco de dados MySQL

## Instruções de Configuração

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure suas variáveis de ambiente criando um arquivo `.env` na raiz do projeto:
   ```env
   # Next Auth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="" # Gere com: openssl rand -base64 32

   # Twitch Auth (Obtenha em https://dev.twitch.tv/console)
   TWITCH_CLIENT_ID=""     # ID do Cliente da sua aplicação Twitch
   TWITCH_CLIENT_SECRET="" # Chave Secreta da sua aplicação Twitch

   # Database (Obtenha no Railway)
   DATABASE_URL=""         # URL de conexão do MySQL

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=""
   CLOUDINARY_API_KEY=""
   CLOUDINARY_API_SECRET=""
   ```

4. Configure o esquema do banco de dados:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Explicação das Variáveis de Ambiente

- `NEXTAUTH_URL`: URL da sua aplicação (use http://localhost:3000 para desenvolvimento)
- `NEXTAUTH_SECRET`: Chave secreta para NextAuth.js (gere usando o comando: `openssl rand -base64 32`)

### Variáveis da Twitch
Para obter as credenciais da Twitch:
1. Acesse https://dev.twitch.tv/console
2. Faça login com sua conta Twitch
3. Clique em "Registrar Aplicativo"
4. Preencha as informações:
   - Nome: Nome da sua aplicação
   - URL de redirecionamento OAuth: `http://localhost:3000/api/auth/callback/twitch`
   - Categoria: Website Integration
5. Após registrar, você receberá:
   - `TWITCH_CLIENT_ID`: ID do Cliente
   - `TWITCH_CLIENT_SECRET`: Chave Secreta do Cliente

- `DATABASE_URL`: String de conexão do seu MySQL no Railway

## Configurando a Autenticação Twitch

1. Acesse o [Console de Desenvolvedor da Twitch](https://dev.twitch.tv/console)
2. Crie uma nova aplicação
3. Configure a URL de redirecionamento OAuth para `http://localhost:3000/api/auth/callback/twitch`
4. Copie o Client ID e Client Secret para seu arquivo `.env`

## Configurando o Banco de Dados no Railway

1. Crie uma conta no [Railway](https://railway.app)
2. Crie um novo projeto e adicione um banco de dados MySQL
3. Copie a string de conexão da aba "Connect"
4. Cole como seu `DATABASE_URL` no arquivo `.env`

## Configurando o Cloudinary

1. Crie uma conta no [Cloudinary](https://cloudinary.com)
2. Copie o `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` e `CLOUDINARY_API_SECRET` fornecidos pelo Cloudinary
3. Cole como suas variáveis de ambiente no arquivo `.env`

## Estrutura do Projeto

```
├── app/
│   ├── api/
│   │   └── auth/
│   ├── components/
│   ├── login/
│   └── page.tsx
├── prisma/
│   └── schema.prisma
└── lib/
    └── auth.ts
```

## Stack Tecnológica

- Next.js 14
- Shadcn-UI
- Next-Auth
- Prisma
- MySQL
- TailwindCSS
- TypeScript

## Contribuindo

Sinta-se à vontade para enviar issues e solicitações de melhorias.
