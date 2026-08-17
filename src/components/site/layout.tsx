import { Link } from "@tanstack/react-router";
import { Menu, Sparkles, Github, Twitter, Linkedin } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/meetings", label: "Meetings" },
  { to: "/planner", label: "Planner" },
  { to: "/research", label: "Research" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Sparkles className="size-4" />
      </span>
      <span className="font-display text-lg font-bold tracking-tight">NorthPilot</span>
    </Link>
  );
}

function NavLinks({ onClick }: { onClick?: () => void }) {
  return (
    <>
      {NAV.map((n) => (
        <Link
          key={n.to}
          to={n.to}
          onClick={onClick}
          className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          activeProps={{ className: "text-foreground bg-secondary" }}
          activeOptions={{ exact: n.to === "/" }}
        >
          {n.label}
        </Link>
      ))}
    </>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          <NavLinks />
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild className="hidden sm:inline-flex">
            <Link to="/dashboard">Get Started</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-6">
              <div className="mt-8 flex flex-col gap-1">
                <NavLinks onClick={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            One intelligent workspace for meeting summaries, task plans and research.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Tools</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/meetings" className="hover:text-foreground">Meeting Summarizer</Link></li>
            <li><Link to="/planner" className="hover:text-foreground">Task Planner</Link></li>
            <li><Link to="/research" className="hover:text-foreground">Research Assistant</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Platform</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
            <li><Link to="/" hash="pricing" className="hover:text-foreground">Pricing</Link></li>
            <li><Link to="/" hash="faq" className="hover:text-foreground">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Follow</h3>
          <div className="mt-3 flex gap-2">
            {[Twitter, Linkedin, Github].map((Icon, i) => (
              <span
                key={i}
                className="grid size-9 place-items-center rounded-md border border-border text-muted-foreground"
              >
                <Icon className="size-4" />
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} NorthPilot. AI output may be inaccurate — always verify important information.
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function AiNotice({ className = "" }: { className?: string }) {
  return (
    <p className={`rounded-lg border border-dashed border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground ${className}`}>
      AI-generated content. Review and verify before relying on it.
    </p>
  );
}
