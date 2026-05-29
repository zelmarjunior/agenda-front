# Constituição — Agenda Front

## Princípios Fundamentais

### I. Test-First Development (NÃO-NEGOCIÁVEL)

Toda feature DEVE seguir um ciclo estrito de Test-Driven Development:

- Os testes DEVEM ser escritos antes de qualquer código de implementação (hooks, utilities, lógica complexa).
- Os testes DEVEM falhar antes do início da implementação; um teste verde escrito sem código correspondente é inválido.
- O ciclo Red → Green → Refactor DEVE ser concluído para cada unidade de trabalho.
- **Testes unitários são OBRIGATÓRIOS** para:
  - Custom hooks (`useAuth`, `useAppointments`, etc)
  - Utilities e formatadores (`formatDate`, `formatCurrency`, `validators`, etc)
  - Contextos (Context API providers e consumers)
  - Toda lógica de estado complexa
- **Testes de componentes (React Testing Library) são OBRIGATÓRIOS** para:
  - Componentes críticos (formulários, modais de confirmação, componentes de estado)
  - Interações com usuário (click, form submit, input change)
- **Testes E2E (Playwright) são OBRIGATÓRIOS** para os seguintes fluxos críticos:
  - Fluxo de login em 2 etapas (email → confirma negócio → senha → dashboard)
  - Criar agendamento completo (selecionar cliente, profissional, serviço, data/hora)
  - Confirmar e concluir agendamento
  - Cancelar agendamento com motivo
  - Criar novo profissional e definir horários
  - Criar novo cliente
  - Adicionar produto ao estoque e ajustar quantidade
  - Configurações do negócio (nome, telefone, endereço)
- Uma feature só está "concluída" quando todos os testes passam e a cobertura atinge no mínimo **70%** em caminhos críticos.
- **Playwright config**: `playwright.config.ts` na raiz; testes em `e2e/`; baseURL `http://localhost:3001` (porta do front).

**Justificativa**: Detectar regressões cedo em JavaScript/React evita bugs em produção. Testes automatizados garantem que a UI funciona como esperado.

---

### II. Component-Driven Design

Componentes reutilizáveis DEVEM ser projetados com foco em composição e documentação:

- Cada componente DEVE ter uma responsabilidade única e clara.
- Componentes DEVEM aceitar props tipadas (TypeScript) e fornecer valores padrão sensatos.
- Componentes DEVEM ser componentizados para maximizar reutilização e organizar o código da melhor forma possível.
- Componentes complexos (formulários, tabelas, modais) DEVEM ser documentados com exemplos em Storybook (opcional para MVP).
- Props DEVEM ser bem-nomeadas e auto-documentadas; nada de `data`, `config`, `options` genéricas.
- Componentes DEVEM ser agnósticos de estado — state é gerenciado externamente (Context, hooks).
- Componentes de layout (Sidebar, Header) DEVEM ser compartilhados entre rotas via Next.js layouts.

**Componentes Obrigatórios no Design System**:

| Componente | Localização | Obrigatoriedade |
|-----------|-------------|-----------------|
| `Button` | `components/common/Button.tsx` | OBRIGATÓRIO em toda ação |
| `Modal` | `components/common/Modal.tsx` | OBRIGATÓRIO para formulários CRUD |
| `Toast/ToastContainer` | `components/common/ToastContainer.tsx` | OBRIGATÓRIO para feedback de ação |
| `Spinner` | `components/common/Spinner.tsx` | OBRIGATÓRIO em loading states pontuais |
| `Skeleton` | `components/common/Skeleton.tsx` | OBRIGATÓRIO em listagens durante fetch |
| `EmptyState` | `components/common/EmptyState.tsx` | OBRIGATÓRIO quando lista está vazia |
| `ErrorState` | `components/common/ErrorState.tsx` | OBRIGATÓRIO quando fetch falha |
| `Pagination` | `components/common/Pagination.tsx` | OBRIGATÓRIO em toda listagem paginada |
| `Badge` | `components/common/Badge.tsx` | OBRIGATÓRIO para status e labels |
| `ConfirmModal` | `components/common/ConfirmModal.tsx` | OBRIGATÓRIO antes de ações destrutivas |
| `Sidebar` | `components/layout/Sidebar.tsx` | OBRIGATÓRIO no dashboard layout |
| `Header` | `components/layout/Header.tsx` | OBRIGATÓRIO no dashboard layout |

