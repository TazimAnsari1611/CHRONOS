import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CHRONOS — A Journey Through 2,000 Years of Human History",
  description:
    "An immersive journey through two millennia of human history, civilization, and culture.",
  applicationName: "CHRONOS",
};

export const viewport: Viewport = {
  themeColor: "#11100e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
