# Plano de Implementação: IA Marketing

**Página**: `/marketing` + `/admin-ai/[secret]`  
**Status**: ✅ Implementado (retroativo)

---

## Arquitetura

```
┌─────────────────────────────────────┐
│  /marketing (Front-end)             │
│  ├── Aba Dicas (POST /api/ai/tips)  │
│  ├── Aba Chat  (POST /api/ai/chat)  │
│  └── Aba Ações (localStorage)       │
└─────────────────────────────────────┘
         │ Next.js API Routes
         ▼
┌─────────────────────────────────────┐
│  API Routes (server-side)           │
│  ├── /api/ai/tips  → tips route     │
│  ├── /api/ai/chat  → chat route     │
│  └── /api/admin/ai-config           │
└─────────────────────────────────────┘
         │ lib/ai/factory.ts
         ▼
┌─────────────────────────────────────┐
│  IAIProvider (interface)            │
│  ├── AnthropicProvider              │
│  ├── OpenAICompatibleProvider       │
│  │   ├── Groq (base URL override)   │
│  │   └── OpenAI                     │
└─────────────────────────────────────┘
```

---

## Decisões Técnicas

### 1. Interface unificada de provedor
`IAIProvider` com `chat()` e `stream()` abstrai diferenças entre provedores. `factory.ts` retorna o provider correto com base na config.

### 2. OpenAI-compatible para Groq e OpenAI
Groq implementa a API OpenAI — `OpenAICompatibleProvider` aceita `baseURL` como parâmetro para reutilizar o mesmo código para Groq e OpenAI.

### 3. Streaming via ReadableStream
`/api/ai/chat` retorna `Response` com `ReadableStream`. O front-end lê via `reader.read()` em loop e acumula os chunks progressivamente na UI.

### 4. Config do sistema em arquivo JSON
`getAISystemConfig()` lê/escreve configuração em `ai-config.json` no servidor (Next.js). O admin panel `POST /api/admin/ai-config` atualiza esse arquivo.

### 5. Ações salvas em localStorage
`useSavedActions.ts` gerencia o array de `SavedAction` no localStorage com key `agenda_saved_actions`. Não há sincronização com backend no MVP.

### 6. Chave do admin protegida por segredo no path
`/admin-ai/[secret]/page.tsx` valida que o parâmetro `secret` corresponde à env var `ADMIN_SECRET`. Sem autenticação formal — segurança por obscuridade no MVP.

---

## Estrutura de Arquivos

```
src/
├── app/
│   ├── (dashboard)/marketing/
│   │   ├── page.tsx
│   │   └── MarketingContent.tsx     ← componente principal (3 abas)
│   ├── admin-ai/
│   │   ├── [secret]/page.tsx        ← rota dinâmica protegida por segredo
│   │   └── AdminAIContent.tsx       ← painel de configuração
│   └── api/
│       ├── ai/
│       │   ├── chat/route.ts        ← streaming handler
│       │   └── tips/route.ts        ← JSON tips handler
│       └── admin/
│           └── ai-config/route.ts   ← GET + POST config
├── lib/ai/
│   ├── types.ts                     ← AIMessage, AIConfig, MarketingTip, SavedAction
│   ├── config.ts                    ← getAISystemConfig()
│   ├── factory.ts                   ← createAIProvider()
│   └── providers/
│       ├── anthropic.ts             ← Anthropic SDK
│       └── openai-compatible.ts     ← OpenAI SDK (Groq + OpenAI)
└── modules/marketing/
    └── hooks/
        ├── useAIChat.ts             ← streaming chat state
        ├── useSavedActions.ts       ← localStorage actions
        └── useUserAIConfig.ts       ← user API key config
```

---

## System Prompts

### Chat
> "Você é um assistente especialista em marketing para negócios de beleza e bem-estar (salões de beleza, barbearias, estúdios de estética, spas). Responda sempre em português brasileiro."

### Tips
> "Você é um especialista em marketing para negócios de beleza. Gere dicas práticas e acionáveis em português brasileiro. Responda SOMENTE com um array JSON válido."

---

## Dependências

- `@anthropic-ai/sdk`
- `openai` (para Groq e OpenAI)
- localStorage para persistência de ações
