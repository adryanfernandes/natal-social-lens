/**
 * Tipos do Observatório do Cadastro Único — Natal/RN.
 * Estes tipos representam DADOS AGREGADOS (nunca dados individuais).
 * Ao migrar para o banco de dados, mantenha estes contratos para que os
 * componentes continuem funcionando sem alterações.
 */

/** Ponto genérico usado por todos os gráficos de barras/donut. */
export interface CategoryDatum {
  /** Rótulo exibido no eixo/legenda. */
  label: string;
  /** Valor absoluto (nº de pessoas, famílias, etc.). */
  value: number;
  /** Percentual opcional (0-100). */
  percent?: number;
}

export interface ExpenseStatistics {
  label: string;
  count: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  distribution: CategoryDatum[];
}

/** Indicador de destaque (cards de vulnerabilidade). */
export interface Indicator {
  id: string;
  label: string;
  value: number;
  percent: number;
  /** Unidade textual: "famílias", "pessoas"... */
  unit: string;
  tone?: "neutral" | "alert" | "critical" | "positive";
}

/** Linha agregada por território — base da tabela de indicadores. */
export interface TerritoryRow {
  zona: Zona;
  localidade: string;
  familias: number;
  pessoas: number;
  rendaPerCapita: number;
  beneficiariosPbf: number;
  pessoasComDeficiencia: number;
  pessoasSituacaoRua: number;
  criancasAdolescentes: number;
  trabalhoInfantil: number;
  familiasRiscoSocial: number;
  insegurancaAlimentar: number;
  familiasIndigenas: number;
  familiasQuilombolas: number;
  cadastrosAtualizados: number;
}

export type Zona = "Norte" | "Sul" | "Leste" | "Oeste" | "Nao informado";

export type PbfFiltro = string;

/** Estado dos filtros globais. */
export interface DashboardFilters {
  zona: string;
  localidade: string;
  equipamento: string;
  faixaRenda: string;
  pbf: PbfFiltro;
}

export const emptyFilters: DashboardFilters = {
  zona: "todas",
  localidade: "todas",
  equipamento: "todos",
  faixaRenda: "todas",
  pbf: "todos",
};

/** Opção de select. */
export interface SelectOption {
  value: string;
  label: string;
}
