import { test, expect } from '@playwright/test';
import { registerBusiness, loginViaUI } from './helpers/auth';

const API_BASE = 'http://localhost:8888/api/v1';

test.describe('Auth — Register & Login', () => {
  test('registers a new business and lands on dashboard', async ({ page, request }) => {
    const ts = Date.now();
    const email = `e2e.reg.${ts}@test.com`;
    const password = 'Test@1234';
    const businessName = `Salão Novo ${ts}`;

    await page.goto('/register');

    await page.fill('#businessName', businessName);
    await page.fill('#address', 'Rua das Flores, 100');
    await page.fill('#phone', '11999990000');
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.fill('#confirmPassword', password);
    await page.click('button[type="submit"]:has-text("Criar negócio")');

    await page.waitForURL('/');
    await expect(page).toHaveURL('/');

    // localStorage should have the token
    const token = await page.evaluate(() => localStorage.getItem('agenda:token'));
    expect(token).toBeTruthy();
  });

  test('logs in with 2-step flow after registration', async ({ page, request }) => {
    const account = await registerBusiness(request, 'login');

    // Pre-seed localStorage so step 2 resolves correctly
    await page.addInitScript(
      ({ key, value }) => localStorage.setItem(key, value),
      {
        key: 'agenda:lastBusiness',
        value: JSON.stringify({ businessId: account.businessId, businessName: account.businessName }),
      },
    );

    await page.goto('/login');

    // Step 1 — enter email
    await page.fill('#email', account.email);
    await page.click('button[type="submit"]:has-text("Continuar")');

    // Step 2 — shows business name
    await expect(page.locator(`text=${account.businessName}`)).toBeVisible();

    await page.fill('#password', account.password);
    await page.click('button[type="submit"]:has-text("Entrar")');

    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });

  test('shows error when password is wrong', async ({ page, request }) => {
    const account = await registerBusiness(request, 'wrongpw');

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
    await page.fill('#password', 'senhaerrada');
    await page.click('button[type="submit"]:has-text("Entrar")');

    // Should stay on login — toast or validation message appears
    await expect(page).not.toHaveURL('/');
  });

  test('logout redirects to /login', async ({ page, request }) => {
    const account = await registerBusiness(request, 'logout');
    await loginViaUI(page, account);

    // Should be on dashboard
    await expect(page).toHaveURL('/');

    // Click logout ("Sair" in the sidebar)
    await page.click('button:has-text("Sair")');

    await page.waitForURL('/login');
    await expect(page).toHaveURL('/login');

    // Token should be cleared
    const token = await page.evaluate(() => localStorage.getItem('agenda:token'));
    expect(token).toBeNull();
  });
});