**Justificativa**: Componentes reutilizáveis reduzem duplicação e facilitam mudanças de design. Responsabilidade única torna testes e manutenção triviais.

---

### III. Type Safety Absoluta

TypeScript strict mode é OBRIGATÓRIO; tipos devem ser explícitos em toda a codebase:

- `"strict": true` em `tsconfig.json`.
- Proibido o uso de `any`, `as any`, `!` (non-null assertion) ou supressão de erros sem documentação.
- Toda função pública DEVE ter retorno tipado explícito: `function foo(): ReturnType { ... }` (não inferência).
- DTOs importados do backend OpenAPI DEVEM ser as únicas fontes de verdade para tipos de dados da API.
- Props de componentes DEVEM ser definidas com `interface Props { ... }` ou `type Props = { ... }`.
- States de Context API DEVEM ser tipados com interfaces explícitas.
- Erros HTTP e erros de validação DEVEM ter tipos definidos (não strings genéricas).

**Justificativa**: Type safety reduz bugs em tempo de execução. IDE autocomplete melhora a velocidade de desenvolvimento.

---

### IV. State Management Simplificado

Estado DEVE ser gerenciado com a abordagem mais simples que funcione:

- **Local state** (useState): Para estado transitório de componente (form inputs, toggles, modais abertos/fechados).
- **Context API**: Para estado global compartilhado (auth, theme, notificações toast).
- **Server state** (SWR): Para dados da API (appointments, professionals, clients) — NÃO duplicate em useState.
- Padrão de redução de estado: Se estado tiver mais de 3 campos interdependentes, use useReducer.
- Proibido multiplicar providers de Context; combinar em um único provider quando possível.
- SWR é a biblioteca padrão do projeto (não React Query). Keys de cache seguem o padrão `[resource-name, businessId, ...filters]`.

**Justificativa**: State management simples evita bugs de sincronização. Respeitar as fronteiras entre local/global/server reduz confusão.

---

### V. Integração com API Backend

A comunicação com a API DEVE ser uniforme e segura:

- Todos os chamados de API DEVEM passar pelo client axios em `services/api.ts` (NUNCA fetch direto).
- Interceptadores DEVEM gerenciar automaticamente:
  - Adição de JWT no header `Authorization`
  - Tratamento de erros 401 (logout automático + redirect para `/login`)
  - Logging de requisições em desenvolvimento
- Tipos de requisição/resposta DEVEM vir do backend OpenAPI (fonte em `backend-openapi-spec.yml`).
- Toda chamada de API DEVE estar em um serviço ou hook customizado, NUNCA diretamente em componentes.
- Cache de requisições DEVE ser gerenciado pelo SWR.
- `getApiError(err)` DEVE ser usado para extrair mensagem de erro de toda resposta da API.
- **Base URL**: `${NEXT_PUBLIC_API_BASE_URL}/api/v1`
- **Error response format**: `{ error: string, message: string, statusCode: number }`

**Justificativa**: Centralizar o client garante autenticação consistente. Interceptadores evitam repetição. Tipos alinhados reduzem erros.

---

### VI. Acessibilidade & Responsividade (WCAG 2.1 AA)

Todo componente DEVE ser acessível e funcionar em mobile, tablet e desktop:

