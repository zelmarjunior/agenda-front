# Frontend Data Model & Type Definitions

> **Fonte de Verdade**: `backend-openapi-spec.yml` na raiz do projeto.  
> Os tipos abaixo refletem o que o backend REALMENTE retorna (verificado contra os DTOs do `agenda-back`).

---

## TypeScript Types (Como Estão no Código)

Os tipos de produção vivem em `src/types/`. Este documento documenta os shapes reais.

### API Wrappers

```typescript
// src/types/api.types.ts
interface SuccessResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
```

---

### Auth

```typescript
// src/types/auth.types.ts

interface LoginStep1Request {
  email: string;
}

interface LoginStep1Response {
  businessId: string;
  businessName: string;
}

interface LoginRequest {
  email: string;
  password: string;
  businessId: string;
}

interface LoginResponse {
  accessToken: string;
}

interface RegisterRequest {
  businessName: string;
  email: string;
  password: string;
  // address, phone, ownerIsAlsoProfessional são opcionais — backend ignora campos extras com whitelist
}

interface RegisterResponse {
  businessId: string;
  businessName: string;
}

// JWT Payload (decodificado de accessToken)
interface JwtPayload {
  sub: string;          // userId
  email: string;
  businessId: string;
  roles: string[];      // ex.: ['OWNER'] ou ['PROFESSIONAL']
  iat: number;
  exp: number;
}
```

---

### Business

```typescript
// src/types/business.types.ts

interface Business {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string;
  createdAt: string;
}

interface UpdateBusinessRequest {
  name?: string;
  address?: string;
  phone?: string;
}
```

---

### Professional

```typescript
// src/types/professionals.types.ts

interface Professional {
  id: string;
  name: string;
  specialty: string | null;
  commissionRate: number | null;
  userId: string;
  createdAt: string;
}

// Nota: Professional NÃO tem email/phone no response da API.
// Email e senha são do User associado (criados no POST professionals).

interface CreateProfessionalRequest {
  name: string;
  email: string;       // email do User que será criado
  password: string;    // senha do User
  specialty?: string;
  commissionRate?: number;
}

interface DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

interface WorkingHour {
  dayOfWeek: DayOfWeek;
  startTime: string;  // "HH:MM"
  endTime: string;    // "HH:MM"
}

interface SetWorkingHoursRequest {
  hours: WorkingHour[];
}

interface AvailableSlot {
  startTime: string;  // ISO date-time UTC
  endTime: string;    // ISO date-time UTC
}
```

---

### Client

```typescript
// src/types/clients.types.ts

interface Client {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  createdAt: string;
}

interface CreateClientRequest {
  name: string;
  phone?: string;
  email?: string;
}

interface UpdateClientRequest {
  name?: string;
  phone?: string;
  email?: string;
}
```

---

### Service

```typescript
// src/types/services.types.ts

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationMinutes: number;
  createdAt: string;
}

// Nota: price pode vir como string do backend — sempre converter com Number(price)

interface CreateServiceRequest {
  name: string;
  price: number;
  durationMinutes: number;
  description?: string;
}

interface UpdateServiceRequest {
  name?: string;
  price?: number;
  durationMinutes?: number;
  description?: string;
}
```

---

### Appointment

```typescript
// src/types/appointments.types.ts

type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

interface Appointment {
  id: string;
  client: Client;
  professional: Professional;
  service: Service;
  scheduledAt: string;      // ISO UTC date-time
  durationMinutes: number;
  status: AppointmentStatus;
  cancellationReason: string | null;
  createdAt: string;
}

interface CreateAppointmentRequest {
  clientId: string;
  professionalId: string;
  serviceId: string;
  scheduledAt: string;      // ISO date-time
}

interface CancelAppointmentRequest {
  reason: string;
}

interface RescheduleAppointmentRequest {
  scheduledAt: string;
  reason: string;
}

interface AppointmentFilters {
  date?: string;            // YYYY-MM-DD
  dateFrom?: string;
  dateTo?: string;
  professionalId?: string;
  status?: AppointmentStatus;
  page?: number;
  limit?: number;
}
```

---

### Inventory (Products)

