---
name: CompanyWise
description: Company-Wise LeetCode Interview Preparation
colors:
  primary: "#2563EB"
  primary-hover: "#1D4ED8"
  primary-light: "#3B82F6"
  background-light: "#FAFAFA"
  background-dark: "#0A0A0B"
  surface-light: "#FFFFFF"
  surface-dark: "#121214"
  border-light: "#E5E7EB"
  border-dark: "#262626"
  text-primary-light: "#0F172A"
  text-primary-dark: "#F8FAFC"
  text-muted-light: "#64748B"
  text-muted-dark: "#A1A1AA"
  easy: "#10B981"
  medium: "#F59E0B"
  hard: "#EF4444"
typography:
  display:
    fontFamily: "Inter, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 800
    lineHeight: 1.15
  headline:
    fontFamily: "Inter, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  mono:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-secondary:
    backgroundColor: "{colors.surface-light}"
    textColor: "{colors.text-primary-light}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  card:
    backgroundColor: "{colors.surface-light}"
    rounded: "{rounded.lg}"
    padding: "20px"
---

## Overview

CompanyWise adopts a developer-focused, high-density utility aesthetic influenced by modern developer toolkits (Linear, Vercel). The design prioritizes scanability, high text contrast, precise data visualization, and frictionless navigation across 200 tech company question collections.

## Colors

- **Primary Brand**: Blue (`#2563EB`), Indigo (`#4F46E5`).
- **Surfaces**:
  - Light mode: Pure `#FFFFFF` on `#FAFAFA` base.
  - Dark mode: Near-black `#121214` surface on `#0A0A0B` base.
- **Borders**:
  - Light: Subtle gray `border-neutral-200/90` (`#E5E7EB`).
  - Dark: Sleek slate `dark:border-neutral-800` (`#262626`).
- **Semantic Difficulties**:
  - Easy: Emerald (`#10B981`, badge text `#047857` in light, `#34D399` in dark).
  - Medium: Amber (`#F59E0B`, badge text `#B45309` in light, `#FBBF24` in dark).
  - Hard: Rose (`#EF4444`, badge text `#BE123C` in light, `#FB7185` in dark).

## Typography

- **Primary Font**: `Inter`, system fallback sans-serif.
- **Code & Numbers**: `JetBrains Mono`, monospace.
- Scale:
  - Display: 32px - 40px, bold 800, tight tracking.
  - Headings: 18px - 22px, bold 700.
  - Body: 14px, regular 400 or medium 500.
  - Captions & Meta: 11px - 12px, semibold 600.

## Layout

- Fluid responsive grid container capped at `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- 12-column responsive grid on desktop:
  - Hero Left: 5 columns (`xl:col-span-5`).
  - Hero Center (Illustration): 3 columns (`xl:col-span-3`).
  - Hero Right (Dashboard Cards): 4 columns (`xl:col-span-4`).
- Featured Companies: 4-column responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`).

## Elevation & Depth

- Restrained elevation using multi-layered ambient drop shadows:
  - Cards: `shadow-xs` / `shadow-2xs` in light, bordered flat in dark.
  - Hover states: `hover:shadow-md hover:-translate-y-0.5`.
  - Floating badges: `shadow-lg shadow-slate-200/50` (light), `dark:shadow-black/70` (dark).

## Shapes

- Rounded corners: `rounded-xl` (12px) for cards, `rounded-lg` (8px) for buttons and inputs, `rounded-full` for badges.
- Avoid razor-sharp 0px borders or exaggerated pill radii for main content blocks.

## Components

- **Navigation**: Sticky top navigation bar with blur backdrop (`backdrop-blur-md`), SVG brand mark, search shortcut, and theme toggle.
- **Company Cards**: Standardized `w-11 h-11` logo containers, company title, question count, hover arrow, and decimal completion progress bar.
- **Difficulty Badges**: High-contrast colored pill badges with status dots.
- **Terminal Illustration**: Theme-aware vector SVG editor window with floating glass company logo badges.

## Do's and Don'ts

- **Do**:
  - Show precise decimal percentages (`0.23%`, `0.26%`) when completion is below 1%.
  - Maintain WCAG AA compliant text contrast in both light and dark themes.
  - Standardize company logo container dimensions.
- **Don't**:
  - Do not introduce heavy multi-color neo-brutalism or noisy textures.
  - Do not display 0% progress when questions have been solved.
  - Do not use raster screenshots with halos or jagged extraction artifacts.
