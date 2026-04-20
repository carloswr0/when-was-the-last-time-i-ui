import { Link } from "react-router";
import { AuthLink } from "../components/auth/AuthLink";
import { Card } from "../components/ui/Card";
import { cn } from "../lib/cn";

const heroPrimaryLink =
  "inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-base font-medium text-white shadow-sm transition-[opacity] hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto";

const heroOutlineLink =
  "inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-border bg-surface px-5 py-2.5 text-base font-medium text-foreground shadow-sm transition-[background-color] hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto";

const exampleItems = [
  {
    title: "Deep-cleaned the bathroom",
    cadence: "Roughly every month",
    last: "18 days ago",
    accent: "bg-recurring-weekly/15 text-recurring-weekly ring-recurring-weekly/30",
  },
  {
    title: "Changed the car’s oil",
    cadence: "Every 5,000 mi · check sticker",
    last: "3,200 mi since last change",
    accent: "bg-recurring-monthly/15 text-recurring-monthly ring-recurring-monthly/30",
  },
  {
    title: "Dentist (cleaning)",
    cadence: "Every 6 months",
    last: "Next window opens in 41 days",
    accent: "bg-recurring-daily/15 text-recurring-daily ring-recurring-daily/30",
  },
  {
    title: "Replaced HVAC filter",
    cadence: "Seasonally",
    last: "Last swap: late February",
    accent: "bg-recurring-custom/15 text-recurring-custom ring-recurring-custom/30",
  },
] as const;

const featureBlocks = [
  {
    title: "Answer the awkward question",
    body: "“When was the last time I…?” Stop guessing. Log it once, glance at it forever.",
  },
  {
    title: "Rhythm, not rigidity",
    body: "Some chores are weekly, some are “when it feels gross.” Set cadences that match real life.",
  },
  {
    title: "Nudges that respect you",
    body: "Reminders for oil changes, teeth cleanings, litter boxes—without turning into a nagging alarm clock.",
  },
  {
    title: "Rooms, rides, routines",
    body: "Group events by home, car, health, or pets so the right context is always one tap away.",
  },
] as const;

const LandingPage = () => {
  return (
    <div className="relative flex min-h-dvh flex-col bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl sm:-right-32 sm:-top-32 sm:h-96 sm:w-96" />
        <div className="absolute -bottom-32 -left-28 h-80 w-80 rounded-full bg-secondary/15 blur-3xl sm:-bottom-40 sm:-left-40 sm:h-[28rem] sm:w-[28rem]" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-info/10 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="group flex items-baseline gap-2 text-left">
            <span className="text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
              When was the last time I…
            </span>
            <span className="hidden rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary sm:inline">
              beta
            </span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3" aria-label="Account">
            <AuthLink to="/login" className="px-2 py-1.5 text-sm sm:text-base">
              Log in
            </AuthLink>
            <Link to="/register" className={cn(heroPrimaryLink, "px-4 py-2 text-sm sm:text-base")}>
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:pt-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-16">
            <div>
              <p className="text-sm font-medium text-primary">Time · events · reminders · calm organization</p>
              <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Remember life’s recurring chores—without a spreadsheet in your head.
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-lg text-muted-foreground sm:text-xl">
                A gentle home for “last time I washed the bathroom,” “when did the oil get changed,” and “how long
                since the dentist?” Track what repeats, see what’s overdue, and get reminded before things slip.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link to="/register" className={heroPrimaryLink}>
                  Create a free account
                </Link>
                <Link to="/login" className={heroOutlineLink}>
                  I already have one
                </Link>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                No lectures—just clarity. Built for busy humans who still want their spaces and schedules under control.
              </p>
            </div>

            <Card className="border-border/80 bg-surface/90 shadow-lg backdrop-blur-sm" padding="lg">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Live snapshot</p>
              <p className="mt-1 text-sm text-muted-foreground">What you might see on a quiet Tuesday evening</p>
              <ul className="mt-6 space-y-4">
                {exampleItems.map((item) => (
                  <li
                    key={item.title}
                    className="flex gap-4 rounded-xl border border-border/60 bg-background/60 p-4 shadow-sm"
                  >
                    <span
                      className={cn(
                        "mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-2 ring-inset",
                        item.accent,
                      )}
                      aria-hidden
                    >
                      ✓
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.cadence}</p>
                      <p className="mt-1 text-sm font-medium text-foreground">{item.last}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </section>

        <section className="border-y border-border/80 bg-surface/50 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Made for the maintenance of real life</h2>
              <p className="mt-3 text-pretty text-lg text-muted-foreground">
                Not another calendar stuffed with meetings—space for the stuff that quietly matters: filters, tires,
                plants, pets, teeth, and the occasional bathroom deep clean.
              </p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featureBlocks.map((f) => (
                <Card key={f.title} className="h-full border-border/70 bg-background/80" padding="md">
                  <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-surface to-secondary/10 p-8 sm:p-12 lg:p-14">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Give your future self a break
              </h2>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                Sign up, add a few “last time I…” moments, and let the app carry the mental load. You’ve got enough tabs
                open already.
              </p>
              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:justify-center">
                <Link to="/register" className={heroPrimaryLink}>
                  Start tracking for free
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/80 bg-background/90 py-8 text-center text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 px-4 sm:flex-row sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} When was the last time I…</p>
          <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <AuthLink to="/login">Log in</AuthLink>
            <AuthLink to="/register" variant="primary">
              Register
            </AuthLink>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