```typescript
// src/types/inventory.types.ts

type ProductType = 'SERVICE_USE' | 'RETAIL';

interface Product {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  type: ProductType;
  createdAt: string;
}

// Nota: currentStock NÃO pode ser enviado no POST/PATCH.
// Use StockAdjustmentRequest para ajustar estoque.

interface CreateProductRequest {
  name: string;
  unit: string;
  minimumStock: number;     // OBRIGATÓRIO
  type: ProductType;
}

interface UpdateProductRequest {
  name?: string;
  unit?: string;
  minimumStock?: number;
  type?: ProductType;
}

interface StockAdjustmentRequest {
  quantity: number;    // positivo = entrada, negativo = saída
  reason: string;
}
```

---

### Reports

```typescript
// src/types/reports.types.ts

interface ReportFilters {
  from: string;    // YYYY-MM-DD
  to: string;      // YYYY-MM-DD
}

interface AppointmentReportRow {
  date: string;
  total: number;
  confirmed: number;
  cancelled: number;
  completed: number;
  revenue: number;
}

interface InventoryReportRow {
  productId: string;
  productName: string;
  currentStock: number;
  minimumStock: number;
  isLow: boolean;
}

interface RevenueReportRow {
  period: string;
  revenue: number;
  appointmentCount: number;
}
```

---

## Avisos Importantes

| Problema | Status | Solução |
|---------|--------|---------|
| `service.price` vem como `string` do backend | Contorno ativo | Converter com `Number(s.price)` antes de `.toFixed()` |
| `Professional` NÃO tem `email`/`phone` no response | Documentado | Usar `CreateProfessionalRequest.email` apenas no POST |
| `SetWorkingHoursRequest` usa `hours`, NÃO `workingHours` | Corrigido | Backend tem `forbidNonWhitelisted: true` |
| `CreateProductRequest` NÃO tem `currentStock` | Corrigido | Usar `StockAdjustmentRequest` para alterar estoque |
| Datas `scheduledAt` em UTC — exibir em local time | Em vigor | Usar `new Date(utcStr).getHours()` para local |

---

## Endpoints Mapeados

```
POST   /auth/login/step1                    → LoginStep1Response
POST   /auth/login                          → LoginResponse
POST   /auth/register                       → RegisterResponse

GET    /businesses/:id                      → Business
PATCH  /businesses/:id                      → Business

GET    /businesses/:id/professionals        → PaginatedResponse<Professional>
POST   /businesses/:id/professionals        → Professional
PATCH  /businesses/:id/professionals/:pid  → Professional
DELETE /businesses/:id/professionals/:pid
POST   /businesses/:id/professionals/:pid/hours         → (void)
GET    /businesses/:id/professionals/:pid/available-slots → AvailableSlot[]
POST   /businesses/:id/professionals/:pid/link-services → (void)

GET    /businesses/:id/clients              → PaginatedResponse<Client>
POST   /businesses/:id/clients             → Client
PATCH  /businesses/:id/clients/:cid        → Client
GET    /businesses/:id/clients/:cid/appointments → PaginatedResponse<Appointment>

GET    /businesses/:id/services             → PaginatedResponse<Service>
POST   /businesses/:id/services            → Service
PATCH  /businesses/:id/services/:sid       → Service
DELETE /businesses/:id/services/:sid

GET    /businesses/:id/appointments         → PaginatedResponse<Appointment>
POST   /businesses/:id/appointments        → Appointment
PATCH  /businesses/:id/appointments/:aid/confirm
PATCH  /businesses/:id/appointments/:aid/cancel
PATCH  /businesses/:id/appointments/:aid/complete
PATCH  /businesses/:id/appointments/:aid/reschedule

GET    /businesses/:id/inventory            → PaginatedResponse<Product>
POST   /businesses/:id/inventory           → Product
PATCH  /businesses/:id/inventory/:pid      → Product
PATCH  /businesses/:id/inventory/:pid/stock

GET    /businesses/:id/reports/appointments → AppointmentReportRow[]
GET    /businesses/:id/reports/inventory    → InventoryReportRow[]
GET    /businesses/:id/reports/revenue      → RevenueReportRow[]
```

---

**Version**: 2.0.0 | **Last Updated**: 2026-05-28
