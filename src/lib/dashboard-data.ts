import { useQuery } from "@tanstack/react-query";
import type { MetricIcon } from "@/components/dashboard/MetricCard";
import type { CategoryDatum, DashboardFilters, ExpenseStatistics, Indicator, SelectOption, TerritoryRow } from "@/types/dashboard";
import type { ValueFormat } from "@/utils/format";
import { normalizarLocalidade } from "@/utils/localidade";

type Counter = Record<string, number>;

interface CubeRow {
  filters: {
    zona: string;
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
  zona: "todas",
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

function groupedSum(
  rows: CubeRow[],
  groupKey: keyof CubeRow["filters"],
  valueKey: keyof CubeRow,
): Counter {
  const result: Counter = {};
  for (const row of rows) {
    const group = row.filters[groupKey];
    result[group] = (result[group] || 0) + Number(row[valueKey] || 0);
  }
  return result;
}

function groupedCounterTotal(
  rows: CubeRow[],
  groupKey: keyof CubeRow["filters"],
  counterKey: keyof CubeRow,
): Counter {
  const result: Counter = {};
  for (const row of rows) {
    const group = row.filters[groupKey];
    const total = Object.values((row[counterKey] as Counter) || {}).reduce((sum, value) => sum + value, 0);
    result[group] = (result[group] || 0) + total;
  }
  return result;
}

function groupedAverage(
  rows: CubeRow[],
  groupKey: keyof CubeRow["filters"],
  totalKey: keyof CubeRow,
  countKey: keyof CubeRow,
): Counter {
  const totals: Counter = {};
  const counts: Counter = {};
  for (const row of rows) {
    const group = row.filters[groupKey];
    totals[group] = (totals[group] || 0) + Number(row[totalKey] || 0);
    counts[group] = (counts[group] || 0) + Number(row[countKey] || 0);
  }
  return Object.fromEntries(
    Object.keys(totals).map((group) => {
      const count = counts[group] ?? 0;
      return [group, count ? (totals[group] ?? 0) / count : 0];
    }),
  );
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
  const values = [...new Set(rows.map((row) => {
    const value = row.filters[key];
    return key === "localidade" ? normalizarLocalidade(value) : value;
  }).filter((value) => {
    if (!value || value === "Nao informado") return false;
    return value !== "NÃO INFORMADO" && value !== "NÃO IDENTIFICADO";
  }))];
  return [{ value: allValue, label: allLabel }, ...values.sort((a, b) => a.localeCompare(b, "pt-BR")).map(option)];
}

function selected(rows: CubeRow[], filters: DashboardFilters) {
  return rows.filter((row) => {
    if (filters.zona !== "todas" && row.filters.zona !== filters.zona) return false;
    if (filters.localidade !== "todas" && normalizarLocalidade(row.filters.localidade) !== filters.localidade) return false;
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
  const zones: Counter = {};
  const pbf: Counter = {};
  const territory = new Map<string, TerritoryRow>();
  for (const row of rows) {
    faixaRenda[row.filters.faixaRenda] = (faixaRenda[row.filters.faixaRenda] || 0) + row.families;
    zones[row.filters.zona] = (zones[row.filters.zona] || 0) + row.families;
    const pbfLabel = row.familyPbf > 0 ? "Beneficiários" : "Não beneficiários";
    pbf[pbfLabel] = (pbf[pbfLabel] || 0) + row.families;
    const localidade = normalizarLocalidade(row.filters.localidade);
    const key = `${row.filters.zona}|${localidade}`;
    const current = territory.get(key) || {
      zona: row.filters.zona as TerritoryRow["zona"],
      localidade,
      familias: 0,
      pessoas: 0,
      rendaPerCapita: 0,
      beneficiariosPbf: 0,
      pessoasComDeficiencia: 0,
      pessoasSituacaoRua: 0,
      criancasAdolescentes: 0,
      trabalhoInfantil: 0,
      familiasRiscoSocial: 0,
      insegurancaAlimentar: 0,
      familiasIndigenas: 0,
      familiasQuilombolas: 0,
      cadastrosAtualizados: 0,
    };
    current.familias += row.families;
    current.pessoas += row.persons;
    current.rendaPerCapita += row.incomePerCapita;
    current.beneficiariosPbf += row.familyPbf;
    current.pessoasComDeficiencia += row.pcd;
    current.pessoasSituacaoRua += row.street;
    current.criancasAdolescentes += row.children;
    current.trabalhoInfantil += row.childLabor;
    current.familiasRiscoSocial += row.risk;
    current.insegurancaAlimentar += row.foodRisk;
    current.familiasIndigenas += row.indigenous;
    current.familiasQuilombolas += row.quilombola;
    current.cadastrosAtualizados += row.updated24;
    territory.set(key, current);
  }
  const tabelaIndicadores = [...territory.values()].map((row) => ({
    ...row,
    rendaPerCapita: row.familias ? row.rendaPerCapita / row.familias : 0,
  })).sort((a, b) => b.familias - a.familias);

  const indicadoresVulnerabilidade: Indicator[] = [
    { id: "extrema-pobreza", label: "Famílias na menor faixa de renda", value: Object.entries(faixaRenda).find(([label]) => normalizedLabel(label).startsWith("ate"))?.[1] || 0, percent: 0, unit: "famílias", tone: "critical" },
    { id: "pobreza", label: "Famílias beneficiárias do PBF", value: familyPbf, percent: percent(familyPbf, families), unit: "famílias", tone: "alert" },
    { id: "rua", label: "Pessoas em situação de rua", value: street, percent: percent(street, persons), unit: "pessoas", tone: "critical" },
    { id: "pcd", label: "Pessoas com deficiência", value: pcd, percent: percent(pcd, persons), unit: "pessoas", tone: "neutral" },
    { id: "trabalho-infantil", label: "Marcação de trabalho infantil", value: childLabor, percent: percent(childLabor, persons), unit: "pessoas", tone: "critical" },
    { id: "inseguranca-alimentar", label: "Famílias em insegurança alimentar", value: foodRisk, percent: percent(foodRisk, families), unit: "famílias", tone: "alert" },
    { id: "violacao-direitos", label: "Risco por violação de direitos", value: risk, percent: percent(risk, families), unit: "famílias", tone: "alert" },
  ];

  const metric = (id: string, label: string, value: number, hint: string, icon: MetricIcon, format?: ValueFormat) => ({ id, label, value, hint, icon, ...(format ? { format } : {}) });
  const ultimaAtualizacao = rows.map((row) => row.latestUpdate).filter(Boolean).sort().at(-1) || "Não informada";

  const localityRows = filters.zona === "todas"
    ? allRows
    : allRows.filter((row) => row.filters.zona === filters.zona);

  return {
    ultimaAtualizacao,
    filterOptions: {
      zonas: options(allRows, "zona", "todas", "Todas as zonas"),
      localidades: options(localityRows, "localidade", "todas", "Todas as localidades"),
      equipamentos: options(allRows, "equipamento", "todos", "Todos os equipamentos"),
      faixasRenda: options(allRows, "faixaRenda", "todas", "Todas as faixas"),
      pbf: options(allRows, "pbf", "todos", "Todos"),
    },
    visaoGeralCards: [
      metric("pessoas", "Pessoas cadastradas", persons, "Pessoas na seleção atual", "users"),
      metric("familias", "Famílias cadastradas", families, "Núcleos familiares na seleção", "home"),
      metric("pbf", "Famílias beneficiárias do PBF", familyPbf, "Programa Bolsa Família", "handHeart"),
      metric("renda", "Renda média per capita", averagePerCapita, "Média declarada por pessoa/mês", "wallet", "currency"),
      metric("pcd", "Pessoas com deficiência", pcd, "Pessoas com marcação de deficiência", "accessibility"),
      metric("risco", "Famílias em risco social", risk, "Situações de risco identificadas", "alert"),
    ],
    faixaEtaria: ageSeries(counter(rows, "age")),
    distribuicaoSexo: series(counter(rows, "gender")),
    corRaca: series(counter(rows, "race")),
    faixaRendaFamiliar: incomeSeries(faixaRenda),
    indicadoresVulnerabilidade,
    bairrosTop: tabelaIndicadores.filter((row) => row.localidade !== "NÃO INFORMADO" && row.localidade !== "NÃO IDENTIFICADO").slice(0, 10).map((row) => ({ label: row.localidade, value: row.familias })),
    tabelaIndicadores,
    familiasCards: [
      metric("total", "Total de famílias", families, "Cadastros familiares", "home"),
      metric("media-pessoas", "Média de pessoas por família", families ? persons / families : 0, "Pessoas por núcleo familiar", "users", "decimal"),
      metric("pbf", "Famílias beneficiárias do PBF", familyPbf, "Programa Bolsa Família", "handHeart"),
      metric("atualizado", "Cadastros atualizados", updated24, "Atualização em até 24 meses", "check"),
      metric("desatualizado", "Cadastros desatualizados", Math.max(0, families - updated24), "Mais de 24 meses", "alert"),
    ],
    familiasPorRegiao: series(zones),
    pessoasPorDomicilio: numericSeries(householdBuckets(counter(rows, "householdSize"))),
    tempoUltimaAtualizacao: series(counter(rows, "updateMonths")),
    estadoCadastral: series(counter(rows, "familyStatus")),
    rendaCards: [
      metric("renda-familiar", "Renda média familiar", averageIncome, "Renda total declarada", "wallet", "currency"),
      metric("renda-per-capita", "Renda média per capita", averagePerCapita, "Média por pessoa/mês", "trending", "currency"),
      metric("familias", "Famílias na seleção", families, "Total após os filtros", "home"),
      metric("risco", "Famílias em risco social", risk, "Risco associado à violação de direitos", "alert"),
      metric("pbf", "Famílias beneficiárias do PBF", familyPbf, "Programa Bolsa Família", "handHeart"),
    ],
    rendaMediaPorRegiao: tabelaIndicadores.reduce<CategoryDatum[]>((items, row) => {
      const found = items.find((item) => item.label === row.zona);
      if (found) found.value = (found.value + row.rendaPerCapita) / 2;
      else items.push({ label: row.zona, value: row.rendaPerCapita });
      return items;
    }, []),
    despesasFamiliares: series(counter(rows, "expenses")),
    pbfDistribuicao: [{ label: "Beneficiários", value: familyPbf }, { label: "Não beneficiários", value: Math.max(0, families - familyPbf) }],
    perfilPopulacaoCards: [
      metric("total-pessoas", "Pessoas cadastradas", persons, "Total na seleção", "users"),
      metric("pcd", "Pessoas com deficiência", pcd, "Marcação de deficiência", "accessibility"),
      metric("pbf", "Pessoas que recebem PBF", sum(rows, "personPbf"), "Benefício informado", "handHeart"),
      metric("rua", "Pessoas em situação de rua", street, "Situação informada", "alert"),
    ],
    perfilSexo: series(counter(rows, "gender")), perfilFaixaEtaria: ageSeries(counter(rows, "age")), perfilCorRaca: series(counter(rows, "race")), perfilParentesco: series(counter(rows, "relationship"), 10),
    domiciliosCards: [metric("domicilios", "Domicílios cadastrados", families, "Famílias na seleção", "home"), ...series(counter(rows, "sanitation"), 3).map((item, index) => metric(`san-${index}`, item.label, item.value, "Condição declarada", "check"))],
    domiciliosTipo: series(counter(rows, "housingType")), domiciliosComodos: numericSeries(counter(rows, "rooms")), saneamentoDomiciliar: series(counter(rows, "sanitation")),
    domiciliosPessoas: numericSeries(householdBuckets(counter(rows, "householdSize"))),
    educacaoCards: [metric("pessoas", "Pessoas cadastradas", persons, "Total na seleção", "users"), metric("frequencia", "Situação escolar informada", Object.values(counter(rows, "school")).reduce((a, b) => a + b, 0), "Registros com situação escolar", "check")],
    frequenciaEscolar: series(counter(rows, "school")), educacaoSerie: series(counter(rows, "education"), 12),
    educacaoFaixaEtaria: ageSeries(counter(rows, "age")),
    educacaoPorZona: series(groupedCounterTotal(rows, "zona", "education")),
    trabalhoRendaCards: [metric("pessoas", "Pessoas cadastradas", persons, "Total na seleção", "users"), metric("trabalho", "Situação de trabalho informada", Object.values(counter(rows, "work")).reduce((a, b) => a + b, 0), "Registros de trabalho", "check"), metric("renda", "Renda média familiar", averageIncome, "Renda declarada", "wallet", "currency")],
    situacaoTrabalho: series(counter(rows, "work")), atividadePrincipal: series(counter(rows, "occupation"), 12),
    trabalhoPorZona: series(groupedCounterTotal(rows, "zona", "work")),
    trabalhoRendaPorZona: series(groupedAverage(rows, "zona", "incomeTotal", "incomeCount")),
    deficienciaCards: [metric("pessoas-pcd", "Pessoas com deficiência", pcd, "Marcação de deficiência", "accessibility"), ...series(counter(rows, "disabilities"), 3).map((item, index) => metric(`def-${index}`, item.label, item.value, "Tipo informado", "accessibility"))],
    tipoDeficiencia: series(counter(rows, "disabilities")),
    deficienciaCobertura: [{ label: "Pessoas com deficiência", value: pcd }, { label: "Demais pessoas", value: Math.max(0, persons - pcd) }],
    deficienciaPorZona: series(groupedSum(rows, "zona", "pcd")),
    deficienciaPorBairro: series(groupedSum(rows, "localidade", "pcd"), 10),
    criancasCards: [metric("criancas", "Crianças e adolescentes", children, "Faixas etárias até 17 anos", "baby"), metric("trabalho-infantil", "Trabalho infantil", childLabor, "Marcação informada", "alert")],
    criancasFaixaEtaria: ageSeries(counter(rows, "age")).filter((item) => /0 e 4|5 a 6|7 a 15|16 a 17/i.test(item.label)), criancasAtendimento: series(counter(rows, "school")),
    criancasPorZona: series(groupedSum(rows, "zona", "children")),
    trabalhoInfantilPorZona: series(groupedSum(rows, "zona", "childLabor")),
    beneficiosCards: [metric("pbf", "Famílias beneficiárias do PBF", familyPbf, "Programa Bolsa Família", "handHeart"), metric("pessoas-pbf", "Pessoas que recebem PBF", sum(rows, "personPbf"), "Benefício individual informado", "users")],
    beneficiosCobertura: [{ label: "Famílias beneficiárias", value: familyPbf }, { label: "Famílias não beneficiárias", value: Math.max(0, families - familyPbf) }],
    beneficiosFamiliasPorZona: series(groupedSum(rows, "zona", "familyPbf")),
    beneficiosPessoasPorZona: series(groupedSum(rows, "zona", "personPbf")),
    beneficiosPorRenda: incomeSeries(groupedSum(rows, "faixaRenda", "familyPbf")),
    gruposCards: [metric("indigena", "Famílias indígenas", sum(rows, "indigenous"), "Identificação informada", "leaf"), metric("quilombola", "Famílias quilombolas", sum(rows, "quilombola"), "Identificação informada", "mapPinned"), metric("grupos", "Grupos específicos", Object.values(counter(rows, "groups")).reduce((a, b) => a + b, 0), "Marcações registradas", "users")],
    gruposTradicionais: series(counter(rows, "groups")),
    gruposIndigenasPorZona: series(groupedSum(rows, "zona", "indigenous")),
    gruposQuilombolasPorZona: series(groupedSum(rows, "zona", "quilombola")),
    gruposPorZona: series(groupedCounterTotal(rows, "zona", "groups")),
    ruaCards: [metric("rua-total", "Pessoas em situação de rua", street, "Situação informada", "alertTriangle"), metric("atendimento", "Atendimentos registrados", Object.values(counter(rows, "services")).reduce((a, b) => a + b, 0), "Rede socioassistencial", "heartHandshake")],
    ruaTempo: series(counter(rows, "streetTime")), ruaDormir: series(counter(rows, "streetSleep")),
    ruaCobertura: [{ label: "Em situação de rua", value: street }, { label: "Demais pessoas", value: Math.max(0, persons - street) }],
    ruaPorZona: series(groupedSum(rows, "zona", "street")),
    redeCards: series(counter(rows, "services"), 4).map((item, index) => metric(`rede-${index}`, item.label, item.value, "Atendimentos informados", "building2")),
    redeCobertura: series(counter(rows, "services")),
    redeFamiliasPorEquipamento: series(groupedSum(rows, "equipamento", "families"), 10),
    redeAtendimentosPorZona: series(groupedCounterTotal(rows, "zona", "services")),
    redeAtendimentosPorBairro: series(groupedCounterTotal(rows, "localidade", "services"), 10),
  };
}

async function fetchCube(): Promise<CubeRow[]> {
  const response = await fetch("/api/dashboard-cube");
  if (!response.ok) throw new Error("Não foi possível carregar os dados do Supabase");
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

export function useExpenseStatistics(filters: DashboardFilters) {
  const query = useQuery({
    queryKey: ["expense-statistics", filters],
    queryFn: async (): Promise<ExpenseStatistics[]> => {
      const params = new URLSearchParams(Object.entries(filters));
      const response = await fetch(`/api/expense-statistics?${params}`);
      if (!response.ok) throw new Error("Não foi possível calcular as estatísticas de despesas");
      return response.json();
    },
    staleTime: 15 * 60 * 1000,
  });
  return {
    data: query.data || [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}

export { emptyFilters };
