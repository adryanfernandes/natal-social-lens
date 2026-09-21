import { useQuery } from "@tanstack/react-query";
import type { MetricIcon } from "@/components/dashboard/MetricCard";
import type { CategoryDatum, DashboardFilters, Indicator, SelectOption, TerritoryRow } from "@/types/dashboard";
import type { ValueFormat } from "@/utils/format";
import { normalizarLocalidade } from "@/utils/localidade";

type Counter = Record<string, number>;

interface CubeRow {
  filters: {
    regiao: string;
    localidade: string;
    equipamento: string;
    faixaRenda: string;
    pbf: string;
  };
  persons: number;
  families: number;
  familyPbf: number;
  incomeTotal: number;
  incomePerCapita: number;
  incomeCount: number;
  updated24: number;
  risk: number;
  foodRisk: number;
  indigenous: number;
  quilombola: number;
  personPbf: number;
  pcd: number;
  childLabor: number;
  children: number;
  street: number;
  latestUpdate?: string | null;
  gender: Counter;
  age: Counter;
  race: Counter;
  relationship: Counter;
  familyStatus: Counter;
  householdSize: Counter;
  updateMonths: Counter;
  housingType: Counter;
  rooms: Counter;
  sanitation: Counter;
  groups: Counter;
  disabilities: Counter;
  school: Counter;
  education: Counter;
  work: Counter;
  occupation: Counter;
  streetTime: Counter;
  streetSleep: Counter;
  services: Counter;
  expenses: Counter;
}

const emptyFilters: DashboardFilters = {
  regiao: "todas",
  localidade: "todas",
  equipamento: "todos",
  faixaRenda: "todas",
  pbf: "todos",
};

const sum = (rows: CubeRow[], key: keyof CubeRow) =>
  rows.reduce((total, row) => total + Number(row[key] || 0), 0);

function counter(rows: CubeRow[], key: keyof CubeRow): Counter {
  const result: Counter = {};
  for (const row of rows) {
    const values = row[key] as Counter;
    for (const [label, value] of Object.entries(values || {})) {
      result[label] = (result[label] || 0) + value;
    }
  }
  return result;
}

function series(values: Counter, limit?: number): CategoryDatum[] {
  const result = Object.entries(values)
    .filter(([, value]) => value > 0)
    .map(([label, value]) => ({ label: normalizarLocalidade(label), value }))
    .sort((a, b) => b.value - a.value);
  return limit ? result.slice(0, limit) : result;
}

function ageSeries(values: Counter): CategoryDatum[] {
  return series(values).sort((a, b) => {
    const firstAge = Number(a.label.match(/\d+/)?.[0] ?? Number.POSITIVE_INFINITY);
    const secondAge = Number(b.label.match(/\d+/)?.[0] ?? Number.POSITIVE_INFINITY);
    return firstAge - secondAge || a.label.localeCompare(b.label, "pt-BR");
  });
}

function numericSeries(values: Counter): CategoryDatum[] {
  return series(values).sort((a, b) => {
    const firstValue = a.label.match(/\d+/)?.[0];
    const secondValue = b.label.match(/\d+/)?.[0];
    if (firstValue && secondValue) return Number(firstValue) - Number(secondValue);
    if (firstValue) return -1;
    if (secondValue) return 1;
    return a.label.localeCompare(b.label, "pt-BR");
  });
}

function incomeRangeOrder(label: string) {
  const normalized = normalizedLabel(label);
  if (/nao informado|sem informacao/.test(normalized)) return Number.POSITIVE_INFINITY;
  if (normalized.startsWith("ate")) return 0;
  if (/acima|mais de|maior que/.test(normalized)) return Number.MAX_SAFE_INTEGER;

  const amount = normalized.match(/(?:r\$\s*)?(\d[\d.,]*)/)?.[1];
  return amount
    ? Number(amount.replace(/\.(?=\d{3}(?:\D|$))/g, "").replace(",", "."))
    : Number.POSITIVE_INFINITY;
}

function incomeSeries(values: Counter): CategoryDatum[] {
  return series(values).sort((a, b) =>
    incomeRangeOrder(a.label) - incomeRangeOrder(b.label)
    || a.label.localeCompare(b.label, "pt-BR"),
  );
}

function option(value: string): SelectOption {
  return { value, label: normalizarLocalidade(value) };
}

