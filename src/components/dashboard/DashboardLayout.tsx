import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { FilterBar } from "./FilterBar";
import { useFilters } from "./filters-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ultimaAtualizacao } from "@/data/mockData";

/** Estrutura visual comum a todas as páginas do observatório. */
export function DashboardLayout({ children }: { children: ReactNode }) {
  const { filters, setFilters, reset } = useFilters();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-72 shrink-0 border-r border-sidebar-border lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Abrir menu">
                <Menu className="size-4" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-0">
              <SheetTitle className="sr-only">Menu do observatório</SheetTitle>
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">Observatório Social</p>
            <p className="truncate text-xs text-muted-foreground">Cadastro Único — Natal/RN</p>
          </div>
        </div>

        <DashboardHeader
          title="Cadastro Único de Natal/RN"
          subtitle="Painel de indicadores socioeconômicos das famílias e pessoas cadastradas."
          lastUpdate={ultimaAtualizacao}
        />

        <main className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">
          <FilterBar filters={filters} onChange={setFilters} onReset={reset} />
          {children}
        </main>
      </div>
    </div>
  );
}
