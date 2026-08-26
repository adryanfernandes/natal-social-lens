/** Paleta e estilos compartilhados pelos gráficos (tokens do design system). */
export const chartPalette = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-chart-6)",
];

export const chartTooltipStyle = {
  contentStyle: {
    background: "var(--color-card)",
    border: "1px solid var(--color-border)",
    borderRadius: "0.5rem",
    fontSize: "0.75rem",
    color: "var(--color-card-foreground)",
    boxShadow: "var(--shadow-card)",
  },
  labelStyle: { color: "var(--color-foreground)", fontWeight: 600 },
  itemStyle: { color: "var(--color-muted-foreground)" },
  cursor: { fill: "var(--color-muted)" },
} as const;