- Semântica HTML obrigatória: `<button>`, `<label>`, `<nav>`, `<main>`, etc (não divs genéricos).
- Todos os inputs DEVEM ter `<label>` associado (atributo `htmlFor`).
- Componentes interativos DEVEM ter foco visível e suportarem navegação por teclado.
- ARIA labels OBRIGATÓRIOS em componentes customizados sem semântica óbvia.
- Ratios de contraste: AA mínimo (4.5:1 para texto, 3:1 para UI components).
- **Responsividade obrigatória**:
  - Mobile-first: design começa em 360px (small phone)
  - Pontos de breakpoint: 640px (tablet), 1024px (desktop), 1280px (large)
  - Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`
  - Sidebar DEVE colapsar para hamburger menu em mobile (< 1024px)
- Skip-to-content link OBRIGATÓRIO na raiz do layout.
- Toast notifications DEVEM ter `role="alert"` e `aria-live="polite"`.
- Modais DEVEM capturar foco (focus trap) e fechar com ESC.
- Testes de acessibilidade: `npm run test:a11y` (se configurado com axe).

**Justificativa**: Acessibilidade é direito legal (LGPD/ADA). Responsividade garante experiência em qualquer dispositivo.

---

### VII. Performance & Otimização

A experiência do usuário começa com performance:

- **Bundle Size**: < 200KB (gzipped, excluding dependencies).
- **Metrics**:
  - FCP (First Contentful Paint): < 2s
  - LCP (Largest Contentful Paint): < 3s
  - CLS (Cumulative Layout Shift): < 0.1
  - Lighthouse Score (mobile): ≥ 80
- **Code Splitting obrigatório**:
  - Cada rota do Next.js é chunked automaticamente.
  - Componentes pesados (listas de módulos no dashboard) DEVEM usar `next/dynamic` com `{ ssr: false }` — padrão `_lazy.tsx`.
- **Imagens**:
  - SEMPRE usar `next/image` (lazy loading automático).
  - Formatos modernos: WEBP quando possível.
- **Dados**:
  - Paginação OBRIGATÓRIA em listas (nunca load-all, exceto calendário com limit:500).
  - SWR `revalidateOnFocus: false` em dados que raramente mudam.
- **Análise**:
  - Lighthouse CI em CI/CD (alertar se score < 80).
- **UX Performance**:
  - Feedback imediato em TODA ação do usuário: máximo **200ms** (skeleton, spinner, ou disabled state).
  - Loading skeletons OBRIGATÓRIOS em listagens — nunca mostrar página em branco durante fetch.
  - Formulários DEVEM desabilitar submit durante loading para evitar double-submit.

**Justificativa**: Performance rápida reduz bounce rate e melhora conversion. Usuários em conexões lentas (mobile 3G) precisam de UX responsiva.

---

### VIII. Segurança & Privacidade

Dados do usuário DEVEM ser tratados com rigor:

- **HTTPS only**: Nunca enviar dados sensíveis em HTTP em produção.
- **XSS Prevention**:
  - React escapa HTML por padrão — confiar nisso.
  - `dangerouslySetInnerHTML` PROIBIDO sem sanitização.
  - Validar inputs de usuário antes de enviar para API.
- **JWT Management**:
  - Armazenar token em localStorage via `storage.ts` (wrapper centralizado).
  - Auto-logout se `401` for retornado pelo backend (interceptor axios).
  - Logout: limpar localStorage E redirecionar para `/login`.
  - Token decode via `decodeToken()` em `utils/jwt.ts` para verificar roles/expiração.
- **Dados Sensíveis**:
  - NUNCA logar senha, tokens, dados pessoais completos em console.
- **Variáveis de Ambiente**:
  - Prefixar com `NEXT_PUBLIC_` apenas para valores públicos.
  - Segredos NUNCA em código commitado.

**Justificativa**: Vazamentos de dados têm alto impacto legal (LGPD). Segurança por padrão evita descuidos.

---

### IX. Padrões de Código

Todo código DEVE ser legível, consistente e bem-estruturado:

- **Linguagem**: Todo código em inglês (variáveis, funções, componentes, commits).
- **TypeScript**:
  - Strict mode obrigatório (veja Princípio III).
  - Interfaces para contratos; `type` para unions e utilitários.
- **Convenções de nomenclatura**:
  - Componentes React: PascalCase (`LoginForm`, `AppointmentList`)
  - Hooks: camelCase prefixado com `use` (`useAuth`, `useAppointments`)
  - Funções/variáveis: camelCase (`formatDate`, `isValidEmail`)
  - Constantes: UPPER_SNAKE_CASE (`MAX_RETRIES`, `API_TIMEOUT`)
  - Arquivos de componente: PascalCase (`Button.tsx`)
  - Arquivos de utils/hooks: camelCase (`formatters.ts`, `useAuth.ts`)
- **Formatação**:
  - Prettier obrigatório com config: `printWidth: 100`, `tabWidth: 2`, `singleQuote: true`
  - ESLint obrigatório para regras de código
- **Comentários**: Comentar o "por quê", não o "o quê". Mínimos e relevantes.
- **Estrutura de Arquivos**:
  - Co-locate: componente + seus hooks + tipos no mesmo diretório.
  - Módulos agrupar por domínio (feature), não por tipo.

**Justificativa**: Código uniforme facilita reviews, onboarding e manutenção.

---

### X. Arquitetura de Módulos (Feature-Driven)

Cada feature DEVE ser um módulo auto-contido:

```
src/modules/[feature]/
├── components/              # Componentes específicos da feature
├── hooks/                   # Hooks customizados (ex: useAppointments)
├── services/                # API calls (ex: appointmentsService.ts)
└── index.ts                 # Exports públicos
```

- **Coesão alta**: Tudo relacionado à feature fica junto.
- **Acoplamento baixo**: Features não importam uma da outra; compartilham através de Context API ou serviços comuns.
- **Escalabilidade**: Fácil adicionar nova feature; apenas criar novo módulo.
- **Teste**: Cada feature pode ter testes isolados em `components/__tests__/`.

**Módulos ativos**: `auth`, `appointments`, `clients`, `professionals`, `services`, `inventory`, `reports`, `business`.

**Justificativa**: Feature-driven architecture facilita paralelização entre desenvolvedores e reduz conflitos de merge.

---

## XI. Design System — Ocean Edition (OBRIGATÓRIO)

Todo trabalho de UI DEVE seguir o **Oceanic Intelligence Design System**. Desvios requerem justificativa explícita.

> Implementado em: `src/app/globals.css` (`@theme` tokens), `src/components/layout/Sidebar.tsx`, `src/components/common/`

### Paleta de Cores — Ocean

| Token Tailwind | Valor Hex | Uso |
|---------------|-----------|-----|
| `ocean-primary` | `#006591` | CTAs, links ativos, logo, foco |
| `ocean-accent` | `#0ea5e9` | Destaque ativo, hover do primary, dots CONFIRMED |
| `ocean-sidebar` | `#213145` | Background da sidebar escura |
| `ocean-surface` | `#f8f9ff` | Background geral da página |
| `ocean-surface-container` | `#e5eeff` | Cards secundários, hover backgrounds |
| `ocean-surface-container-low` | `#eff4ff` | Table headers, row hover |
| `ocean-on-surface` | `#0b1c30` | Texto principal |
| `ocean-on-surface-variant` | `#3e4850` | Labels, texto secundário |
| `ocean-secondary` | `#576065` | Texto auxiliar, placeholders |
| `ocean-outline` | `#6e7881` | Ícones inativos |
| `ocean-outline-variant` | `#bec8d2` | Bordas de cards e inputs |
| `ocean-error` | `#ba1a1a` | Erros, badge danger |
| `ocean-error-container` | `#ffdad6` | Badge danger background |
| `ocean-tertiary` | `#006399` | Status COMPLETED, ícones de sucesso |
| `ocean-tertiary-container` | `#58a1dc` | Badge CONFIRMED borders |
| `ocean-sidebar-text` | `#dbe4ea` | (legacy) |
| `ocean-sidebar-muted` | `#94ccff` | Texto muted na sidebar (versão), rodapé |

