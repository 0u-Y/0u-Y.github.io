import { getRelativeLocaleUrl } from "astro:i18n";

export type Language = "en" | "ko";
export type Translations = Partial<Record<Language, string>>;

export function getLanguage(path: string): Language {
  return /^\/ko(?:\/|$)/.test(path) ? "ko" : "en";
}

export function localizedPath(path: string, lang: Language): string {
  return getRelativeLocaleUrl(lang, path.replace(/^\/ko(?=\/|$)/, ""));
}

export const ui = {
  en: {
    home: "Home",
    research: "Research",
    "open-source": "Open Source",
    about: "About",
    navigation: "Main navigation",
    language: "Language",
    unavailable: "Translation not available",
    skip: "Skip to content",
    selected: "Selected writing",
    selectedHint: "A few places to start",
    recent: "Recent writing",
    noWriting:
      "No writing published yet. Questions and work in progress will find a home here.",
    allWriting: "All writing",
    noEntries: "No entries yet. Work in progress belongs here, too.",
    researchDescription:
      "Questions before conclusions. Literature reviews, ideas in progress, and experiments on Ethereum clients and distributed systems.",
    openSourceDescription:
      "The work behind a contribution. Pull requests, bug investigations, and monthly notes from open source.",
    monthly: "Monthly report",
    sample: "Sample",
    sampleArticle: "Sample article",
    sampleNotice:
      "This is a sample to demonstrate the writing structure. It does not describe the author’s actual research or contributions.",
    updated: "Updated",
    email: "Email",
    builtWith: "Built with AstroPaper",
  },
  ko: {
    home: "Home",
    research: "Research",
    "open-source": "Open Source",
    about: "About",
    navigation: "주 메뉴",
    language: "언어",
    unavailable: "아직 번역이 없습니다",
    skip: "본문으로 건너뛰기",
    siteDescription:
      "Ethereum 클라이언트와 분산 시스템에 관한 질문, 실험, 오픈소스 기여를 기록합니다.",
    selected: "주요 글",
    selectedHint: "먼저 읽어볼 글",
    recent: "최근 글",
    noWriting: "아직 공개한 글이 없습니다.",
    allWriting: "전체 글",
    noEntries: "아직 공개한 글이 없습니다.",
    researchDescription:
      "Ethereum 클라이언트와 분산 시스템에 관한 연구 노트입니다. 읽은 논문과 떠오른 질문, 실험 과정과 결과를 정리합니다.",
    openSourceDescription:
      "오픈소스에 기여하면서 겪은 문제와 해결 과정을 기록합니다. 개별 PR 작업기와 매달의 활동을 정리합니다.",
    monthly: "월간 기록",
    sample: "예시",
    sampleArticle: "예시 글",
    sampleNotice:
      "글의 구성을 보여주기 위한 예시입니다. 실제 연구나 기여 실적을 나타내지 않습니다.",
    updated: "수정",
    email: "이메일",
    builtWith: "AstroPaper로 제작",
  },
};
