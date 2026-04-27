import { Link } from "react-router";
import { cn } from "../lib/cn";
import IncomingDeadlines from "../components/sections/IncomingDeadlines";
import YourGroups from "../components/sections/YourGroups";

const HomeScreen = () => {
  return (
    <div className="relative flex min-h-dvh flex-col bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl sm:h-80 sm:w-80" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl flex-col gap-1 px-4 py-6 sm:px-6">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Home</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Deadlines, your calendar, and the groups you share routines with.
          </p>
        </div>
      </header>

      <nav
        className="relative z-10 border-b border-border/80 bg-background/70 backdrop-blur-sm"
        aria-label="Home actions"
      >
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <Link
            to="/settings"
            className={cn(
              "inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-[opacity,background-color] sm:w-auto sm:text-base",
              "hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-offset-background",
            )}
          >
            Settings
          </Link>
          <Link
            to="/group/new"
            className={cn(
              "inline-flex min-h-11 w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-[opacity,background-color] sm:w-auto sm:text-base",
              "bg-primary text-white shadow-sm hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-offset-background",
            )}
          >
            New group
          </Link>
        </div>
      </nav>

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
        <IncomingDeadlines />

        <YourGroups />
      </main>
    </div>
  );
};

export default HomeScreen;
