# Tasks: Visualização Dinâmica do Calendário

**Status geral**: ⬜ Não iniciado

---

## Fase 1 — Store e Estado Global

- [ ] **T1.1** Criar `useCalendarStore` (Zustand) com state: `mode`, `currentDate`, `showEmptySlots`, `selectedProfessionalId`
- [ ] **T1.2** Implementar ações: `selectDay`, `goToMonth`, `nextDay`, `prevDay`, `toggleEmptySlots`
- [ ] **T1.3** Persistir `showEmptySlots` em sessionStorage
- [ ] **T1.4** Testes unitários para as ações do store

## Fase 2 — Visão Mensal

- [ ] **T2.1** Criar componente `MonthGrid` com grade 7×5/6
- [ ] **T2.2** Criar componente `DayCell` com indicadores de carga e valor
- [ ] **T2.3** Integrar `GET /appointments?year=&month=&view=month` para dados do mês
- [ ] **T2.4** Ao clicar em dia: chamar `selectDay(date)` → modo muda para `day`
- [ ] **T2.5** Skeleton loader enquanto dados do mês carregam

## Fase 3 — Visão Diária

- [ ] **T3.1** Criar componente `DayTimeline` com slots de 30 min
- [ ] **T3.2** Criar componente `EmptySlot` (visível com toggle ativo)
- [ ] **T3.3** Integrar `GET /appointments?date=` para dados do dia
- [ ] **T3.4** Integrar `GET /appointments/slots` para espaços disponíveis
- [ ] **T3.5** Implementar filtro por profissional na visão diária

## Fase 4 — Sticky Header

- [ ] **T4.1** Criar componente `DayViewHeader` com data, total previsto, total realizado
- [ ] **T4.2** Aplicar CSS sticky + glassmorphism ao header
- [ ] **T4.3** Calcular totais no cliente a partir dos agendamentos já carregados (sem request adicional)
- [ ] **T4.4** Testar sticky em diferentes tamanhos de tela

## Fase 5 — Navegação e Animações

- [ ] **T5.1** Criar componente `DayNavigation` (Anterior / Próximo / Voltar ao mês)
- [ ] **T5.2** Implementar animação de transição mensal ↔ diária (< 300ms)
- [ ] **T5.3** Implementar prefetch dos dias ±1 com React Query ao entrar na visão diária
- [ ] **T5.4** Testar navegação por teclado (acessibilidade)

## Fase 6 — Cards e Ações

- [ ] **T6.1** Atualizar `AppointmentCard` com botão de confirmação WhatsApp integrado
- [ ] **T6.2** Toggle "Mostrar espaços vazios" visível e funcional na toolbar
- [ ] **T6.3** Dia vazio: exibir mensagem + botão "Novo agendamento"
- [ ] **T6.4** Testar visão em mobile (responsividade da timeline)
