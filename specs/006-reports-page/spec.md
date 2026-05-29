# Spec: Página de Relatórios

**Página**: `/reports`  
**Status**: ✅ Especificado | ✅ Implementado | ⚠️ Testado (manual)  
**Última atualização**: 2026-05-29

---

## User Story

**Como** dono de um negócio,  
**Quero** visualizar relatórios financeiros e operacionais com filtros de período,  
**Para que** eu possa tomar decisões estratégicas com base em dados reais.

---

## Acceptance Scenarios

1. **Given** dono autenticado, **When** acessa `/reports`, **Then** visualiza abas para Financeiro, Agendamentos e Estoque.

2. **Given** aba Financeiro selecionada, **When** informa período de início e fim e clica em "Gerar", **Then** visualiza faturamento total e detalhamento por profissional.

3. **Given** aba Agendamentos, **When** filtra por profissional e período, **Then** visualiza taxa de ocupação, cancelamentos e serviços mais realizados.

4. **Given** aba Estoque, **When** filtra por período, **Then** visualiza consumo de produtos e alertas de reposição.

---

## Functional Requirements

- **FR-REP-PAGE-001**: Três abas de relatório: Financeiro, Agendamentos, Estoque.
- **FR-REP-PAGE-002**: Filtros de data (início/fim) em todos os relatórios.
- **FR-REP-PAGE-003**: Filtro opcional por profissional no relatório financeiro e de agendamentos.
- **FR-REP-PAGE-004**: Exibir estado de loading durante geração do relatório.
- **FR-REP-PAGE-005**: Exibir estado de erro claro se a API falhar.

---

## Componentes

- `ReportsContent.tsx` — página principal com abas
- `reportsService.ts` — chamadas para os 3 endpoints de relatório
- `types/reports.types.ts` — tipos de resposta dos relatórios
