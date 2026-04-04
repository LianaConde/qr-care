# QR-Care 🏥

Uma aplicação web inovadora para criar e gerenciar códigos QR contendo informações pessoais e médicas importantes. Ideal para emergências médicas, acessibilidade e identificação rápida de informações críticas.

## 📋 Índice

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Usar](#como-usar)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuindo](#contribuindo)

## 🎯 Sobre

O **QR-Care** é uma plataforma que permite aos usuários criar código QR personalizados com informações essenciais de contato e saúde. Em caso de emergência, qualquer pessoa pode escanear o QR code e acessar instantaneamente informações vitais do portador.

Com integração de IA (OpenAI), o aplicativo oferece sugestões automáticas de informações relevantes e geradores de conteúdo inteligente para situações de emergência.

## ✨ Funcionalidades

- **Autenticação Segura**: Sistema de login/cadastro com Firebase
- **Geração de QR Code**: Cria código QR contendo dados pessoais e médicos
- **Painel de Controle**: Visualize todos os seus QR codes criados
- **Informações Médicas**: Armazene dados cruciais como:
  - Nome e idade
  - Alergias
  - Medicamentos em uso
  - Histórico de cirurgias
  - Informações de contato de emergência
  - Necessidades especiais (PCD)
  - Instruções de acalmar/orientação
  
- **IA Assistente**: Gerador de sugestões com OpenAI para otimizar informações de emergência
- **Acesso Público**: QR code compartilhável com visualização pública segura
- **Armazenamento em Nuvem**: Dados sincronizados com Firebase Firestore

## 🛠️ Tecnologias

### Frontend
- **React** 19.2.4 - Biblioteca UI
- **React Router DOM** 7.14.0 - Roteamento
- **Firebase** 12.11.0 - Autenticação e banco de dados
- **QRCode.react** 4.2.0 - Geração de QR codes
- **Axios** 1.14.0 - Cliente HTTP
- **CSS** - Estilização customizada

### Backend
- **Node.js** - Runtime
- **Express** 5.2.1 - Framework servidor
- **OpenAI** 6.33.0 - IA e processamento de linguagem
- **CORS** 2.8.6 - Cross-Origin Resource Sharing
- **Dotenv** 17.4.0 - Variáveis de ambiente

### Serviços
- **Firebase**: Autenticação e Firestore (banco de dados)
- **OpenAI API**: Geradores de conteúdo inteligente

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** (v14 ou superior)
- **npm** (v6 ou superior) ou **yarn**
- Conta no **Firebase** (para setup do projeto)
- Chave de API do **OpenAI** (para recursos de IA)

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/qr-care.git
cd qr-care
```

### 2. Instale as dependências do frontend

```bash
npm install
```

### 3. Instale as dependências do backend

```bash
cd backend
npm install
cd ..
```

## ⚙️ Configuração

### 1. Configurar Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto ou use um existente
3. Ative a **Autenticação** (Email/Senha)
4. Crie um banco de dados **Firestore** (modo teste ou produção)
5. Copie suas credenciais do Firebase

As credenciais já estão configuradas em [src/firebase.js](src/firebase.js)

### 2. Configurar Backend

Crie um arquivo `.env` na pasta `backend/`:

```env
PORT=5000
OPENAI_API_KEY=sua_chave_openai_aqui
```

Obtenha a chave de API do OpenAI em: [platform.openai.com](https://platform.openai.com/api-keys)

### 3. Configurar Frontend (opcional)

Crie um arquivo `.env` na raiz do projeto se precisar customizar a URL da API:

```env
REACT_APP_API_URL=http://localhost:5000
```

## 🚀 Como Usar

### Desenvolvimento

1. **Inicie o servidor backend**:
```bash
npm run backend
```
ou
```bash
cd backend && npm start
```

2. **Em outro terminal, inicie o frontend**:
```bash
npm run frontend
```
ou
```bash
npm start
```

3. A aplicação estará disponível em: `http://localhost:3000`

### Modo de Desenvolvimento Integrado

Para rodar frontend e backend simultaneamente:

```bash
npm run dev
```

### Produção

1. **Build da aplicação**:
```bash
npm run build
```

2. **Servir a aplicação buildada**:
```bash
npm start
```

## 📜 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm start` | Inicia frontend e backend em desenvolvimento |
| `npm run dev` | Modo desenvolvimento integrado |
| `npm run frontend` | Inicia apenas o React (porta 3000) |
| `npm run backend` | Inicia apenas o servidor Node (porta 5000) |
| `npm run build` | Faz build para produção |
| `npm test` | Executa testes |

## 📁 Estrutura do Projeto

```
qr-care/
├── src/                          # Frontend React
│   ├── components/
│   │   └── Navbar.js            # Barra de navegação
│   ├── pages/
│   │   ├── Cadastro.js          # Tela de registro/login
│   │   ├── QRCodeCreator.js     # Criador de QR codes
│   │   ├── MeuQRs.js            # Lista de QR codes do usuário
│   │   ├── CriarQR.js           # Página de criação
│   │   └── QRPublicView.js      # Visualização pública do QR
│   ├── App.js                    # Componente raiz
│   ├── firebase.js               # Configuração Firebase
│   ├── theme.js                  # Tema e estilos
│   └── index.js                  # Ponto de entrada
├── backend/
│   ├── server.js                 # Servidor Express
│   ├── package.json
│   └── .env                      # Variáveis de ambiente
├── public/                        # Assets públicos
├── build/                         # Build gerado
├── scripts/
│   └── dev.js                    # Script de desenvolvimento
└── package.json                  # Dependências do projeto
```

## 🔐 Segurança

- Não commit do arquivo `.env` (já configurado no `.gitignore`)
- Chaves de API são mantidas no backend
- Firebase oferece autenticação segura
- CORS configurado para prevenir requisições não autorizadas

## 📱 Uso da Aplicação

### Para Usuários

1. **Cadastro**: Crie uma conta com email e senha
2. **Criar QR Code**: Preencha seus dados pessoais e médicos
3. **IA Assistente**: Use a IA para gerar sugestões de conteúdo
4. **Salvar**: Armazene seu QR code na nuvem
5. **Compartilhar**: Obtenha um link público ou código QR para compartilhar

### Para Emergências

1. **Escanear**: Use qualquer leitor de QR code no código
2. **Visualizar**: Acesse instantaneamente as informações vitais
3. **Contatar**: Use as informações de contato de emergência

## 🐛 Troubleshooting

**Erro "OPENAI_API_KEY not configured"**
- Verifique se o `.env` está na pasta `backend/`
- Reinicie o servidor backend após adicionar a chave

**Erro de conexão com Firebase**
- Verifique se as credenciais estão corretas em `src/firebase.js`
- Certifique-se de que o Firestore e Autenticação estão habilitados

**Porta 5000 já em uso**
- Altere a porta no `backend/server.js` e atualize `.env`

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a Licença ISC.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ por [Seu Nome]

## 📞 Suporte

Para reportar bugs ou sugerir melhorias, abra uma [issue](https://github.com/seu-usuario/qr-care/issues).

---

**Última atualização**: Abril 2026

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
