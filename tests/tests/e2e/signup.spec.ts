import { test, expect } from "@playwright/test";

/**
 * teste e2e 1: fluxo de cadastro de usuario
 */

const BASE_URL = "http://localhost:3000";
const validPassword = "Senha@123";

test.describe("Fluxo de Cadastro (Signup)", () => {
  test("deve permitir cadastro com e-mail e senha validos e redirecionar para o feed", async ({
    page,
  }) => {
    const uniqueEmail = `teste_${Date.now()}@example.com`;

    await page.goto(`${BASE_URL}/signup`);
    await expect(page).toHaveURL(`${BASE_URL}/signup`);

    await page.locator('input[type="email"]').fill(uniqueEmail);
    await page.locator('input[type="password"]').first().fill(validPassword);
    await page.locator('input[type="password"]').nth(1).fill(validPassword);

    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(`${BASE_URL}/`, { timeout: 8000 });
  });

  test("deve permanecer na pagina de signup ao tentar cadastrar com e-mail ja existente", async ({
    page,
  }) => {
    const existingEmail = `duplicado_${Date.now()}@example.com`;

    // primeiro cadastro
    await page.goto(`${BASE_URL}/signup`);
    await page.locator('input[type="email"]').fill(existingEmail);
    await page.locator('input[type="password"]').first().fill(validPassword);
    await page.locator('input[type="password"]').nth(1).fill(validPassword);
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/`, { timeout: 8000 });

    // segundo cadastro com mesmo e-mail
    await page.goto(`${BASE_URL}/signup`);
    await page.locator('input[type="email"]').fill(existingEmail);
    await page.locator('input[type="password"]').first().fill(validPassword);
    await page.locator('input[type="password"]').nth(1).fill(validPassword);
    await page.locator('button[type="submit"]').click();

    // deve permanecer na pagina de signup
    await expect(page).toHaveURL(`${BASE_URL}/signup`);
  });
});
