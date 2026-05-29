# Plano de Implementação: Appointments Page

**Página**: `/appointments`  
**Status**: ✅ Implementado

---

## Decisões Técnicas

### 1. 14-day window
`AppointmentAgenda` exibe janela deslizante de 14 dias a partir da data atual, agrupados por dia. `utils/calendar.ts` e `utils/appointmentCalendar.ts` calculam os slots e agrupamentos.

### 2. SWR para revalidação automática
`useAppointments.ts` usa SWR com `revalidateOnFocus: true` — quando o usuário volta para a aba após confirmar um agendamento, a lista revalida automaticamente.

### 3. Modais inline
`CancelForm` e `RescheduleForm` são renderizados como modais sobre a agenda. Após confirmação, SWR invalida o cache e recarrega a lista.

### 4. Lazy loading
`_lazy.tsx` em cada página usa `dynamic(() => import('./...'), { ssr: false })` para reduzir bundle inicial.

---

## Estrutura de Arquivos

```
src/
├── app/(dashboard)/appointments/
│   ├── page.tsx
│   └── _lazy.tsx
└── modules/appointments/
    ├── AppointmentAgenda.tsx
    ├── AppointmentList.tsx
    ├── AppointmentStatusBadge.tsx
    ├── CancelForm.tsx
    ├── RescheduleForm.tsx
    ├── MonthCalendar.tsx
    ├── DayTimeline.tsx
    ├── appointmentsService.ts
    ├── useAppointments.ts
    └── useAllAppointments.ts
```

---

## Dependências

- `swr` para data fetching
- `utils/calendar.ts` e `utils/appointmentCalendar.ts`
- `types/appointments.types.ts`
- `components/common/Modal.tsx` e `ConfirmModal.tsx`
