"use client";

import { useCallback, useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CenturyScene } from "@/components/centuries/CenturyScene";
import { IntroSection } from "@/components/intro/IntroSection";
import { TimelineNavigation } from "@/components/timeline/TimelineNavigation";
import { centuries } from "@/data/centuries";
import { useTimelineStore } from "@/stores/timelineStore";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ChronosExperience() {
  const root = useRef<HTMLElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const { activeIndex, setActiveIndex, startJourney, restartJourney } =
    useTimelineStore();

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.15,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useGSAP(
    () => {
      const progress = root.current?.querySelector(".timeline-progress");
      const articles = gsap.utils.toArray<HTMLElement>(".century-scene");
      const media = gsap.matchMedia();
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (progress) gsap.set(progress, { scaleX: self.progress });
        },
      });

      articles.forEach((article, index) => {
        ScrollTrigger.create({
          trigger: article,
          start: "top 58%",
          end: "bottom 48%",
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        });

        if (reducedMotion) {
          return;
        }

        const heroCopy = article.querySelectorAll(
          ".century-meta, .century-number, .century-heading, .century-subtitle, .century-description",
        );
        gsap.fromTo(
          heroCopy,
          { y: 28, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.85,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: {
              trigger: article,
              start: "top 68%",
              once: true,
            },
          },
        );

        const revealItems = article.querySelectorAll(
          ".details-heading, .detail-card, .historical-fact",
        );
        gsap.fromTo(
          revealItems,
          { y: 22, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.045,
            ease: "power2.out",
            scrollTrigger: {
              trigger: article.querySelector(".century-details"),
              start: "top 72%",
              once: true,
            },
          },
        );

        const galleryItems = article.querySelectorAll(".gallery-card");
        gsap.fromTo(
          galleryItems,
          { clipPath: "inset(12% 0 0 0)", y: 32, autoAlpha: 0.35 },
          {
            clipPath: "inset(0% 0 0 0)",
            y: 0,
            autoAlpha: 1,
            duration: 1,
            stagger: 0.18,
            ease: "power3.out",
            scrollTrigger: {
              trigger: galleryItems[0],
              start: "top 82%",
              once: true,
            },
          },
        );
      });

      media.add(
        "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
        () => {
          articles.forEach((article) => {
            const hero = article.querySelector<HTMLElement>(".century-hero");
            const image = article.querySelector<HTMLElement>(
              ".century-hero-image",
            );
            if (!hero || !image) return;

            gsap.fromTo(
              image,
              { scale: 1.16, yPercent: -3, clipPath: "inset(4% 4% 4% 4%)" },
              {
                scale: 1,
                yPercent: 0,
                clipPath: "inset(0% 0% 0% 0%)",
                ease: "none",
                scrollTrigger: {
                  trigger: hero,
                  start: "top top",
                  end: "+=55%",
                  scrub: 0.7,
                  pin: hero,
                  pinSpacing: true,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                },
              },
            );
          });
        },
      );

      return () => media.revert();
    },
    { scope: root, dependencies: [setActiveIndex], revertOnUpdate: true },
  );

  const scrollToCentury = useCallback((index: number) => {
    const boundedIndex = Math.max(0, Math.min(centuries.length - 1, index));
    const target = document.getElementById(
      `century-${centuries[boundedIndex].id}`,
    );
    if (!target) return;
    const destination = Math.max(
      0,
      Math.round(window.scrollY + target.getBoundingClientRect().top - 72),
    );
    startJourney();
    setActiveIndex(boundedIndex);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.killTweensOf(".time-transition");
      gsap
        .timeline()
        .fromTo(
          ".time-transition",
          { autoAlpha: 0 },
          { autoAlpha: 0.72, duration: 0.14, ease: "power1.in" },
        )
        .fromTo(
          ".time-glitch-band",
          { xPercent: -115, scaleX: 0.35, autoAlpha: 0.3 },
          {
            xPercent: 115,
            scaleX: 1,
            autoAlpha: 0.9,
            duration: 0.28,
            stagger: 0.035,
            ease: "power4.inOut",
          },
          0,
        )
        .to(".time-transition", {
          autoAlpha: 0,
          duration: 0.55,
          ease: "power2.out",
        });
    }

    window.scrollTo({
      top: destination,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }, [setActiveIndex, startJourney]);

  const restart = useCallback(() => {
    restartJourney();
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }, [restartJourney]);

  const enterTimeline = useCallback(() => {
    scrollToCentury(0);
  }, [scrollToCentury]);

  return (
    <main ref={root} className="chronos-experience relative overflow-clip">
      <TimelineNavigation
        onSelectCentury={scrollToCentury}
        onRestart={restart}
      />
      <IntroSection onEnter={enterTimeline} />

      <div aria-label="Historical timeline" className="centuries">
        {centuries.map((century, index) => (
          <CenturyScene key={century.id} century={century} index={index} />
        ))}
      </div>

      <section
        id="journey-end"
        className="journey-end relative isolate flex min-h-[85svh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center sm:px-10"
        aria-labelledby="journey-end-title"
      >
        <div aria-hidden="true" className="chronos-atmosphere absolute inset-0 -z-10" />
        <div aria-hidden="true" className="chronos-grid absolute inset-0 -z-10 opacity-35" />
        <div className="completion-mark mb-8 grid size-24 place-items-center rounded-full border border-chronos-gold/50 text-3xl text-chronos-gold">
          ◉
        </div>
        <p className="mb-5 text-[0.6rem] tracking-[0.26em] text-chronos-gold">
          THE JOURNEY CONTINUES
        </p>
        <h2
          id="journey-end-title"
          className="font-display text-4xl leading-[1.14] tracking-[-0.03em] sm:text-6xl lg:text-7xl"
        >
          2,000 YEARS.
          <br />
          <span className="text-chronos-gold-soft">COUNTLESS STORIES.</span>
          <br />
          ONE HUMANITY.
        </h2>
        <p className="mt-7 max-w-lg text-sm leading-7 text-chronos-muted sm:text-base">
          History is not a single road. Choose another chapter and discover a
          different view of the human story.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            className="chronos-button min-h-12 border border-chronos-gold/60 px-6 text-[0.65rem] tracking-[0.18em] transition-colors hover:bg-chronos-gold/10"
            onClick={restart}
          >
            RESTART JOURNEY
          </button>
          <button
            type="button"
            className="min-h-12 border border-white/15 px-6 text-[0.65rem] tracking-[0.18em] text-chronos-muted transition-colors hover:border-white/40 hover:text-chronos-paper"
            onClick={() => scrollToCentury(activeIndex)}
          >
            REVISIT {centuries[activeIndex].title.toUpperCase()}
          </button>
        </div>
        <p className="mt-16 text-[0.55rem] tracking-[0.18em] text-chronos-muted">
          CHRONOS · A JOURNEY THROUGH 2,000 YEARS OF HUMAN HISTORY
        </p>
      </section>

      <div
        className="time-transition pointer-events-none fixed inset-0 z-[60] bg-[#090806] opacity-0"
        aria-hidden="true"
      >
        <span className="time-glitch-band time-glitch-band-a" />
        <span className="time-glitch-band time-glitch-band-b" />
        <span className="time-glitch-band time-glitch-band-c" />
        <span className="time-glitch-band time-glitch-band-d" />
      </div>
    </main>
  );
}
