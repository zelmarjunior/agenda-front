# Tasks: Appointments Page

**Página**: `/appointments`  
**Status Geral**: ✅ Implementado | ✅ Testado (parcial)

---

## Implementação

- [x] Criar `types/appointments.types.ts`
- [x] Implementar `appointmentsService.ts` (getAll, create, confirm, cancel, complete, reschedule, getSlots)
- [x] Implementar `useAppointments.ts` com SWR e filtros
- [x] Implementar `useAllAppointments.ts`
- [x] Implementar `AppointmentAgenda.tsx` (14-day grouped view)
- [x] Implementar `AppointmentStatusBadge.tsx`
- [x] Implementar `CancelForm.tsx` (modal com campo motivo)
- [x] Implementar `RescheduleForm.tsx`
- [x] Implementar `MonthCalendar.tsx`
- [x] Implementar `DayTimeline.tsx`
- [x] Criar `utils/calendar.ts` e `utils/appointmentCalendar.ts`
- [x] Criar `app/(dashboard)/appointments/page.tsx` com lazy loading

## Testes

- [x] Teste unitário `AppointmentAgenda` — renderização, agrupamento por dia
- [x] Teste unitário `AppointmentStatusBadge` — cores corretas por status
- [x] Teste unitário `CancelForm` — validação de motivo obrigatório
- [x] Teste unitário `DayTimeline` — slots por hora

## Pendentes

- [ ] Teste unitário `RescheduleForm`
- [ ] Teste unitário `MonthCalendar`
- [ ] Formulário de criação de novo agendamento (modal ou página dedicada)
- [ ] Filtro por profissional na agenda
- [ ] Testes e2e Playwright para fluxo completo de criação → confirmação → conclusão
