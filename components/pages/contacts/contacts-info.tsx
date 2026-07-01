import type { SVGProps } from "react";
import { Mail, Phone, MapPin, Clock, type LucideIcon } from "lucide-react";
import type { ContactsDict } from "@/types";

function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.94 4.62 18.9 19.05c-.23 1.01-.83 1.26-1.68.79l-4.64-3.42-2.24 2.16c-.25.25-.46.46-.94.46l.33-4.73L18.64 5.9c.37-.33-.08-.51-.58-.18L5.42 13.62l-4.57-1.43c-.99-.31-1.01-.99.21-1.47L20.66 3.2c.83-.31 1.55.2 1.28 1.42Z" />
    </svg>
  );
}

const channelIcons: Record<
  string,
  LucideIcon | ((p: SVGProps<SVGSVGElement>) => React.JSX.Element)
> = {
  email: Mail,
  phone: Phone,
  telegram: TelegramIcon,
};

export function ContactsInfo({ dict }: { dict: ContactsDict }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h2 className="font-mono text-xs uppercase tracking-widest text-subtle">
          {dict.channelsTitle}
        </h2>
        <ul className="flex flex-col gap-3">
          {dict.channels.map((channel) => {
            const IconCmp = channelIcons[channel.type] ?? Mail;
            return (
              <li key={channel.type}>
                <a
                  href={channel.href}
                  target={channel.type === "telegram" ? "_blank" : undefined}
                  rel={
                    channel.type === "telegram"
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-surface/40 p-4 transition-colors hover:border-primary/40"
                >
                  <span className="grid size-11 place-items-center rounded-xl border border-border-strong bg-elevated text-primary">
                    <IconCmp className="size-5" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-xs text-subtle">{channel.label}</span>
                    <span className="text-foreground transition-colors group-hover:text-primary">
                      {channel.value}
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <InfoCard icon={MapPin} title={dict.officeTitle} value={dict.office} />
        <InfoCard icon={Clock} title={dict.hoursTitle} value={dict.hours} />
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  value,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface/40 p-5">
      <span className="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary">
        <Icon className="size-5" />
      </span>
      <span className="font-mono text-xs uppercase tracking-widest text-subtle">
        {title}
      </span>
      <span className="text-pretty text-sm text-muted">{value}</span>
    </div>
  );
}
