/**
 * DADOS FICTÍCIOS — substitua este arquivo pelos dados reais.
 *
 * Toda a aplicação lê apenas daqui. Para conectar ao banco depois:
 * troque cada export por uma função de leitura (ex. hooks com TanStack Query)
 * mantendo os mesmos tipos definidos em src/types/dashboard.ts.
 */
import type {
  CategoryDatum,
  Indicator,
  SelectOption,
  TerritoryRow,
} from "@/types/dashboard";
import { normalizarLocalidade } from "@/utils/localidade";

export const ultimaAtualizacao = "31/07/2026";

/* ------------------------------------------------------------------ */
/* Opções de filtros                                                   */
/* ------------------------------------------------------------------ */

export const regioesOptions: SelectOption[] = [
  { value: "todas", label: "Todas as regiões" },
  { value: "Norte", label: "Norte" },
  { value: "Sul", label: "Sul" },
  { value: "Leste", label: "Leste" },
  { value: "Oeste", label: "Oeste" },
];

export const localidadesOptions: SelectOption[] = [
  { value: "todas", label: "Todos os bairros" },
  { value: "nossa-senhora-apresentacao", label: "Nossa Senhora da Apresentação" },
  { value: "lagoa-azul", label: "Lagoa Azul" },
  { value: "felipe-camarao", label: "Felipe Camarão" },
  { value: "pajucara", label: "Pajuçara" },
  { value: "planalto", label: "Planalto" },
  { value: "cidade-nova", label: "Cidade Nova" },
  { value: "ponta-negra", label: "Ponta Negra" },
].map((option) => ({ ...option, label: normalizarLocalidade(option.label) }));

export const equipamentosOptions: SelectOption[] = [
  { value: "todos", label: "Todos os equipamentos" },
  { value: "cras-pajucara", label: "CRAS Pajuçara" },
  { value: "cras-planalto", label: "CRAS Planalto" },
  { value: "cras-felipe-camarao", label: "CRAS Felipe Camarão" },
  { value: "creas-norte", label: "CREAS Zona Norte" },
  { value: "creas-oeste", label: "CREAS Zona Oeste" },
  { value: "centro-pop", label: "Centro POP Natal" },
];

export const faixaRendaOptions: SelectOption[] = [
  { value: "todas", label: "Todas as faixas" },
  { value: "ate-218", label: "Até R$ 218" },
  { value: "219-706", label: "R$ 219 a R$ 706" },
  { value: "707-meio-sm", label: "R$ 707 a 1/2 salário mínimo" },
  { value: "acima-meio-sm", label: "Acima de 1/2 salário mínimo" },
];

export const pbfOptions: SelectOption[] = [
  { value: "todos", label: "Todos" },
  { value: "beneficiarios", label: "Beneficiários" },
  { value: "nao-beneficiarios", label: "Não beneficiários" },
];

/* ------------------------------------------------------------------ */
/* Visão Geral                                                         */
/* ------------------------------------------------------------------ */

export const visaoGeralCards = [
  {
    id: "pessoas",
    label: "Pessoas cadastradas",
    value: 235482,
    hint: "Pessoas registradas no Cadastro Único",
    icon: "users" as const,
  },
  {
    id: "familias",
    label: "Famílias cadastradas",
    value: 94218,
    hint: "Núcleos familiares com cadastro ativo",
    icon: "home" as const,
  },
  {
    id: "pbf",
    label: "Beneficiários do Bolsa Família",
    value: 62541,
    hint: "Famílias beneficiárias do PBF",
    icon: "handHeart" as const,
  },
  {
    id: "renda",
    label: "Renda média per capita",
    value: 487.32,
    format: "currency" as const,
    hint: "Média declarada por pessoa/mês",
    icon: "wallet" as const,
  },
  {
    id: "pcd",
    label: "Pessoas com deficiência",
    value: 18430,
    hint: "Pessoas com marcação de deficiência",
    icon: "accessibility" as const,
  },
  {
    id: "risco",
    label: "Famílias em risco social",
    value: 12742,
    hint: "Situações de risco identificadas",
    icon: "alert" as const,
  },
];

export const faixaEtaria: CategoryDatum[] = [
  { label: "0 a 5 anos", value: 24310 },
  { label: "6 a 11 anos", value: 29875 },
  { label: "12 a 17 anos", value: 31240 },
  { label: "18 a 29 anos", value: 48920 },
  { label: "30 a 59 anos", value: 72415 },
  { label: "60 anos ou mais", value: 28722 },
];

