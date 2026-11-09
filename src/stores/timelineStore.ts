import { create } from "zustand";

type TimelineState = {
  activeIndex: number;
  journeyStarted: boolean;
  setActiveIndex: (index: number) => void;
  startJourney: () => void;
  restartJourney: () => void;
};

export const useTimelineStore = create<TimelineState>((set) => ({
  activeIndex: 0,
  journeyStarted: false,
  setActiveIndex: (activeIndex) => set({ activeIndex }),
  startJourney: () => set({ journeyStarted: true }),
  restartJourney: () =>
    set({ activeIndex: 0, journeyStarted: false }),
}));
