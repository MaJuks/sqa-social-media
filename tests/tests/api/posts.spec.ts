import { test, expect } from "@playwright/test";

/**
 * testes de api: posts (/posts e /posts/:id/like)
 *
 * testa os endpoints de posts da api de forma isolada (caixa preta),
 * verificando a listagem de posts e o comportamento do sistema de curtidas.
 */

const API_BASE_URL = "http://localhost:8080";
const validPassword = "Senha@123";

// helper: cria um usuario e retorna seu id
async function createUser(request: any): Promise<number> {
  const email = `posts_test_${Date.now()}@example.com`;
  const response = await request.post(`${API_BASE_URL}/auth/signup`, {
    data: { email, password: validPassword },
  });
  const body = await response.json();
  return body.id;
}

test.describe("API - GET /posts", () => {
  test("deve retornar lista de posts com estrutura correta (200)", async ({
    request,
  }) => {
    const response = await request.get(`${API_BASE_URL}/posts`);

    expect(response.status()).toBe(200);

    const body = await response.json();

    // verifica estrutura do response
    expect(body).toHaveProperty("posts");
    expect(body).toHaveProperty("total");
    expect(body).toHaveProperty("skip");
    expect(body).toHaveProperty("limit");

    // verifica que posts e um array
    expect(Array.isArray(body.posts)).toBe(true);
    expect(body.posts.length).toBeGreaterThan(0);

    // verifica estrutura de um post individual
    const firstPost = body.posts[0];
    expect(firstPost).toHaveProperty("id");
    expect(firstPost).toHaveProperty("title");
    expect(firstPost).toHaveProperty("body");
  });

  test("deve respeitar os parametros de paginacao limit e skip", async ({
    request,
  }) => {
    const limit = 5;
    const skip = 0;

    const response = await request.get(
      `${API_BASE_URL}/posts?limit=${limit}&skip=${skip}`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    // verifica que o numero de posts retornados respeita o limit
    expect(body.posts.length).toBeLessThanOrEqual(limit);
    expect(body.skip).toBe(skip);
  });
});

test.describe("API - POST /posts/:id/like", () => {
  test("deve curtir um post e retornar o estado liked como booleano", async ({
    request,
  }) => {
    const userId = await createUser(request);
    const postId = 1; // post fixo do dummyjson

    const response = await request.post(
      `${API_BASE_URL}/posts/${postId}/like?userId=${userId}`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty("postId", postId);
    expect(body).toHaveProperty("liked");
    expect(typeof body.liked).toBe("boolean");
  });

  test("deve alternar o estado de curtida (toggle) ao chamar o endpoint duas vezes", async ({
    request,
  }) => {
    const userId = await createUser(request);
    const postId = 2; // post fixo do dummyjson

    // primeira curtida
    const firstResponse = await request.post(
      `${API_BASE_URL}/posts/${postId}/like?userId=${userId}`
    );
    const firstBody = await firstResponse.json();
    const firstLikedState = firstBody.liked;

    // segunda chamada: deve inverter o estado
    const secondResponse = await request.post(
      `${API_BASE_URL}/posts/${postId}/like?userId=${userId}`
    );
    const secondBody = await secondResponse.json();

    expect(secondBody.liked).toBe(!firstLikedState);
  });
});
