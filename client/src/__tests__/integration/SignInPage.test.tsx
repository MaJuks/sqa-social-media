import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignIn from "@/app/signin/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

jest.mock("@/service/auth/auth", () => ({
  authService: {
    signIn: jest.fn(),
  },
}));

describe("Página de Login", () => {
  test("renderiza os campos de email, senha e botão de entrar", () => {
    render(<SignIn />);

    expect(screen.getByPlaceholderText("seu@email.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByText("Entrar", { selector: "h1" })).toBeInTheDocument();
  });

  test("exibe mensagem de erro ao submeter com email vazio", async () => {
    render(<SignIn />);

    fireEvent.submit(document.querySelector("form")!);

    await waitFor(() => {
      expect(screen.getByText("Email é obrigatório")).toBeInTheDocument();
    });
  });
});
