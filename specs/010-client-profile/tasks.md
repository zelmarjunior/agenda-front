# Tasks: Perfil Ampliado do Cliente

**Status geral**: ⬜ Não iniciado

---

## Fase 1 — Painel de Dados (Summary)

- [ ] **T1.1** Adicionar endpoint `GET /clients/:id/summary` no backend (ou verificar se já existe aggregado)
- [ ] **T1.2** Criar `ClientDataPanel` com 4 MetricCards (visitas, valor gasto, último, próximo)
- [ ] **T1.3** Integrar `GET /clients/:id/summary` com React Query
- [ ] **T1.4** Skeleton loader para o painel de dados

## Fase 2 — AlertsBanner

- [ ] **T2.1** Criar `AlertsBanner` que renderiza alertas de anamnese e alertas de saúde
- [ ] **T2.2** Garantir que banner aparece acima das tabs sempre que `pendingAnamnesis=true` ou `activeAlerts.length > 0`
- [ ] **T2.3** Botão no banner navega diretamente para tab Anamnese

## Fase 3 — Quick Actions

- [ ] **T3.1** Criar botão "Novo agendamento" que abre modal com cliente pré-preenchido
- [ ] **T3.2** Integrar store de agendamentos para pré-preencher o clientId/clientName
- [ ] **T3.3** Criar botão WhatsApp com link pré-formatado para o telefone do cliente

## Fase 4 — Tab: Anamnese

- [ ] **T4.1** Integrar `GET /clients/:id/anamnesis`
- [ ] **T4.2** Listar fichas preenchidas com data, profissional e status
- [ ] **T4.3** Destacar respostas de alerta em vermelho
- [ ] **T4.4** Botão para aplicar nova anamnese (abre modal de seleção de template)
- [ ] **T4.5** Criar modal de preenchimento de anamnese inline (profissional preenche presencialmente)

## Fase 5 — Tab: Observações com Fotos

- [ ] **T5.1** Integrar `GET /clients/:id/notes` paginado
- [ ] **T5.2** Criar feed de observações (texto + miniaturas de fotos)
- [ ] **T5.3** Criar `AddNoteForm` com textarea + input de upload de fotos
- [ ] **T5.4** Implementar upload de fotos (multipart/form-data) com preview antes do envio
- [ ] **T5.5** Validar tipo (JPG/PNG/WEBP) e tamanho (≤ 5MB) no frontend antes do upload
- [ ] **T5.6** Integrar lightbox (`yet-another-react-lightbox` ou similar) para visualização ampliada
- [ ] **T5.7** Deletar observação com confirmação

## Fase 6 — Tab: Histórico de Agendamentos

- [ ] **T6.1** Mover/adaptar lista de agendamentos do perfil atual para a tab Histórico
- [ ] **T6.2** Paginação de 10 por página
- [ ] **T6.3** Filtro por status (todos, concluídos, cancelados)

## Fase 7 — Polimento e Integração

- [ ] **T7.1** Navegação entre tabs sem reload (state na URL: `?tab=anamnese`)
- [ ] **T7.2** Testar responsividade mobile
- [ ] **T7.3** Testar fluxo completo: abrir perfil → ver alerta → preencher anamnese → verificar alerta sumiu
