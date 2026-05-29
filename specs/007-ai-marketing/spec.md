# Spec: IA Marketing — Dicas e Chat para Negócios de Beleza

**Página**: `/marketing`  
**Status**: ⚠️ Spec retroativa (feature implementada sem spec prévia) | ✅ Implementado | ⚠️ Testado (manual)  
**Criada em**: 2026-05-29 (retroativa)  
**Auditoria**: Feature identificada durante auditoria SDD — implementada antes da spec.

---

## Contexto

Esta feature foi desenvolvida sem especificação prévia. Esta spec documenta retroativamente o que foi construído e formaliza os requisitos para guiar evoluções futuras.

---

## User Story

**Como** dono de um negócio de beleza,  
**Quero** receber dicas personalizadas de marketing e conversar com um assistente de IA,  
**Para que** eu possa crescer meu negócio com estratégias práticas e acessíveis.

---

## Acceptance Scenarios

### Dicas de Marketing

1. **Given** dono autenticado, **When** acessa `/marketing` e seleciona a categoria "Redes Sociais", **Then** recebe 5 dicas práticas com título, descrição, dificuldade e impacto.

2. **Given** dicas geradas, **When** ativa o contexto do negócio (nome, serviços, desafio), **Then** as dicas são personalizadas para a realidade específica do negócio.

3. **Given** dica recebida, **When** clica em "Salvar como Ação", **Then** a dica vai para a aba "Minhas Ações" com status "Pendente".

4. **Given** ação salva, **When** dono marca como "Em Progresso" ou "Concluído", **Then** status é atualizado e persiste entre sessões (localStorage).

### Chat com Assistente

5. **Given** dono na aba "Chat", **When** digita uma pergunta e envia, **Then** recebe resposta em streaming (texto aparece progressivamente) em português brasileiro.

6. **Given** chat aberto, **When** clica em um "Quick Prompt" (pergunta pré-definida), **Then** a pergunta é enviada automaticamente.

### Configuração de Provedor

7. **Given** usuário com chave de API própria configurada, **When** usa a feature de IA, **Then** sua chave é usada em vez da chave do sistema (sem limite de uso).

8. **Given** sistema sem chave de API configurada e usuário sem chave própria, **When** tenta usar a IA, **Then** recebe mensagem clara pedindo para configurar.

---

## Categorias de Marketing

| ID | Label |
|---|---|
| `redes-sociais` | Redes Sociais |
| `fidelizacao` | Fidelização de Clientes |
| `promocoes` | Promoções e Descontos |
| `captacao` | Captação de Novos Clientes |
| `atendimento` | Qualidade do Atendimento |
| `online` | Presença Online |

---

## Provedores de IA Suportados

| Provedor | Modelos | Custo |
|---|---|---|
| Groq | Llama 3.3 70B, Llama 3.1 8B, Mixtral 8x7B | Gratuito |
| Anthropic Claude | Haiku 4.5, Sonnet 4.6, Opus 4.8 | Pago |
| OpenAI | GPT-4o Mini, GPT-4o | Pago |

---

## Functional Requirements

- **FR-AI-001**: Sistema DEVE suportar múltiplos provedores de IA (Groq, Anthropic, OpenAI) via interface unificada.
- **FR-AI-002**: Chat DEVE funcionar com streaming — texto aparece progressivamente.
- **FR-AI-003**: Dicas DEVEM ser retornadas como JSON estruturado com título, descrição, categoria, dificuldade e impacto.
- **FR-AI-004**: Ações salvas DEVEM persistir no localStorage do usuário.
- **FR-AI-005**: Sistema DEVE suportar chave do sistema (admin) e chave própria do usuário.
- **FR-AI-006**: Quando `allowUserKeys = false` (config do admin), usuários NÃO DEVEM poder usar chave própria.
- **FR-AI-007**: Limites diários de uso DEVEM ser configuráveis por tier (gratuito/pago).
- **FR-AI-008**: Dicas DEVEM poder ser personalizadas com contexto do negócio (nome, serviços, desafio principal).

---

## Admin Panel

Painel de administração acessível via `/admin-ai/[secret]` (URL com segredo no path — não indexada):

- Configurar provedor e modelo padrão do sistema
- Configurar chave de API do sistema
- Habilitar/desabilitar uso de chaves próprias por usuários
- Configurar limites de uso diário por tier

---

## Success Criteria

- **SC-AI-001**: Dicas são geradas em menos de 10 segundos (Groq free tier).
- **SC-AI-002**: Chat responde com streaming em menos de 2 segundos para o primeiro token.
- **SC-AI-003**: Provedor padrão (Groq gratuito) funciona sem custo para o sistema com chave configurada.
- **SC-AI-004**: Falha no provedor de IA exibe mensagem amigável ao usuário, sem crashar a página.

---

## Assumptions

- Chave de API do sistema é armazenada em variável de ambiente ou arquivo de configuração protegido no servidor.
- Limites de uso diário não são enforcement rigoroso no MVP — são orientativos.
- Ações salvas ficam apenas no localStorage do navegador (sem sincronização cross-device no MVP).
- O segredo do painel admin (`/admin-ai/[secret]`) é definido via variável de ambiente.
