# Plan: Perfil Ampliado do Cliente

**Página**: `/clientes/:id`  
**Última atualização**: 2026-05-30

---

## Arquitetura de Componentes

```
ClientProfilePage
├── ClientDataPanel         ← painel de 4 métricas no topo (sticky opcional)
│   ├── MetricCard (visitas)
│   ├── MetricCard (valor gasto)
│   ├── MetricCard (último atendimento)
│   └── MetricCard (próximo agendamento)
├── AlertsBanner            ← anamnese pendente + alertas de saúde (se existirem)
├── QuickActions            ← botão "Novo agendamento" + botão WhatsApp
├── ProfileTabs
│   ├── Tab: Resumo         ← próximo agendamento + alertas de anamnese
│   ├── Tab: Anamnese       ← fichas preenchidas + alertas de respostas críticas
│   ├── Tab: Observações    ← feed cronológico com texto e galeria de fotos
│   └── Tab: Histórico      ← lista paginada de agendamentos passados
└── NewAppointmentModal     ← modal com cliente pré-preenchido
```

---

## Data Fetching

### Painel de Dados (agregado)

```
GET /clients/:id/summary
→ {
    totalVisits: 23,
    totalSpent: 1840.50,
    lastAppointment: { date, service, professional },
    nextAppointment: { date, service, professional } | null,
    pendingAnamnesis: boolean,
    activeAlerts: string[]
  }
```

Endpoint novo — retorna dados agregados em um único request para evitar waterfalls.

### Observações com Fotos

```
GET /clients/:id/notes?page=1&limit=10
POST /clients/:id/notes          (multipart/form-data: text + files[])
DELETE /clients/:id/notes/:noteId
```

### Upload de Fotos

Fluxo de upload:
1. Frontend faz `POST /clients/:id/notes` com `multipart/form-data`
2. Backend valida tipo (JPG/PNG/WEBP) e tamanho (≤ 5MB) de cada arquivo
3. Faz upload para S3/Cloudflare R2 e salva apenas as URLs no banco
4. Retorna nota criada com URLs das fotos

### Abrindo Modal de Agendamento

```typescript
// Ao clicar em "Novo agendamento" no perfil do cliente
router.push(`/agendamentos/novo?clientId=${client.id}&clientName=${client.name}`)
// OU abre modal com estado pré-preenchido via Zustand/store de agendamentos
```

---

## Lightbox de Fotos

Usar biblioteca leve (ex: `yet-another-react-lightbox`) para:
- Abrir foto em fullscreen ao clicar na miniatura
- Navegação entre fotos da mesma observação com setas
- Swipe em mobile

---

## AlertsBanner

Renderizado apenas se `pendingAnamnesis=true` OR `activeAlerts.length > 0`.  
Alertas de saúde (anamnese) aparecem em vermelho com ícone de aviso — sempre acima das tabs.

```tsx
{(summary.pendingAnamnesis || summary.activeAlerts.length > 0) && (
  <AlertsBanner
    pendingAnamnesis={summary.pendingAnamnesis}
    alerts={summary.activeAlerts}
    onFillAnamnesis={() => setActiveTab('anamnese')}
  />
)}
```

---

## Decisões de Design

- **Por que endpoint `/summary` agregado?** Evita 4 requests paralelos (waterfall) no carregamento do perfil. Um único endpoint é mais performático e simples de cachear.
- **Por que fotos no S3 e URLs no banco?** Banco de dados não deve armazenar blobs. S3 escala, tem CDN integrado e permite expiração de URLs.
- **Por que modal ao invés de navegar para outra página?** Contexto do cliente não é perdido; usuário pode fechar o modal e continuar no perfil.
