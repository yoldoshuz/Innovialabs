import {
  CodeXml,
  Smartphone,
  Cpu,
  Rocket,
  ShieldCheck,
  TrendingUp,
  Cloud,
  SquareTerminal,
  Settings,
  Users,
  LockKeyhole,
  Search,
  Send,
  PenTool,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Brand icon set (guideline p.11): linear, rounded caps, Ink or Violet. */
const icons: Record<IconName, LucideIcon> = {
  code: CodeXml,
  mobile: Smartphone,
  chip: Cpu,
  rocket: Rocket,
  shield: ShieldCheck,
  chart: TrendingUp,
  cloud: Cloud,
  terminal: SquareTerminal,
  settings: Settings,
  team: Users,
  lock: LockKeyhole,
  search: Search,
  send: Send,
  pen: PenTool,
};

export function Icon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  const Cmp = icons[name];
  return (
    <Cmp
      aria-hidden
      strokeWidth={1.9}
      className={cn("size-7 shrink-0", className)}
    />
  );
}
