export type ValueFormat = "integer" | "currency" | "decimal" | "percent";

const integer = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const decimal = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatValue(value: number, format: ValueFormat = "integer") {
  switch (format) {
    case "currency":
      return currency.format(value);
    case "decimal":
      return decimal.format(value);
    case "percent":
      return `${decimal.format(value)}%`;
    default:
      return integer.format(value);
  }
}

export function formatCompact(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Soma os valores de uma série. */
export function sum(values: { value: number }[]) {
  return values.reduce((total, item) => total + item.value, 0);
}

/** Percentual de um valor sobre o total da série. */
export function share(value: number, total: number) {
  return total === 0 ? 0 : (value / total) * 100;
}
