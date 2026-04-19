import { useState } from "react";
import { Card } from "../components/ui/Card";
import { cn } from "../lib/cn";

const FONT_TOKENS = ["sans", "mono"];

const TEXT_SIZE_TOKENS = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl"];

const LEADING_TOKENS = ["tight", "snug", "normal", "relaxed", "loose"];

/** Token suffixes after `--color-`, matching `index.css` `@theme static`. */
const COLOR_GROUPS: { title: string; tokens: string[] }[] = [
  { title: "Brand", tokens: ["primary", "secondary"] },
  {
    title: "Surfaces & text",
    tokens: [
      "background",
      "surface",
      "foreground",
      "muted-foreground",
      "border",
    ],
  },
  { title: "Functional", tokens: ["success", "warning", "error", "info"] },
  {
    title: "Recurring events",
    tokens: [
      "recurring-daily",
      "recurring-weekly",
      "recurring-monthly",
      "recurring-custom",
    ],
  },
  {
    title: "Tags & categories",
    tokens: ["tag-purple", "tag-pink", "tag-teal", "tag-yellow"],
  },
];

function FontFamilyRow({ token }: { token: string }) {
  const varName = `--font-${token}`;
  const resolved =
    typeof document !== "undefined"
      ? getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
      : "";

  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-border py-3 last:border-b-0">
      <div
        className="flex h-14 min-w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-surface px-3 shadow-inner"
        style={{ fontFamily: `var(${varName})` }}
        aria-hidden
      >
        <span className="text-lg text-foreground">Aa</span>
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="font-mono text-sm text-foreground">{token}</p>
        <p className="break-all font-mono text-xs text-muted-foreground">
          {varName}
          {resolved ? ` · ${resolved}` : ""}
        </p>
      </div>
      <code className="hidden shrink-0 rounded-lg bg-background px-2 py-1 font-mono text-xs text-muted-foreground sm:block">
        font-{token}
      </code>
    </div>
  );
}

function TextSizeRow({ token }: { token: string }) {
  const sizeVar = `--text-${token}`;
  const lhVar = `--text-${token}--line-height`;
  const sizeResolved =
    typeof document !== "undefined"
      ? getComputedStyle(document.documentElement).getPropertyValue(sizeVar).trim()
      : "";
  const lhResolved =
    typeof document !== "undefined"
      ? getComputedStyle(document.documentElement).getPropertyValue(lhVar).trim()
      : "";

  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-border py-3 last:border-b-0">
      <div className="min-w-0 flex-1 space-y-2">
        <p className="font-mono text-sm text-foreground">{token}</p>
        <p className="font-mono text-xs text-muted-foreground">
          {sizeVar}
          {sizeResolved ? ` · ${sizeResolved}` : ""}
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          {lhVar}
          {lhResolved ? ` · ${lhResolved}` : ""}
        </p>
        <p
          className={cn(
            "text-foreground",
            token === "xs" && "text-xs",
            token === "sm" && "text-sm",
            token === "base" && "text-base",
            token === "lg" && "text-lg",
            token === "xl" && "text-xl",
            token === "2xl" && "text-2xl",
            token === "3xl" && "text-3xl",
          )}
        >
          The quick brown fox ({token})
        </p>
      </div>
      <code className="hidden shrink-0 rounded-lg bg-background px-2 py-1 font-mono text-xs text-muted-foreground sm:block">
        text-{token}
      </code>
    </div>
  );
}

function LeadingRow({ token }: { token: string }) {
  const varName = `--leading-${token}`;
  const resolved =
    typeof document !== "undefined"
      ? getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
      : "";

  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-border py-3 last:border-b-0">
      <div
        className="flex h-14 min-w-14 shrink-0 flex-col justify-center rounded-xl border border-border bg-surface px-3 text-center shadow-inner"
        aria-hidden
      >
        <span className="text-xs leading-none text-muted-foreground">A</span>
        <span
          className="text-sm text-foreground"
          style={{ lineHeight: `var(${varName})` }}
        >
          abc
        </span>
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="font-mono text-sm text-foreground">{token}</p>
        <p className="font-mono text-xs text-muted-foreground">
          {varName}
          {resolved ? ` · ${resolved}` : ""}
        </p>
      </div>
      <code className="hidden shrink-0 rounded-lg bg-background px-2 py-1 font-mono text-xs text-muted-foreground sm:block">
        leading-{token}
      </code>
    </div>
  );
}

