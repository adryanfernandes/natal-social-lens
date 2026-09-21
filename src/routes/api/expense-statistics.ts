import { createFileRoute } from "@tanstack/react-router";
import type { CategoryDatum, DashboardFilters, ExpenseStatistics } from "@/types/dashboard";

type Counter = Record<string, number>;

interface ExpenseCubeRow {
  filters: DashboardFilters;
  expenseAmounts?: Record<string, Counter>;
}

const PAGE_SIZE = 1000;
const SOURCE = "dashboard_cube_v4";

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Variavel ${name} nao configurada`);
  return value;
}

function matches(row: ExpenseCubeRow, filters: DashboardFilters) {
  if (filters.zona !== "todas" && row.filters.zona !== filters.zona) return false;
  if (filters.localidade !== "todas" && row.filters.localidade !== filters.localidade) return false;
  if (filters.equipamento !== "todos" && row.filters.equipamento !== filters.equipamento) return false;
  if (filters.faixaRenda !== "todas" && row.filters.faixaRenda !== filters.faixaRenda) return false;
  if (filters.pbf !== "todos" && row.filters.pbf !== filters.pbf) return false;
  return true;
}

function calculate(rows: ExpenseCubeRow[]): ExpenseStatistics[] {
  const categories = new Map<string, Counter>();
  for (const row of rows) {
    for (const [category, amounts] of Object.entries(row.expenseAmounts || {})) {
      const aggregate = categories.get(category) || {};
      for (const [amount, frequency] of Object.entries(amounts)) {
        aggregate[amount] = (aggregate[amount] || 0) + frequency;
      }
      categories.set(category, aggregate);
    }
  }

  return [...categories.entries()].map(([label, histogram]) => {
    const values = Object.entries(histogram)
      .map(([amount, frequency]) => ({ amount: Number(amount), frequency }))
      .filter(({ amount, frequency }) => Number.isFinite(amount) && amount > 0 && frequency > 0)
      .sort((a, b) => a.amount - b.amount);
    const count = values.reduce((total, item) => total + item.frequency, 0);
    const total = values.reduce((sum, item) => sum + item.amount * item.frequency, 0);
    const min = values[0]?.amount ?? 0;
    const max = values.at(-1)?.amount ?? 0;
    const medianAt = (position: number) => {
      let cumulative = 0;
      return values.find((item) => {
        cumulative += item.frequency;
        return cumulative > position;
      })?.amount ?? 0;
    };
    const median = count
      ? (medianAt(Math.floor((count - 1) / 2)) + medianAt(Math.floor(count / 2))) / 2
      : 0;
    const uniqueValues = new Set(values.map((item) => item.amount)).size;
    const binCount = Math.min(8, Math.max(1, uniqueValues));
    const binRatio = binCount > 1 && max > min ? (max / min) ** (1 / binCount) : 1;
    const bins = Array.from({ length: binCount }, (_, index) => ({
      start: min * binRatio ** index,
      end: index === binCount - 1 ? max : min * binRatio ** (index + 1),
      value: 0,
    }));
    for (const item of values) {
      const index = binCount === 1 || binRatio === 1
        ? 0
        : Math.min(binCount - 1, Math.floor(Math.log(item.amount / min) / Math.log(binRatio)));
      const bin = bins[index];
      if (bin) bin.value += item.frequency;
    }
    const distribution: CategoryDatum[] = bins.map((bin) => ({
      label: binCount === 1
        ? `R$ ${bin.start.toLocaleString("pt-BR")}`
        : `R$ ${Math.round(bin.start).toLocaleString("pt-BR")}–${Math.round(bin.end).toLocaleString("pt-BR")}`,
      value: bin.value,
    }));
    return { label, count, min, max, mean: count ? total / count : 0, median, distribution };
  }).filter((item) => item.count > 0).sort((a, b) => b.count - a.count);
}

async function loadRows(filters: DashboardFilters) {
  const base = env("SUPABASE_URL").replace(/\/$/, "");
  const key = env("SUPABASE_SECRET_KEY");
  const rows: ExpenseCubeRow[] = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const response = await fetch(
      `${base}/rest/v1/excel_rows?select=data&source_file=eq.${SOURCE}&order=row_number&offset=${offset}&limit=${PAGE_SIZE}`,
      { headers: { apikey: key }, cache: "no-store", signal: AbortSignal.timeout(30_000) },
    );
    if (!response.ok) throw new Error(`Supabase respondeu ${response.status}: ${await response.text()}`);
    const page = (await response.json()) as Array<{ data: ExpenseCubeRow }>;
    rows.push(...page.map((row) => row.data).filter((row) => matches(row, filters)));
    if (page.length < PAGE_SIZE) break;
  }
  return rows;
}

export const Route = createFileRoute("/api/expense-statistics")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const filters: DashboardFilters = {
            zona: url.searchParams.get("zona") || "todas",
            localidade: url.searchParams.get("localidade") || "todas",
            equipamento: url.searchParams.get("equipamento") || "todos",
            faixaRenda: url.searchParams.get("faixaRenda") || "todas",
            pbf: url.searchParams.get("pbf") || "todos",
          };
          return Response.json(calculate(await loadRows(filters)), {
            headers: { "Cache-Control": "public, max-age=60, s-maxage=900" },
          });
        } catch (error) {
          return Response.json(
            { error: error instanceof Error ? error.message : "Falha ao calcular despesas" },
            { status: 502 },
          );
        }
      },
    },
  },
});
