import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Database, Download, FileSpreadsheet, RefreshCw } from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import principalUrl from "@/data/2026_BDTrabalhado_10Abril_Karine.xlsx?url";
import dicionarioUrl from "@/data/dicionariotudo.xlsx?url";

interface WorkbookSource {
  id: string;
  name: string;
  description: string;
  url: string;
}

interface SheetPreview {
  name: string;
  rows: Array<Record<string, unknown>>;
  columns: string[];
}

const sources: WorkbookSource[] = [
  {
    id: "principal",
    name: "2026_BDTrabalhado_10Abril_Karine.xlsx",
    description: "Base principal usada nos indicadores do observatório.",
    url: principalUrl,
  },
  {
    id: "dicionario",
    name: "dicionariotudo.xlsx",
    description: "Dicionário das variáveis e categorias disponíveis na base.",
    url: dicionarioUrl,
  },
];

export const Route = createFileRoute("/fontes-dados")({
  head: () => ({
    meta: [
      { title: "Fontes de Dados — Cadastro Único de Natal/RN" },
      {
        name: "description",
        content: "Visualização e download das planilhas originais usadas no observatório.",
      },
    ],
  }),
  component: FontesDadosPage,
});

function FontesDadosPage() {
  const [selectedSource, setSelectedSource] = useState(sources[0]!);
  const [sheets, setSheets] = useState<SheetPreview[]>([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadWorkbook() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(selectedSource.url);
        if (!response.ok) throw new Error("Não foi possível carregar a planilha.");
        const workbook = XLSX.read(await response.arrayBuffer(), { type: "array" });
        const previews = workbook.SheetNames.map((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
            defval: "",
            raw: false,
          });
          const columns = rows.length > 0 ? Object.keys(rows[0]!) : [];
          return { name: sheetName, rows: rows.slice(0, 25), columns };
        });

        if (!cancelled) {
          setSheets(previews);
          setSelectedSheet(previews[0]?.name ?? "");
        }
      } catch (loadError) {
        if (!cancelled) {
          setSheets([]);
          setSelectedSheet("");
          setError(loadError instanceof Error ? loadError.message : "Erro ao ler a planilha.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadWorkbook();
    return () => {
      cancelled = true;
    };
  }, [selectedSource]);

  const currentSheet = sheets.find((sheet) => sheet.name === selectedSheet);

  return (
    <div className="flex flex-col gap-8">
      <SectionTitle
        title="Fontes de dados"
        description="Consulte uma amostra dos dados originais e baixe as planilhas utilizadas como fonte do painel."
      />

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {sources.map((source) => (
          <article
            key={source.id}
            className={`panel flex flex-col gap-4 p-5 ${selectedSource.id === source.id ? "ring-2 ring-primary/30" : ""}`}
          >
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <FileSpreadsheet className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <h2 className="break-words text-sm font-semibold text-foreground">{source.name}</h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{source.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant={selectedSource.id === source.id ? "default" : "outline"} onClick={() => setSelectedSource(source)}>
                <Database aria-hidden />
                Visualizar dados
              </Button>
              <Button variant="outline" asChild>
                <a href={source.url} download={source.name}>
                  <Download aria-hidden />
                  Baixar Excel
                </a>
              </Button>
            </div>
          </article>
        ))}
      </section>

      <ChartCard
        title="Pré-visualização da planilha"
        description="São exibidas até 25 linhas da aba selecionada. O arquivo original permanece disponível para download."
        meta={loading ? "Carregando" : `${sheets.length} aba(s)`}
      >
        {loading ? (
          <div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
            <RefreshCw className="mr-2 size-4 animate-spin" aria-hidden />
            Lendo arquivo original...
          </div>
        ) : error ? (
          <p className="py-8 text-sm text-destructive">{error}</p>
        ) : sheets.length === 0 ? (
          <p className="py-8 text-sm text-muted-foreground">A planilha não possui abas legíveis.</p>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Abas da planilha">
              {sheets.map((sheet) => (
                <Button
                  key={sheet.name}
                  size="sm"
                  variant={sheet.name === selectedSheet ? "default" : "outline"}
                  onClick={() => setSelectedSheet(sheet.name)}
                  role="tab"
                  aria-selected={sheet.name === selectedSheet}
                >
                  {sheet.name}
                </Button>
              ))}
            </div>
            {currentSheet && currentSheet.rows.length > 0 ? (
              <div className="max-h-[32rem] overflow-auto rounded-md border border-border">
                <table className="w-full min-w-max border-collapse text-left text-xs">
                  <thead className="sticky top-0 bg-muted text-muted-foreground">
                    <tr>
                      {currentSheet.columns.map((column) => (
                        <th key={column} className="border-b border-border px-3 py-2 font-semibold">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentSheet.rows.map((row, rowIndex) => (
                      <tr key={`${currentSheet.name}-${rowIndex}`} className="border-b border-border last:border-0">
                        {currentSheet.columns.map((column) => (
                          <td key={column} className="max-w-64 whitespace-nowrap px-3 py-2 text-foreground">
                            {String(row[column] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="py-8 text-sm text-muted-foreground">A aba selecionada não possui registros para exibir.</p>
            )}
          </div>
        )}
      </ChartCard>
    </div>
  );
}
