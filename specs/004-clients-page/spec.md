# Spec: Página de Clientes

**Página**: `/clients`  
**Status**: ✅ Especificado | ✅ Implementado | ⚠️ Testado (manual)  
**Última atualização**: 2026-05-29

---

## User Story

**Como** dono de um negócio,  
**Quero** gerenciar minha base de clientes e visualizar o histórico de atendimentos de cada um,  
**Para que** eu tenha contexto completo na hora de atender.

---

## Acceptance Scenarios

1. **Given** dono autenticado, **When** acessa `/clients`, **Then** visualiza lista de clientes com nome, telefone e e-mail.

2. **Given** lista de clientes, **When** clica em um cliente, **Then** modal de perfil abre com dados e histórico de agendamentos.

3. **Given** perfil de cliente aberto, **When** visualiza histórico, **Then** vê lista de agendamentos ordenados por data com serviço, profissional e status.

4. **Given** lista de clientes, **When** clica em "Novo Cliente", **Then** formulário abre com campos nome, telefone e e-mail (todos opcionais exceto nome).

---

## Functional Requirements

- **FR-CLI-PAGE-001**: Listar clientes com paginação.
- **FR-CLI-PAGE-002**: Criar e editar cliente (nome obrigatório, telefone e e-mail opcionais).
- **FR-CLI-PAGE-003**: Exibir perfil completo do cliente com histórico de agendamentos.
- **FR-CLI-PAGE-004**: Histórico ordenado cronologicamente com status colorido.

---

## Componentes

- `ClientList.tsx` — lista com paginação
- `ClientForm.tsx` — criar/editar
- `ClientHistory.tsx` — histórico de agendamentos
- `ClientProfileModal.tsx` — modal de perfil completo
- `clientsService.ts` — chamadas à API
- `useClients.ts` — SWR hook
