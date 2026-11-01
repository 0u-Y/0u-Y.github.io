---
name: Protocol Notebook
description: A restrained research notebook for technical writing.
colors:
  paper: "#faf9f6"
  ink: "#282d32"
  muted: "#626870"
  blue: "#355b82"
  line: "#dedfd9"
  intro-copy: "#4a525b"
  inline-code: "#efefeb"
  code-block: "#f3f3ef"
typography:
  display:
    fontFamily: '"Inter Variable", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif'
    fontSize: "clamp(32px, 5vw, 42px)"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.035em"
  title:
    fontSize: "17px"
    fontWeight: 550
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body:
    fontFamily: '"Inter Variable", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif'
    fontSize: "16px"
    lineHeight: 1.75
  date:
    fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace'
    fontSize: "11px"
    lineHeight: 1.8
rounded:
  label: "3px"
  code-block: "4px"
components:
  navigation:
    textColor: "{colors.muted}"
    padding: "8px 0"
  sample-label:
    textColor: "{colors.muted}"
    rounded: "{rounded.label}"
    padding: "0 5px"
  code-block:
    backgroundColor: "{colors.code-block}"
    rounded: "{rounded.code-block}"
    padding: "22px"
---

# Design System: Protocol Notebook

## Overview

**Creative North Star: "The Research Notebook"**

A restrained research notebook in Read mode. Warm paper, ink text, calm blue links, generous spacing, and thin rules keep technical writing central. English navigation and Korean-friendly typography share a narrow reading column.

**Key Characteristics:**

- Warm white paper and restrained blue accents.
- A 720px reading measure with generous vertical space.
- Flat, text-led lists and Korean-friendly article typography.

## Colors

### Primary

Calm blue marks links, the wordmark icon, title punctuation, active navigation underlines, focus outlines, and blockquote rules.

### Neutral

Warm paper is the page background. Ink carries headings and primary text; muted gray carries dates, descriptions, and supporting labels. Pale gray rules separate sections. Introductory text has a softer ink tone; code uses lightly tinted surfaces.

## Typography

Inter Variable leads a sans-serif stack with Apple SD Gothic Neo, Noto Sans KR, and Malgun Gothic fallbacks. Dates and code use the monospace stack defined above.

Page headings use the display role. Article titles use a smaller responsive size (`clamp(28px, 5vw, 38px)`) and line height (1.4). Post titles use the title role. Introductory copy is larger (18px, line height 1.85), becoming 16px on mobile.

Article prose uses 16px type with line height 1.9; Korean prose uses line height 2 and `word-break: keep-all`. Korean article headings also keep words together, with `overflow-wrap: anywhere` as the overflow fallback. Prose section headings use 24px and 19px sizes. Dates use tabular numerals.

## Layout

The centered shell has a maximum outer width of 792px and 36px horizontal padding, yielding a 720px content measure. The desktop header is at least 112px tall. Introductory content has 76px top and 58px bottom padding. Post rows use a 112px date column, a flexible text column, a 22px gap, and 25px vertical padding.

At widths of 700px and below, the wordmark and language switch share the first row, with the main navigation below. At 600px and below, shell padding becomes 24px, post dates move above their summaries, and the footer stacks. Introductory padding becomes 48px above and 42px below. Wide code and tables scroll horizontally within the reading column. Korean text keeps words together, with overflow wrapping available for long tokens.

## Elevation & Depth

The interface is flat and uses no shadows. Thin borders, whitespace, and subtle code backgrounds provide separation. Smooth anchor scrolling applies only when reduced motion is not requested.

## Shapes

Content lists and sections remain unboxed. Rules are 1px. Small labels, inline code, and article images have 3px corners; code blocks have 4px corners. Keyboard focus uses a 2px blue outline with a 5px offset.

## Components

- **Navigation:** muted text becomes ink for the current page, with a 2px blue underline offset by 10px. Links underline on hover.
- **Language switch:** a small EN / KO control sits to the right of the navigation on desktop and the wordmark on mobile. The active language uses blue, medium weight, and an underline. Each link has a 44px touch target. Unavailable translations are disabled and struck through. Main menu labels remain English in both languages.
- **Post row:** date, ink title, muted summary, and compact metadata sit between thin rules. Hovering a title turns it blue.
- **Sample label and notice:** a compact outlined label identifies sample entries; an article notice sits between two rules.
- **Article code:** inline code uses a pale surface; blocks have padding, a thin border, and horizontal scrolling. Mobile block padding is 16px.
- **Article quote:** a single blue left rule and 22px inset distinguish quoted text.

## Do's and Don'ts

### Do

- Use thin rules and whitespace to separate content.
- Preserve Korean words in article headings and prose.
- Keep sample-content labels visible.

### Don't

- Do not add stock photos or large post thumbnails.
- Do not introduce elevated cards or decorative shadows.
