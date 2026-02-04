# Estrutura do Backend

## 📂 Estrutura de Pastas

```
backend/
├── .env                          # Variáveis de ambiente (não versionado)
├── .venv/                        # Ambiente virtual Python
├── requirements.txt              # Dependências do projeto
├── export_swagger.py             # Script para exportar OpenAPI
├── test_routes.py               # Script de testes das rotas
├── openapi.json                 # Especificação OpenAPI em JSON
├── openapi.yaml                 # Especificação OpenAPI em YAML
├── swagger.html                 # Interface Swagger standalone
│
└── app/                         # Aplicação principal
    ├── __init__.py
    ├── main.py                  # Entry point da aplicação
    ├── config.py                # Configurações gerais
    ├── utils.py                 # Funções utilitárias
    │
    ├── auth/                    # Módulo de autenticação
    │   ├── __init__.py
    │   ├── auth_routes.py       # Rotas de autenticação
    │   └── user_querys.py       # Queries de usuários
    │
    ├── database/                # Configuração do banco
    │   ├── __init__.py
    │   └── supabase_client.py   # Cliente Supabase
    │
    ├── models/                  # Modelos Pydantic
    │   ├── __init__.py
    │   ├── auth_type.py         # Modelos de autenticação
    │   ├── user_type.py         # Modelos de usuário
    │   ├── course_type.py       # Modelos de curso
    │   ├── threads_type.py      # Modelos de threads
    │   ├── post_type.py         # Modelos de posts
    │   ├── post_votes_types.py  # Modelos de votos
    │   ├── post_validations_type.py
    │   └── chat_type.py         # Modelos de chat
    │
    └── api/                     # Rotas da API
        ├── __init__.py
        ├── routes.py            # Agregador de rotas (/api)
        │
        ├── chat/                # Módulo de chat
        │   ├── __init__.py
        │   ├── routes.py        # Rotas REST do chat
        │   ├── server.py        # Servidor Socket.IO
        │   ├── connection_handlers.py
        │   ├── room_handlers.py
        │   ├── database_service.py
        │   ├── permissions_service.py
        │   └── constants.py
        │
        └── threads/             # Módulo de threads e posts
            ├── __init__.py
            ├── threads_routes.py      # Rotas de threads (principal)
            ├── posts_routes.py        # Rotas de posts
            ├── post_votes_routes.py   # Rotas de votos
            │
            └── querys/          # Funções de banco de dados
                ├── __init__.py
                ├── thread_querys.py    # CRUD de threads
                ├── posts_querys.py     # CRUD de posts
                └── posts_vote_query.py # CRUD de votos
```

---

## 🛣️ Estrutura de Rotas

### Hierarquia Completa

```
http://localhost:8000
│
├── /                                    [GET]     Root endpoint
├── /docs                                [GET]     Swagger UI
├── /redoc                               [GET]     ReDoc
├── /openapi.json                        [GET]     OpenAPI spec
│
├── /auth                                          Auth module
│   └── /                                [GET]     Login/Auth
│
└── /api                                           API principal
    │
    ├── /                                [GET]     API root
    │
    ├── /chat                                      Chat module
    │   ├── /                            [GET]     Lista chats (query: user_id)
    │   └── /{chat_id}/messages          [GET]     Mensagens do chat
    │
    └── /threads                                   Threads module
        │
        ├── /                            [POST]    Criar thread
        ├── /course/{course_id}          [GET]     Threads por curso
        ├── /{thread_id}                 [GET]     Buscar thread
        ├── /{thread_id}                 [PATCH]   Atualizar thread
        ├── /{thread_id}                 [DELETE]  Deletar thread
        │
        ├── /posts                                 Posts submodule
        │   ├── /                        [POST]    Criar post
        │   ├── /thread/{thread_id}      [GET]     Posts da thread
        │   ├── /{post_id}               [GET]     Buscar post
        │   ├── /{post_id}               [PATCH]   Atualizar post
        │   └── /{post_id}               [DELETE]  Deletar post
        │
        └── /votes                                 Votes submodule
            ├── /                        [POST]    Votar em post
            ├── /post/{post_id}          [GET]     Votos do post
            ├── /user/me                 [GET]     Meus votos
            └── /{post_id}               [DELETE]  Remover voto
```

---

## 📊 Mapeamento de Rotas por Arquivo

### main.py
- `GET /` - Root endpoint

### auth/auth_routes.py
- `GET /auth/` - Autenticação

### api/routes.py
- `GET /api/` - API root
- Agrega: chat_routes, threads_routes

### api/chat/routes.py
- `GET /api/chat/` - Lista chats
- `GET /api/chat/{chat_id}/messages` - Mensagens

### api/threads/threads_routes.py
- `POST /api/threads/` - Criar thread
- `GET /api/threads/course/{course_id}` - Threads por curso
- `GET /api/threads/{thread_id}` - Buscar thread
- `PATCH /api/threads/{thread_id}` - Atualizar thread
- `DELETE /api/threads/{thread_id}` - Deletar thread
- Agrega: posts_routes, post_votes_routes

### api/threads/posts_routes.py
- `POST /api/threads/posts/` - Criar post
- `GET /api/threads/posts/thread/{thread_id}` - Posts da thread
- `GET /api/threads/posts/{post_id}` - Buscar post
- `PATCH /api/threads/posts/{post_id}` - Atualizar post
- `DELETE /api/threads/posts/{post_id}` - Deletar post

