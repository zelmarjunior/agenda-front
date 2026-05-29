import { test, expect } from '@playwright/test';
import { registerBusiness, loginViaUI, seedProfessional, seedService, seedClient } from './helpers/auth';

test.describe('Appointments', () => {
  test('creates a new appointment via the modal', async ({ page, request }) => {
    const account = await registerBusiness(request, 'appt-create');
    const professional = await seedProfessional(request, account);
    const service = await seedService(request, account);
    const client = await seedClient(request, account);

    await loginViaUI(page, account);
    await page.goto('/appointments');

    // Open create modal
    await page.click('button:has-text("+ Novo")');
    await expect(page.locator('text=Novo agendamento')).toBeVisible();

    // Select client
    await page.selectOption('#clientId', { label: client.name });

    // Select professional
    await page.selectOption('#professionalId', { label: professional.name });

    // Select service
    const serviceOption = page.locator('#serviceId option').filter({ hasText: service.name });
    const serviceValue = await serviceOption.getAttribute('value');
    await page.selectOption('#serviceId', serviceValue!);

    // Set date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    await page.fill('#date', dateStr);

    // Select first available time
    await page.waitForTimeout(800); // wait for slots to load
    const timeSelect = page.locator('#time');
    await expect(timeSelect).toBeEnabled();

    // Submit
    await page.click('button:has-text("Confirmar agendamento")');

    // Toast success
    await expect(page.locator('text=Agendamento criado!')).toBeVisible({ timeout: 5000 });

    // Modal closes
    await expect(page.locator('text=Novo agendamento')).not.toBeVisible();
  });

  test('confirms a PENDING appointment', async ({ page, request }) => {
    const account = await registerBusiness(request, 'appt-confirm');
    const professional = await seedProfessional(request, account);
    const service = await seedService(request, account);
    const client = await seedClient(request, account);

    // Create appointment via API
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const apptRes = await request.post(
      `http://localhost:8888/api/v1/businesses/${account.businessId}/appointments`,
      {
        headers: { Authorization: `Bearer ${account.token}` },
        data: {
          clientId: client.id,
          professionalId: professional.id,
          serviceId: service.id,
          scheduledAt: tomorrow.toISOString(),
        },
      },
    );
    expect(apptRes.ok(), `Create appt failed: ${await apptRes.text()}`).toBeTruthy();

    await loginViaUI(page, account);
    await page.goto('/appointments');

    // Switch to list view to see the appointment
    await page.click('button:has-text("Lista")');

    // Find the Confirmar button
    const confirmBtn = page.locator('button:has-text("Confirmar")').first();
    await expect(confirmBtn).toBeVisible({ timeout: 5000 });
    await confirmBtn.click();

    await expect(page.locator('text=Agendamento confirmado!')).toBeVisible({ timeout: 5000 });
  });

  test('cancels an appointment with a reason', async ({ page, request }) => {
    const account = await registerBusiness(request, 'appt-cancel');
    const professional = await seedProfessional(request, account);
    const service = await seedService(request, account);
    const client = await seedClient(request, account);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(11, 0, 0, 0);

    const apptRes = await request.post(
      `http://localhost:8888/api/v1/businesses/${account.businessId}/appointments`,
      {
        headers: { Authorization: `Bearer ${account.token}` },
        data: {
          clientId: client.id,
          professionalId: professional.id,
          serviceId: service.id,
          scheduledAt: tomorrow.toISOString(),
        },
      },
    );
    expect(apptRes.ok()).toBeTruthy();

    await loginViaUI(page, account);
    await page.goto('/appointments');

    // Switch to list view
    await page.click('button:has-text("Lista")');

    // Find and click Cancelar button
    const cancelBtn = page.locator('button:has-text("Cancelar")').first();
    await expect(cancelBtn).toBeVisible({ timeout: 5000 });
    await cancelBtn.click();

    // Cancel form/modal appears
    await expect(page.locator('text=Cancelar agendamento')).toBeVisible();

    // Fill reason
    await page.fill('#reason', 'Cliente solicitou cancelamento');
    await page.click('button:has-text("Cancelar agendamento")');

    await expect(page.locator('text=Agendamento cancelado')).toBeVisible({ timeout: 5000 });
  });
});
