# Plan: Visualização Dinâmica do Calendário

**Página**: `/agendamentos`  
**Última atualização**: 2026-05-30

---

## Arquitetura de Componentes

```
AgendamentosPage
├── CalendarHeader          ← navegação (mês atual, setas, toggle de visão)
├── [mode === 'month']
│   └── MonthView
│       ├── MonthGrid       ← 7×5/6 células clicáveis
│       └── DayCell         ← indicadores de carga e valor previsto/realizado
└── [mode === 'day']
    ├── DayViewHeader       ← sticky: data, total previsto, total realizado
    ├── DayTimeline         ← slots de 30 min, 00:00-23:30
    │   ├── EmptySlot       ← visível quando toggle "espaços vazios" ativo
    │   └── AppointmentCard ← card com ações (confirmar, WhatsApp, detalhes)
    └── DayNavigation       ← botões Anterior / Próximo + "Voltar ao mês"
```

---

## Gerenciamento de Estado

Usando **Zustand** (ou Context, se o projeto já usa):

```typescript
interface CalendarStore {
  mode: 'month' | 'day'
  currentDate: Date           // data selecionada (mês ou dia)
  showEmptySlots: boolean     // persistido em sessionStorage
  selectedProfessionalId: string | null
  
  // ações
  selectDay: (date: Date) => void
  goToMonth: () => void
  nextDay: () => void
  prevDay: () => void
  toggleEmptySlots: () => void
}
```

---

## Data Fetching

### Visão Mensal

`GET /appointments?year=2026&month=5&view=month`

Retorna um objeto com chave por dia:
```json
{
  "2026-05-15": { "count": 3, "revenue": 240, "realized": 80 },
  "2026-05-16": { "count": 1, "revenue": 120, "realized": 120 }
}
```

### Visão Diária

`GET /appointments?date=2026-05-15&professionalId=xxx`

Prefetch: ao entrar no modo diário, faz prefetch dos dias `-1` e `+1` em paralelo com `React Query` (ou SWR).

### Endpoint de Slots (espaços vazios)

`GET /appointments/slots?date=2026-05-15&professionalId=xxx`

Retorna array de slots de 30 min com status `AVAILABLE` ou `BOOKED`.

---

## Comportamento do Sticky Header

```css
.day-view-header {
  position: sticky;
  top: 0;            /* sticky abaixo do nav global */
  z-index: 10;
  backdrop-filter: blur(12px);
  background: rgba(var(--card-rgb), 0.8);
}
```

Dados do header (total previsto e realizado) são calculados no cliente a partir dos agendamentos do dia já carregados — sem request adicional.

---

## Animação de Transição

```typescript
// Framer Motion ou CSS transitions
const variants = {
  month: { opacity: 1, x: 0 },
  day:   { opacity: 1, x: 0 },
  exit:  { opacity: 0, x: -20 }
}
```

Transição de 200ms para não atrasar a percepção de clique.

---

## Decisões de Design

- **Por que Zustand e não useState local?** O estado do calendário é compartilhado entre header, grid e sidebar; um store evita prop drilling.
- **Por que prefetch de ±1 dia?** A principal ação do usuário após abrir um dia é navegar para o próximo/anterior. Prefetch elimina o delay percebido.
- **Por que slots de 30 min fixos?** Serviços têm duração mínima de 30 min no sistema; granularidade maior não agrega valor e aumenta o DOM.
