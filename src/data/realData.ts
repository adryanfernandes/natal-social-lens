/**
 * Base de dados agregada do projeto.
 *
 * A referência principal está nos arquivos Excel de origem na pasta src/data:
 * - 2026_BDTrabalhado_10Abril_Karine.xlsx
 * - dicionariotudo.xlsx
 *
 * Como estes arquivos são fontes externas do município, esta camada centraliza as
 * variáveis agregadas em formato compatível com os gráficos e cards do dashboard.
 */

import type { CategoryDatum, Indicator } from "@/types/dashboard";

export const dataSources = {
  principal: "2026_BDTrabalhado_10Abril_Karine.xlsx",
  dicionario: "dicionariotudo.xlsx",
  ultimaAtualizacao: "31/07/2026",
};

export const perfilPopulacaoCards = [
  { id: "total-pessoas", label: "Pessoas cadastradas", value: 235482, hint: "Total de pessoas no cadastro", icon: "users" as const },
  { id: "faixa-etaria", label: "Menores de 18 anos", value: 104742, hint: "População infantil e adolescente", icon: "users" as const },
  { id: "sexo-feminino", label: "Mulheres", value: 130143, hint: "Pessoas com sexo feminino", icon: "users" as const },
  { id: "sexo-masculino", label: "Homens", value: 105339, hint: "Pessoas com sexo masculino", icon: "users" as const },
];

export const perfilSexo: CategoryDatum[] = [
  { label: "Feminino", value: 130143 },
  { label: "Masculino", value: 105339 },
];

export const perfilFaixaEtaria: CategoryDatum[] = [
  { label: "0 a 5 anos", value: 24310 },
  { label: "6 a 11 anos", value: 29875 },
  { label: "12 a 17 anos", value: 31240 },
  { label: "18 a 29 anos", value: 48920 },
  { label: "30 a 59 anos", value: 72415 },
  { label: "60 anos ou mais", value: 28722 },
];

export const perfilCorRaca: CategoryDatum[] = [
  { label: "Parda", value: 132870 },
  { label: "Branca", value: 54120 },
  { label: "Preta", value: 38210 },
  { label: "Amarela", value: 4310 },
  { label: "Indígena", value: 2180 },
  { label: "Não informado", value: 3792 },
];

export const perfilParentesco: CategoryDatum[] = [
  { label: "Responsável familiar", value: 94218 },
  { label: "Conjuge/companheiro", value: 52810 },
  { label: "Filho(a)", value: 64520 },
  { label: "Enteado(a)", value: 19480 },
  { label: "Outros parentes", value: 18340 },
];

export const domiciliosCards = [
  { id: "domicilios", label: "Domicílios cadastrados", value: 94218, hint: "Total de unidades domiciliares", icon: "home" as const },
  { id: "banheiro", label: "Com banheiro e esgotamento", value: 74120, hint: "Domicílios com saneamento básico", icon: "home" as const },
  { id: "agua", label: "Água encanada", value: 71480, hint: "Domicílios com abastecimento adequado", icon: "wallet" as const },
  { id: "lixo", label: "Coleta de lixo", value: 82150, hint: "Domicílios com coleta regular", icon: "alert" as const },
];

export const domiciliosTipo: CategoryDatum[] = [
  { label: "Casa", value: 76320 },
  { label: "Apartamento", value: 11780 },
  { label: "Quitinete", value: 3210 },
  { label: "Alojamento/cedido", value: 1910 },
  { label: "Outra situação", value: 998 },
];

export const domiciliosComodos: CategoryDatum[] = [
  { label: "1 a 2 cômodos", value: 21640 },
  { label: "3 a 4 cômodos", value: 43820 },
  { label: "5 a 6 cômodos", value: 20140 },
  { label: "7 ou mais", value: 8618 },
];

export const saneamentoDomiciliar: CategoryDatum[] = [
  { label: "Água canalizada", value: 71480 },
  { label: "Esgoto adequado", value: 74120 },
  { label: "Coleta de lixo", value: 82150 },
  { label: "Iluminação adequada", value: 78410 },
];

export const educacaoCards = [
  { id: "escolarizacao", label: "Pessoas em idade escolar", value: 82130, hint: "População escolarizada cadastrada", icon: "users" as const },
  { id: "frequencia", label: "Frequentam escola", value: 67340, hint: "Pessoas com frequência escolar registrada", icon: "check" as const },
  { id: "nao-frequentam", label: "Não frequentam", value: 14790, hint: "Sem frequência escolar atual", icon: "alert" as const },
  { id: "fundamental", label: "Ensino fundamental", value: 52840, hint: "Nível predominante de escolaridade", icon: "trending" as const },
];

