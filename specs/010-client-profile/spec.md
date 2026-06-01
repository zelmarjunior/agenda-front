# Spec: Perfil Ampliado do Cliente

**Página**: `/clientes/:id`  
**Status**: 📝 Especificado | ⬜ Implementado | ⬜ Testado  
**Última atualização**: 2026-05-30

---

## User Story

**Como** dono ou profissional de um negócio,  
**Quero** um perfil rico do cliente com painel de dados, histórico de observações com fotos e anamnese,  
**Para que** ofereça atendimento personalizado com todo o contexto do cliente disponível na tela.

---

## Acceptance Scenarios

1. **Given** dono abre o perfil de um cliente, **When** a página carrega, **Then** vê painel de dados no topo: total de visitas, valor gasto, último atendimento, próximo agendamento.

2. **Given** profissional quer registrar observação pós-atendimento, **When** adiciona texto e faz upload de foto (ex: foto do resultado), **Then** observação aparece no histórico com data, profissional e imagem em miniatura.

3. **Given** cliente com anamnese pendente, **When** profissional abre o perfil, **Then** alerta de anamnese pendente aparece no topo com botão para iniciar preenchimento.

4. **Given** cliente com resposta de alerta na anamnese (ex: alergia a oxidante), **When** profissional visualiza o perfil, **Then** alerta aparece destacado em vermelho no painel.

5. **Given** perfil do cliente aberto, **When** profissional clica em "Novo agendamento", **Then** modal de agendamento abre com o cliente já preenchido automaticamente.

6. **Given** histórico de observações com 10 fotos, **When** profissional clica em uma miniatura, **Then** lightbox abre com visualização ampliada e navegação entre imagens.

7. **Given** cliente sem agendamentos futuros, **When** dono visualiza o painel de dados, **Then** campo "Próximo agendamento" exibe "Nenhum agendado" com botão de agendamento rápido.

---

## Functional Requirements

- **FR-CLI-001**: Painel de dados DEVE calcular em tempo real: total de visitas, valor gasto (soma de agendamentos concluídos), data do último e do próximo atendimento.
- **FR-CLI-002**: Observações DEVEM suportar texto + até 5 fotos por observação.
- **FR-CLI-003**: Upload de fotos DEVE aceitar JPG/PNG/WEBP com limite de 5MB por arquivo.
- **FR-CLI-004**: Alertas de anamnese DEVEM aparecer antes do conteúdo principal do perfil.
- **FR-CLI-005**: Botão "Novo agendamento" DEVE pré-preencher o cliente no modal/página de agendamento.
- **FR-CLI-006**: Histórico de observações DEVE ser paginado (10 por página).
- **FR-CLI-007**: Fotos DEVEM ser armazenadas em storage externo (S3 ou similar); perfil salva apenas URLs.

---

## Sections

1. **Painel de Dados** (topo) — 4 métricas-chave em cards
2. **Alertas** — anamnese pendente / alertas de saúde em destaque
3. **Próximo Agendamento** — card com botão de confirmação WhatsApp
4. **Anamnese** — tab com fichas preenchidas e alertas de respostas críticas
5. **Observações** — feed cronológico com texto e galeria de fotos
6. **Histórico de Agendamentos** — lista paginada de todos os atendimentos

---

## Success Criteria

- **SC-CLI-001**: Painel de dados carrega em < 1.5 segundos.
- **SC-CLI-002**: Upload de foto aceito e exibido em < 5 segundos.
- **SC-CLI-003**: Botão "Novo agendamento" pré-preenche o cliente em 100% dos cliques.
- **SC-CLI-004**: Alertas de anamnese nunca aparecem abaixo do fold na primeira visualização.
