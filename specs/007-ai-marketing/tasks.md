# Tasks: IA Marketing

**Página**: `/marketing` + `/admin-ai/[secret]`  
**Status Geral**: ✅ Implementado (sem spec prévia) | ⚠️ Testado (manual)

> ⚠️ Esta feature foi implementada antes da spec. Esta task list documenta o que foi feito e lista melhorias pendentes.

---

## Implementado

### Infraestrutura de IA

- [x] Criar `lib/ai/types.ts` (AIMessage, AIConfig, AISystemConfig, MarketingTip, SavedAction, MARKETING_CATEGORIES, AI_PROVIDERS_INFO)
- [x] Criar `lib/ai/factory.ts` (createAIProvider — retorna provider correto)
- [x] Criar `lib/ai/config.ts` (getAISystemConfig — lê/escreve ai-config.json)
- [x] Implementar `lib/ai/providers/anthropic.ts` (chat + stream via @anthropic-ai/sdk)
- [x] Implementar `lib/ai/providers/openai-compatible.ts` (chat + stream para Groq e OpenAI)

### API Routes

- [x] Implementar `app/api/ai/chat/route.ts` (POST streaming com seleção de provedor)
- [x] Implementar `app/api/ai/tips/route.ts` (POST retorna JSON de 5 dicas)
- [x] Implementar `app/api/admin/ai-config/route.ts` (GET + POST protegido por Bearer secret)

### Front-end

- [x] Implementar `modules/marketing/hooks/useAIChat.ts` (estado de chat + streaming)
- [x] Implementar `modules/marketing/hooks/useSavedActions.ts` (localStorage)
- [x] Implementar `modules/marketing/hooks/useUserAIConfig.ts` (config de chave do usuário)
- [x] Implementar `MarketingContent.tsx` (3 abas: Dicas, Chat, Ações)
- [x] Implementar `AdminAIContent.tsx` (painel de configuração completo)
- [x] Criar rota dinâmica `/admin-ai/[secret]/page.tsx`
- [x] Adicionar item "Marketing IA" no sidebar de navegação

---

## Pendentes

### Testes

- [ ] Testes unitários para `lib/ai/factory.ts` e providers (mock de SDK)
- [ ] Testes unitários para `useAIChat.ts` (streaming mock)
- [ ] Testes unitários para `useSavedActions.ts` (localStorage mock)
- [ ] Testes e2e para fluxo de geração de dicas

### Features

- [ ] Limite de uso diário com enforcement real (contador por usuário no servidor)
- [ ] Histórico de conversas de chat persistido no servidor (não só na sessão)
- [ ] Compartilhar dica gerada (copiar link ou texto formatado)
- [ ] Integração com dados reais do negócio (puxar automaticamente serviços e contagem de clientes do back-end ao ativar contexto)
- [ ] Admin panel com autenticação formal (não só segredo no path)
- [ ] Suporte a mais provedores (Gemini, Mistral)

### Dívida Técnica

- [ ] Mover `ai-config.json` para variável de ambiente ou banco de dados (arquivo no servidor não escala em deploy serverless)
- [ ] Rate limiting no nível das API routes
- [ ] Tratamento de erro estruturado com códigos específicos por tipo de falha de provider