export const distribuicaoSexo: CategoryDatum[] = [
  { label: "Feminino", value: 130143 },
  { label: "Masculino", value: 105339 },
];

export const corRaca: CategoryDatum[] = [
  { label: "Parda", value: 132870 },
  { label: "Branca", value: 54120 },
  { label: "Preta", value: 38210 },
  { label: "Amarela", value: 4310 },
  { label: "Indígena", value: 2180 },
  { label: "Não informado", value: 3792 },
];

/** Categorias configuráveis — altere aqui quando os cortes de renda mudarem. */
export const faixaRendaFamiliar: CategoryDatum[] = [
  { label: "Até R$ 218", value: 41250 },
  { label: "R$ 219 a R$ 706", value: 32480 },
  { label: "R$ 707 a 1/2 salário mínimo", value: 14310 },
  { label: "Acima de 1/2 salário mínimo", value: 6178 },
];

export const indicadoresVulnerabilidade: Indicator[] = [
  {
    id: "extrema-pobreza",
    label: "Famílias em extrema pobreza",
    value: 41250,
    percent: 43.8,
    unit: "famílias",
    tone: "critical",
  },
  {
    id: "pobreza",
    label: "Famílias em pobreza",
    value: 32480,
    percent: 34.5,
    unit: "famílias",
    tone: "alert",
  },
  {
    id: "rua",
    label: "Pessoas em situação de rua",
    value: 1284,
    percent: 0.5,
    unit: "pessoas",
    tone: "critical",
  },
  {
    id: "pcd",
    label: "Pessoas com deficiência",
    value: 18430,
    percent: 7.8,
    unit: "pessoas",
    tone: "neutral",
  },
  {
    id: "trabalho-infantil",
    label: "Marcação de trabalho infantil",
    value: 962,
    percent: 0.4,
    unit: "pessoas",
    tone: "critical",
  },
  {
    id: "inseguranca-alimentar",
    label: "Famílias em insegurança alimentar",
    value: 27310,
    percent: 29,
    unit: "famílias",
    tone: "alert",
  },
  {
    id: "violacao-direitos",
    label: "Risco por violação de direitos",
    value: 4180,
    percent: 4.4,
    unit: "famílias",
    tone: "alert",
  },
];

/** Bairros com maior número de famílias cadastradas. */
export const bairrosTop: CategoryDatum[] = [
  { label: "Nossa Senhora da Apresentação", value: 9840 },
  { label: "Lagoa Azul", value: 8215 },
  { label: "Felipe Camarão", value: 7460 },
  { label: "Pajuçara", value: 6320 },
  { label: "Planalto", value: 5185 },
].map((item) => ({ ...item, label: normalizarLocalidade(item.label) }));

export const tabelaIndicadores: TerritoryRow[] = [
  {
    zona: "Norte",
    localidade: "Nossa Senhora da Apresentação",
    familias: 9840,
    pessoas: 27310,
    rendaPerCapita: 412.5,
    beneficiariosPbf: 7120,
    pessoasComDeficiencia: 2140,
  },
  {
    zona: "Norte",
    localidade: "Lagoa Azul",
    familias: 8215,
    pessoas: 22980,
    rendaPerCapita: 428.9,
    beneficiariosPbf: 6050,
    pessoasComDeficiencia: 1810,
  },
  {
    zona: "Oeste",
    localidade: "Felipe Camarão",
    familias: 7460,
    pessoas: 20140,
    rendaPerCapita: 401.2,
    beneficiariosPbf: 5680,
    pessoasComDeficiencia: 1620,
  },
  {
    zona: "Oeste",
    localidade: "Cidade Nova",
    familias: 4120,
    pessoas: 11380,
    rendaPerCapita: 445.7,
    beneficiariosPbf: 2810,
    pessoasComDeficiencia: 890,
  },
  {
    zona: "Sul",
    localidade: "Pajuçara",
    familias: 6320,
    pessoas: 17240,
    rendaPerCapita: 489.3,
    beneficiariosPbf: 4210,
    pessoasComDeficiencia: 1240,
  },
  {
    zona: "Sul",
    localidade: "Ponta Negra",
    familias: 2140,
    pessoas: 5480,
    rendaPerCapita: 612.8,
    beneficiariosPbf: 980,
    pessoasComDeficiencia: 410,
  },
  {
    zona: "Leste",
    localidade: "Planalto",
    familias: 5185,
    pessoas: 14120,
    rendaPerCapita: 470.4,
    beneficiariosPbf: 3410,
    pessoasComDeficiencia: 1020,
  },
  {
    zona: "Leste",
    localidade: "Rocas",
    familias: 1890,
    pessoas: 4980,
    rendaPerCapita: 523.1,
    beneficiariosPbf: 910,
    pessoasComDeficiencia: 360,
  },
].map((row) => ({ ...row, localidade: normalizarLocalidade(row.localidade) } as TerritoryRow));

