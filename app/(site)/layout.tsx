import { BOOKING_URL } from "../../lib/site";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="topbar">
        <div className="wrap">
          <a href="/" className="mark">DANIELADEOTOKI.COM</a>
          <nav>
            <a href="https://danieladeotoki.com" className="hide-sm">Portfolio</a>
            <a href="https://linkedin.com/in/adeotokidaniel/" className="hide-sm">LinkedIn</a>
            <a href="mailto:adeotokidaniel@gmail.com" className="hide-sm">Email</a>
            <a href={BOOKING_URL} target="_blank" rel="noreferrer"><b>Book a call</b></a>
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
    </>
  );
}
