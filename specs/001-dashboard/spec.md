# Spec: Dashboard

**Página**: `/` (dashboard home)  
**Status**: ✅ Especificado | ✅ Implementado | ⚠️ Testado (manual)  
**Última atualização**: 2026-05-29

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

## Navegação (Sidebar)

| Item | Rota | Ícone |
|---|---|---|
| Agenda | `/appointments` | Calendário |
| Clientes | `/clients` | Pessoas |
| Profissionais | `/professionals` | Usuário |
| Serviços | `/services` | Lista |
| Estoque | `/inventory` | Caixa |
| Relatórios | `/reports` | Gráfico |
| Marketing IA | `/marketing` | Brilho |
| Configurações | `/settings` | Engrenagem |

---

## Componentes

- `layout.tsx` — sidebar + main content wrapper
- `DashboardContent.tsx` — conteúdo da home
- `AuthContext` — estado global de autenticação (token, businessId, logout)
- `api.ts` — instância axios com interceptor de auth header e redirect em 401
