"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Flip, gsap } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { centuries } from "@/data/centuries";
import { useTimelineStore } from "@/stores/timelineStore";
import { ChronosWordmark } from "@/components/brand/ChronosWordmark";

gsap.registerPlugin(useGSAP, Flip);

type TimelineNavigationProps = {
  onSelectCentury: (index: number) => void;
  onRestart: () => void;
};

const yearLabel = (year: number) => String(year).padStart(3, "0");

export function TimelineNavigation({
  onSelectCentury,
  onRestart,
}: TimelineNavigationProps) {
  const { activeIndex, journeyStarted } = useTimelineStore();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const selectorButtonRef = useRef<HTMLButtonElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);
  const pendingFlip = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const previousIndex = useRef(activeIndex);
  const active = centuries[activeIndex];
  const choices = useMemo(
    () => [
      active,
      ...centuries.filter((century) => century.id !== active.id),
    ],
    [active],
  );

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (yearRef.current) {
        if (reduceMotion) {
          yearRef.current.textContent = String(active.startYear).padStart(
            3,
            "0",
          );
          previousIndex.current = activeIndex;
        } else {
          const counter = {
            value: centuries[previousIndex.current].startYear,
          };
          gsap.to(counter, {
            value: active.startYear,
            duration: 0.75,
            ease: "power2.out",
            onUpdate: () => {
              if (yearRef.current) {
                yearRef.current.textContent = String(
                  Math.round(counter.value),
                ).padStart(3, "0");
              }
            },
            onComplete: () => {
              previousIndex.current = activeIndex;
            },
          });
        }
      }

      if (pendingFlip.current) {
        if (reduceMotion) {
          pendingFlip.current = null;
          setSelectorOpen(false);
        } else {
          Flip.from(pendingFlip.current, {
            duration: 0.65,
            ease: "power2.inOut",
            absolute: true,
            stagger: 0.012,
            onComplete: () => {
              pendingFlip.current = null;
              setSelectorOpen(false);
            },
          });
        }
      }
    },
    {
      dependencies: [activeIndex],
      scope: selectorRef,
      revertOnUpdate: true,
    },
  );

  useEffect(() => {
    if (!selectorOpen) return;
    selectorRef.current
      ?.querySelector<HTMLButtonElement>('[aria-current="true"]')
      ?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectorOpen(false);
        window.requestAnimationFrame(() => selectorButtonRef.current?.focus());
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectorOpen]);

  const choose = (index: number) => {
    if (index === activeIndex) {
      setSelectorOpen(false);
      return;
    }
    pendingFlip.current = Flip.getState(".century-option");
    onSelectCentury(index);
  };

  return (
    <header
      style={
        {
          "--era-accent": active.theme.accent,
          "--era-secondary": active.theme.secondary,
        } as CSSProperties
      }
      className="timeline-chrome fixed inset-x-0 top-0 z-50 border-b border-white/10 px-3 sm:px-7 lg:px-10"
    >
      <div className="timeline-header-row mx-auto grid h-[4.5rem] max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-2 sm:h-[5rem] sm:gap-4">
        <button
          type="button"
          className="timeline-brand group justify-self-start text-left"
          onClick={() => {
            setSelectorOpen(false);
            onRestart();
          }}
          aria-label="Restart CHRONOS journey"
        >
          <ChronosWordmark />
        </button>

        <nav className="timeline-controls flex items-center gap-1.5 sm:gap-2.5" aria-label="Century navigation">
          <button
            type="button"
            className="timeline-arrow"
            onClick={() => {
              setSelectorOpen(false);
              onSelectCentury(Math.max(0, activeIndex - 1));
            }}
            disabled={activeIndex === 0}
            aria-label="Previous century"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
              <path d="M16 10H4m0 0 5-5m-5 5 5 5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="relative" ref={selectorRef}>
            <button
              ref={selectorButtonRef}
              type="button"
              onClick={() => setSelectorOpen((open) => !open)}
              className="timeline-chapter-picker"
              aria-expanded={selectorOpen}
              aria-controls="century-selector"
              aria-label={`Choose a century. Current chapter ${activeIndex + 1} of ${centuries.length}: ${active.title}, ${yearLabel(active.startYear)} to ${yearLabel(active.endYear)}`}
            >
              <span className="timeline-chapter-copy">
                <span className="timeline-chapter-label">CHAPTER {String(activeIndex + 1).padStart(2, "0")}</span>
                <span className="timeline-chapter-range">
                  {yearLabel(active.startYear)}—{yearLabel(active.endYear)}
                </span>
                <span className="timeline-chapter-title">{active.title}</span>
              </span>
              <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className={`timeline-chevron size-3.5 ${selectorOpen ? "is-open" : ""}`}>
                <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {selectorOpen && (
              <div
                id="century-selector"
                role="dialog"
                aria-label="Choose a century"
                className="century-selector-panel absolute right-0 top-12 z-20 max-h-[min(70vh,34rem)] w-[min(88vw,23rem)] overflow-y-auto border border-white/15 bg-chronos-surface p-2 shadow-2xl"
              >
                <p className="px-3 py-3 text-[0.58rem] tracking-[0.2em] text-chronos-muted">
                  SELECT A CHAPTER
                </p>
                <ol className="grid gap-1">
                  {choices.map((century) => {
                    const index = centuries.findIndex(
                      (item) => item.id === century.id,
                    );
                    const selected = index === activeIndex;
                    return (
                      <li key={century.id}>
                        <button
                          type="button"
                          className={`century-option flex min-h-12 w-full items-center gap-3 px-3 text-left transition-colors ${
                            selected
                              ? "bg-chronos-gold/10 text-chronos-paper"
                              : "text-chronos-muted hover:bg-white/5 hover:text-chronos-paper"
                          }`}
                          aria-current={selected ? "true" : undefined}
                          onClick={() => choose(index)}
                        >
                          <span className="w-7 font-display text-xs text-chronos-gold">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-xs">
                            {century.title}
                          </span>
                          <span className="text-[0.55rem] tracking-[0.08em]">
                            {yearLabel(century.startYear)}—{yearLabel(century.endYear)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
          </div>

          <button
            type="button"
            className="timeline-arrow"
            onClick={() => {
              setSelectorOpen(false);
              onSelectCentury(Math.min(centuries.length - 1, activeIndex + 1));
            }}
            disabled={activeIndex === centuries.length - 1}
            aria-label="Next century"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
              <path d="M4 10h12m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </nav>

        <div className="timeline-current-time justify-self-end">
          <span
            ref={yearRef}
            aria-live="polite"
            className="timeline-current-year"
          >
            {yearLabel(active.startYear)}
          </span>
          <span className="timeline-current-meta">
            <span>{String(activeIndex + 1).padStart(2, "0")}</span>
            <span className="timeline-current-divider">/</span>
            <span>{String(centuries.length).padStart(2, "0")}</span>
          </span>
        </div>
      </div>

      <div
        className="timeline-progress absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-chronos-gold"
        role="progressbar"
        aria-label="Journey progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round((activeIndex / (centuries.length - 1)) * 100)}
      />
      <span className="sr-only" aria-live="polite">{journeyStarted ? "Journey in progress" : "Journey ready"}</span>
    </header>
  );
}
