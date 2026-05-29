import { test, expect } from '@playwright/test';
import { registerBusiness, loginViaUI } from './helpers/auth';

test.describe('Professionals', () => {
  test('registers a new professional', async ({ page, request }) => {
    const account = await registerBusiness(request, 'prof-create');
    await loginViaUI(page, account);

    await page.goto('/professionals');

    // Open create modal
    await page.click('button:has-text("+ Novo profissional")');
    await expect(page.locator('text=Novo profissional')).toBeVisible();

    const ts = Date.now();
    await page.fill('#name', 'Juliana Souza');
    await page.fill('#email', `juliana.${ts}@salon.com`);
    await page.fill('#password', 'Test@1234');
    await page.fill('#specialty', 'Manicure');

    await page.click('button[type="submit"]:has-text("Cadastrar")');

    await expect(page.locator('text=Profissional cadastrado!')).toBeVisible({ timeout: 5000 });

    // Professional appears in the list
    await expect(page.locator('text=Juliana Souza')).toBeVisible();
  });

  test('opens working hours modal for a professional', async ({ page, request }) => {
    const account = await registerBusiness(request, 'prof-hours');
    await loginViaUI(page, account);

    // Seed a professional via API first
    const ts = Date.now();
    const profRes = await request.post(
      `http://localhost:8888/api/v1/businesses/${account.businessId}/professionals`,
      {
        headers: { Authorization: `Bearer ${account.token}` },
        data: { name: 'Carla Lima', email: `carla.${ts}@test.com`, password: 'Test@1234' },
      },
    );
    expect(profRes.ok()).toBeTruthy();

    await page.goto('/professionals');

    // Click "Horários" for the professional
    const horariosBtn = page.locator('button:has-text("Horários")').first();
    await expect(horariosBtn).toBeVisible({ timeout: 5000 });
    await horariosBtn.click();

    // Working hours modal opens
    await expect(page.locator('text=Carla Lima')).toBeVisible();

    // Confirm the form is present (at least one day checkbox or select)
    await expect(page.locator('text=Segunda').or(page.locator('text=SEG').or(page.locator('text=MON')))).toBeVisible({ timeout: 3000 });
  });

  test('edits an existing professional', async ({ page, request }) => {
    const account = await registerBusiness(request, 'prof-edit');
    await loginViaUI(page, account);

    const ts = Date.now();
    const profRes = await request.post(
      `http://localhost:8888/api/v1/businesses/${account.businessId}/professionals`,
      {
        headers: { Authorization: `Bearer ${account.token}` },
        data: { name: 'Beatriz Costa', email: `beatriz.${ts}@test.com`, password: 'Test@1234' },
      },
    );
    expect(profRes.ok()).toBeTruthy();

    await page.goto('/professionals');

    const editBtn = page.locator('button:has-text("Editar")').first();
    await expect(editBtn).toBeVisible({ timeout: 5000 });
    await editBtn.click();

    await page.fill('#name', 'Beatriz Costa Silva');
    await page.fill('#specialty', 'Coloração');
    await page.click('button[type="submit"]:has-text("Salvar")');

    await expect(page.locator('text=Profissional atualizado!')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Beatriz Costa Silva')).toBeVisible();
  });
});
