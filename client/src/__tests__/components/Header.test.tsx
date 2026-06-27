import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "@/components/Header";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    logout: jest.fn(),
  }),
}));

describe("Header", () => {
  test("exibe título e botões de entrar e criar conta quando não autenticado", () => {
    render(<Header />);

    expect(screen.getByText("SQA Social Media")).toBeInTheDocument();
    expect(screen.getByText("Entrar")).toBeInTheDocument();
    expect(screen.getByText("Criar Conta")).toBeInTheDocument();
  });
});
