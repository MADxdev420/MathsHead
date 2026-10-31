import { test, expect } from "@playwright/test";
test("kattintásos csúcs és él, JSON megőrzés, súly, mátrixkijelölés", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/grafelmelet");
  await page.getByRole("button", { name: "Gráf törlése", exact: true }).click();
  await page
    .getByRole("button", { name: "Kattintással csúcs", exact: true })
    .click();
  const board = page.locator("#editor-board .graph-board");
  await board.scrollIntoViewIfNeeded();
  const b = await board.boundingBox();
  expect(b).toBeTruthy();
  await board.click({ position: { x: b!.width * 0.28, y: b!.height * 0.4 } });
  await board.click({ position: { x: b!.width * 0.68, y: b!.height * 0.6 } });
  await expect(page.getByLabel("Kijelölt csúcs").locator("option")).toHaveCount(
    3,
  );
  await page
    .getByRole("button", { name: "Két kattintással él", exact: true })
    .click();
  await page.locator("#editor-board svg ellipse").nth(0).click();
  await page.locator("#editor-board svg ellipse").nth(1).click();
  await expect(page.locator("#tulajdonsagok")).toContainText("2 = 2 × 1");
  if (testInfo.project.name === "chromium") {
    await page
      .getByRole("button", { name: "Kijelölés / mozgatás", exact: true })
      .click();
    const point = page.locator("#editor-board svg ellipse").first();
    await point.scrollIntoViewIfNeeded();
    const pos = await point.boundingBox();
    const before = await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("mathshead-graph")!).vertices[0]
          .x as number,
    );
    await page.mouse.move(pos!.x + pos!.width / 2, pos!.y + pos!.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      pos!.x + pos!.width / 2 + 40,
      pos!.y + pos!.height / 2 + 20,
      { steps: 8 },
    );
    await page.mouse.up();
    await expect
      .poll(async () =>
        page.evaluate(
          () =>
            JSON.parse(localStorage.getItem("mathshead-graph")!).vertices[0]
              .x as number,
        ),
      )
      .not.toBe(before);
  }
  await page.getByLabel("Súlyozott", { exact: true }).check();
  await page.getByLabel("Kijelölt él").selectOption({ index: 1 });
  await page.getByLabel("Élsúly", { exact: true }).fill("7");
  await page.getByRole("button", { name: "Súly mentése" }).click();
  await page.getByLabel("Algoritmus", { exact: true }).selectOption("Dijkstra");
  await page.getByLabel("Kezdőcsúcs", { exact: true }).selectOption("v0");
  await page.getByLabel("Célcsúcs", { exact: true }).selectOption("v1");
  await expect(page.locator("#algoritmusok")).toContainText("Hossz: 7");
  await page
    .locator("#matrixok .matrix button")
    .filter({ hasText: "7" })
    .first()
    .click();
  await expect(page.locator("#matrixok .matrix-selected")).not.toHaveCount(0);
  await page.reload();
  await expect(page.getByLabel("Súlyozott", { exact: true })).toBeChecked();
  await expect(page.getByLabel("Kijelölt él").locator("option")).toHaveCount(2);
  await page
    .locator("#szerkeszto")
    .screenshot({ path: `test-results/editor-${testInfo.project.name}.png` });
  expect(errors).toEqual([]);
});
test("kilenc gráfalgoritmus választható és a többlépéses vezérlés működik", async ({
  page,
}) => {
  await page.goto("/grafelmelet");
  const select = page.getByLabel("Algoritmus", { exact: true });
  await expect(select.locator("option")).toHaveCount(9);
  for (const name of [
    "BFS",
    "DFS",
    "Euler",
    "Dijkstra",
    "Bellman–Ford",
    "Legrövidebb BFS",
    "Kruskal",
    "Prim",
  ]) {
    await select.selectOption(name);
    await expect(page.locator("#algoritmusok .algorithm-info h3")).toHaveText(
      name,
    );
    await page
      .locator("#algoritmusok")
      .getByRole("button", { name: "Következő lépés", exact: true })
      .click();
    await page
      .locator("#algoritmusok")
      .getByRole("button", { name: "Újrakezdés", exact: true })
      .click();
  }
  await page.getByLabel("Irányított", { exact: true }).check();
  await select.selectOption("Topologikus");
  await expect(page.locator("#algoritmusok")).toContainText(
    "Topologikus sorrend",
  );
});
test("saját kvantorpredikátum és hibajelzés", async ({ page }) => {
  await page.goto("/logika");
  await page.getByLabel("Predikátum", { exact: true }).selectOption("custom");
  await page.getByLabel("Saját predikátum (x változóval)").fill("x*x >= 0");
  await expect(page.locator("#kvantorok .result-strip")).toContainText("IGAZ");
  await page.getByLabel("Saját predikátum (x változóval)").fill("x=2");
  await expect(page.locator("#kvantorok").getByRole("alert")).toBeVisible();
});
