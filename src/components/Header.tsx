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
      </div>
    </Container>
  );
}
