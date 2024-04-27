"use client";
import clsx from "clsx";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Logo, Logomark } from "@/components/Logo";
import { isLogoHovered } from "./RootLayout";
import { useStore } from "@nanostores/react";

export function Header({
  panelId,
  icon: Icon,
  expanded,
  onToggle,
  toggleRef,
  invert = false,
}: {
  panelId: string;
  icon: React.ComponentType<{ className?: string }>;
  expanded: boolean;
  onToggle: () => void;
  toggleRef: React.RefObject<HTMLButtonElement>;
  invert?: boolean;
}) {
  const $isLogoHovered = useStore(isLogoHovered);

  return (
    <Container>
      <div className="flex items-center justify-between">
        <a
          href="/"
          aria-label="Home"
          onMouseEnter={() => isLogoHovered.set(true)}
          onMouseLeave={() => isLogoHovered.set(false)}
        >
          <Logomark
            className="h-8 sm:hidden"
            invert={invert}
            filled={$isLogoHovered}
          />
          <Logo
            className="hidden h-8 sm:block"
            invert={invert}
            filled={$isLogoHovered}
          />
        </a>
        <div className="flex items-center gap-x-8">
          <Button href="/contact" invert={invert}>
            Contact us
          </Button>
          <button
            ref={toggleRef}
            type="button"
            onClick={onToggle}
            aria-expanded={expanded ? "true" : "false"}
            aria-controls={panelId}
            className={clsx(
              "group -m-2.5 rounded-full p-2.5 transition",
              invert ? "hover:bg-white/10" : "hover:bg-neutral-950/10",
            )}
            aria-label="Toggle navigation"
          >
            <Icon
              className={clsx(
                "h-6 w-6",
                invert
                  ? "fill-white group-hover:fill-neutral-200"
                  : "fill-neutral-950 group-hover:fill-neutral-700",
              )}
            />
          </button>
        </div>
      </div>
    </Container>
  );
}
