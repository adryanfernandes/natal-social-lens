import { useQuery } from "@tanstack/react-query";
import { Info, MapPinned } from "lucide-react";
import { useMemo, useState } from "react";
import { formatValue, type ValueFormat } from "@/utils/format";
import { normalizarLocalidade } from "@/utils/localidade";
import type { TerritoryRow } from "@/types/dashboard";

type MapLevel = "bairro" | "zona";
type MetricKey = Exclude<keyof TerritoryRow, "zona" | "localidade">;

interface GeoFeature {
  type: "Feature";
  properties: { codigo: string; bairro: string };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
}

interface GeoCollection {
  type: "FeatureCollection";
  features: GeoFeature[];
}

interface MapMetric {
  key: MetricKey;
  label: string;
  unit: string;
  format?: ValueFormat;
}

const metrics: MapMetric[] = [
  { key: "familias", label: "Número de famílias", unit: "famílias" },
  { key: "pessoas", label: "Número de pessoas", unit: "pessoas" },
  { key: "pessoasSituacaoRua", label: "Pessoas em situação de rua", unit: "pessoas" },
  { key: "pessoasComDeficiencia", label: "Pessoas com deficiência", unit: "pessoas" },
  { key: "beneficiariosPbf", label: "Famílias beneficiárias do PBF", unit: "famílias" },
  { key: "criancasAdolescentes", label: "Crianças e adolescentes", unit: "pessoas" },
  { key: "trabalhoInfantil", label: "Marcação de trabalho infantil", unit: "pessoas" },
  { key: "familiasRiscoSocial", label: "Famílias em risco social", unit: "famílias" },
  { key: "insegurancaAlimentar", label: "Insegurança alimentar", unit: "famílias" },
  { key: "familiasIndigenas", label: "Famílias indígenas", unit: "famílias" },
  { key: "familiasQuilombolas", label: "Famílias quilombolas", unit: "famílias" },
  { key: "cadastrosAtualizados", label: "Cadastros atualizados", unit: "famílias" },
  {
    key: "rendaPerCapita",
    label: "Renda familiar per capita",
    unit: "média mensal",
    format: "currency",
  },
];

const neighborhoodZones: Record<string, TerritoryRow["zona"]> = {
  ALECRIM: "Leste",
  "AREIA PRETA": "Leste",
  "BARRO VERMELHO": "Leste",
  "CIDADE ALTA": "Leste",
  "LAGOA SECA": "Leste",
  "MAE LUIZA": "Leste",
  PETROPOLIS: "Leste",
  "PRAIA DO MEIO": "Leste",
  RIBEIRA: "Leste",
  ROCAS: "Leste",
  "SANTOS REIS": "Leste",
  TIROL: "Leste",
  "BOM PASTOR": "Oeste",
  "CIDADE DA ESPERANCA": "Oeste",
  "CIDADE NOVA": "Oeste",
  "DIX SEPT ROSADO": "Oeste",
  "FELIPE CAMARAO": "Oeste",
  GUARAPES: "Oeste",
  NORDESTE: "Oeste",
  "NOSSA SENHORA DE NAZARE": "Oeste",
  PLANALTO: "Oeste",
  QUINTAS: "Oeste",
  IGAPO: "Norte",
  "LAGOA AZUL": "Norte",
  "NOSSA SENHORA DA APRESENTACAO": "Norte",
  PAJUCARA: "Norte",
  POTENGI: "Norte",
  REDINHA: "Norte",
  SALINAS: "Norte",
  CANDELARIA: "Sul",
  "CAPIM MACIO": "Sul",
  "LAGOA NOVA": "Sul",
  NEOPOLIS: "Sul",
  "NOVA DESCOBERTA": "Sul",
  PITIMBU: "Sul",
  "PONTA NEGRA": "Sul",
};

const mapColors = [
  "color-mix(in oklch, var(--color-chart-2) 18%, var(--color-muted))",
  "color-mix(in oklch, var(--color-chart-2) 38%, var(--color-muted))",
  "color-mix(in oklch, var(--color-chart-1) 58%, var(--color-muted))",
  "color-mix(in oklch, var(--color-chart-1) 78%, var(--color-muted))",
  "var(--color-chart-1)",
];

function keyName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/-/g, " ")
    .toUpperCase();
}

