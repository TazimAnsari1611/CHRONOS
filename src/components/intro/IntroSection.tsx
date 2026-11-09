"use client";

import { useRef } from "react";
import type { PointerEvent } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { SplitText } from "gsap/SplitText";
import { ChronosWordmark } from "@/components/brand/ChronosWordmark";

gsap.registerPlugin(useGSAP, MotionPathPlugin, SplitText);

type IntroSectionProps = {
  onEnter: () => void;
};

export function IntroSection({ onEnter }: IntroSectionProps) {
  const section = useRef<HTMLElement>(null);
  const portalX = useRef<((value: number) => void) | null>(null);
  const portalY = useRef<((value: number) => void) | null>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const portal =
        section.current?.querySelector<SVGPathElement>(".portal-orbit");
      const heading = section.current?.querySelector(".intro-tagline");
      if (!heading) return;

      const split = new SplitText(heading, { type: "words,chars" });
      if (reduceMotion) {
        gsap.set(
          [
            ".intro-brand",
            ".intro-kicker",
            ".intro-enter",
            ".portal-ring",
            ".portal-core",
          ],
          { autoAlpha: 1 },
        );
        gsap.set(".portal-particle", { autoAlpha: 0 });
        gsap.set(split.chars, { autoAlpha: 1, y: 0 });
        split.revert();
        return;
      }

      portalX.current = gsap.quickTo(".portal-parallax", "x", {
        duration: 0.8,
        ease: "power2.out",
      });
      portalY.current = gsap.quickTo(".portal-parallax", "y", {
        duration: 0.8,
        ease: "power2.out",
      });

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .fromTo(
          ".portal-ring",
          { scale: 0.28, autoAlpha: 0, rotate: -22 },
          {
            scale: 1,
            autoAlpha: 1,
            rotate: 0,
            duration: 1.2,
            stagger: 0.08,
            ease: "expo.out",
          },
        )
        .fromTo(
          ".portal-core",
          { scale: 0.72, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 1.05, ease: "power2.out" },
          "-=1.2",
        )
        .from(
          ".intro-brand",
          { y: 16, autoAlpha: 0, duration: 0.55 },
          "-=0.8",
        )
        .from(
          split.chars,
          {
            yPercent: 110,
            autoAlpha: 0,
            duration: 0.45,
            stagger: 0.018,
            ease: "power3.out",
          },
          "-=0.25",
        )
        .from(
          ".intro-kicker",
          { y: 14, autoAlpha: 0, duration: 0.45 },
          "-=0.15",
        )
        .from(
          ".intro-enter",
          { y: 18, autoAlpha: 0, duration: 0.5 },
          "-=0.2",
        )
        .fromTo(
          ".portal-particle",
          { autoAlpha: 0, scale: 0 },
          {
            autoAlpha: 0.85,
            scale: 1,
            duration: 0.4,
            stagger: 0.06,
            ease: "back.out(2)",
          },
          "-=0.8",
        );

      gsap.to(".portal-core", {
        scale: 1.05,
        opacity: 0.76,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      if (portal) {
        gsap.to(".portal-particle", {
          duration: 11,
          repeat: -1,
          ease: "none",
          motionPath: { path: portal, align: portal, autoRotate: false },
          stagger: { each: 2.7, repeat: -1 },
        });
      }

      return () => split.revert();
    },
    { scope: section },
  );

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const bounds = section.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    portalX.current?.(x * 20);
    portalY.current?.(y * 14);
  };

  const handlePointerLeave = () => {
    portalX.current?.(0);
    portalY.current?.(0);
  };

  return (
    <section
      ref={section}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="intro-section relative isolate flex min-h-[100svh] flex-col overflow-hidden px-6 pb-12 pt-28 sm:px-10 lg:px-16"
      aria-labelledby="intro-title"
    >
      <div aria-hidden="true" className="chronos-atmosphere absolute inset-0 -z-10" />
      <div aria-hidden="true" className="chronos-grid absolute inset-0 -z-10 opacity-50" />
      <div aria-hidden="true" className="film-grain pointer-events-none absolute inset-0 -z-10" />

      <header className="intro-brand mx-auto flex w-full max-w-7xl items-center justify-between">
        <ChronosWordmark />
        <span className="hidden text-[0.6rem] tracking-[0.2em] text-chronos-muted sm:block">
          THE HUMAN STORY / 000—2026
        </span>
      </header>

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 items-center justify-center py-12">
        <div
          aria-hidden="true"
          className="portal-parallax pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(74vw,680px)] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="portal-core absolute inset-[17%] rounded-full" />
          <div className="portal-ring absolute inset-0 rounded-full" />
          <div className="portal-ring portal-ring-outer absolute inset-[7%] rounded-full" />
          <div className="portal-ring portal-ring-inner absolute inset-[23%] rounded-full" />
          <svg
            className="absolute inset-0 size-full overflow-visible"
            viewBox="0 0 600 600"
          >
            <path
              className="portal-orbit"
              d="M300 20 A280 280 0 1 1 299.9 20"
              fill="none"
            />
            <circle className="portal-particle" cx="0" cy="0" r="3" />
            <circle className="portal-particle" cx="0" cy="0" r="2" />
            <circle className="portal-particle" cx="0" cy="0" r="1.5" />
          </svg>
          <div className="portal-coordinate absolute left-1/2 top-[11%] -translate-x-1/2 text-[0.55rem] tracking-[0.35em]">
            MMXXVI
          </div>
          <div className="portal-coordinate absolute bottom-[11%] left-1/2 hidden -translate-x-1/2 text-[0.55rem] tracking-[0.35em] sm:block">
            AB ORIGINE
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
          <p className="intro-kicker mb-6 text-[0.6rem] tracking-[0.32em] text-chronos-gold-soft sm:text-xs">
            AN INTERACTIVE JOURNEY THROUGH HUMAN HISTORY
          </p>
          <h1
            id="intro-title"
            className="intro-tagline overflow-hidden font-display text-5xl leading-[1.05] tracking-[-0.045em] text-chronos-paper sm:text-7xl lg:text-8xl"
          >
            Every Century
            <br />
            <span className="text-chronos-gold-soft">Has a Story.</span>
          </h1>
          <p className="intro-kicker mx-auto mt-6 max-w-lg text-sm leading-6 text-chronos-muted sm:text-base">
            Twenty-one moments. Countless worlds. One shared passage through
            time.
          </p>
          <button
            type="button"
            onClick={onEnter}
            className="intro-enter chronos-button mt-9 inline-flex min-h-12 items-center gap-4 border border-chronos-gold/60 px-6 py-3 text-[0.65rem] font-medium tracking-[0.2em] transition-colors hover:border-chronos-gold hover:bg-chronos-gold/10 focus-visible:outline-offset-4"
          >
            ENTER THE TIMELINE
            <span aria-hidden="true" className="text-chronos-gold">↘</span>
          </button>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl items-center justify-between text-[0.55rem] tracking-[0.18em] text-chronos-muted">
        <span>SCROLL TO TRAVEL</span>
        <span>21 CHAPTERS / 2,026 YEARS</span>
      </div>
    </section>
  );
}
