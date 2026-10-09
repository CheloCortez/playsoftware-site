import { site } from "@/content/site";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-mono text-xl font-bold tracking-tight", className)}>
      <span className="text-accent">{site.brand.nameAccent}</span>{" "}
      <span className="text-text">{site.brand.nameRest}</span>
    </span>
  );
}
