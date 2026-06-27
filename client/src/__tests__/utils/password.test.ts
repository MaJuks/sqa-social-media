import { isPasswordValid } from "@/utils/password";

describe("isPasswordValid", () => {
  test("deve retornar true para senha válida", () => {
    expect(isPasswordValid("Senha@123")).toBe(true);
  });

  // bug: a função usa `password.length <= 8`, então senha com exatamente 8 chars é rejeitada
  // o requisito diz mínimo 8 caracteres, então "Ab@12345" deveria ser válida
  test("deve aceitar senha com exatamente 8 caracteres", () => {
    expect(isPasswordValid("Ab@12345")).toBe(true);
  });
});