### Status Badges (Color-Coded — Ocean)

| Status | Classe `Badge` | Background | Texto |
|--------|---------------|-----------|-------|
| `PENDING` | `warning` | `bg-amber-100` | `text-amber-800` |
| `CONFIRMED` | `success` | `bg-[#c9e6ff]` | `text-[#004c6e]` |
| `COMPLETED` | `info` | `bg-[#0ea5e9]/15` | `text-ocean-primary` |
| `CANCELLED` | `danger` | `bg-ocean-error-container` | `text-ocean-error` |

### Tipografia

- **Font obrigatória**: `Plus Jakarta Sans` via `next/font/google` → `--font-jakarta`
- **Hierarquia**:
  - Página título: `text-2xl font-bold text-ocean-on-surface tracking-tight`
  - Card/section título: `text-sm font-semibold text-ocean-on-surface`
  - Label de campo: `text-sm font-semibold text-ocean-on-surface-variant`
  - Cabeçalho de tabela: `text-xs font-semibold text-ocean-secondary uppercase tracking-wider`
  - Texto de corpo: `text-sm text-ocean-on-surface-variant`
  - Texto auxiliar: `text-xs text-ocean-secondary`
  - Versão/muted: `text-[10px] font-medium tracking-widest uppercase`

### Shape & Espaçamento

