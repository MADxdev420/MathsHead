import { test, expect } from "@playwright/test";
test("navigáció, téma és reszponzív oldal", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "A matematika",
  );
  if (testInfo.project.name === "mobile")
    await page.getByRole("button", { name: "Menü megnyitása" }).click();
  await page.getByRole("button", { name: "Sötét megjelenés" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  if (testInfo.project.name === "mobile")
    await page.getByRole("button", { name: "Menü megnyitása" }).click();
  await page.getByRole("button", { name: "Világos megjelenés" }).click();
  if (testInfo.project.name === "mobile")
    await page
      .getByRole("button", { name: "Menü bezárása", exact: true })
      .first()
      .click();
  await page.screenshot({
    path: `test-results/home-${testInfo.project.name}.png`,
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});
test("logikai parser, ekvivalencia, kvantorok és léptetés", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/logika");
  await page.getByLabel("Logikai kifejezés", { exact: true }).fill("A IFF B");
  await expect(page.locator("#kalkulator")).toContainText("4 értékelés");
  await page
    .getByLabel("Ekvivalencia ellenőrzése ezzel a kifejezéssel")
    .fill("(A AND B) OR (NOT A AND NOT B)");
  await expect(page.locator("#kalkulator")).toContainText(
    "logikailag ekvivalens",
  );
  await page.getByLabel("Logikai kifejezés", { exact: true }).fill("A AND (");
  await expect(page.getByRole("alert")).toBeVisible();
  await page
    .getByLabel("Logikai kifejezés", { exact: true })
    .fill("A OR NOT A");
  await expect(page.locator("#kalkulator")).toContainText("Tautológia");
  await page
    .locator("#bizonyitasok")
    .getByRole("button", { name: "Következő lépés", exact: true })
    .click();
  await expect(page.locator("#bizonyitasok .current")).toContainText(
    "Tegyük fel",
  );
  await page.getByLabel("Alaphalmaz (üresen is hagyható)").fill("-1,0,1");
  await expect(page.locator("#kvantorok")).toContainText("Minden a elemhez");
  expect(errors).toEqual([]);
});
test("számelmélet: javított LNKO/LKKT, szita, tényezőfa és RSA", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/szamelmelet");
  await expect(page.locator("#lnko-lkkt")).toContainText("40460");
  await page
    .getByLabel("Egész számok, vesszővel elválasztva")
    .fill("51450,5733");
  await expect(page.locator("#lnko-lkkt")).toContainText("2006550");
  await page
    .locator("#szita")
    .getByRole("button", { name: "Következő lépés", exact: true })
    .click();
  await expect(page.locator("#szita .removed")).toHaveCount(59);
  await page.getByRole("button", { name: "Interaktív tényezőfa" }).click();
  await expect(page.locator("#felbontas svg")).toHaveCount(1);
  await page.getByLabel("Tényezőfa csomópontja").selectOption("p0");
  await expect(page.locator("#felbontas")).toContainText(
    "prím, tovább nem bontható",
  );
  await expect(page.locator("#rsa")).toContainText("Visszafejtett m");
  await page.getByLabel("Nyilvános kitevő e").fill("4");
  await expect(page.locator("#rsa").getByRole("alert")).toBeVisible();
  await page.getByLabel("Nyilvános kitevő e").fill("3");
  await page.screenshot({
    path: `test-results/number-${testInfo.project.name}.png`,
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});
test("gráfszerkesztés, undo/redo, algoritmus, mátrix és export", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/grafelmelet");
  await expect(page.locator("#editor-board svg")).toHaveCount(1);
  await page.getByLabel("Ellenőrzött példagráf").selectOption("G1");
  await expect(page.locator("#tulajdonsagok")).toContainText("12 = 2 × 6");
  await page.getByLabel("Algoritmus", { exact: true }).selectOption("Euler");
  await expect(page.locator("#algoritmusok")).toContainText("4 páratlan");
  await page.getByLabel("Ellenőrzött példagráf").selectOption("G2");
  await expect(page.locator("#algoritmusok")).toContainText("Euler-séta");
  await page
    .locator("#algoritmusok")
    .getByRole("button", { name: "Következő lépés", exact: true })
    .click();
  await expect(page.locator("#algoritmusok")).toContainText("1. él bejárva");
  await page
    .getByRole("button", { name: "Csúcs középre", exact: true })
    .click();
  await page.getByLabel("Kijelölt csúcs").selectOption("v0");
  await page.getByLabel("Új csúcsnév").fill("Új");
  await page.getByRole("button", { name: "Átnevezés", exact: true }).click();
  await expect(page.getByLabel("Kijelölt csúcs")).toContainText("Új");
  await page.getByRole("button", { name: "Visszavonás", exact: true }).click();
  await expect(page.getByLabel("Kijelölt csúcs")).toContainText("v0");
  await page.getByRole("button", { name: "Újra", exact: true }).click();
  await expect(page.getByLabel("Kijelölt csúcs")).toContainText("Új");
  await page.getByText("Mentés, import és export", { exact: true }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "SVG-export", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("graf.svg");
  await page.getByLabel("Algoritmus", { exact: true }).selectOption("Kruskal");
  await page.screenshot({
    path: `test-results/graph-${testInfo.project.name}.png`,
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});
test("import hibák, irányított Euler és negatív kör kezelése", async ({
  page,
}) => {
  await page.goto("/grafelmelet");
  await page.getByText("Mentés, import és export", { exact: true }).click();
  await page.getByLabel("Gráf JSON beillesztése").fill('{"invalid":true}');
  await page
    .getByRole("button", { name: "JSON importálása", exact: true })
    .click();
  await expect(page.locator("#szerkeszto").getByRole("alert")).toBeVisible();
  const g = {
    vertices: [
      { id: "a", label: "a", x: -2, y: 0 },
      { id: "b", label: "b", x: 2, y: 0 },
    ],
    edges: [
      { id: "e1", from: "a", to: "b", weight: 1 },
      { id: "e2", from: "b", to: "a", weight: -2 },
    ],
    directed: true,
    weighted: true,
  };
  await page.getByLabel("Gráf JSON beillesztése").fill(JSON.stringify(g));
  await page
    .getByRole("button", { name: "JSON importálása", exact: true })
    .click();
  await page.getByLabel("Algoritmus", { exact: true }).selectOption("Dijkstra");
  await expect(page.locator("#algoritmusok").getByRole("alert")).toContainText(
    "nemnegatív",
  );
  await page
    .getByLabel("Algoritmus", { exact: true })
    .selectOption("Bellman–Ford");
  await expect(page.locator("#algoritmusok")).toContainText("negatív kör van");
  await page.getByLabel("Algoritmus", { exact: true }).selectOption("Euler");
  await expect(page.locator("#algoritmusok")).toContainText("Euler-kör");
});