function canonicalNeighborhood(value: string) {
  const key = keyName(value);
  return key === "FILIPE CAMARAO" ? "FELIPE CAMARAO" : key;
}

function rings(feature: GeoFeature): number[][][] {
  return feature.geometry.type === "Polygon"
    ? (feature.geometry.coordinates as number[][][])
    : (feature.geometry.coordinates as number[][][][]).flat();
}

function buildProjection(features: GeoFeature[]) {
  const points = features.flatMap((feature) => rings(feature).flat());
  const xs = points.map((point) => point[0] ?? 0);
  const ys = points.map((point) => point[1] ?? 0);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = 900;
  const height = 650;
  const padding = 24;
  const scale = Math.min(
    (width - padding * 2) / (maxX - minX),
    (height - padding * 2) / (maxY - minY),
  );
  const drawnWidth = (maxX - minX) * scale;
  const drawnHeight = (maxY - minY) * scale;
  const offsetX = (width - drawnWidth) / 2;
  const offsetY = (height - drawnHeight) / 2;
  const project = (point: number[]) => [
    offsetX + ((point[0] ?? minX) - minX) * scale,
    height - offsetY - ((point[1] ?? minY) - minY) * scale,
  ];
  return { width, height, project };
}

function featurePath(feature: GeoFeature, project: (point: number[]) => number[]) {
  return rings(feature)
    .map(
      (ring) =>
        ring
          .map((point, index) => {
            const [x, y] = project(point);
            return `${index ? "L" : "M"}${x?.toFixed(1)},${y?.toFixed(1)}`;
          })
          .join(" ") + " Z",
    )
    .join(" ");
}

function aggregateByZone(rows: TerritoryRow[], key: MetricKey) {
  const groups = new Map<string, { value: number; families: number }>();
  rows
    .filter((row) => row.zona !== "Nao informado")
    .forEach((row) => {
      const current = groups.get(row.zona) ?? { value: 0, families: 0 };
      if (key === "rendaPerCapita") current.value += row.rendaPerCapita * row.familias;
      else current.value += row[key];
      current.families += row.familias;
      groups.set(row.zona, current);
    });
  return new Map(
    [...groups].map(([label, item]) => [
      label,
      key === "rendaPerCapita" && item.families ? item.value / item.families : item.value,
    ]),
  );
}

function aggregateByNeighborhood(rows: TerritoryRow[], key: MetricKey) {
  const groups = new Map<string, { value: number; families: number }>();
  rows.forEach((row) => {
    const label = canonicalNeighborhood(row.localidade);
    const current = groups.get(label) ?? { value: 0, families: 0 };
    if (key === "rendaPerCapita") current.value += row.rendaPerCapita * row.familias;
    else current.value += row[key];
    current.families += row.familias;
    groups.set(label, current);
  });
  return new Map(
    [...groups].map(([label, item]) => [
      label,
      key === "rendaPerCapita" && item.families ? item.value / item.families : item.value,
    ]),
  );
}

function useNeighborhoodGeometry() {
  return useQuery({
    queryKey: ["natal-neighborhood-geometry"],
    queryFn: async () => {
      const response = await fetch("/data/natal-bairros.geojson");
      if (!response.ok) throw new Error("Não foi possível carregar a malha territorial.");
      return response.json() as Promise<GeoCollection>;
    },
    staleTime: Infinity,
  });
}

