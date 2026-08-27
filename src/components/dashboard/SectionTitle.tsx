export interface SectionTitleProps {
  title: string;
  description?: string | undefined;
}

export function SectionTitle({ title, description }: SectionTitleProps) {
  return (
    <div className="border-l-2 border-primary pl-3">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
