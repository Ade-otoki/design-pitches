import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Product Logs — Daniel Ade-Otoki", template: "%s — Daniel Ade-Otoki" },
  description:
    "Self-initiated product logs by Daniel Ade-Otoki, product designer: research, problem framing and working prototypes for teams I'd love to join.",
  metadataBase: new URL("https://design-pitches.vercel.app"),
};

// Bare root: prototypes render with nothing around them so they look right inside the device frame.
// The site header and footer live in app/(site)/layout.tsx.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap"
        />
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
