import { Link } from "react-router";

const SettingsScreen = () => {
  return (
    <div className="relative flex min-h-dvh flex-col bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl sm:h-80 sm:w-80" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-6 sm:px-6">
          <Link
            to="/home"
            className="inline-flex w-fit items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span aria-hidden>←</span> Back to home
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Settings</h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Account and app preferences.
            </p>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6" />
    </div>
  );
};

export default SettingsScreen;
