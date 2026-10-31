import { afterEach, describe, it, expect } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Exercises } from "../src/components/Exercises";
import { csv } from "../src/components/common";
import LogicPage from "../src/pages/LogicPage";
afterEach(cleanup);
describe("React widgetek", () => {
  it("CSV helyesen idézőjelezi a címkéket", () =>
    expect(
      csv([
        ["a;b", 'c"d'],
        [1, 2],
      ]),
    ).toBe('"a;b";"c""d"\r\n1;2'));
  it("60 prímtényezőinek interaktív összeállítása", () => {
    render(<Exercises topic="number" />);
    fireEvent.click(screen.getByLabelText("15. feladat"));
    for (const n of [2, 2, 3, 5]) fireEvent.click(screen.getByText("× " + n));
    fireEvent.click(screen.getByText("Megoldás ellenőrzése"));
    expect(screen.getByRole("status")).toHaveTextContent("Helyes megoldás");
  });
  it("logikai kalkulátor hiba és igazságtábla", () => {
    render(<LogicPage />);
    const input = screen.getByLabelText("Logikai kifejezés");
    fireEvent.change(input, { target: { value: "A IFF B" } });
    expect(screen.getByText("4 értékelés")).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "A AND (" } });
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
  it("gyakorlófeladat helyes választ és indoklást ad", () => {
    render(<Exercises topic="number" />);
    fireEvent.click(screen.getByLabelText("2. feladat"));
    fireEvent.change(screen.getByLabelText("Válasz"), {
      target: { value: "34" },
    });
    fireEvent.click(screen.getByText("Megoldás ellenőrzése"));
    expect(screen.getByRole("status")).toHaveTextContent("Helyes megoldás");
    expect(screen.getByRole("status")).toHaveTextContent("2²");
  });
  it("szerkesztett logikai feladatot valódi algoritmussal értékel", () => {
    render(<Exercises topic="logic" />);
    fireEvent.click(screen.getByLabelText("15. feladat"));
    fireEvent.change(screen.getByLabelText("Logikai formula"), {
      target: { value: "A OR NOT A" },
    });
    fireEvent.click(screen.getByText("Megoldás ellenőrzése"));
    expect(screen.getByRole("status")).toHaveTextContent("Helyes megoldás");
  });
  it("interaktív háromcsúcsú fa", () => {
    render(<Exercises topic="graph" />);
    fireEvent.click(screen.getByLabelText("15. feladat"));
    fireEvent.click(screen.getByText("ab +"));
    fireEvent.click(screen.getByText("ac +"));
    fireEvent.click(screen.getByText("Megoldás ellenőrzése"));
    expect(screen.getByRole("status")).toHaveTextContent("Helyes megoldás");
  });
});
