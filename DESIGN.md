---
name: CompanyWise
description: Company-Wise LeetCode Interview Preparation & Mastery System
colors:
  brand-navy: "#0F1B3D"
  brand-amber: "#F5A524"
  background-light: "#F7F8FB"
  surface-light: "#FFFFFF"
  border-light: "#E2E8F0"
  text-primary-light: "#0F1B3D"
  text-muted-light: "#64748B"
  
  # Dark Mode Warm Charcoal Specification
  background-dark: "#262624"
  surface-dark: "#30302E"
  soft-surface-dark: "#1F1E1D"
  border-dark: "#43433F"
  text-primary-dark: "#FAF9F5"
  text-muted-dark: "#A8A69C"
  accent-dark: "#D97757"
  solve-button-bg: "#D97757"
  solve-button-text: "#1F1E1D"
  easy-dark: "#8FBF78"
  medium-dark: "#E0B14F"
  hard-dark: "#EE8F78"
typography:
  light:
    headings: "Inter, sans-serif"
    body: "Inter, sans-serif"
    mono: "JetBrains Mono, monospace"
  dark:
    serif: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif'
    serif-weight: 400
    sans: 'system-ui, -apple-system, "Segoe UI", sans-serif'
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
  button-primary-light:
    backgroundColor: "{colors.brand-navy}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-dark:
    backgroundColor: "{colors.solve-button-bg}"
    textColor: "{colors.solve-button-text}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  card-dark:
    backgroundColor: "{colors.surface-dark}"
    rounded: "{rounded.lg}"
    padding: "20px"
---

## Overview

CompanyWise adopts an authoritative, engineering-grade interview intelligence aesthetic. In dark mode, it uses a signature warm charcoal palette with terracotta accents, organic difficulty markers, and an editorial typography system driven completely by device-native system fonts (zero internet asset overhead).

## Dark Mode Typography System

Neither font loads from the internet; rendering leverages installed device fonts for instant, zero-latency typography.

1. **Editorial Serif (`400` regular weight)**:
   - **Stack**: `"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif`
   - **Used For**:
     - Main headline (`h1`)
     - Section titles (`h2`, `h3`, card headings)
     - The `"CompanyWise"` logo wordmark
     - Big numbers in stat cards (Catalog count, company count, your solved, accuracy percentage)
     - Letters in quick-jump circles and alphabet filter bars
   - **Feel**: Light, elegant, editorial presence (Iowan Old Style on Apple, Palatino on Mac/Windows, Georgia on Windows/Android).

2. **System Sans-Serif (`system-ui, -apple-system, "Segoe UI", sans-serif`)**:
   - **Used For**: Body copy, buttons, search input, tables, badges, and secondary labels.
   - **Feel**: Native platform consistency (San Francisco on Apple, Segoe UI on Windows, Roboto on Android).

## Dark Mode Color System

| Role | Color | Used for |
|---|---|---|
| **Background** | `#262624` | Page background (warm charcoal) |
| **Cards** | `#30302E` | Cards, inputs, buttons |
| **Soft surface** | `#1F1E1D` | Quiet fills (progress track, key hint, hover states) |
| **Text** | `#FAF9F5` | Main text (warm off-white) |
| **Muted text** | `#A8A69C` | Secondary text and labels |
| **Borders** | `#43433F` | Dividers and outlines |
| **Accent** | `#D97757` | Highlighted words, progress bars, the spark logo |
| **Solve buttons** | `#D97757` with `#1F1E1D` text | Primary action buttons |
| **Easy** | `#8FBF78` | Easy difficulty (green) |
| **Medium** | `#E0B14F` | Medium difficulty (amber) |
| **Hard** | `#EE8F78` | Hard difficulty (coral) |

## Light Mode Reference
- Canvas: `#F7F8FB`
- Cards: `#FFFFFF`
- Borders: `#E2E8F0`
- Primary text & brand anchor: `#0F1B3D`
- Accent: `#F5A524`