### api/threads/post_votes_routes.py
- `POST /api/threads/votes/` - Votar
- `GET /api/threads/votes/post/{post_id}` - Votos do post
- `GET /api/threads/votes/user/me` - Meus votos
- `DELETE /api/threads/votes/{post_id}` - Remover voto

---

## 🔗 WebSocket

### Socket.IO Server
- **Path:** `/api/ws`
- **Arquivo:** `app/api/chat/server.py`
- **Protocolo:** Socket.IO v4

### Eventos
```python
# Client -> Server
'join_room'      # Entrar em uma sala/chat
'leave_room'     # Sair de uma sala
'send_message'   # Enviar mensagem

# Server -> Client
'message'        # Nova mensagem recebida
'user_joined'    # Usuário entrou na sala
'user_left'      # Usuário saiu da sala
```

---

## 🗄️ Estrutura do Banco (Supabase)

### Tabelas Principais

```
users
├── id (uuid, PK)
├── facef_code (int, unique)
├── name (text)
├── email (text)
├── course_id (uuid, FK)
└── created_at (timestamp)

courses
├── id (uuid, PK)
├── name (text)
└── year (text)

threads
├── id (uuid, PK)
├── title (text)
├── content (text)
├── is_anonymous (boolean)
├── created_by (uuid, FK -> users)
├── course_id (uuid, FK -> courses)
├── year (text)
├── ai_suggested_answer (text, nullable)
├── created_at (timestamp)
└── updated_at (timestamp)

posts
├── id (uuid, PK)
├── thread_id (uuid, FK -> threads)
├── content (text)
├── is_anonymous (boolean)
├── created_by (uuid, FK -> users)
├── created_at (timestamp)
└── updated_at (timestamp)

post_votes
├── id (uuid, PK)
├── post_id (uuid, FK -> posts)
├── user_id (uuid, FK -> users)
├── vote_type (text: 'upvote' | 'downvote')
├── created_at (timestamp)
└── UNIQUE(post_id, user_id)

chats
├── id (uuid, PK)
├── name (text)
├── course_id (uuid, FK -> courses)
├── is_general (boolean)
└── created_at (timestamp)

messages
├── id (uuid, PK)
├── chat_id (uuid, FK -> chats)
├── user_id (uuid, FK -> users)
├── content (text)
└── created_at (timestamp)
```

---

## 🔐 Autenticação

### Header Atual
```
user-id: <uuid-do-usuario>
```

### Rotas Protegidas
Requerem header `user-id`:
- POST /api/threads/
- PATCH /api/threads/{thread_id}
- DELETE /api/threads/{thread_id}
- POST /api/threads/posts/
- PATCH /api/threads/posts/{post_id}
- DELETE /api/threads/posts/{post_id}
- POST /api/threads/votes/
- GET /api/threads/votes/user/me
- DELETE /api/threads/votes/{post_id}

### Permissões Especiais
Apenas o criador pode:
- Editar sua thread/post
- Deletar sua thread/post

---

## 📦 Modelos Pydantic

### Request Models (Input)
- `ThreadsType` - Criar/editar thread
- `PostCreateRequest` - Criar post
- `PostUpdateRequest` - Editar post
- `PostsVotesCreateRequest` - Votar em post
- `AuthRegisterModel` - Autenticação

### Response Models (Output)
- `ThreadsResponse` - Thread completa com posts
- `PostTypeResponse` - Post com votos
- `PostsVotesResponse` - Voto detalhado

### Base Models
- `ThreadsType` - Thread base
- `PostType` - Post base
- `PostsVotesType` - Voto base
- `UserType` - Usuário
- `CourseType` - Curso
- `ChatType` - Chat

---

## 🏷️ Tags do Swagger

- **Root** - Endpoints raiz
- **Auth** - Autenticação
- **Chat** - Chats e mensagens
- **Threads** - Threads do fórum
- **Posts** - Posts em threads
- **Post Votes** - Sistema de votação

---

## 📈 Fluxo de Dados

### Exemplo: Criar Post e Votar

```
1. Cliente
   ↓ POST /api/threads/posts/
   ↓ Headers: { user-id: "123" }
   ↓ Body: { thread_id: "abc", content: "...", is_anonymous: false }

2. posts_routes.py
   ↓ Valida PostCreateRequest
   ↓ Chama create_post()

3. posts_querys.py
   ↓ Adiciona created_by = user_id
   ↓ INSERT no Supabase (tabela posts)

4. Supabase
   ↓ Retorna sucesso

5. Cliente
   ← { "message": "Post criado com sucesso!", "success": true }
```

---

## 🔄 Integração Frontend-Backend

### Headers Necessários
```javascript
{
  'Content-Type': 'application/json',
  'user-id': userId  // Para rotas protegidas
}
```

### Exemplo de Requisição
```javascript
// Criar post
const response = await fetch('http://localhost:8000/api/threads/posts/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'user-id': '123'
  },
  body: JSON.stringify({
    thread_id: 'abc',
    content: 'Meu post',
    is_anonymous: false
  })
});
```

---

**Total de Rotas:** 22  
**Total de Arquivos:** ~40  
**Linguagem:** Python 3.13  
**Framework:** FastAPI 0.115+
