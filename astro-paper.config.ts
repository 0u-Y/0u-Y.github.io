import { defineAstroPaperConfig } from "./src/types/config";

// Personal information lives here. Empty contacts are intentionally hidden.
export const profile = {
  name: "YoungWoo Yang",
  introduction:
    "I study Ethereum clients and distributed systems, and contribute to open source. This is where I keep questions, experiments, and work in progress.",
  github: "https://github.com/0u-Y",
  email: "",
  interests: [
    "Ethereum clients & protocol implementation",
    "Distributed systems & peer-to-peer networks",
    "Testing, performance & reliability",
  ],
  biography:
    "Add a short introduction here: what you are working on, how you approach research, and what you would like to explore next.",
  activity:
    "Add selected contributions, pull requests, and other activities here. Include links and a short description of your role.",
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
