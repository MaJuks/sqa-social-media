import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PostCard from "@/components/PostCard";

const mockPost = {
  id: 1,
  title: "Título do Post de Teste",
  body: "Corpo do post de teste.",
  liked: false,
};

describe("PostCard", () => {
  test("renderiza título, corpo e botão de curtir", () => {
    render(
      <PostCard
        post={mockPost}
        isAuthenticated={false}
        onLike={jest.fn()}
      />
    );

    expect(screen.getByText("Título do Post de Teste")).toBeInTheDocument();
    expect(screen.getByText("Corpo do post de teste.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /curtir/i })).toBeInTheDocument();
  });
});
