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
import { reportHiggsfieldError } from "../lib/higgsfield-error-reporting";
import appMetaJson from "../app-meta.json";

declare const __HF_DESIGN_INSPECTOR__: boolean;

type AppMeta = {
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  favicon_url?: string | null;
  og_video_url?: string | null;
  marketplace_cover_url?: string | null;
};

const appMeta = appMetaJson as AppMeta;

function buildHead(meta: AppMeta) {
  const title = meta.og_title ?? "KOSTAL Brasil";
  const description = meta.og_description ?? "Tecnologia eletromecânica para mobilidade.";
  const image = meta.og_image_url ?? "/assets/brand/kostal-og.png";
  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title },
      { name: "description", content: description },
      { name: "author", content: "KOSTAL Brasil" },
      { name: "theme-color", content: "#061426" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: image },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: meta.favicon_url ?? "/assets/brand/favicon.svg" },
      { rel: "apple-touch-icon", href: "/assets/brand/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  };
}

function NotFoundComponent() {
  return (
    <main className="simple-state">
      <strong>404</strong>
      <h1>Página não encontrada.</h1>
      <Link to="/">Voltar ao início</Link>
    </main>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportHiggsfieldError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <main className="simple-state">
      <h1>Esta página não carregou.</h1>
      <p>Tente novamente ou volte ao início.</p>
      <button type="button" onClick={() => { router.invalidate(); reset(); }}>
        Tentar novamente
      </button>
      <a href="/">Voltar ao início</a>
    </main>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => buildHead(appMeta),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" style={{ colorScheme: "dark" }}>
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useEffect(() => {
    if (!__HF_DESIGN_INSPECTOR__) return;
    void import("../module/design-inspector/runtime")
      .then(({ installHiggsfieldDesignInspector }) => installHiggsfieldDesignInspector())
      .catch((error) => {
        reportHiggsfieldError(
          error instanceof Error ? error : new Error("Design inspector unavailable"),
          { boundary: "design_inspector_import" },
        );
      });
  }, []);

  return <QueryClientProvider client={queryClient}><Outlet /></QueryClientProvider>;
}
