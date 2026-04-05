# QR Care

Aplicação web para criar QR Codes com informações essenciais de saúde e contato, pensada para facilitar o acesso rápido a dados importantes em situações de emergência.

## Resumo

O **QR Care** permite que um usuário cadastre informações pessoais e médicas, gere um QR Code e compartilhe um link público com uma visualização organizada desses dados.

Além disso, o projeto usa inteligência artificial para sugerir orientações de apoio com base nas informações cadastradas.

## Problema que o projeto resolve

Em momentos de urgência, nem sempre é fácil descobrir rapidamente:

- alergias do paciente
- medicamentos em uso
- contato de emergência
- condições específicas, como autismo, ansiedade ou outras necessidades

O QR Care foi criado para reduzir essa dificuldade e tornar essas informações acessíveis com rapidez.

## Principais funcionalidades

- autenticação de usuários com Firebase
- cadastro de dados pessoais e médicos
- geração de QR Code
- visualização pública ao escanear o QR
- listagem dos QR Codes já criados
- exclusão de QR Codes salvos
- sugestão de orientação com IA
- fallback local quando a OpenAI estiver indisponível

## Como funciona

1. O usuário entra na plataforma.
2. Preenche os dados do paciente.
3. Pode gerar uma sugestão com IA.
4. Salva o cadastro.
5. O sistema cria um QR Code.
6. Ao escanear o QR, abre uma página pública com as informações organizadas.

## Tecnologias utilizadas

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

### Banco de dados e autenticação

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
│  ├─ index.html
│  └─ manifest.json
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

- Node.js
- npm
- projeto Firebase configurado
- chave válida da OpenAI no backend

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/LianaConde/qr-care.git
cd qr-care
```

### 2. Instale as dependências da aplicação

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

Crie o arquivo `backend/.env`:

```env
PORT=5000
OPENAI_API_KEY=sua_chave_aqui
```

### Frontend

Se quiser definir manualmente a URL da API:

```env
REACT_APP_API_URL=http://localhost:5000
```

## Como rodar

### Frontend e backend juntos

```bash
npm start
```

### Rodando separadamente

Frontend:

```bash
npm run frontend
```

Backend:

```bash
npm run backend
```

## Scripts disponíveis

- `npm start` - sobe frontend e backend juntos
- `npm run dev` - modo integrado de desenvolvimento
- `npm run frontend` - sobe apenas o frontend
- `npm run backend` - sobe apenas o backend
- `npm run build` - gera a build de produção

## Integração com IA

O backend usa a OpenAI para gerar orientações de apoio baseadas nas informações cadastradas.

Quando a chave estiver sem cota, indisponível ou o serviço estiver temporariamente inacessível, o sistema pode responder com um modo local de fallback para não interromper o fluxo principal.

## Estado atual do projeto

Atualmente o projeto já permite:

- criar e visualizar QR Codes
- salvar dados no Firestore
- excluir QR Codes
- abrir página pública via QR
- usar IA para apoio textual

## Limitações atuais

- upload de PDFs ainda não está integrado
- a qualidade da resposta com IA depende da disponibilidade da chave da OpenAI
- em ambiente local, o QR aponta para `localhost`; para uso externo, o projeto precisa ser publicado

## Próximos passos

- integrar PDFs com armazenamento em nuvem
- publicar a aplicação online
- melhorar regras de segurança do Firestore
- evoluir o fallback local da IA

## Repositório

- GitHub: [LianaConde/qr-care](https://github.com/LianaConde/qr-care)

## Autoria

Projeto desenvolvido por [LianaConde](https://github.com/LianaConde).
