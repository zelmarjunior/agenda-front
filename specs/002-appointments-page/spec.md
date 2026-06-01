# Spec: Página de Agendamentos

**Página**: `/appointments`  
**Status**: ✅ Especificado | ✅ Implementado | ✅ Testado (parcial) | 🔄 Atualizado 2026-05-30  
**Última atualização**: 2026-05-30

---

## User Story

**Como** dono ou profissional,  
**Quero** visualizar e gerenciar agendamentos em uma agenda visual,  
**Para que** eu possa criar, confirmar, cancelar e reagendar atendimentos com facilidade.

---

## Acceptance Scenarios

1. **Given** dono autenticado, **When** acessa `/appointments`, **Then** visualiza agenda dos próximos 14 dias agrupada por dia.

2. **Given** agenda aberta, **When** clica em um agendamento, **Then** visualiza detalhes e opções de ação (confirmar, cancelar, reagendar).

3. **Given** agendamento `PENDING`, **When** clica em "Confirmar", **Then** status muda para `CONFIRMED` com feedback visual.

4. **Given** qualquer agendamento, **When** clica em "Cancelar", **Then** modal de cancelamento abre pedindo motivo antes de confirmar.

5. **Given** agenda aberta, **When** navega entre semanas no mini-calendário, **Then** a visualização dos 14 dias é atualizada.

6. **Given** sem agendamentos no dia, **When** visualiza o dia na agenda, **Then** estado de "sem agendamentos" é exibido claramente.

---

## Functional Requirements

- **FR-APPT-PAGE-001**: Exibir agendamentos dos próximos 14 dias agrupados por data.
- **FR-APPT-PAGE-002**: Exibir badge de status colorido em cada agendamento.
- **FR-APPT-PAGE-003**: Permitir confirmar, cancelar (com motivo) e reagendar (com motivo) diretamente na agenda.
- **FR-APPT-PAGE-004**: Mini-calendário para navegar entre datas.
- **FR-APPT-PAGE-005**: Timeline por hora para o dia selecionado.
- **FR-APPT-PAGE-006**: Dados atualizados via SWR (revalidação ao focar a janela).

---

## Componentes

- `AppointmentAgenda.tsx` — agenda 14 dias agrupada por dia
- `AppointmentList.tsx` — view tabular alternativa
- `AppointmentStatusBadge.tsx` — badge colorido por status
- `CancelForm.tsx` — modal com campo de motivo
- `RescheduleForm.tsx` — modal para reagendamento
- `MonthCalendar.tsx` — calendário de navegação
- `DayTimeline.tsx` — timeline horária do dia
- `useAppointments.ts` — SWR hook com filtros
- `appointmentsService.ts` — chamadas à API

---

## Status Colors

| Status | Cor |
|---|---|
| PENDING | Amarelo |
| CONFIRMED | Verde |
| COMPLETED | Azul |
| CANCELLED | Vermelho/Cinza |

## Atualizações (2026-05-30)

> A visualização dinâmica do calendário (mês → dia → navegação) é especificada em [specs/front/008-calendar-view](../008-calendar-view/spec.md).

### Valor Previsto e Realizado por Dia

- **FR-APPT-PAGE-007**: Cada dia agrupado na agenda DEVE exibir:
  - `Valor previsto`: soma dos preços dos serviços dos agendamentos `PENDING` e `CONFIRMED` do dia
  - `Valor realizado`: soma dos valores dos agendamentos `COMPLETED` do dia
- **FR-APPT-PAGE-008**: Esses valores DEVEM ser visíveis no cabeçalho de cada grupo de dia e no cabeçalho sticky da visão diária.

### Botões de Ação Rápida

- **FR-APPT-PAGE-009**: Card de agendamento DEVE ter botão de "Confirmar via WhatsApp" que abre link `wa.me` com mensagem pré-formatada.
- **FR-APPT-PAGE-010**: Perfil do cliente DEVE ter botão "Novo agendamento" que pré-preenche o cliente no formulário de agendamento.