function normalizedLabel(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function options(rows: CubeRow[], key: keyof CubeRow["filters"], allValue: string, allLabel: string) {
  const values = [...new Set(rows.map((row) => row.filters[key]).filter((value) => value && value !== "Nao informado"))];
  return [{ value: allValue, label: allLabel }, ...values.sort((a, b) => a.localeCompare(b, "pt-BR")).map(option)];
}

function selected(rows: CubeRow[], filters: DashboardFilters) {
  return rows.filter((row) => {
    if (filters.regiao !== "todas" && row.filters.regiao !== filters.regiao) return false;
    if (filters.localidade !== "todas" && row.filters.localidade !== filters.localidade) return false;
    if (filters.equipamento !== "todos" && row.filters.equipamento !== filters.equipamento) return false;
    if (filters.faixaRenda !== "todas" && row.filters.faixaRenda !== filters.faixaRenda) return false;
    if (filters.pbf !== "todos" && row.filters.pbf !== filters.pbf) return false;
    return true;
  });
}

function percent(value: number, total: number) {
  return total ? Number(((value / total) * 100).toFixed(1)) : 0;
}

function householdBuckets(values: Counter) {
  const result: Counter = {};
  for (const [label, value] of Object.entries(values)) {
    const amount = Number.parseInt(label, 10);
    const bucket = Number.isNaN(amount) ? label : amount >= 6 ? "6 ou mais" : `${amount} pessoa${amount === 1 ? "" : "s"}`;
    result[bucket] = (result[bucket] || 0) + value;
  }
  return result;
}

function derive(allRows: CubeRow[], filters: DashboardFilters) {
  const rows = selected(allRows, filters);
  const persons = sum(rows, "persons");
  const families = sum(rows, "families");
  const familyPbf = sum(rows, "familyPbf");
  const pcd = sum(rows, "pcd");
  const street = sum(rows, "street");
  const childLabor = sum(rows, "childLabor");
  const children = sum(rows, "children");
  const risk = sum(rows, "risk");
  const foodRisk = sum(rows, "foodRisk");
  const updated24 = sum(rows, "updated24");
  const incomeCount = sum(rows, "incomeCount");
  const averageIncome = incomeCount ? sum(rows, "incomeTotal") / incomeCount : 0;
  const averagePerCapita = incomeCount ? sum(rows, "incomePerCapita") / incomeCount : 0;

  const faixaRenda: Counter = {};
  const regions: Counter = {};
  const pbf: Counter = {};
  const territory = new Map<string, TerritoryRow>();
  for (const row of rows) {
    faixaRenda[row.filters.faixaRenda] = (faixaRenda[row.filters.faixaRenda] || 0) + row.families;
    regions[row.filters.regiao] = (regions[row.filters.regiao] || 0) + row.families;
    const pbfLabel = row.familyPbf > 0 ? "Beneficiarios" : "Nao beneficiarios";
    pbf[pbfLabel] = (pbf[pbfLabel] || 0) + row.families;
    const key = `${row.filters.regiao}|${row.filters.localidade}`;
    const current = territory.get(key) || {
      regiao: row.filters.regiao as TerritoryRow["regiao"],
      localidade: normalizarLocalidade(row.filters.localidade),
      familias: 0,
      pessoas: 0,
      rendaPerCapita: 0,
      beneficiariosPbf: 0,
      pessoasComDeficiencia: 0,
    };
    current.familias += row.families;
    current.pessoas += row.persons;
    current.rendaPerCapita += row.incomePerCapita;
    current.beneficiariosPbf += row.familyPbf;
    current.pessoasComDeficiencia += row.pcd;
    territory.set(key, current);
  }
  const tabelaIndicadores = [...territory.values()].map((row) => ({
    ...row,
    rendaPerCapita: row.familias ? row.rendaPerCapita / row.familias : 0,
  })).sort((a, b) => b.familias - a.familias);

  const indicadoresVulnerabilidade: Indicator[] = [
    { id: "extrema-pobreza", label: "Familias na menor faixa de renda", value: Object.entries(faixaRenda).find(([label]) => normalizedLabel(label).startsWith("ate"))?.[1] || 0, percent: 0, unit: "familias", tone: "critical" },
    { id: "pobreza", label: "Familias beneficiarias do PBF", value: familyPbf, percent: percent(familyPbf, families), unit: "familias", tone: "alert" },
    { id: "rua", label: "Pessoas em situacao de rua", value: street, percent: percent(street, persons), unit: "pessoas", tone: "critical" },
    { id: "pcd", label: "Pessoas com deficiencia", value: pcd, percent: percent(pcd, persons), unit: "pessoas", tone: "neutral" },
    { id: "trabalho-infantil", label: "Marcacao de trabalho infantil", value: childLabor, percent: percent(childLabor, persons), unit: "pessoas", tone: "critical" },
    { id: "inseguranca-alimentar", label: "Familias em inseguranca alimentar", value: foodRisk, percent: percent(foodRisk, families), unit: "familias", tone: "alert" },
    { id: "violacao-direitos", label: "Risco por violacao de direitos", value: risk, percent: percent(risk, families), unit: "familias", tone: "alert" },
  ];

  const metric = (id: string, label: string, value: number, hint: string, icon: MetricIcon, format?: ValueFormat) => ({ id, label, value, hint, icon, ...(format ? { format } : {}) });
  const ultimaAtualizacao = rows.map((row) => row.latestUpdate).filter(Boolean).sort().at(-1) || "Nao informada";

  return {
    ultimaAtualizacao,
    filterOptions: {
      regioes: options(allRows, "regiao", "todas", "Todas as regioes"),
      localidades: options(allRows, "localidade", "todas", "Todas as localidades"),
      equipamentos: options(allRows, "equipamento", "todos", "Todos os equipamentos"),
      faixasRenda: options(allRows, "faixaRenda", "todas", "Todas as faixas"),
      pbf: options(allRows, "pbf", "todos", "Todos"),
    },
    visaoGeralCards: [
      metric("pessoas", "Pessoas cadastradas", persons, "Pessoas na selecao atual", "users"),
      metric("familias", "Familias cadastradas", families, "Nucleos familiares na selecao", "home"),
      metric("pbf", "Familias beneficiarias do PBF", familyPbf, "Programa Bolsa Familia", "handHeart"),
      metric("renda", "Renda media per capita", averagePerCapita, "Media declarada por pessoa/mes", "wallet", "currency"),
      metric("pcd", "Pessoas com deficiencia", pcd, "Pessoas com marcacao de deficiencia", "accessibility"),
      metric("risco", "Familias em risco social", risk, "Situacoes de risco identificadas", "alert"),
    ],
    faixaEtaria: ageSeries(counter(rows, "age")),
    distribuicaoSexo: series(counter(rows, "gender")),
    corRaca: series(counter(rows, "race")),
    faixaRendaFamiliar: incomeSeries(faixaRenda),
    indicadoresVulnerabilidade,
    bairrosTop: tabelaIndicadores.slice(0, 10).map((row) => ({ label: row.localidade, value: row.familias })),
    tabelaIndicadores,
    familiasCards: [
      metric("total", "Total de familias", families, "Cadastros familiares", "home"),
      metric("media-pessoas", "Media de pessoas por familia", families ? persons / families : 0, "Pessoas por nucleo familiar", "users", "decimal"),
      metric("pbf", "Familias beneficiarias do PBF", familyPbf, "Programa Bolsa Familia", "handHeart"),
      metric("atualizado", "Cadastros atualizados", updated24, "Atualizacao em ate 24 meses", "check"),
      metric("desatualizado", "Cadastros desatualizados", Math.max(0, families - updated24), "Mais de 24 meses", "alert"),
    ],
    familiasPorRegiao: series(regions),
    pessoasPorDomicilio: numericSeries(householdBuckets(counter(rows, "householdSize"))),
    tempoUltimaAtualizacao: series(counter(rows, "updateMonths")),
    estadoCadastral: series(counter(rows, "familyStatus")),
    rendaCards: [
      metric("renda-familiar", "Renda media familiar", averageIncome, "Renda total declarada", "wallet", "currency"),
      metric("renda-per-capita", "Renda media per capita", averagePerCapita, "Media por pessoa/mes", "trending", "currency"),
      metric("familias", "Familias na selecao", families, "Total apos os filtros", "home"),
      metric("risco", "Familias em risco social", risk, "Risco associado a violacao de direitos", "alert"),
      metric("pbf", "Familias beneficiarias do PBF", familyPbf, "Programa Bolsa Familia", "handHeart"),
    ],
    rendaMediaPorRegiao: tabelaIndicadores.reduce<CategoryDatum[]>((items, row) => {
      const found = items.find((item) => item.label === row.regiao);
      if (found) found.value = (found.value + row.rendaPerCapita) / 2;
      else items.push({ label: row.regiao, value: row.rendaPerCapita });
      return items;
    }, []),
    despesasFamiliares: series(counter(rows, "expenses")),
    pbfDistribuicao: [{ label: "Beneficiarios", value: familyPbf }, { label: "Nao beneficiarios", value: Math.max(0, families - familyPbf) }],
    perfilPopulacaoCards: [
      metric("total-pessoas", "Pessoas cadastradas", persons, "Total na selecao", "users"),
      metric("pcd", "Pessoas com deficiencia", pcd, "Marcacao de deficiencia", "accessibility"),
      metric("pbf", "Pessoas que recebem PBF", sum(rows, "personPbf"), "Beneficio informado", "handHeart"),
      metric("rua", "Pessoas em situacao de rua", street, "Situacao informada", "alert"),
    ],
    perfilSexo: series(counter(rows, "gender")), perfilFaixaEtaria: ageSeries(counter(rows, "age")), perfilCorRaca: series(counter(rows, "race")), perfilParentesco: series(counter(rows, "relationship"), 10),
    domiciliosCards: [metric("domicilios", "Domicilios cadastrados", families, "Familias na selecao", "home"), ...series(counter(rows, "sanitation"), 3).map((item, index) => metric(`san-${index}`, item.label, item.value, "Condicao declarada", "check"))],
    domiciliosTipo: series(counter(rows, "housingType")), domiciliosComodos: numericSeries(counter(rows, "rooms")), saneamentoDomiciliar: series(counter(rows, "sanitation")),
    educacaoCards: [metric("pessoas", "Pessoas cadastradas", persons, "Total na selecao", "users"), metric("frequencia", "Situacao escolar informada", Object.values(counter(rows, "school")).reduce((a, b) => a + b, 0), "Registros com situacao escolar", "check")],
    frequenciaEscolar: series(counter(rows, "school")), educacaoSerie: series(counter(rows, "education"), 12),
    trabalhoRendaCards: [metric("pessoas", "Pessoas cadastradas", persons, "Total na selecao", "users"), metric("trabalho", "Situacao de trabalho informada", Object.values(counter(rows, "work")).reduce((a, b) => a + b, 0), "Registros de trabalho", "check"), metric("renda", "Renda media familiar", averageIncome, "Renda declarada", "wallet", "currency")],
    situacaoTrabalho: series(counter(rows, "work")), atividadePrincipal: series(counter(rows, "occupation"), 12),
    deficienciaCards: [metric("pessoas-pcd", "Pessoas com deficiencia", pcd, "Marcacao de deficiencia", "accessibility"), ...series(counter(rows, "disabilities"), 3).map((item, index) => metric(`def-${index}`, item.label, item.value, "Tipo informado", "accessibility"))],
    tipoDeficiencia: series(counter(rows, "disabilities")),
    criancasCards: [metric("criancas", "Criancas e adolescentes", children, "Faixas etarias ate 17 anos", "baby"), metric("trabalho-infantil", "Trabalho infantil", childLabor, "Marcacao informada", "alert")],
    criancasFaixaEtaria: ageSeries(counter(rows, "age")).filter((item) => /0 e 4|5 a 6|7 a 15|16 a 17/i.test(item.label)), criancasAtendimento: series(counter(rows, "school")),
    beneficiosCards: [metric("pbf", "Familias beneficiarias do PBF", familyPbf, "Programa Bolsa Familia", "handHeart"), metric("pessoas-pbf", "Pessoas que recebem PBF", sum(rows, "personPbf"), "Beneficio individual informado", "users")],
    beneficiosCobertura: [{ label: "Familias beneficiarias", value: familyPbf }, { label: "Familias nao beneficiarias", value: Math.max(0, families - familyPbf) }],
    gruposCards: [metric("indigena", "Familias indigenas", sum(rows, "indigenous"), "Identificacao informada", "leaf"), metric("quilombola", "Familias quilombolas", sum(rows, "quilombola"), "Identificacao informada", "mapPinned"), metric("grupos", "Grupos especificos", Object.values(counter(rows, "groups")).reduce((a, b) => a + b, 0), "Marcacoes registradas", "users")],
    gruposTradicionais: series(counter(rows, "groups")),
    ruaCards: [metric("rua-total", "Pessoas em situacao de rua", street, "Situacao informada", "alertTriangle"), metric("atendimento", "Atendimentos registrados", Object.values(counter(rows, "services")).reduce((a, b) => a + b, 0), "Rede socioassistencial", "heartHandshake")],
    ruaTempo: series(counter(rows, "streetTime")), ruaDormir: series(counter(rows, "streetSleep")),
    redeCards: series(counter(rows, "services"), 4).map((item, index) => metric(`rede-${index}`, item.label, item.value, "Atendimentos informados", "building2")),
    redeCobertura: series(counter(rows, "services")),
  };
}

async function fetchCube(): Promise<CubeRow[]> {
  const response = await fetch("/api/dashboard-cube");
  if (!response.ok) throw new Error("Nao foi possivel carregar os dados do Supabase");
  return response.json();
}

export function useDashboardData(filters: DashboardFilters = emptyFilters) {
  const query = useQuery({ queryKey: ["dashboard-cube"], queryFn: fetchCube, staleTime: 15 * 60 * 1000 });
  return {
    data: derive(query.data || [], filters),
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}

export { emptyFilters };
