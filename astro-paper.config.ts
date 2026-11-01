import { defineAstroPaperConfig } from "./src/types/config";

// Personal information lives here. Empty contacts are intentionally hidden.
export const profile = {
  name: "YoungWoo Yang",
  introduction:
    "I contribute to Ethereum clients and study blockchain systems. Here, I share notes on core development, research papers, and experiments",
  github: "https://github.com/0u-Y",
  email: "yyw1000@naver.com",
};

export default defineAstroPaperConfig({
  site: {
    url: "https://ericyang.dev",
    title: `${profile.name} — Research & Open Source`,
    author: profile.name,
    description:
      "Questions, experiments, and open-source field notes on Ethereum clients and distributed systems.",
    lang: "en",
    timezone: "Asia/Seoul",
  },
  posts: { perPage: 12, perIndex: 6, scheduledPostMargin: 0 },
  features: {
    lightAndDarkMode: false,
    dynamicOgImage: false,
    showArchives: false,
    showBackButton: true,
    editPost: { enabled: false },
    search: false,
  },
  socials: [
    ...(profile.github ? [{ name: "github", url: profile.github }] : []),
    ...(profile.email
      ? [{ name: "mail", url: `mailto:${profile.email}` }]
      : []),
  ],
  shareLinks: [],
});
