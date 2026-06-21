import { test, expect } from "@playwright/test";

/**
 * testes de api: autenticacao (/auth/signin e /auth/signup)
 *
 * testa os endpoints de autenticacao da api de forma isolada (caixa preta),
 * verificando status codes, estrutura de resposta e cenarios de erro.
 */

const API_BASE_URL = "http://localhost:8080";

// e-mail unico por execucao de teste para evitar conflito
const uniqueEmail = `api_test_${Date.now()}@example.com`;
const validPassword = "Senha@123";

test.describe("API - POST /auth/signup", () => {
  test("deve criar um novo usuario com dados validos (201)", async ({
    request,
  }) => {
    const response = await request.post(`${API_BASE_URL}/auth/signup`, {
      data: {
        email: uniqueEmail,
        password: validPassword,
      },
    });

    // verifica status de sucesso (201 created ou 200 ok)
    expect([200, 201]).toContain(response.status());

    const body = await response.json();

    // verifica que a resposta contem os campos esperados
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("email", uniqueEmail);
    expect(typeof body.id).toBe("number");
  });

  test("deve retornar 409 ao tentar cadastrar com e-mail ja existente", async ({
    request,
  }) => {
    // primeiro cadastro
    await request.post(`${API_BASE_URL}/auth/signup`, {
      data: {
        email: uniqueEmail,
        password: validPassword,
      },
    });

    // segundo cadastro com o mesmo e-mail
    const response = await request.post(`${API_BASE_URL}/auth/signup`, {
      data: {
        email: uniqueEmail,
        password: validPassword,
      },
    });

    expect(response.status()).toBe(409);
  });
});

test.describe("API - POST /auth/signin", () => {
  test("deve autenticar usuario com credenciais validas (200)", async ({
    request,
  }) => {
    // cadastra um usuario para poder fazer login
    const signupEmail = `signin_test_${Date.now()}@example.com`;
    await request.post(`${API_BASE_URL}/auth/signup`, {
      data: { email: signupEmail, password: validPassword },
    });

    // faz login com as credenciais cadastradas
    const response = await request.post(`${API_BASE_URL}/auth/signin`, {
      data: {
        email: signupEmail,
        password: validPassword,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("email", signupEmail);
  });

  test("deve retornar 401 ao tentar login com senha incorreta", async ({
    request,
  }) => {
    // cadastra um usuario
    const signupEmail = `wrong_pass_${Date.now()}@example.com`;
    await request.post(`${API_BASE_URL}/auth/signup`, {
      data: { email: signupEmail, password: validPassword },
    });

    // tenta login com senha errada
    const response = await request.post(`${API_BASE_URL}/auth/signin`, {
      data: {
        email: signupEmail,
        password: "SenhaErrada@999",
      },
    });

    expect(response.status()).toBe(401);
  });
});