/* ------------------------------------------------------------------ */
/* Página Famílias                                                     */
/* ------------------------------------------------------------------ */

export const familiasCards = [
  { id: "total", label: "Total de famílias", value: 94218, hint: "Cadastros familiares ativos", icon: "home" as const },
  {
    id: "media-pessoas",
    label: "Média de pessoas por família",
    value: 2.5,
    format: "decimal" as const,
    hint: "Pessoas por núcleo familiar",
    icon: "users" as const,
  },
  { id: "pbf", label: "Famílias beneficiárias do PBF", value: 62541, hint: "Bolsa Família", icon: "handHeart" as const },
  {
    id: "atualizado",
    label: "Cadastros atualizados",
    value: 68420,
    hint: "Atualização em até 24 meses",
    icon: "check" as const,
  },
  {
    id: "desatualizado",
    label: "Cadastros desatualizados",
    value: 25798,
    hint: "Sem atualização há mais de 24 meses",
    icon: "alert" as const,
  },
];

export const familiasPorRegiao: CategoryDatum[] = [
  { label: "Norte", value: 38210 },
  { label: "Oeste", value: 24180 },
  { label: "Sul", value: 17420 },
  { label: "Leste", value: 14408 },
];

export const pessoasPorDomicilio: CategoryDatum[] = [
  { label: "1 pessoa", value: 18420 },
  { label: "2 pessoas", value: 22310 },
  { label: "3 pessoas", value: 21870 },
  { label: "4 pessoas", value: 16240 },
  { label: "5 pessoas", value: 9180 },
  { label: "6 ou mais", value: 6198 },
];

export const tempoUltimaAtualizacao: CategoryDatum[] = [
  { label: "Até 12 meses", value: 41230 },
  { label: "13 a 24 meses", value: 27190 },
  { label: "25 a 36 meses", value: 15420 },
  { label: "Mais de 36 meses", value: 10378 },
];

export const estadoCadastral: CategoryDatum[] = [
  { label: "Atualizado", value: 68420 },
  { label: "Desatualizado", value: 25798 },
];

/* ------------------------------------------------------------------ */
/* Página Renda e Vulnerabilidade                                      */
/* ------------------------------------------------------------------ */

export const rendaCards = [
  {
    id: "renda-familiar",
    label: "Renda média familiar",
    value: 1218.45,
    format: "currency" as const,
    hint: "Renda total declarada por família",
    icon: "wallet" as const,
  },
  {
    id: "renda-per-capita",
    label: "Renda média per capita",
    value: 487.32,
    format: "currency" as const,
    hint: "Média por pessoa/mês",
    icon: "trending" as const,
  },
  {
    id: "extrema-pobreza",
    label: "Famílias em extrema pobreza",
    value: 41250,
    hint: "Renda per capita até R$ 218",
    icon: "alert" as const,
  },
  {
    id: "pobreza",
    label: "Famílias em pobreza",
    value: 32480,
    hint: "Renda per capita de R$ 219 a R$ 706",
    icon: "alert" as const,
  },
  {
    id: "pbf",
    label: "Famílias beneficiárias do PBF",
    value: 62541,
    hint: "Programa Bolsa Família",
    icon: "handHeart" as const,
  },
];

export const rendaMediaPorRegiao: CategoryDatum[] = [
  { label: "Sul", value: 561 },
  { label: "Leste", value: 512 },
  { label: "Oeste", value: 442 },
  { label: "Norte", value: 418 },
];

export const despesasFamiliares: CategoryDatum[] = [
  { label: "Alimentação", value: 88420 },
  { label: "Energia", value: 84120 },
  { label: "Água", value: 71340 },
  { label: "Gás", value: 68210 },
  { label: "Transporte", value: 42180 },
  { label: "Aluguel", value: 27650 },
  { label: "Medicamentos", value: 21480 },
];

export const pbfDistribuicao: CategoryDatum[] = [
  { label: "Beneficiários", value: 62541 },
  { label: "Não beneficiários", value: 31677 },
];
