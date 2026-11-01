# Research & Open Source

Ethereum 클라이언트와 분산 시스템 연구, 오픈소스 활동을 기록하는 개인 기술 블로그입니다. AstroPaper v6.1.0을 출발점으로 만들었으며, Astro 7 + TypeScript + Markdown/MDX를 사용합니다. 정적 파일만 생성합니다.

## 실행과 빌드

Node.js 22.12 이상과 npm을 사용합니다. `package-lock.json`을 함께 관리하세요.

```bash
npm ci
npm run dev
npm run check
npm run build
npm test
npm run preview
```

개발 서버는 기본적으로 `http://localhost:4321`에서 열립니다. `npm run build`는 타입 검사 후 `dist/`를 생성합니다. `npm test`는 빌드 산출물의 메뉴, 카테고리, 글 경로와 사이트맵을 검사하므로 빌드 후 실행하세요. `npm run format:check`와 `npm run format`으로 형식을 확인하고 정리할 수 있습니다.

## 개인 정보 바꾸기

루트의 `astro-paper.config.ts`에서 관리합니다.

- `profile.name`, `introduction`: 이름과 Home 소개
- `profile.github`: 실제 GitHub 프로필 URL. 빈 값이면 모든 개인 GitHub 링크를 숨깁니다.
- `profile.email`: 실제 이메일. 빈 값이면 이메일 링크를 숨깁니다. GitHub와 이메일이 모두 비어 있으면 About 연락 영역도 숨깁니다.
- `site.url`: 현재 공개 주소는 `https://ericyang.dev`입니다. 추후 도메인을 바꾸면 canonical, sitemap도 이 설정을 따릅니다.
- `site.timezone`: 날짜 표시 기준. 기본값은 `Asia/Seoul`입니다.

About 본문과 기여 프로젝트 링크는 `src/pages/about.astro`에서 수정합니다. 이름과 연락처는 위 설정을 공유합니다. 확인되지 않은 이력과 성과는 넣지 않았습니다. UI는 영어이며, 한국어 글은 `lang: ko`로 지정합니다.

## 글 추가하기

1. `src/content/templates/`의 템플릿을 복사해 `src/content/posts/`에 `.md` 또는 `.mdx` 파일로 저장합니다.
2. 제목, 설명, 날짜, 카테고리와 본문을 수정합니다.
3. 공개할 준비가 되면 `draft: false`로 바꿉니다.
4. 개발 화면과 `npm run build`를 확인하고 commit·push합니다.

```yaml
---
title: "A precise research question"
description: "A short description for the list."
pubDatetime: 2026-10-15T09:00:00+09:00
category: research
format: investigation
featured: false
draft: true
lang: en
tags: [ethereum]
---
```

필수 필드는 `title`, `description`, `pubDatetime`, `category`입니다. 카테고리는 `research` 또는 `open-source`만 허용합니다. 선택 필드 `format`은 `investigation`, `literature-review`, `experiment`, `contribution`, `monthly` 중 하나입니다. 월간 정리는 `category: open-source`와 `format: monthly`로 발행합니다. 별도 Monthly 메뉴는 없습니다.

- `featured: true`: Home 대표 글에 표시합니다. 최대 3개이며 0개면 섹션을 숨깁니다.
- `draft: true`: 개발 화면을 포함해 목록과 상세 경로에서 제외합니다.
- 미래 `pubDatetime`: 개발 화면에서는 확인할 수 있고, 프로덕션 빌드에서는 발행 시간이 지난 글만 포함합니다. 예약 시간에 자동 공개하려면 해당 시간 이후 호스팅 재빌드가 필요합니다.
- `modDatetime`: 선택적인 수정일. 최근 글 정렬에 반영하고 상세 페이지에 수정일을 표시합니다.
- `sample: true`: 예시임을 목록과 본문에 명시합니다. 본인 글에서는 생략하세요.
- `lang: ko`: 한국어 글의 언어와 줄바꿈을 지정합니다.