function ColorRow({ token }: { token: string }) {
  const varName = `--color-${token}`;
  const resolved =
    typeof document !== "undefined"
      ? getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
      : "";
  const swatchStyle = { backgroundColor: `var(${varName})` };

  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-border py-3 last:border-b-0">
      <div
        className="h-14 w-14 shrink-0 rounded-xl border border-border shadow-inner"
        style={swatchStyle}
        aria-hidden
      />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="font-mono text-sm text-foreground">{token}</p>
        <p className="font-mono text-xs text-muted-foreground">
          {varName}
          {resolved ? ` · ${resolved}` : ""}
        </p>
      </div>
      <code className="hidden shrink-0 rounded-lg bg-background px-2 py-1 font-mono text-xs text-muted-foreground sm:block">
        bg-{token} · text-{token}
      </code>
    </div>
  );
}

const ThemePreview = () => {
  const [dark, setDark] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"),
  );

  const toggleDark = () => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-6">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Theme preview</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Tokens from <code className="font-mono text-foreground">index.css</code>{" "}
              <code className="font-mono text-foreground">@theme static</code> and related
              rules.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleDark}
            className={cn(
              "rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground shadow-sm",
              "hover:bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
            )}
          >
            {dark ? "Light" : "Dark"} mode
          </button>
        </header>

        {COLOR_GROUPS.map((group) => (
          <Card key={group.title}>
            <h2 className="text-lg font-semibold text-foreground">{group.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              <code className="font-mono">--color-*</code> utilities (e.g.{" "}
              <code className="font-mono">bg-{group.tokens[0]}</code>
              ).
            </p>
            <div className="mt-4">
              {group.tokens.map((token) => (
                <ColorRow key={token} token={token} />
              ))}
            </div>
          </Card>
        ))}

        <Card>
          <h2 className="text-lg font-semibold text-foreground">Typography</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Font families, type scale, and <code className="font-mono">leading-*</code> tokens live in{" "}
            <code className="font-mono text-foreground">@theme static</code>.{" "}
            <code className="font-mono text-foreground">html</code> is set to{" "}
            <code className="font-mono text-foreground">font-size: 16px</code> so{" "}
            <code className="font-mono text-foreground">1rem</code> equals 16px.
          </p>

          <div className="mt-6 space-y-6 border-t border-border pt-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Font families
              </p>
              <div className="mt-3">
                {FONT_TOKENS.map((t) => (
                  <FontFamilyRow key={t} token={t} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Font size and line-height
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Each step uses <code className="font-mono">--text-&#123;size&#125;</code> and{" "}
                <code className="font-mono">--text-&#123;size&#125;--line-height</code> (paired with{" "}
                <code className="font-mono">text-*</code> utilities).
              </p>
              <div className="mt-3">
                {TEXT_SIZE_TOKENS.map((t) => (
                  <TextSizeRow key={t} token={t} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Line-height (unitless scale)
              </p>
              <div className="mt-3">
                {LEADING_TOKENS.map((t) => (
                  <LeadingRow key={t} token={t} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Samples
              </p>
              <div className="mt-3 space-y-2 text-foreground">
                <p className="text-xs">text-xs — The quick brown fox</p>
                <p className="text-sm">text-sm — The quick brown fox</p>
                <p className="text-base">text-base — The quick brown fox</p>
                <p className="text-lg">text-lg — The quick brown fox</p>
                <p className="text-xl">text-xl — The quick brown fox</p>
                <p className="text-2xl font-semibold">text-2xl — The quick brown fox</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-foreground">Other theme-related rules</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>
              <span className="text-foreground">Dark mode:</span> class{" "}
              <code className="font-mono text-foreground">dark</code> on{" "}
              <code className="font-mono text-foreground">&lt;html&gt;</code> overrides
              background, surface, foreground, muted, and border tokens (see{" "}
              <code className="font-mono text-foreground">html.dark</code> in{" "}
              <code className="font-mono text-foreground">index.css</code>).
            </li>
            <li>
              <span className="text-foreground">Variant:</span>{" "}
              <code className="font-mono text-foreground">@custom-variant dark</code>{" "}
              scopes <code className="font-mono text-foreground">dark:*</code> utilities
              to <code className="font-mono text-foreground">.dark</code> ancestors.
            </li>
            <li>
              <span className="text-foreground">Base:</span>{" "}
              <code className="font-mono text-foreground">html</code> sets{" "}
              <code className="font-mono text-foreground">font-size: 16px</code>;{" "}
              <code className="font-mono text-foreground">body</code> uses{" "}
              <code className="font-mono text-foreground">font-sans</code>,{" "}
              <code className="font-mono text-foreground">text-base</code>,{" "}
              <code className="font-mono text-foreground">bg-background</code>, and{" "}
              <code className="font-mono text-foreground">text-foreground</code>.
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default ThemePreview;