export function ThematicMap({ rows }: { rows: TerritoryRow[] }) {
  const [level, setLevel] = useState<MapLevel>("bairro");
  const [metricKey, setMetricKey] = useState<MetricKey>("familias");
  const [active, setActive] = useState<string | null>(null);
  const { data, isLoading, error } = useNeighborhoodGeometry();
  const metric = metrics.find((item) => item.key === metricKey) ?? metrics[0]!;
  const neighborhoodValues = useMemo(
    () => aggregateByNeighborhood(rows, metricKey),
    [rows, metricKey],
  );
  const zoneValues = useMemo(() => aggregateByZone(rows, metricKey), [rows, metricKey]);
  const ranked = useMemo(() => {
    const values = level === "bairro" ? neighborhoodValues : zoneValues;
    return [...values.entries()]
      .filter(([label]) => label !== "Nao informado")
      .sort((a, b) => b[1] - a[1]);
  }, [level, neighborhoodValues, zoneValues]);
  const max = ranked[0]?.[1] ?? 0;
  const projection = useMemo(() => (data ? buildProjection(data.features) : null), [data]);
  const colorFor = (value: number) => {
    if (!value || !max) return "var(--color-muted)";
    return mapColors[Math.min(4, Math.floor((value / max) * 5))] ?? mapColors[0]!;
  };
  const activeValue = active
    ? ((level === "bairro" ? neighborhoodValues.get(active) : zoneValues.get(active)) ?? 0)
    : 0;

  return (
    <div className="panel overflow-hidden">
      <div className="grid border-b border-border lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="p-5">
          <div className="flex items-center gap-2">
            <MapPinned className="size-5 text-primary" aria-hidden />
            <h2 className="text-base font-semibold">Distribuição territorial</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Selecione o recorte e o indicador exibido no mapa.
          </p>
        </div>
        <div className="grid gap-3 border-t border-border p-4 sm:grid-cols-[auto_minmax(240px,320px)] lg:border-l lg:border-t-0">
          <div>
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Território</span>
            <div
              className="flex h-9 rounded-md bg-muted p-1"
              role="group"
              aria-label="Recorte territorial"
            >
              {(["bairro", "zona"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setLevel(item);
                    setActive(null);
                  }}
                  className={`rounded px-3 text-sm font-medium transition-colors ${level === item ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {item === "bairro" ? "Bairros" : "Zonas"}
                </button>
              ))}
            </div>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Indicador</span>
            <select
              value={metricKey}
              onChange={(event) => {
                setMetricKey(event.target.value as MetricKey);
                setActive(null);
              }}
              className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {metrics.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="relative min-h-[520px] bg-muted/35 p-3 sm:p-5">
          {isLoading ? (
            <div className="flex min-h-[500px] items-center justify-center text-sm text-muted-foreground">
              Carregando malha territorial...
            </div>
          ) : null}
          {error ? (
            <div className="flex min-h-[500px] items-center justify-center text-sm text-destructive">
              {error instanceof Error ? error.message : "Erro ao carregar o mapa."}
            </div>
          ) : null}
          {data && projection ? (
            <svg
              viewBox={`0 0 ${projection.width} ${projection.height}`}
              className="h-auto max-h-[650px] min-h-[480px] w-full"
              role="img"
              aria-label={`Mapa de ${metric.label.toLowerCase()} por ${level}`}
            >
              {data.features.map((feature) => {
                const neighborhood = canonicalNeighborhood(feature.properties.bairro);
                const zone = neighborhoodZones[neighborhood] ?? "Nao informado";
                const label = level === "bairro" ? neighborhood : zone;
                const value =
                  level === "bairro"
                    ? (neighborhoodValues.get(neighborhood) ?? 0)
                    : (zoneValues.get(zone) ?? 0);
                return (
                  <path
                    key={feature.properties.codigo}
                    d={featurePath(feature, projection.project)}
                    fill={colorFor(value)}
                    stroke={active === label ? "var(--color-foreground)" : "var(--color-card)"}
                    strokeWidth={active === label ? 2.5 : 1.2}
                    className="cursor-pointer transition-[fill,stroke] duration-150 hover:brightness-95"
                    onMouseEnter={() => setActive(label)}
                    onFocus={() => setActive(label)}
                    tabIndex={0}
                  >
                    <title>
                      {normalizarLocalidade(label)}: {formatValue(value, metric.format)}
                    </title>
                  </path>
                );
              })}
            </svg>
          ) : null}
          <div className="pointer-events-none absolute left-5 top-5 rounded-md border border-border bg-card/95 px-3 py-2 shadow-sm backdrop-blur-sm">
            <p className="text-xs text-muted-foreground">
              {active ? normalizarLocalidade(active) : "Passe sobre o mapa"}
            </p>
            <p className="mt-0.5 text-base font-semibold">
              {active ? formatValue(activeValue, metric.format) : metric.label}
            </p>
            {active ? <p className="text-xs text-muted-foreground">{metric.unit}</p> : null}
          </div>
          <div className="absolute bottom-5 left-5 rounded-md border border-border bg-card/95 p-3 shadow-sm backdrop-blur-sm">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Menor <span className="float-right ml-12">Maior</span>
            </p>
            <div className="flex">
              {mapColors.map((color) => (
                <span
                  key={color}
                  className="h-2.5 w-9 first:rounded-l last:rounded-r"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <p className="absolute bottom-3 right-4 text-[10px] text-muted-foreground">
            Malha territorial: IBGE, Censo 2022
          </p>
        </div>

        <aside className="border-t border-border p-5 lg:border-l lg:border-t-0">
          <h3 className="text-sm font-semibold">Maior concentração</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Ranking conforme os filtros globais ativos.
          </p>
          <ol className="mt-4 divide-y divide-border">
            {ranked.slice(0, 10).map(([label, value], index) => (
              <li key={label} className="grid grid-cols-[24px_1fr_auto] items-center gap-2 py-3">
                <span className="text-xs tabular-nums text-muted-foreground">{index + 1}</span>
                <span
                  className="min-w-0 truncate text-sm font-medium"
                  title={normalizarLocalidade(label)}
                >
                  {normalizarLocalidade(label)}
                </span>
                <span className="text-sm font-semibold tabular-nums">
                  {formatValue(value, metric.format)}
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex gap-2 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>
              Morro Branco, Parque das Colinas e localidades sem limite oficial permanecem nos
              totais e filtros, mas não recebem polígono no mapa.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function FamilyConcentrationMap({ rows }: { rows: TerritoryRow[] }) {
  const [active, setActive] = useState<string | null>(null);
  const { data, isLoading, error } = useNeighborhoodGeometry();
  const values = useMemo(() => aggregateByNeighborhood(rows, "familias"), [rows]);
  const max = Math.max(0, ...values.values());
  const projection = useMemo(() => (data ? buildProjection(data.features) : null), [data]);
  const activeValue = active ? (values.get(active) ?? 0) : 0;
  const colorFor = (value: number) => {
    if (!value || !max) return "var(--color-muted)";
    return mapColors[Math.min(4, Math.floor((value / max) * 5))] ?? mapColors[0]!;
  };

  return (
    <div className="panel flex min-h-[404px] flex-col overflow-hidden">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold">Concentração de famílias por bairro</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Intensidade conforme o número de famílias cadastradas.
        </p>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center bg-muted/35 p-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando malha territorial...</p>
        ) : null}
        {error ? (
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Erro ao carregar o mapa."}
          </p>
        ) : null}
        {data && projection ? (
          <svg
            viewBox={`0 0 ${projection.width} ${projection.height}`}
            className="h-[315px] w-full"
            role="img"
            aria-label="Concentração de famílias cadastradas por bairro de Natal"
          >
            {data.features.map((feature) => {
              const neighborhood = canonicalNeighborhood(feature.properties.bairro);
              const value = values.get(neighborhood) ?? 0;
              return (
                <path
                  key={feature.properties.codigo}
                  d={featurePath(feature, projection.project)}
                  fill={colorFor(value)}
                  stroke={active === neighborhood ? "var(--color-foreground)" : "var(--color-card)"}
                  strokeWidth={active === neighborhood ? 2.5 : 1.2}
                  className="cursor-pointer transition-[fill,stroke] duration-150 hover:brightness-95"
                  onMouseEnter={() => setActive(neighborhood)}
                  onFocus={() => setActive(neighborhood)}
                  tabIndex={0}
                >
                  <title>
                    {normalizarLocalidade(neighborhood)}: {formatValue(value)} famílias
                  </title>
                </path>
              );
            })}
          </svg>
        ) : null}
        <div className="pointer-events-none absolute left-4 top-4 rounded-md border border-border bg-card/95 px-3 py-2 shadow-sm">
          <p className="text-xs text-muted-foreground">
            {active ? normalizarLocalidade(active) : "Passe sobre um bairro"}
          </p>
          <p className="mt-0.5 text-sm font-semibold">
            {active ? `${formatValue(activeValue)} famílias` : "Cadastro Único"}
          </p>
        </div>
        <div className="absolute bottom-4 left-4 rounded-md border border-border bg-card/95 p-2 shadow-sm">
          <div className="flex">
            {mapColors.map((color) => (
              <span
                key={color}
                className="h-2 w-7 first:rounded-l last:rounded-r"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>Menor</span>
            <span>Maior</span>
          </div>
        </div>
        <p className="absolute bottom-3 right-4 text-[10px] text-muted-foreground">
          Malha: IBGE, Censo 2022
        </p>
      </div>
    </div>
  );
}
