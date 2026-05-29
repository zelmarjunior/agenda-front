# Spec: Página de Profissionais

**Página**: `/professionals`  
**Status**: ✅ Especificado | ✅ Implementado | ⚠️ Testado (manual)  
**Última atualização**: 2026-05-29

---

## User Story

**Como** dono de um negócio,  
**Quero** cadastrar e gerenciar profissionais e seus horários de atendimento,  
**Para que** a agenda reflita corretamente a disponibilidade de cada um.

---

## Acceptance Scenarios

1. **Given** dono autenticado, **When** acessa `/professionals`, **Then** visualiza lista de profissionais do negócio com nome, especialidade e status.

2. **Given** lista de profissionais, **When** clica em "Novo Profissional", **Then** formulário de cadastro abre com campos nome, e-mail, senha provisória e especialidade.

3. **Given** profissional criado, **When** clica em "Editar", **Then** formulário de edição abre com dados pré-preenchidos.

4. **Given** profissional selecionado, **When** clica em "Horários", **Then** formulário de horários de atendimento abre com dias da semana e campos de hora início/fim.

5. **Given** horários salvos, **When** tenta agendar fora do horário configurado, **Then** o slot não aparece como disponível.

---

## Functional Requirements

- **FR-PROF-PAGE-001**: Listar profissionais com paginação.
- **FR-PROF-PAGE-002**: Criar profissional com nome, e-mail, senha provisória e especialidade.
- **FR-PROF-PAGE-003**: Editar dados de profissional existente.
- **FR-PROF-PAGE-004**: Configurar horários de atendimento por dia da semana.
- **FR-PROF-PAGE-005**: Vincular serviços ao profissional.

---

## Componentes

- `ProfessionalList.tsx` — tabela com lista
- `ProfessionalForm.tsx` — criar/editar profissional
- `WorkingHoursForm.tsx` — configurar horários
- `professionalsService.ts` — chamadas à API
- `useProfessionals.ts` — SWR hook
