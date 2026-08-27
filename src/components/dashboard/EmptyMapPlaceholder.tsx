import { MapPinned } from "lucide-react";

export interface EmptyMapPlaceholderProps {
  title?: string;
  message?: string;
  /**
   * Futuramente: receber um GeoJSON (shapefile convertido) e renderizar
   * o mapa coroplético dos bairros de Natal.
   */
  geojsonUrl?: string | undefined;
}

export function EmptyMapPlaceholder({
  title = "Mapa dos bairros de Natal",
  message = "Visualização territorial será integrada posteriormente.",
}: EmptyMapPlaceholderProps) {
  return (
    <div className="panel flex min-h-[320px] flex-col items-center justify-center gap-3 border-dashed bg-muted/40 p-8 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
        <MapPinned className="size-6" aria-hidden />
      </span>
      <p className="text-base font-semibold tracking-tight text-foreground">{title}</p>
      <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{message}</p>
    </div>
  );
}
