"use client";

import type { TemplateId } from "@/types/signature";
import { cn } from "@/lib/utils";

interface TemplateVisualProps {
  templateId: TemplateId;
  primary: string;
  secondary: string;
  text: string;
  name?: string;
  role?: string;
  company?: string;
  compact?: boolean;
  className?: string;
}

function Avatar({ primary, compact }: { primary: string; compact?: boolean }) {
  return (
    <div
      className={cn("shrink-0 rounded-full", compact ? "h-8 w-8" : "h-10 w-10")}
      style={{ background: `linear-gradient(135deg, ${primary}, ${primary}88)`, boxShadow: `0 0 0 2px white, 0 0 0 3px ${primary}44` }}
    />
  );
}

function NavDots({ primary, count = 3 }: { primary: string; count?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-2 w-2 rounded-full" style={{ backgroundColor: primary, opacity: 0.6 + i * 0.15 }} />
      ))}
    </div>
  );
}

function LogoBlock({ primary, compact }: { primary: string; compact?: boolean }) {
  return (
    <div
      className={cn("rounded font-bold text-white", compact ? "px-1.5 py-0.5 text-[8px]" : "px-2 py-1 text-[9px]")}
      style={{ background: primary }}
    >
      LOGO
    </div>
  );
}

function TextLines({ name, role, company, text, secondary, compact }: {
  name: string; role: string; company: string; text: string; secondary: string; compact?: boolean;
}) {
  return (
    <div className={cn("min-w-0 flex-1", compact ? "space-y-0" : "space-y-0.5")}>
      <p className={cn("font-bold leading-tight", compact ? "text-[10px]" : "text-xs")} style={{ color: text }}>{name}</p>
      <p className={cn(compact ? "text-[8px]" : "text-[10px]")} style={{ color: secondary }}>{role}</p>
      {!compact && <p className="text-[9px] font-semibold" style={{ color: secondary }}>{company}</p>}
    </div>
  );
}

