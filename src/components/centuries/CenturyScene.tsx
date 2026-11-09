"use client";

import { useRef } from "react";
import Image from "next/image";
import type { CSSProperties } from "react";
import type { PointerEvent } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { Century } from "@/types/century";

gsap.registerPlugin(useGSAP);

type CenturySceneProps = {
  century: Century;
  index: number;
};

const padYear = (year: number) => String(year).padStart(3, "0");

export function CenturyScene({ century, index }: CenturySceneProps) {
  const heroRef = useRef<HTMLElement>(null);
  const imageX = useRef<((value: number) => void) | null>(null);
  const imageY = useRef<((value: number) => void) | null>(null);
  const theme = {
    "--era-accent": century.theme.accent,
    "--era-atmosphere": century.theme.atmosphere,
    "--era-deep": century.theme.deep,
    "--era-surface": century.theme.surface,
    "--era-secondary": century.theme.secondary,
  } as CSSProperties;

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      imageX.current = gsap.quickTo(".century-hero-image", "x", {
        duration: 0.65,
        ease: "power3.out",
      });
      imageY.current = gsap.quickTo(".century-hero-image", "y", {
        duration: 0.65,
        ease: "power3.out",
      });
    },
    { scope: heroRef },
  );

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    imageX.current?.(((event.clientX - bounds.left) / bounds.width - 0.5) * 12);
    imageY.current?.(((event.clientY - bounds.top) / bounds.height - 0.5) * 10);
  };

  const resetPointer = () => {
    imageX.current?.(0);
    imageY.current?.(0);
  };

  return (
    <article
      id={`century-${century.id}`}
      className="century-scene relative"
      style={theme}
      aria-labelledby={`century-title-${century.id}`}
    >
      <section
        ref={heroRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
        className="century-hero relative isolate flex min-h-[100svh] items-end overflow-hidden px-6 pb-14 pt-32 sm:px-10 sm:pb-20 lg:px-16"
      >
        <div className="century-image-frame absolute inset-0 z-0 overflow-hidden">
          <Image
            src={century.heroImage}
            alt={century.heroAlt}
            fill
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            sizes="100vw"
            className="century-hero-image object-cover"
          />
        </div>
        <div aria-hidden="true" className="hero-vignette pointer-events-none absolute inset-0 z-[1]" />

        <div className="relative z-10 mx-auto w-full max-w-[1600px]">
          <div className="hero-copy max-w-4xl">
            <p className="century-meta mb-5 flex items-center gap-3 text-[0.6rem] tracking-[0.22em] text-chronos-gold-soft sm:text-xs">
              <span className="era-marker size-1.5 rounded-full bg-[var(--era-accent)]" />
              CHAPTER {String(index + 1).padStart(2, "0")}{" "}
              <span aria-hidden="true" className="text-white/35">/</span>{" "}
              {padYear(century.startYear)}—{padYear(century.endYear)}
            </p>
            <p className="century-number mb-1 font-display text-[clamp(4rem,12vw,10rem)] leading-[0.78] tracking-[-0.06em] text-white/15">
              {String(century.centuryNumber).padStart(2, "0")}
            </p>
            <h2
              id={`century-title-${century.id}`}
              className="century-heading max-w-4xl font-display text-4xl leading-[1.05] tracking-[-0.035em] text-chronos-paper sm:text-6xl lg:text-7xl"
            >
              {century.title}
            </h2>
            <p className="century-subtitle mt-4 max-w-xl font-display text-lg italic text-chronos-gold-soft sm:text-2xl">
              {century.subtitle}
            </p>
            <p className="century-description mt-6 max-w-2xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              {century.description}
            </p>
          </div>

          <div className="mt-12 flex items-center justify-between border-t border-white/20 pt-4 text-[0.55rem] tracking-[0.18em] text-white/55 sm:text-[0.6rem]">
            <span>HISTORICAL IMAGE</span>
            <span className="hidden sm:inline">{century.regions.slice(0, 3).join(" · ")}</span>
            <a
              href={century.imageCredit.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="max-w-[60%] text-right leading-4 text-white/75 underline decoration-white/35 underline-offset-4 hover:text-white sm:max-w-[48%]"
              aria-label={`Image credit: ${century.imageCredit.title}, ${century.imageCredit.author}, ${century.imageCredit.license}. View source on Wikimedia Commons.`}
            >
              {century.imageCredit.title} · {century.imageCredit.author} · {century.imageCredit.license}
            </a>
            <a
              href="#journey-end"
              className="text-chronos-paper transition-colors hover:text-chronos-gold-soft"
            >
              EXPLORE THE ERA ↓
            </a>
          </div>
        </div>
      </section>

      <section className="century-details relative overflow-hidden px-6 py-20 sm:px-10 sm:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
            <div className="details-heading max-w-xl">
              <p className="mb-5 text-[0.6rem] tracking-[0.22em] text-chronos-gold">
                MANY WORLDS, ONE CENTURY
              </p>
              <h3 className="font-display text-3xl leading-tight tracking-[-0.025em] sm:text-4xl">
                A closer look at <span className="text-chronos-gold-soft">{century.title}.</span>
              </h3>
              <p className="mt-5 text-sm leading-7 text-chronos-muted">
                These snapshots are entry points, not a single account of the
                age. Communities experienced this century differently across
                geography, belief, and social position.
              </p>

              <div className="mt-8 border-l border-[var(--era-accent)]/60 pl-5">
                <p className="text-[0.58rem] tracking-[0.18em] text-chronos-gold-soft">
                  REGIONS IN FOCUS
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {century.regions.map((region) => (
                    <li
                      key={region}
                      className="border border-white/10 px-3 py-2 text-[0.65rem] text-chronos-paper/80"
                    >
                      {region}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid gap-px bg-white/10 sm:grid-cols-2">
              <DetailCard label="Architecture & cities" text={century.architecture} />
              <DetailCard label="Culture & traditions" text={century.culture} />
              <DetailCard label="Clothing & fashion" text={century.fashion} />
              <DetailCard label="Technology & invention" text={century.technology} />
              <DetailCard label="Transportation & daily life" text={century.transportation} />
              <div className="detail-card p-6 sm:p-7">
                <p className="text-[0.58rem] tracking-[0.18em] text-chronos-gold-soft">
                  A DETAIL TO REMEMBER
                </p>
                <p className="mt-4 font-display text-lg leading-7 text-chronos-paper">
                  {century.interestingFacts[0]}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <div className="mb-7 flex items-end justify-between gap-6">
              <div>
                <p className="text-[0.58rem] tracking-[0.2em] text-chronos-gold">
                  FRAGMENTS OF AN AGE
                </p>
                <h3 className="mt-3 font-display text-2xl text-chronos-paper sm:text-3xl">
                  Places, practices, and passage.
                </h3>
              </div>
              <p className="hidden max-w-xs text-right text-xs leading-5 text-chronos-muted sm:block">
                Historical photographs and digitized objects are paired with
                original visual reconstructions.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {century.galleryImages.map((image, imageIndex) => (
                <figure
                  key={image.src}
                  className={`gallery-card group relative isolate min-h-64 overflow-hidden border border-white/10 bg-chronos-surface sm:min-h-80 ${
                    imageIndex === 0 ? "md:translate-y-8" : ""
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                    className="gallery-image object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                  />
                  <div aria-hidden="true" className="gallery-caption-shade absolute inset-x-0 bottom-0 h-28" />
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
                    <span className="font-display text-xl text-white sm:text-2xl">
                      {image.label}
                    </span>
                    <span className="text-[0.5rem] tracking-[0.14em] text-white/65">
                      STUDY {String(imageIndex + 1).padStart(2, "0")}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="mt-24 grid gap-12 border-t border-white/10 pt-10 lg:grid-cols-2">
            <div>
              <p className="text-[0.58rem] tracking-[0.2em] text-chronos-gold">
                TURNING POINTS
              </p>
              <ul className="mt-5 divide-y divide-white/10">
                {century.importantEvents.map((event) => (
                  <li
                    key={event}
                    className="historical-fact py-4 text-sm leading-6 text-chronos-paper/80"
                  >
                    {event}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[0.58rem] tracking-[0.2em] text-chronos-gold">
                SMALL WINDOWS INTO THE PAST
              </p>
              <ul className="mt-5 divide-y divide-white/10">
                {century.interestingFacts.map((fact) => (
                  <li
                    key={fact}
                    className="historical-fact py-4 font-display text-lg leading-7 text-chronos-paper/85"
                  >
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

function DetailCard({ label, text }: { label: string; text: string }) {
  return (
    <div className="detail-card p-6 sm:p-7">
      <p className="text-[0.58rem] tracking-[0.16em] text-chronos-gold-soft">
        {label.toUpperCase()}
      </p>
      <p className="mt-4 text-sm leading-6 text-chronos-paper/75">{text}</p>
    </div>
  );
}
