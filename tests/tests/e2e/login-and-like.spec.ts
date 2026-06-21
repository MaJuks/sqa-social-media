import { test, expect } from "@playwright/test";

/**
 * teste e2e 2: fluxo de login e curtida de post
 */

const BASE_URL = "http://localhost:3000";
const API_BASE_URL = "http://localhost:8080";
const validPassword = "Senha@123";

let testEmail: string;

test.beforeAll(async ({ request }) => {
  testEmail = `e2e_login_${Date.now()}@example.com`;
  await request.post(`${API_BASE_URL}/auth/signup`, {
    data: { email: testEmail, password: validPassword },
  });
});

test.describe("Fluxo de Login e Curtida", () => {
  test("deve fazer login com credenciais validas e exibir o feed de posts", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/signin`);
    await expect(page).toHaveURL(`${BASE_URL}/signin`);

    await page.locator('input[type="email"]').fill(testEmail);
    await page.locator('input[type="password"]').fill(validPassword);
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(`${BASE_URL}/`, { timeout: 8000 });

    const firstPost = page.getByRole("listitem").first();
    await expect(firstPost).toBeVisible({ timeout: 8000 });
  });

  test("deve curtir um post e confirmar mudanca de estado na interface", async ({
    page,
  }) => {
    // 1. faz login
    await page.goto(`${BASE_URL}/signin`);
    await page.locator('input[type="email"]').fill(testEmail);
    await page.locator('input[type="password"]').fill(validPassword);
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(`${BASE_URL}/`, { timeout: 8000 });

    // 2. aguarda os posts carregarem
    const firstPost = page.getByRole("listitem").first();
    await expect(firstPost).toBeVisible({ timeout: 8000 });

    // 3. clica em curtir no primeiro post
    const likeButton = page.getByRole("button", { name: "Curtir" }).first();
    await expect(likeButton).toBeVisible();
    await likeButton.click();

    // 4. verifica que o botao mudou para "Curtido" (confirma interacao do usuario)
    const likedButton = page.getByRole("button", { name: "Curtido" }).first();
    await expect(likedButton).toBeVisible({ timeout: 5000 });

    // 5. navega para a pagina de curtidos e confirma que ela carrega
    await page.goto(`${BASE_URL}/auth/liked`);
    await expect(page).toHaveURL(`${BASE_URL}/auth/liked`);

    // 6. verifica que a pagina renderizou (header visivel)
    await expect(page.locator("header")).toBeVisible({ timeout: 8000 });
  });
});
