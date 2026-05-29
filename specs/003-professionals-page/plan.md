# Plano de Implementação: Professionals Page

**Página**: `/professionals`  
**Status**: ✅ Implementado

---

## Estrutura de Arquivos

```
src/
├── app/(dashboard)/professionals/
│   ├── page.tsx
│   └── _lazy.tsx
└── modules/professionals/
    ├── ProfessionalList.tsx
    ├── ProfessionalForm.tsx
    ├── WorkingHoursForm.tsx
    ├── professionalsService.ts
    └── useProfessionals.ts
```

---

## Decisões Técnicas

### 1. WorkingHoursForm com dias da semana como checkboxes
Cada dia da semana é um toggle. Quando habilitado, exibe campos de hora início e fim. Envia array com apenas os dias configurados.

### 2. Formulário controlado com react-hook-form + zod
Validação client-side com zod schema, integrado ao react-hook-form. Erros exibidos inline abaixo de cada campo.

---

## Dependências

- `react-hook-form`, `zod`
- `swr`
- `types/` (tipos de Professional, WorkingHour)