- **Border radius padrão**: `rounded-2xl` (16px) para cards, modais
- **Border radius médio**: `rounded-xl` (12px) para botões, inputs, avatares
- **Border radius pequeno**: `rounded-lg` (8px) para itens menores
- **Border radius full**: `rounded-full` para badges de status e dots
- **Shadow de card**: glassmorphism (sem shadow padrão)
- **Shadow de modal**: `boxShadow: '0 24px 64px rgba(0,101,145,0.12)'`
- **Shadow de FAB/botões primários**: `shadow-sm shadow-ocean-primary/20`

### Layout

- **Sidebar**: Fixa, `w-64` (256px) desktop, colapsável mobile; `bg-[#213145]`
- **Main content**: `flex-1 overflow-y-auto`, padding `px-8 pt-8 pb-10` desktop, `px-4 pt-14` mobile
- **Background body**: `#f8f9ff` + `radial-gradient` Ocean Blue (ambient, fixo)

### Glassmorphism (Uso Extensivo — padrão do sistema)

Componente disponível via utilitário `glass-card` (definido em `globals.css @layer utilities`):
```css
.glass-card {
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(190,200,210,0.45);
}
```

Aplicar em:
- **TODOS os cards de conteúdo**: `glass-card rounded-2xl`
- **Sidebar mobile backdrop**: `bg-black/50 backdrop-blur-sm`
- **Modal backdrop**: `backdrop-blur-sm bg-[rgba(11,28,48,0.45)]`
- **Botões secundários**: `bg-white/70 backdrop-blur-sm`
- **Action buttons dentro de blocos**: `bg-white/70 backdrop-blur-sm`

Adicionar `glass-card-hover` para interatividade em cards (lift de 1px + shadow on hover).

### Sidebar Ocean

```
Estrutura do componente Sidebar:
├── Brand header (logo gradient + nome + badge "Professional")
├── Nav items
│   ├── Active: ocean-sidebar-item-active (bg rgba azul/18%, border-l-3 #0ea5e9, text white)
│   └── Inactive: ocean-sidebar-item-inactive (#bfc8ce → white on hover, bg white/8% on hover)
└── Footer (logout button + versão em text muted #94ccff/40%)
```

Utilitários CSS: `.ocean-sidebar-item`, `.ocean-sidebar-item-active`, `.ocean-sidebar-item-inactive`

### Formulários Ocean

Input style obrigatório: utilitário `.ocean-input`
```css
.ocean-input {
  background: rgba(255,255,255,0.8);
  border: 1px solid #bec8d2;
  border-radius: 0.75rem;
}
.ocean-input:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14,165,233,0.15);
}
```

### Micro-Animações (OBRIGATÓRIAS)