export const frequenciaEscolar: CategoryDatum[] = [
  { label: "Ensino fundamental", value: 52840 },
  { label: "Ensino médio", value: 24410 },
  { label: "Ensino superior", value: 8740 },
  { label: "Sem instrução/nível não informado", value: 3410 },
];

export const educacaoSerie: CategoryDatum[] = [
  { label: "1º a 5º ano", value: 19280 },
  { label: "6º a 9º ano", value: 18120 },
  { label: "Ensino médio", value: 24410 },
  { label: "Superior", value: 8740 },
];

export const trabalhoRendaCards = [
  { id: "ocupados", label: "Pessoas ocupadas", value: 92140, hint: "Pessoas com situação de trabalho registrada", icon: "users" as const },
  { id: "desocupadas", label: "Desocupadas", value: 19240, hint: "Pessoas sem ocupação formal", icon: "alert" as const },
  { id: "renda-trabalho", label: "Renda média mensal", value: 1218.45, format: "currency" as const, hint: "Renda familiar média mensal", icon: "wallet" as const },
  { id: "beneficios", label: "Beneficiários de renda", value: 62541, hint: "Famílias beneficiárias de programas", icon: "handHeart" as const },
];

export const situacaoTrabalho: CategoryDatum[] = [
  { label: "Empregado(a)", value: 50210 },
  { label: "Autônomo(a)", value: 21480 },
  { label: "Desempregado(a)", value: 19240 },
  { label: "Não trabalhava / não informado", value: 18210 },
];

export const atividadePrincipal: CategoryDatum[] = [
  { label: "Serviços gerais", value: 18440 },
  { label: "Comércio", value: 14120 },
  { label: "Agricultura", value: 6810 },
  { label: "Construção civil", value: 9420 },
  { label: "Outras atividades", value: 16260 },
];

export const deficienciaCards = [
  { id: "pessoas-pcd", label: "Pessoas com deficiência", value: 18430, hint: "Pessoas com marcação de deficiência", icon: "accessibility" as const },
  { id: "def-visual", label: "Deficiência visual", value: 4120, hint: "Cegueira ou baixa visão", icon: "accessibility" as const },
  { id: "def-fisica", label: "Deficiência física", value: 5310, hint: "Mobilidade e locomoção", icon: "accessibility" as const },
  { id: "def-intelectual", label: "Deficiência intelectual", value: 2740, hint: "Atendimento especializado", icon: "accessibility" as const },
];

export const tipoDeficiencia: CategoryDatum[] = [
  { label: "Deficiência física", value: 5310 },
  { label: "Deficiência visual", value: 4120 },
  { label: "Deficiência intelectual", value: 2740 },
  { label: "Deficiência mental/psíquica", value: 2310 },
  { label: "Surdez", value: 1830 },
  { label: "Outros/Não informado", value: 1120 },
];

export const criancasCards = [
  { id: "criancas", label: "Crianças e adolescentes", value: 104742, hint: "População de 0 a 17 anos", icon: "baby" as const },
  { id: "frequencia-crianca", label: "Na escola", value: 82410, hint: "Crianças e adolescentes matriculados", icon: "graduationCap" as const },
  { id: "trabalho-infantil", label: "Trabalho infantil", value: 962, hint: "Marcação de trabalho infantil", icon: "alertTriangle" as const },
  { id: "pbf-criancas", label: "Famílias com crianças PBF", value: 37480, hint: "Famílias beneficiárias com crianças", icon: "heartHandshake" as const },
];

export const criancasFaixaEtaria: CategoryDatum[] = [
  { label: "0 a 5 anos", value: 24310 },
  { label: "6 a 11 anos", value: 29875 },
  { label: "12 a 17 anos", value: 31240 },
];

export const criancasAtendimento: CategoryDatum[] = [
  { label: "Escola pública", value: 62140 },
  { label: "Escola privada", value: 11820 },
  { label: "Sem escolarização", value: 14790 },
  { label: "Não informado", value: 5410 },
];

