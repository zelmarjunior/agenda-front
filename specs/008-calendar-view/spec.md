# Spec: Visualização Dinâmica do Calendário

**Página**: `/agendamentos`  
**Status**: 📝 Especificado | ⬜ Implementado | ⬜ Testado  
**Última atualização**: 2026-05-30

---

## User Story

**Como** dono ou profissional de um negócio,  
**Quero** navegar de forma fluida entre visão mensal e diária de agendamentos,  
**Para que** encontre rapidamente um agendamento específico e navegue entre dias sem recarregar a página.

---

## Acceptance Scenarios

1. **Given** usuário está na visão mensal, **When** clica em um dia com agendamentos, **Then** a visão muda para o dia clicado, mostrando os horários em timeline vertical.

2. **Given** usuário está na visão diária, **When** clica nas setas "Anterior" ou "Próximo", **Then** navega para o dia anterior/seguinte sem recarregar a página.

3. **Given** usuário está na visão diária, **When** clica em "Voltar ao mês" ou no cabeçalho do mês, **Then** a visão mês é restaurada com o mês do dia atual destacado.

4. **Given** visão diária aberta, **When** usuário scrolla para baixo, **Then** cabeçalho fixo permanece visível mostrando o dia, o total previsto e o total realizado.

5. **Given** visão mensal, **When** dia tem agendamentos, **Then** o dia mostra um indicador colorido e o valor total previsto do dia.

6. **Given** toggle "Mostrar espaços vazios" ativo, **When** usuário visualiza a timeline do dia, **Then** todos os horários do profissional são exibidos, incluindo os disponíveis (slots vazios).

7. **Given** toggle "Mostrar espaços vazios" inativo, **When** usuário visualiza a timeline, **Then** apenas agendamentos confirmados/pendentes aparecem (sem espaços).

8. **Given** visão diária com múltiplos profissionais, **When** usuário filtra por profissional, **Then** apenas os agendamentos daquele profissional aparecem.

---

## Functional Requirements

- **FR-UI-001**: Transição entre visão mensal e diária DEVE ser animada (< 300ms).
- **FR-UI-002**: Visão diária DEVE exibir timeline com slots de 30 minutos.
- **FR-UI-003**: Cabeçalho DEVE ser fixo (sticky) ao scrollar na visão diária.
- **FR-UI-004**: Cabeçalho diário DEVE mostrar: data, total previsto e total realizado.
- **FR-UI-005**: Toggle de espaços vazios DEVE persistir entre navegações na sessão.
- **FR-UI-006**: Navegação entre dias DEVE fazer prefetch do dia anterior e próximo.
- **FR-UI-007**: Visão mensal DEVE mostrar indicador de valor por dia (previsto em cinza, realizado em verde).
- **FR-UI-008**: Card de agendamento DEVE ter botão de confirmação WhatsApp integrado.

---

## UI States

- **Mensal**: grade de calendário, dias clicáveis, indicadores de carga e valor
- **Diário**: timeline vertical com horários, cabeçalho fixo, cards de agendamento
- **Transição**: animação slide/fade entre os dois modos
- **Carregando**: skeleton loader enquanto dados chegam
- **Dia vazio**: mensagem de encorajamento + botão "Novo agendamento"

---

## Success Criteria

- **SC-CAL-001**: Transição mensal → diário ocorre em < 300ms (dados já carregados).
- **SC-CAL-002**: Navegação entre dias adjacentes não faz nova requisição se dados já estão em cache.
- **SC-CAL-003**: Cabeçalho sticky permanece visível em 100% do scroll na visão diária.
- **SC-CAL-004**: Toggle de espaços vazios funciona offline (estado local).
