# Spec: Página de Estoque

**Página**: `/inventory`  
**Status**: ✅ Especificado | ✅ Implementado | ⚠️ Testado (manual)  
**Última atualização**: 2026-05-29

---

## User Story

**Como** dono de um negócio,  
**Quero** visualizar e gerenciar o estoque de produtos,  
**Para que** eu saiba quando repor e evite bloqueios de agendamentos por falta de insumos.

---

## Acceptance Scenarios

1. **Given** dono autenticado, **When** acessa `/inventory`, **Then** visualiza lista de produtos com quantidade atual, mínimo e alerta visual quando abaixo do mínimo.

2. **Given** produto abaixo do estoque mínimo, **When** aparece na lista, **Then** é destacado com cor vermelha/laranja e ícone de alerta.

3. **Given** lista de produtos, **When** clica em "Ajustar Estoque", **Then** modal abre para informar quantidade e motivo do ajuste.

4. **Given** lista de produtos, **When** clica em "Novo Produto", **Then** formulário abre com nome, unidade, quantidade inicial, estoque mínimo e tipo (uso em serviço / venda).

---

## Functional Requirements

- **FR-INV-PAGE-001**: Listar produtos com alerta visual para estoque baixo.
- **FR-INV-PAGE-002**: Criar e editar produto (nome, unidade, currentStock, minimumStock, tipo).
- **FR-INV-PAGE-003**: Ajuste manual de estoque com campo de motivo.
- **FR-INV-PAGE-004**: Indicador visual de nível de estoque (crítico / baixo / ok).

---

## Componentes

- `InventoryContent.tsx` (lazy loaded) — página principal de estoque
- Reutiliza componentes comuns: Modal, ConfirmModal, Spinner, EmptyState, Pagination
- `types/inventory.types.ts` — tipos de Product, ServiceProduct, StockMovement