글 URL은 `/posts/<파일명>/`입니다. 하위 폴더를 사용하면 폴더 경로도 포함됩니다. 파일명을 바꾸면 URL도 바뀌므로 공개 이후에는 주의하세요.

초기 샘플 4개는 `draft: true`로 비공개 처리했습니다. 실제 연구나 기여 실적이 아닙니다. 구조를 확인한 뒤 삭제하거나 본인 글로 교체하세요. 모든 글을 삭제해도 Home과 카테고리 목록의 빈 상태가 표시됩니다.

## 코드, 표, 이미지, MDX

일반 Markdown 코드 블록에는 Shiki 문법 강조가 적용됩니다. 긴 코드와 넓은 표는 가로 스크롤하며 페이지 전체를 밀어내지 않습니다.

이미지는 `public/images/`에 넣고 대체 텍스트와 함께 `![설명](/images/file.svg)` 형식으로 사용하세요. 도식 예시는 `public/images/research-workflow.svg`에 있습니다. 대표 썸네일은 필요 없습니다.

MDX에서는 기존 AstroPaper 컴포넌트를 사용할 수 있습니다. `src/content/posts/experiment-notebook.mdx`는 한국어 본문과 `ResponsiveTable` 사용 예시입니다.

## GitHub Pages 배포

사이트는 [ericyang.dev](https://ericyang.dev/), 배포 저장소는 [0u-Y/0u-Y.github.io](https://github.com/0u-Y/0u-Y.github.io)입니다.

`main`에 push하면 `.github/workflows/deploy.yml`이 npm 의존성 설치, 빌드·검증, GitHub Pages 배포를 수행합니다. GitHub 저장소 Settings → Pages의 Source는 GitHub Actions입니다. Actions 화면에서 수동으로 재배포할 수도 있습니다.

사이트는 루트 주소를 사용하므로 `/blog` 같은 `base` 경로를 사용하지 않습니다. 커스텀 도메인은 저장소 Settings → Pages에서 설정합니다. Porkbun의 루트 ALIAS와 `www` CNAME은 `0u-y.github.io`를 가리킵니다. 네임서버 변경은 필요하지 않습니다. 예전 Hugo 저장소와 Astro 블로그의 Git 이력은 모두 보존했습니다. 이전 Hugo 설정과 생성 산출물은 배포 소스에서 제거했습니다.

원래 [0u-Y/blog](https://github.com/0u-Y/blog) 저장소는 초기 버전으로 남아 있습니다. 앞으로는 이 저장소의 `main`에 변경을 push하세요.

## 출처와 라이선스

[AstroPaper v6.1.0](https://github.com/satnaing/astro-paper/releases/tag/v6.1.0), commit `4c33a60529f9c443145a89fe526ff231c009272d` 기반입니다. 원본 MIT 라이선스와 Sat Naing의 저작권 표시는 `LICENSE`에 보존했습니다. Footer에도 AstroPaper 출처 링크를 유지합니다.

AstroPaper의 콘텐츠 컬렉션, 초안·예약 글 필터, 정렬, 경로, 글 메타데이터, MDX 표 컴포넌트와 코드 강조 구성을 활용했습니다. 기존 일반 블로그 메뉴와 데모 콘텐츠, 검색·테마 전환·동적 OG 생성 등 이번 범위에서 쓰지 않는 화면은 제거했습니다.

현재 의존성은 원본 태그의 Astro 6 구성에서 Astro 7과 호환 MDX로 갱신했습니다. 정확한 재현 버전은 lockfile을 따릅니다. 본문 영문 글꼴 Inter는 npm 패키지로 자체 호스팅하며, OFL 라이선스를 `public/licenses/Inter-OFL.txt`에 포함했습니다. 한국어는 기기에서 사용 가능한 한국어 시스템 글꼴을 사용합니다.
