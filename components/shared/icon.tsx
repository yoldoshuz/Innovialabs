import {
  Globe,
  Brain,
  LayoutDashboard,
  Server,
  Workflow,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

/** Maps dictionary icon keys to Lucide components (keeps JSON serializable). */
const icons: Record<string, LucideIcon> = {
  globe: Globe,
  brain: Brain,
  layout: LayoutDashboard,
  server: Server,
  workflow: Workflow,
  shield: ShieldCheck,
};

export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = icons[name] ?? Globe;
  return <Cmp className={className} aria-hidden="true" />;
}
