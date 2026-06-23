import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";

function NotFoundComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-alabaster">
      <div className="text-center max-w-md">
        <div className="eyebrow text-obsidian/40 mb-4">404</div>
        <h1 className="font-display text-5xl mb-4">Page not found</h1>
        <p className="text-obsidian/60 mb-8 text-sm">
          The page you're looking for has moved or no longer exists.
        </p>
        <Link to="/" className="eyebrow border-b border-obsidian pb-1">
          Return Home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-alabaster">
      <div className="text-center max-w-md">
        <h1 className="font-display text-3xl mb-3">This page didn't load</h1>
        <p className="text-sm text-obsidian/60 mb-8">
          Something went wrong on our end.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="eyebrow bg-obsidian text-alabaster px-6 py-3 hover:bg-gold transition-colors"
          >
            Try again
          </button>
          <a href="/" className="eyebrow border border-obsidian/20 px-6 py-3 hover:bg-bone transition-colors">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Aeterna — Luxury Fragrance House" },
      {
        name: "description",
        content:
          "Aeterna — sculptural luxury perfumes hand-poured in Grasse. Discover signature scents, niche fragrances, and gift sets.",
      },
      { name: "author", content: "Aeterna Fragrances" },
      { property: "og:title", content: "Aeterna — Luxury Fragrance House" },
      {
        property: "og:description",
        content: "Sculptural luxury perfumes, hand-poured in Grasse.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-alabaster text-obsidian">
        <SiteNav />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
        <CartDrawer />
      </div>
    </QueryClientProvider>
  );
}