export function SignatureTemplateVisual({
  templateId,
  primary,
  secondary,
  text,
  name = "Jane Smith",
  role = "Marketing Lead",
  company = "Acme Inc",
  compact = false,
  className,
}: TemplateVisualProps) {
  const pad = compact ? "p-2" : "p-3";

  switch (templateId) {
    case "banner":
      return (
        <div className={cn("overflow-hidden rounded-lg bg-white shadow-sm", className)}>
          <div className="h-1" style={{ background: primary }} />
          <div className={cn("flex items-start gap-2", pad)}>
            <Avatar primary={primary} compact={compact} />
            <TextLines name={name} role={role} company={company} text={text} secondary={secondary} compact={compact} />
            <LogoBlock primary={primary} compact={compact} />
          </div>
          <div className={cn("border-t border-purple-100", compact ? "px-2 pb-2 pt-1" : "px-3 pb-2 pt-1.5")}>
            <NavDots primary={primary} />
          </div>
        </div>
      );

    case "creative":
      return (
        <div className={cn("flex overflow-hidden rounded-lg bg-white shadow-sm", className)}>
          <div className="w-1 shrink-0 rounded-l-lg" style={{ background: primary }} />
          <div className={cn("flex-1", pad)}>
            <div className="flex gap-2">
              <Avatar primary={primary} compact={compact} />
              <TextLines name={name} role={role} company={company} text={text} secondary={secondary} compact={compact} />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <LogoBlock primary={primary} compact={compact} />
              <NavDots primary={primary} />
            </div>
          </div>
        </div>
      );

    case "card":
      return (
        <div className={cn("rounded-lg bg-white shadow-sm", pad, className)} style={{ border: `1px solid ${primary}44` }}>
          <div className="flex gap-2">
            <Avatar primary={primary} compact={compact} />
            <TextLines name={name} role={role} company={company} text={text} secondary={secondary} compact={compact} />
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-purple-50 pt-2">
            <LogoBlock primary={primary} compact={compact} />
            <NavDots primary={primary} />
          </div>
        </div>
      );

    case "corporate":
      return (
        <div className={cn("rounded-lg bg-white text-center shadow-sm", pad, className)}>
          <LogoBlock primary={primary} compact={compact} />
          <div className="mx-auto my-2 h-px w-full" style={{ background: `${secondary}66` }} />
          <div className="flex items-start justify-center gap-2">
            <Avatar primary={primary} compact={compact} />
            <TextLines name={name} role={role} company={company} text={text} secondary={secondary} compact={compact} />
          </div>
          <div className="mt-2 flex justify-center"><NavDots primary={primary} /></div>
        </div>
      );

    case "split":
      return (
        <div className={cn("flex rounded-lg bg-white shadow-sm", pad, className)}>
          <div className="flex flex-col items-center gap-1 border-r-2 pr-2" style={{ borderColor: primary }}>
            <Avatar primary={primary} compact={compact} />
            <LogoBlock primary={primary} compact={compact} />
          </div>
          <div className="pl-2">
            <TextLines name={name} role={role} company={company} text={text} secondary={secondary} compact={compact} />
            <div className="mt-2"><NavDots primary={primary} /></div>
          </div>
        </div>
      );

    case "stack":
      return (
        <div className={cn("rounded-lg bg-white text-center shadow-sm", pad, className)}>
          <div className="mx-auto w-fit"><Avatar primary={primary} compact={compact} /></div>
          <div className="mt-2"><TextLines name={name} role={role} company={company} text={text} secondary={secondary} compact={compact} /></div>
          <div className="mt-2 flex justify-center"><LogoBlock primary={primary} compact={compact} /></div>
          <div className="mt-2 flex justify-center"><NavDots primary={primary} /></div>
        </div>
      );

    case "gradient":
      return (
        <div className={cn("overflow-hidden rounded-lg bg-white shadow-sm", className)}>
          <div className={cn(compact ? "px-2 py-1.5" : "px-3 py-2")} style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}>
            <p className={cn("font-bold text-white", compact ? "text-[10px]" : "text-xs")}>{name}</p>
            <p className={cn("text-white/80", compact ? "text-[8px]" : "text-[10px]")}>{role}</p>
          </div>
          <div className={cn("flex gap-2", pad)}>
            <Avatar primary={primary} compact={compact} />
            <TextLines name={company} role={role} company="" text={text} secondary={secondary} compact={compact} />
            <LogoBlock primary={primary} compact={compact} />
          </div>
        </div>
      );

    case "sidebar":
      return (
        <div className={cn("flex overflow-hidden rounded-lg bg-white shadow-sm", className)}>
          <div className={cn("shrink-0 rounded-l-lg", pad)} style={{ background: `${primary}15` }}>
            <Avatar primary={primary} compact={compact} />
            <div className="mt-1"><LogoBlock primary={primary} compact={compact} /></div>
          </div>
          <div className={pad}>
            <TextLines name={name} role={role} company={company} text={text} secondary={secondary} compact={compact} />
            <div className="mt-2"><NavDots primary={primary} /></div>
          </div>
        </div>
      );

    case "compact":
      return (
        <div className={cn("flex items-center gap-2 rounded-lg bg-white shadow-sm", pad, className)}>
          <Avatar primary={primary} compact={compact} />
          <div className="h-8 w-0.5" style={{ background: primary }} />
          <TextLines name={name} role={role} company={company} text={text} secondary={secondary} compact={compact} />
          <NavDots primary={primary} />
        </div>
      );

    case "nav-bottom":
      return (
        <div className={cn("rounded-lg bg-white shadow-sm", pad, className)}>
          <div className="flex gap-2">
            <Avatar primary={primary} compact={compact} />
            <TextLines name={name} role={role} company={company} text={text} secondary={secondary} compact={compact} />
            <LogoBlock primary={primary} compact={compact} />
          </div>
          <div className="mt-2 rounded bg-purple-50/80 p-1"><NavDots primary={primary} /></div>
        </div>
      );

    case "minimal":
      return (
        <div className={cn("rounded-lg bg-white shadow-sm", pad, className)}>
          <TextLines name={name} role={role} company={company} text={text} secondary={secondary} compact={compact} />
          <div className="mt-2"><NavDots primary={primary} /></div>
        </div>
      );

    case "nav-left":
    default:
      return (
        <div className={cn("rounded-lg bg-white shadow-sm", pad, className)}>
          <div className="flex gap-2">
            <Avatar primary={primary} compact={compact} />
            <div className="flex-1">
              <TextLines name={name} role={role} company={company} text={text} secondary={secondary} compact={compact} />
              <div className="mt-1.5"><NavDots primary={primary} /></div>
            </div>
            <LogoBlock primary={primary} compact={compact} />
          </div>
        </div>
      );
  }
}
