import { type Page, type APIRequestContext, expect } from '@playwright/test';

const API_BASE = 'http://localhost:8888/api/v1';

export interface TestAccount {
  email: string;
  password: string;
  businessName: string;
  businessId: string;
  token: string;
}

export async function registerBusiness(request: APIRequestContext, suffix = ''): Promise<TestAccount> {
  const ts = Date.now() + suffix;
  const email = `e2e.${ts}@test.com`;
  const password = 'Test@1234';
  const businessName = `Salão E2E ${ts}`;

  const res = await request.post(`${API_BASE}/auth/register`, {
    data: { businessName, email, password, address: 'Rua Teste, 1', phone: '11999990000', ownerIsAlsoProfessional: false },
  });

  expect(res.ok(), `Register failed: ${await res.text()}`).toBeTruthy();
  const body = await res.json();
  const token: string = body.data.token;

  const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  return { email, password, businessName, businessId: payload.businessId, token };
}

export async function loginViaUI(page: Page, account: TestAccount): Promise<void> {
  // Pre-populate localStorage so step 2 knows the businessId
  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, value),
    {
      key: 'agenda:lastBusiness',
      value: JSON.stringify({ businessId: account.businessId, businessName: account.businessName }),
    },
  );

  await page.goto('/login');
  await page.fill('#email', account.email);
  await page.click('button[type="submit"]:has-text("Continuar")');
  await expect(page.locator('text=' + account.businessName)).toBeVisible();
  await page.fill('#password', account.password);
  await page.click('button[type="submit"]:has-text("Entrar")');
  await page.waitForURL('/');
}

export async function seedProfessional(
  request: APIRequestContext,
  account: TestAccount,
  name = 'Ana Teste',
): Promise<{ id: string; name: string }> {
  const ts = Date.now();
  const res = await request.post(`${API_BASE}/businesses/${account.businessId}/professionals`, {
    headers: { Authorization: `Bearer ${account.token}` },
    data: { name, email: `prof.${ts}@test.com`, password: 'Test@1234', specialty: 'Cabelo' },
  });
  expect(res.ok(), `Seed professional failed: ${await res.text()}`).toBeTruthy();
  const body = await res.json();
  return { id: body.data.id, name: body.data.name };
}

export async function seedService(
  request: APIRequestContext,
  account: TestAccount,
  name = 'Corte',
): Promise<{ id: string; name: string }> {
  const res = await request.post(`${API_BASE}/businesses/${account.businessId}/services`, {
    headers: { Authorization: `Bearer ${account.token}` },
    data: { name, price: 50, durationMinutes: 60 },
  });
  expect(res.ok(), `Seed service failed: ${await res.text()}`).toBeTruthy();
  const body = await res.json();
  return { id: body.data.id, name: body.data.name };
}

export async function seedClient(
  request: APIRequestContext,
  account: TestAccount,
  name = 'Maria Teste',
): Promise<{ id: string; name: string }> {
  const res = await request.post(`${API_BASE}/businesses/${account.businessId}/clients`, {
    headers: { Authorization: `Bearer ${account.token}` },
    data: { name, phone: '11999990001' },
  });
  expect(res.ok(), `Seed client failed: ${await res.text()}`).toBeTruthy();
  const body = await res.json();
  return { id: body.data.id, name: body.data.name };
}
