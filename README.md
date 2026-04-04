# QR Care

Aplicação web para criar QR Codes com informações importantes de saúde e contato, facilitando o acesso rápido a dados essenciais em situações de emergência.

## Visão geral

O QR Care permite:

- cadastrar e autenticar usuários com Firebase
- criar QR Codes com dados pessoais e médicos
- gerar orientações de apoio com IA
- salvar os registros no Firestore
- abrir uma página pública organizada ao ler o QR Code

## Como funciona

1. O usuário faz login ou cadastro.
2. Preenche os dados do paciente.
3. Pode gerar uma sugestão de orientação com IA.
4. Salva o cadastro.
5. O sistema gera um QR Code com link para uma página pública de visualização.

## Tecnologias

### Frontend

- React
- React Router DOM
- Axios
- QRCode.react

### Backend

- Node.js
- Express
- OpenAI SDK
- Dotenv
- CORS

### Banco e autenticação

- Firebase Authentication
- Firebase Firestore

## Estrutura do projeto

```text
qr-care/
├─ backend/
│  ├─ .env.example
│  ├─ package.json
│  └─ server.js
├─ public/
├─ scripts/
│  └─ dev.js
├─ src/
│  ├─ assets/
│  ├─ components/
│  │  └─ Navbar.js
│  ├─ pages/
│  │  ├─ Cadastro.js
│  │  ├─ MeuQRs.js
│  │  ├─ QRCodeCreator.js
│  │  └─ QRPublicView.js
│  ├─ App.js
│  ├─ App.css
│  ├─ firebase.js
│  └─ theme.js
├─ package.json
└─ README.md
```

## Requisitos

- Node.js instalado
- npm instalado
- projeto Firebase configurado
- chave da OpenAI válida no backend

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/LianaConde/qr-care.git
cd qr-care
```

### 2. Instale as dependências da raiz

```bash
npm install
```

### 3. Instale as dependências do backend

```bash
cd backend
npm install
cd ..
```

## Configuração

### Backend

Crie o arquivo `backend/.env` com:

```env
PORT=5000
OPENAI_API_KEY=sua_chave_aqui
```

### Frontend

Opcionalmente, você pode definir a URL da API:

```env
REACT_APP_API_URL=http://localhost:5000
```

## Rodando o projeto

### Subir frontend e backend juntos

```bash
npm start
```

### Rodar separadamente

Frontend:

```bash
npm run frontend
```

Backend:

```bash
npm run backend
```

## Scripts disponíveis

- `npm start`: sobe frontend e backend juntos
- `npm run dev`: modo integrado de desenvolvimento
- `npm run frontend`: sobe apenas o React
- `npm run backend`: sobe apenas o backend
- `npm run build`: gera a build de produção

## Fluxo do QR Code

- o cadastro é salvo no Firestore
- o sistema cria um link público no formato `/qr/:id`
- o QR Code aponta para esse link
- ao abrir o link, a pessoa vê uma página organizada com os dados cadastrados

## IA no projeto

O backend usa a OpenAI para gerar orientações com base nas informações do paciente.

Se a chave estiver sem cota ou a API estiver indisponível, o sistema pode usar um fallback local para não interromper o fluxo.

## Limitações atuais

- upload de PDFs ainda não está integrado ao Firebase Storage
- a qualidade da resposta da IA depende da disponibilidade e da cota da chave da OpenAI
- o link do QR em ambiente local funciona com `localhost`; para uso real externo, o projeto precisa ser publicado

## Próximos passos sugeridos

- integrar PDFs com Firebase Storage
- publicar o projeto em produção
- adicionar regras mais refinadas no Firestore
- melhorar o fallback local da IA

## Autor

Projeto mantido por [LianaConde](https://github.com/LianaConde).
