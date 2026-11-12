import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Product Logs — Daniel Ade-Otoki", template: "%s — Daniel Ade-Otoki" },
  description:
    "Self-initiated product logs by Daniel Ade-Otoki, product designer: research, problem framing and working prototypes for teams I'd love to join.",
  metadataBase: new URL("https://design-pitches.vercel.app"),
};

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
      <body>
        <header className="topbar">
          <div className="wrap">
            <a href="/" className="mark">DANIELADEOTOKI.COM</a>
            <nav>
              <a href="https://danieladeotoki.com" className="hide-sm">Portfolio</a>
              <a href="https://linkedin.com/in/adeotokidaniel/" className="hide-sm">LinkedIn</a>
              <a href="mailto:adeotokidaniel@gmail.com">Contact</a>
            </nav>
          </div>
        </header>
        {children}
        <footer>
          <div className="wrap">
            <span>Daniel Ade-Otoki · Product Designer · Lagos, Nigeria · open to remote and relocation</span>
            <span>
              <a href="https://danieladeotoki.com">danieladeotoki.com</a> ·{" "}
              <a href="https://github.com/Ade-otoki">GitHub</a>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