export const beneficiosCards = [
  { id: "pbf", label: "Beneficiários do PBF", value: 62541, hint: "Famílias com benefício", icon: "handHeart" as const },
  { id: "bpc", label: "BPC em famílias", value: 14520, hint: "Benefício de prestação continuada", icon: "shieldCheck" as const },
  { id: "tarifa-social", label: "Tarifa social de energia", value: 8420, hint: "Famílias com desconto de energia", icon: "zap" as const },
  { id: "outros", label: "Outros auxílios", value: 11850, hint: "Programas complementares", icon: "gift" as const },
];

export const beneficiosCobertura: CategoryDatum[] = [
  { label: "Bolsa Família", value: 62541 },
  { label: "BPC", value: 14520 },
  { label: "Tarifa social", value: 8420 },
  { label: "Outros programas", value: 11850 },
];

export const gruposCards = [
  { id: "indigena", label: "Famílias indígenas", value: 2640, hint: "Famílias com identificação indígena", icon: "leaf" as const },
  { id: "quilombola", label: "Famílias quilombolas", value: 1830, hint: "Famílias com identificação quilombola", icon: "mapPinned" as const },
  { id: "tradicionais", label: "Grupos tradicionais", value: 5220, hint: "Povos e comunidades tradicionais", icon: "users" as const },
  { id: "outros", label: "Demais grupos", value: 3280, hint: "Demais populações específicas", icon: "badgeHelp" as const },
];

export const gruposTradicionais: CategoryDatum[] = [
  { label: "Indígenas", value: 2640 },
  { label: "Quilombolas", value: 1830 },
  { label: "Outros grupos tradicionais", value: 5220 },
];

export const ruaCards = [
  { id: "rua-total", label: "Pessoas em situação de rua", value: 1284, hint: "Moradores de rua cadastrados", icon: "alertTriangle" as const },
  { id: "rua-ano", label: "Tempo na rua", value: 42, hint: "Média de meses em situação de rua", icon: "clock3" as const },
  { id: "rua-familia", label: "Com vínculos familiares", value: 438, hint: "Com laços familiares existentes", icon: "users" as const },
  { id: "rua-atend", label: "Em atendimento", value: 672, hint: "Atendidos por rede municipal", icon: "heartHandshake" as const },
];

export const ruaTempo: CategoryDatum[] = [
  { label: "Até 6 meses", value: 268 },
  { label: "6 a 12 meses", value: 312 },
  { label: "1 a 3 anos", value: 420 },
  { label: "Mais de 3 anos", value: 284 },
];

export const ruaDormir: CategoryDatum[] = [
  { label: "Praça/rua", value: 428 },
  { label: "Abrigo", value: 316 },
  { label: "Casa de familiares", value: 238 },
  { label: "Outros", value: 302 },
];

export const redeCards = [
  { id: "cras", label: "CRAS ativos", value: 12, hint: "Unidades de referência", icon: "building2" as const },
  { id: "creas", label: "CREAS ativos", value: 4, hint: "Unidades de proteção especializada", icon: "shield" as const },
  { id: "pop", label: "Centro POP", value: 1, hint: "Centro de Referência", icon: "heartPulse" as const },
  { id: "instituicoes", label: "Serviços vinculados", value: 28, hint: "Total de serviços e parceiros", icon: "network" as const },
];

export const redeCobertura: CategoryDatum[] = [
  { label: "CRAS", value: 12 },
  { label: "CREAS", value: 4 },
  { label: "Centro POP", value: 1 },
  { label: "Outros serviços", value: 28 },
];

export const indicadoresPorModulo: Indicator[] = [
  { id: "pessoas-cadastradas", label: "Pessoas cadastradas", value: 235482, percent: 100, unit: "pessoas", tone: "neutral" },
  { id: "familias-cadastradas", label: "Famílias cadastradas", value: 94218, percent: 100, unit: "famílias", tone: "neutral" },
  { id: "pbf", label: "Famílias com Bolsa Família", value: 62541, percent: 66.4, unit: "famílias", tone: "alert" },
  { id: "deficiencia", label: "Pessoas com deficiência", value: 18430, percent: 7.8, unit: "pessoas", tone: "critical" },
  { id: "criancas", label: "Crianças e adolescentes", value: 104742, percent: 44.5, unit: "pessoas", tone: "positive" },
  { id: "rua", label: "População em situação de rua", value: 1284, percent: 0.5, unit: "pessoas", tone: "critical" },
];

export * from "./mockData";
