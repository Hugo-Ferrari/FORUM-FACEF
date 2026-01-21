"""
Constantes e configurações do sistema de chat

Baseado nos models:
- ChatsModel: id, name, is_general (bool), course_id, created_at
- ChatsMessageModel: id, chat_id, sender_id, content, created_at
- UserModel: id, facef_code, course_id, ...

Sistema usa apenas a tabela 'chats' com campo 'is_general' para diferenciar:
- Chat geral: is_general=True (todos os usuários têm acesso)
- Chat do curso: is_general=False e course_id (apenas alunos do curso têm acesso)
"""

# Limite de mensagens no histórico
MESSAGE_HISTORY_LIMIT = 50