- **Hover em botões**: `transition-all active:scale-95` (Ocean primary) ou `active:scale-[0.98]` (forms)
- **Hover em linhas de tabela**: `hover:bg-ocean-surface-container-low/40 transition-colors`
- **Hover em sidebar links**: `transition-colors duration-150`
- **Hover em cards**: `glass-card-hover` (translateY(-1px) + shadow)
- **Abertura de modal**: Fade + scale: `translateY(10px) scale(0.96)` → `translateY(0) scale(1)` (250ms ease)
- **Modal backdrop**: opacity 0→1 (250ms)
- **Focus visible**: `focus:ring-2 focus:ring-ocean-accent focus:ring-offset-2`
- **Loading state**: `animate-pulse` em skeletons
- **Toggle active state**: `bg-ocean-primary text-white` (sem animation, instant)

### Padrões de UX (OBRIGATÓRIOS)

1. **Feedback imediato**: Toda ação ≤ 200ms (spinner, skeleton, disabled state).
2. **Validação inline**: react-hook-form + zod. Erros em `text-ocean-error`.
3. **Confirmação destrutiva**: Toda ação irreversível usa `ConfirmModal`.
4. **Empty states**: `EmptyState` com CTA quando lista vazia.
5. **Loading skeletons**: `Skeleton` durante fetch inicial.
6. **Toast feedback**: Toda operação CRUD → toast de sucesso/erro.
7. **Mobile-first**: Testar em 375px. Sidebar hamburger abaixo de 1024px.

---

## XII. Stack Tecnológica (Versões Fixas)

| Tecnologia | Versão | Notas |
|-----------|--------|-------|
| **Next.js** | 16.x | App Router obrigatório |
| **React** | 19.x | Concurrent features disponíveis |
| **TypeScript** | 5.x | strict mode obrigatório |
| **Tailwind CSS** | 4.x | JIT engine padrão |
| **SWR** | 2.x | Server state — não usar React Query |
| **Axios** | 1.x | HTTP client — não usar fetch diretamente |
| **react-hook-form** | 7.x | Formulários |
| **Zod** | 4.x | Schema validation |
| **Vitest** | 4.x | Unit + component tests |
| **React Testing Library** | 16.x | Testes de componente |
| **Playwright** | (a instalar) | E2E tests — pendente |

**Proibido adicionar**: React Query, Redux, MobX, Zustand (não necessário para escala atual), date-fns, moment.js (usar `Intl` nativo).

---

## Padrões Específicos de Next.js

### Roteamento

- **App Router** (não Pages Router): Obrigatório para Next.js 13+.
- Route Groups `(auth)`, `(dashboard)` para organizar sem afetar URL.
- Layout hierarchy: raiz (`app/layout.tsx`) → grupo → página.
- Não misturar layouts de grupo; cada grupo tem seu próprio layout.

### Server vs Client Components

- **Server Components (padrão)**: Use para layouts, data fetching, componentes estáticos.
- **Client Components** (`"use client"`): Apenas para interatividade (formulários, estado, event listeners).
- **Regra prática**: Se não precisa de estado/evento, é Server Component.
- Páginas do dashboard DEVEM usar `_lazy.tsx` + `next/dynamic({ ssr: false })` para evitar hydration mismatch com dados de localStorage.

### Middleware

- `middleware.ts` na raiz de `src/` intercepta requisições.
- Usar para: validar cookie de auth (`agenda:authCookie`), redirecionar rotas protegidas.
- Não fazer lógica pesada (API calls) — apenas verificações rápidas de cookie.

---

## Governance

- **Constitution supersedes**: Todos os PRs devem verificar conformidade com este documento.
- **Amendments**: Mudanças neste documento requerem revisão da equipe e atualização de templates.
- **Enforcement**: Use checklists em PRs para validar conformidade.
- **Design deviations**: Qualquer desvio do Design System (seção XI) DEVE ser justificado no PR description.

---

**Version**: 2.0.0 | **Ratified**: 2026-05-28 | **Last Amended**: 2026-05-28
