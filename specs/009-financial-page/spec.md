# Spec: Página Financeira

**Página**: `/financeiro`  
**Status**: 📝 Especificado | ⬜ Implementado | ⬜ Testado  
**Última atualização**: 2026-05-30

---

## User Story

**Como** dono de um negócio,  
**Quero** uma página dedicada ao controle financeiro com caixa do dia, custos e insights de IA,  
**Para que** entenda a saúde financeira do salão em tempo real e tome decisões embasadas.

---

## Acceptance Scenarios

1. **Given** dono acessa `/financeiro`, **When** a página carrega, **Then** vê o caixa do dia com total de entradas, saídas e saldo líquido do dia atual.

2. **Given** caixa do dia visível, **When** dono clica em "Entradas", **Then** expande lista de agendamentos concluídos hoje com valor e meio de pagamento de cada um.

3. **Given** caixa do dia visível, **When** dono clica em "Saídas", **Then** expande lista de custos do dia (fixos proporcionados + variáveis).

4. **Given** dono seleciona período "Último mês" no filtro, **When** visualiza o resumo, **Then** vê receita bruta, total de custos, lucro líquido e margem percentual do período.

5. **Given** seção de custos fixos, **When** dono adiciona "Aluguel" R$ 2.500 mensal, **Then** custo aparece na lista e é considerado nas projeções.

6. **Given** dono abre seção "Insights IA", **When** clica em "Analisar meu financeiro", **Then** IA retorna análise contextualizada com tendências, alertas e sugestões em streaming.

7. **Given** visão de breakdown por meio de pagamento, **When** dono visualiza, **Then** vê gráfico de pizza com proporção Dinheiro / Pix / Cartão / Outros.

8. **Given** custo variável "Compra de produtos" de R$ 450, **When** dono registra, **Then** aparece na lista de saídas do período e reduz o lucro líquido.

---

## Functional Requirements

- **FR-FIN-001**: Caixa do dia DEVE atualizar em tempo real ao concluir agendamentos.
- **FR-FIN-002**: Filtro de período DEVE suportar: hoje, esta semana, este mês, mês anterior, personalizado.
- **FR-FIN-003**: Gráfico de receita DEVE mostrar evolução semanal/mensal com linha de tendência.
- **FR-FIN-004**: IA DEVE usar os dados financeiros reais do período selecionado para a análise.
- **FR-FIN-005**: CRUD de custos fixos DEVE ter feedback visual imediato (optimistic update).
- **FR-FIN-006**: Breakdown por meio de pagamento DEVE ser interativo (clique filtra a lista).
- **FR-FIN-007**: Página DEVE ser restrita a usuários com role `OWNER`.

---

## Sections

1. **Caixa do Dia** — saldo em destaque + listas expansíveis de entradas/saídas
2. **Resumo do Período** — receita bruta, custos, lucro, margem (filtro de período)
3. **Gráficos** — evolução de receita + breakdown por meio de pagamento
4. **Custos Fixos** — CRUD de custos recorrentes
5. **Custos Variáveis** — registro avulso de despesas
6. **Insights IA** — análise contextualizada com streaming

---

## Success Criteria

- **SC-FINUI-001**: Caixa do dia carrega em < 2 segundos.
- **SC-FINUI-002**: Insights de IA chegam em streaming (< 3s para primeiro token).
- **SC-FINUI-003**: Adição de custo fixo reflete na projeção sem recarregar a página.
- **SC-FINUI-004**: Página não renderiza para usuários sem role OWNER (redirect).
