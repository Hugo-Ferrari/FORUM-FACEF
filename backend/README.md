# FORUM FACEF - Backend

API REST desenvolvida em FastAPI para o sistema de fórum acadêmico da FACEF.

## 🎯 Sobre o Projeto

Sistema de fórum acadêmico que permite aos alunos da uniFACEF interagirem de um sistema de chat em tempo real e retire suas dúvidas sobre as matérias do curso. O backend fornece uma API REST completa com autenticação, gerenciamento de conteúdo e comunicação via WebSocket.

## 🚀 Tecnologias

- **FastAPI** - Framework web moderno e rápido
- **Python 3.13** - Linguagem principal
- **Supabase** - Banco de dados PostgreSQL e autenticação
- **Socket.IO** - Comunicação em tempo real (WebSocket)
- **Pydantic** - Validação de dados
- **uvicorn** - Servidor ASGI

## 📦 Instalação

### Pré-requisitos
- Python 3.13+
- pip
- Conta no Supabase

### Configuração

1. Clone o repositório e entre na pasta backend:
```bash
cd backend
```

2. Crie e ative um ambiente virtual:
```bash
python3 -m venv .venv
source .venv/bin/activate  # No Windows: .venv\Scripts\activate
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do backend:
```env
SUPABASE_URL=sua-url-do-supabase
SUPABASE_KEY=sua-chave-do-supabase
```

5. Inicie o servidor:
```bash
uvicorn app.main:app --reload
```

A API estará disponível em: `http://localhost:8000`

## 📚 Documentação

- **Swagger UI**: http://localhost:8000/docs

## 🏗️ Funcionalidades Implementadas

### ✅ Autenticação
- Login de usuários
- Validação via código FACEF

### ✅ Threads
- Criar threads por curso
- Listar threads de um curso
- Editar threads (apenas criador)
- Deletar threads (apenas criador)
- Suporte para posts anônimos
- Sugestões de IA (campo preparado)

### ✅ Posts
- Criar posts em threads
- Listar posts de uma thread
- Editar posts (apenas criador)
- Deletar posts (apenas criador)
- Posts anônimos
- Sistema de votos integrado

### ✅ Sistema de Votação
- Upvote/Downvote em posts
- Estatísticas de votos (total, upvotes, downvotes)
- Um voto por usuário por post
- Trocar voto (remove anterior automaticamente)
- Remover voto

### ✅ Chat em Tempo Real
- Lista de chats por curso
- Histórico de mensagens
- WebSocket via Socket.IO
- Suporte a chat geral e específicos

## 🔜 Funcionalidades Planejadas

### 🔄 Em Desenvolvimento

#### Sistema de IA
- [ ] Integração com modelo de IA para sugerir respostas
- [ ] Análise de conteúdo das threads
- [ ] Respostas automáticas para dúvidas comuns
- [ ] Moderação de conteúdo

#### Notificações
- [ ] Notificações em tempo real via WebSocket
- [ ] Email notifications
- [ ] Notificar quando alguém responder sua thread
- [ ] Notificar quando seu post receber votos

#### Busca Avançada
- [ ] Busca de threads por palavras-chave
- [ ] Filtros por data, autor, curso
- [ ] Ordenação por relevância/votos/data
- [ ] Busca full-text

#### Moderação
- [ ] Sistema de denúncias
- [ ] Painel de moderação
- [ ] Remoção de conteúdo impróprio
- [ ] Log de ações de moderação

### 📋 Backlog

#### Melhorias de Autenticação
- [ ] Implementar JWT tokens
- [ ] Refresh tokens

#### Sistema de Perfil
- [ ] Perfil de usuário completo
- [ ] Avatar/foto de perfil
- [ ] Biografia
- [ ] Histórico de atividades
- [ ] Ranking de contribuições

#### Gamificação
- [ ] Sistema de pontos
- [ ] Badges/conquistas
- [ ] Ranking de usuários mais ativos
- [ ] Níveis de experiência

#### Analytics
- [ ] Estatísticas de uso
- [ ] Posts mais populares
- [ ] Usuários mais ativos
- [ ] Dashboard de métricas

#### Performance
- [ ] Cache com Redis
- [ ] Paginação em todas as listagens
- [ ] Rate limiting
- [ ] Compressão de respostas
- [ ] CDN para assets

#### Arquivos e Mídia
- [ ] Upload de imagens em posts
- [ ] Anexar arquivos
- [ ] Preview de links
- [ ] Emojis e reações


## 📁 Estrutura
Consulte o arquivo [ESTRUTURA.md](ESTRUTURA.md) para ver a estrutura completa de pastas e rotas.

## 📝 Convenções de Código

- Use **snake_case** para funções e variáveis
- Use **PascalCase** para classes
- Docstrings em todas as funções públicas
- Type hints obrigatórios
- Máximo 100 caracteres por linha

## 🐛 Troubleshooting

### Erro de conexão com Supabase
Verifique se as variáveis de ambiente estão corretas no arquivo `.env`

### Erro 422 nas rotas
Verifique se todos os campos obrigatórios estão sendo enviados

### WebSocket não conecta
Certifique-se de usar o path correto: `/api/ws`

## 📞 Suporte

- Documentação: http://localhost:8000/docs
- Issues: GitHub Issues

## 📄 Licença

Este projeto é privado e pertence à uniFACEF.

---

**Desenvolvido com ❤️ para uniFACEF**
