# Spec: Dashboard

**Página**: `/` (dashboard home)  
**Status**: ✅ Especificado | ✅ Implementado | ⚠️ Testado (manual) | 🔄 Atualizado 2026-05-30  
**Última atualização**: 2026-05-30

---

## User Story

**Como** dono ou profissional autenticado,  
**Quero** ver um resumo da operação ao abrir o painel,  
**Para que** eu saiba rapidamente o estado do negócio sem navegar por várias páginas.

---

## Acceptance Scenarios

1. **Given** usuário autenticado, **When** acessa `/`, **Then** visualiza layout com sidebar de navegação e conteúdo do dashboard.

2. **Given** usuário não autenticado, **When** acessa qualquer rota do dashboard, **Then** é redirecionado para `/login`.

3. **Given** sidebar visível, **When** clica em qualquer item de navegação, **Then** é levado para a página correspondente sem reload completo (Next.js navigation).

---

## Functional Requirements

- **FR-DASH-001**: O dashboard DEVE exibir navegação lateral com todas as seções do sistema.
- **FR-DASH-002**: O layout DEVE ser responsivo e funcionar em telas a partir de 768px.
- **FR-DASH-003**: Usuário não autenticado DEVE ser redirecionado para `/login` em qualquer rota protegida.
- **FR-DASH-004**: O token JWT DEVE ser armazenado no localStorage e enviado como Bearer em todas as requests.

---

## Navegação (Sidebar) — Atualizado 2026-05-30

> ⚠️ **Relatórios foi removido do menu lateral.** A seção de relatórios foi movida para dentro do Dashboard.
> 
> ⚠️ **Menu superior** sendo avaliado como alternativa ao lateral para melhor uso de espaço horizontal.

| Item | Rota | Ícone | Contador |
|---|---|---|---|
| Agenda | `/appointments` | Calendário | Agendamentos do dia |
| Clientes | `/clients` | Pessoas | Total de clientes |
| Profissionais | `/professionals` | Usuário | Total de profissionais |
| Serviços | `/services` | Lista | Total de serviços ativos |
| Estoque | `/inventory` | Caixa | Produtos abaixo do mínimo |
| Financeiro | `/financeiro` | Cifrão | — |
| Marketing IA | `/marketing` | Brilho | — |
| Configurações | `/settings` | Engrenagem | — |

### Contadores nas Guias

Cada item de navegação DEVE exibir um badge numérico com:
- **Agenda**: número de agendamentos confirmados para hoje
- **Estoque**: número de produtos abaixo do estoque mínimo (badge vermelho se > 0)
- **Clientes/Profissionais/Serviços**: total de registros ativos

Contadores são carregados uma vez ao montar o layout e atualizados a cada 5 minutos ou ao navegar entre rotas.

---

## Seção de Relatórios no Dashboard — Nova (2026-05-30)

O dashboard DEVE incluir uma seção de relatórios rápidos com:
1. **Mapa de calor de horários** — grid hora × dia-da-semana com intensidade de cor
2. **Relatório de pagamentos pendentes** — lista compacta de agendamentos sem paymentMethod
3. **Resumo financeiro rápido** — receita do mês, custos, lucro líquido (cards)

Esses painéis substituem a rota `/reports` que será descontinuada.

## Componentes

- `layout.tsx` — sidebar + main content wrapper
- `DashboardContent.tsx` — conteúdo da home
- `NavBadge.tsx` — badge numérico para contadores nas guias
- `HeatmapPanel.tsx` — mapa de calor de horários
- `PendingPaymentsPanel.tsx` — painel de pagamentos pendentes
- `FinancialSnapshotPanel.tsx` — resumo financeiro rápido
- `AuthContext` — estado global de autenticação (token, businessId, logout)
- `api.ts` — instância axios com interceptor de auth header e redirect em 401
