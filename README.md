# 🚀 WhatsWeb - Sistema de Atendimento via WhatsApp

Sistema de atendimento integrado ao WhatsApp desenvolvido com **Node.js**, **Express**, **SQLite** e **whatsapp-web.js**, permitindo gerenciar clientes, chamados e conversas em tempo real através de um painel web.

---

## 📸 Funcionalidades

### 🤖 Integração com WhatsApp

* Conexão via QR Code
* Recebimento automático de mensagens
* Envio de mensagens pelo painel administrativo
* Atendimento em tempo real

### 👥 Gestão de Clientes

* Cadastro automático de clientes
* Listagem de clientes
* Histórico de conversas por cliente

### 🎫 Gestão de Chamados

* Abertura automática de chamados
* Geração de protocolo único
* Status de chamados:

  * Aberto
  * Fechado
* Encerramento de chamados

### 💬 Sistema de Conversas

* Histórico completo de mensagens
* Mensagens de clientes e atendentes
* Horário das mensagens
* Atualização automática das conversas

### 📊 Dashboard

* Total de clientes
* Total de chamados
* Chamados abertos
* Chamados fechados
* Sessões ativas

---

## 🛠️ Tecnologias Utilizadas

### Backend

* Node.js
* Express.js
* SQLite
* whatsapp-web.js
* Puppeteer
* Dotenv

### Frontend

* HTML5
* CSS3
* JavaScript (Vanilla)

---

## 📁 Estrutura do Projeto

```bash
whatsweb/
│
├── database/
│   ├── helpdesk.db
│   ├── clientes.json
│   ├── chamados.json
│   └── sessoes.json
│
├── public/
│   ├── css/
│   │   ├── global.css
│   │   ├── dashboard.css
│   │   ├── clientes.css
│   │   ├── chamados.css
│   │   └── conversa.css
│   │
│   ├── js/
│   │   ├── dashboard.js
│   │   ├── clientes.js
│   │   ├── chamados.js
│   │   └── conversa.js
│   │
│   ├── index.html
│   ├── clientes.html
│   ├── chamados.html
│   └── conversa.html
│
├── server.js
├── db.js
├── whatsappClient.js
├── package.json
└── README.md
```

---

## ⚙️ Instalação

### 1. Clonar o projeto

```bash
git clone https://github.com/seu-usuario/whatsweb.git
cd whatsweb
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Executar o projeto

```bash
node server.js
```

ou

```bash
npm start
```

---

## 🌐 Acesso

Painel:

```text
http://localhost:3000
```

Clientes:

```text
http://localhost:3000/clientes.html
```

Chamados:

```text
http://localhost:3000/chamados.html
```

---

## 📡 Endpoints

### Dashboard

```http
GET /dashboard
```

### Clientes

```http
GET /clientes
```

### Chamados

```http
GET /chamados
```

### Mensagens

```http
GET /mensagens/:numero
```

### Responder Cliente

```http
GET /responder/:numero/:mensagem
```

---

## 🗄️ Banco de Dados

### clientes

* id
* numero

### chamados

* id
* numero
* protocolo
* mensagem
* status
* data

### mensagens

* id
* numero
* autor
* mensagem
* data

### sessoes

* id
* numero
* etapa
* atualizadoEm

---

## 🔄 Fluxo do Atendimento

Cliente → WhatsApp → Bot → Abertura de Chamado → Painel Administrativo → Resposta do Atendente → Histórico de Conversa → Encerramento do Chamado

---

## 🚧 Próximas Funcionalidades

* Layout semelhante ao WhatsApp Web
* Mensagens não lidas
* Pesquisa de clientes
* Filtros de chamados
* Transferência de atendimento
* Múltiplos atendentes
* Autenticação de usuários
* Upload de arquivos
* Envio de imagens e documentos
* Notificações em tempo real
* Dashboard avançado com gráficos

---

## 👨‍💻 Autor

Desenvolvido por **GUI-94** desenvolvimento web, com foco em integração de APIs, banco de dados e sistemas de atendimento em tempo real.
