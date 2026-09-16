import { createElement } from "react";
import type {
  ScrollScrubScene,
  ScrollScrubTheme,
} from "@/components/scroll-scrub/scroll-scrub";

export const scrollScrubTheme: ScrollScrubTheme = {
  accent: "#E87722",
  background: "#061426",
  ink: "#F6F8FB",
  muted: "#A8B5C4",
};

export const scrollScrubScenes: ScrollScrubScene[] = [
  {
    id: "precisao",
    label: "Precisão",
    poster: "/assets/world/scene-01-poster.png",
    mobilePoster: "/assets/world/scene-01-mobile-poster.png",
    clip: "/assets/world/scene-01.mp4",
    mobileClip: "/assets/world/scene-01-mobile.mp4",
    kicker: "KOSTAL BRASIL",
    title: "Precisão em cada comando.",
    body: "Componentes eletromecânicos projetados para responder com precisão, do primeiro toque ao movimento.",
    align: "left",
    linger: 0.24,
    scroll: 5.2,
    objectPosition: "center center",
    mobileObjectPosition: "center center",
    actions: createElement(
      "a",
      { href: "#produtos", className: "hero-catalog-cta" },
      "Explorar 3D",
    ),
  },
];
