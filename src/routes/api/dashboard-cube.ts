import { createFileRoute } from "@tanstack/react-router";

const PAGE_SIZE = 1000;
const SOURCE = "dashboard_cube_v4";

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Variavel ${name} nao configurada`);
  return value;
}

async function loadCube() {
  const base = env("SUPABASE_URL").replace(/\/$/, "");
  const key = env("SUPABASE_SECRET_KEY");
  const rows: unknown[] = [];

  for (let offset = 0; ; offset += PAGE_SIZE) {
    const response = await fetch(
      `${base}/rest/v1/excel_rows?select=data&source_file=eq.${SOURCE}&order=row_number&offset=${offset}&limit=${PAGE_SIZE}`,
      {
        headers: { apikey: key },
        cache: "no-store",
        signal: AbortSignal.timeout(30_000),
      },
    );
    if (!response.ok) {
      throw new Error(`Supabase respondeu ${response.status}: ${await response.text()}`);
    }
    const page = (await response.json()) as Array<{ data: Record<string, unknown> }>;
    rows.push(...page.map((row) => {
      const { expenseAmounts: _expenseAmounts, ...dashboardData } = row.data;
      return dashboardData;
    }));
    if (page.length < PAGE_SIZE) break;
  }

  return rows;
}

export const Route = createFileRoute("/api/dashboard-cube")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const rows = await loadCube();
          return Response.json(rows, {
            headers: { "Cache-Control": "public, max-age=60, s-maxage=900" },
          });
        } catch (error) {
          return Response.json(
            { error: error instanceof Error ? error.message : "Falha ao carregar indicadores" },
            { status: 502 },
          );
        }
      },
    },
  },
});
