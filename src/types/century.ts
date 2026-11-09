export type CenturyTheme = {
  accent: string;
  atmosphere: string;
  deep: string;
  surface: string;
  secondary: string;
  motif: string;
};

export type Century = {
  id: string;
  centuryNumber: number;
  startYear: number;
  endYear: number;
  title: string;
  subtitle: string;
  description: string;
  theme: CenturyTheme;
  heroImage: string;
  heroAlt: string;
  imageCredit: {
    title: string;
    author: string;
    license: string;
    sourceUrl: string;
  };
  galleryImages: { src: string; alt: string; label: string }[];
  regions: string[];
  architecture: string;
  culture: string;
  fashion: string;
  technology: string;
  transportation: string;
  importantEvents: string[];
  interestingFacts: string[];
};
