import { saveUser, getUser } from "@/lib/localStorage";

describe("localStorage - persistência de sessão", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // bug encontrado: saveUser salva com a chave "user" mas getUser lê de "sqa_social_user"
  // depois do login, ao recarregar a página o usuário sempre aparece como deslogado
  test("deve recuperar o usuário salvo", () => {
    const user = { id: 1, email: "teste@exemplo.com" };
    saveUser(user);
    expect(getUser()).toEqual(user);
  });

  test("retorna null quando não há usuário salvo", () => {
    expect(getUser()).toBeNull();
  });
});
