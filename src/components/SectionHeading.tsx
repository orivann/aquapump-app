import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
  className?: string;
  actions?: ReactNode;
};

const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  actions,
}: SectionHeadingProps) => {
  const alignment =
    align === "center"
      ? "items-center text-center"
      : align === "right"
        ? "items-end text-right"
        : "items-start text-left";

  return (
    <div className={cn("flex w-full flex-col gap-4", alignment, className)}>
      <div className="flex w-full flex-col gap-3">
        {eyebrow ? (
          <span className="inline-flex items-center gap-2 self-auto rounded-full border border-border/40 bg-muted/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            {eyebrow}
          </span>
        ) : null}
        <h2 className="font-display text-3xl tracking-tight text-foreground md:text-4xl lg:text-5xl">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-balance text-sm text-muted-foreground/90 md:text-base lg:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      ) : null}
    </div>
  );
};

export default SectionHeading;
