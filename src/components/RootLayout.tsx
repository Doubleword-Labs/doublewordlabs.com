"use client";

import { createContext, useEffect, useId, useRef, useState } from "react";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";

import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { GridPattern } from "@/components/GridPattern";
import { Offices } from "@/components/Offices";
import { SocialMedia } from "@/components/SocialMedia";
import { MenuIcon } from "./MenuIcon";
import { XIcon } from "./XIcon";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { atom } from "nanostores";

export const isLogoHovered = atom(false);

export function RootLayout({ children }: { children: React.ReactNode }) {
  let panelId = useId();
  let [expanded, setExpanded] = useState(false);
  let openRef = useRef<React.ElementRef<"button">>(null);
  let closeRef = useRef<React.ElementRef<"button">>(null);
  let navRef = useRef<React.ElementRef<"div">>(null);
  let shouldReduceMotion = useReducedMotion();

  return (
    <MotionConfig transition={shouldReduceMotion ? { duration: 0 } : undefined}>
      <header>
        <div
          className="absolute left-0 right-0 top-2 z-40 pt-14"
          aria-hidden={expanded ? "true" : undefined}
          // @ts-ignore (https://github.com/facebook/react/issues/17157)
          inert={expanded ? "" : undefined}
        >
          <Header
            panelId={panelId}
            icon={MenuIcon}
            toggleRef={openRef}
            expanded={expanded}
            onToggle={() => {
              setExpanded((expanded) => !expanded);
              window.setTimeout(() =>
                closeRef.current?.focus({ preventScroll: true }),
              );
            }}
          />
        </div>

        <motion.div
          layout
          id={panelId}
          style={{ height: expanded ? "auto" : "0.5rem" }}
          className="relative z-50 overflow-hidden bg-neutral-950 pt-2"
          aria-hidden={expanded ? undefined : "true"}
          // @ts-ignore (https://github.com/facebook/react/issues/17157)
          inert={expanded ? undefined : ""}
        >
          <motion.div layout className="bg-neutral-800">
            <div ref={navRef} className="bg-neutral-950 pb-16 pt-14">
              <Header
                invert
                panelId={panelId}
                icon={XIcon}
                toggleRef={closeRef}
                expanded={expanded}
                onToggle={() => {
                  setExpanded((expanded) => !expanded);
                  window.setTimeout(() =>
                    openRef.current?.focus({ preventScroll: true }),
                  );
                }}
              />
            </div>
            <Navigation />
          </motion.div>
        </motion.div>
      </header>

      <motion.div
        layout
        style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
        className="relative flex flex-auto overflow-hidden bg-white pt-14"
      >
        <motion.div
          layout
          className="relative isolate flex w-full flex-col pt-20"
        >
          <GridPattern
            className="absolute inset-x-0 -top-14 -z-10 h-[1000px] w-full fill-neutral-50 stroke-neutral-950/5 [mask-image:linear-gradient(to_bottom_left,white_40%,transparent_50%)]"
            yOffset={-96}
            interactive
          />

          <main className="w-full flex-auto">{children}</main>

          <Footer />
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
}
