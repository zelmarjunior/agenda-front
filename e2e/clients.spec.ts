import { test, expect } from '@playwright/test';
import { registerBusiness, loginViaUI } from './helpers/auth';

test.describe('Clients', () => {
  test('registers a new client', async ({ page, request }) => {
    const account = await registerBusiness(request, 'client-create');
    await loginViaUI(page, account);

    await page.goto('/clients');

    await page.click('button:has-text("+ Novo cliente")');

    // Modal title
    await expect(page.locator('[role="dialog"], .modal, [aria-modal="true"]').first()).toBeVisible({ timeout: 3000 });

    await page.fill('#name', 'Fernanda Lima');
    await page.fill('#phone', '11988887777');
    await page.fill('#email', 'fernanda@email.com');

    await page.click('button[type="submit"]:has-text("Cadastrar")');

    await expect(page.locator('text=Cliente cadastrado!')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Fernanda Lima')).toBeVisible();
  });

  test('searches for a client by name', async ({ page, request }) => {
    const account = await registerBusiness(request, 'client-search');
    await loginViaUI(page, account);

    // Seed a client via API
    const clientRes = await request.post(
      `http://localhost:8888/api/v1/businesses/${account.businessId}/clients`,
      {
        headers: { Authorization: `Bearer ${account.token}` },
        data: { name: 'Patrícia Santos', phone: '11977776666' },
      },
    );
    expect(clientRes.ok()).toBeTruthy();

    await page.goto('/clients');

    // Wait for list to load
    await expect(page.locator('text=Patrícia Santos')).toBeVisible({ timeout: 5000 });

    // Search
    await page.fill('input[placeholder="Buscar por nome..."]', 'Patrícia');
    await expect(page.locator('text=Patrícia Santos')).toBeVisible();
  });

  test('views client appointment history', async ({ page, request }) => {
    const account = await registerBusiness(request, 'client-history');
    await loginViaUI(page, account);

    const ts = Date.now();
    const clientRes = await request.post(
      `http://localhost:8888/api/v1/businesses/${account.businessId}/clients`,
      {
        headers: { Authorization: `Bearer ${account.token}` },
        data: { name: `Cliente Historia ${ts}`, phone: '11966665555' },
      },
    );
    expect(clientRes.ok()).toBeTruthy();

    await page.goto('/clients');

    const histBtn = page.locator('button:has-text("Histórico")').first();
    await expect(histBtn).toBeVisible({ timeout: 5000 });
    await histBtn.click();

    // History modal opens
    await expect(
      page.locator('text=Histórico').or(page.locator('text=histórico')),
    ).toBeVisible({ timeout: 3000 });
  });

  test('edits a client', async ({ page, request }) => {
    const account = await registerBusiness(request, 'client-edit');
    await loginViaUI(page, account);

    const ts = Date.now();
    const clientRes = await request.post(
      `http://localhost:8888/api/v1/businesses/${account.businessId}/clients`,
      {
        headers: { Authorization: `Bearer ${account.token}` },
        data: { name: `Rita Mendes ${ts}`, phone: '11955554444' },
      },
    );
    expect(clientRes.ok()).toBeTruthy();

    await page.goto('/clients');

    const editBtn = page.locator('button:has-text("Editar")').first();
    await expect(editBtn).toBeVisible({ timeout: 5000 });
    await editBtn.click();

    await page.fill('#name', 'Rita Mendes Silva');
    await page.click('button[type="submit"]:has-text("Salvar")');

    await expect(page.locator('text=Cliente atualizado!')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Rita Mendes Silva')).toBeVisible();
  });
});
