---
name: CompanyWise
description: Company-Wise LeetCode Interview Preparation & Mastery System
colors:
  brand-navy: "#0F1B3D"
  brand-navy-dark: "#111215"
  brand-navy-surface: "#17191E"
  brand-navy-hover: "#252832"
  brand-navy-border: "#282B35"
  brand-amber: "#F5A524"
  brand-amber-hover: "#E0921B"
  background-light: "#F7F8FB"
  background-dark: "#111215"
  surface-light: "#FFFFFF"
  surface-dark: "#17191E"
  border-light: "#E2E8F0"
  border-dark: "#282B35"
  text-primary-light: "#0F1B3D"
  text-primary-dark: "#FFFFFF"
  text-muted-light: "#64748B"
  text-muted-dark: "#94A3B8"
  easy: "#10B981"
  medium: "#F5A524"
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
    backgroundColor: "{colors.brand-navy}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-accent:
    backgroundColor: "{colors.brand-amber}"
    textColor: "{colors.brand-navy-dark}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  card:
    backgroundColor: "{colors.surface-light}"
    rounded: "{rounded.lg}"
    padding: "20px"
---

## Overview

CompanyWise adopts an authoritative, engineering-grade interview intelligence aesthetic derived from its signature mark: a dark navy squircle with progressive capability bars crowned by an amber goal-status apex dot. The design prioritizes scanability, high text contrast, precise data visualization, and frictionless navigation across 200+ tech company question collections.

## Color Palette

- **Brand Anchor**:
  - **Midnight Navy (`#0F1B3D`)**: Anchors primary buttons, headings, badges, and dark squircle logo containers in light mode.
  - **Greyish Black Canvas (`#111215`)**: Modern developer-grade dark neutral charcoal canvas without any blueish cast.
  - **Elevated Greyish Black Surface (`#17191E`)**: Clean card and panel surface separation in dark mode.
  - **Interactive Hover Charcoal (`#252832`)**: Smooth row and button hovers in dark mode.
  - **Structural Border (`#282B35`)**: Deliberate, clean structural separators and outlines.
- **Apex Accent**:
  - **Warm Amber Gold (`#F5A524`)**: Direct from the logo's apex dot. Used for attempted status, target indicators, streak milestones, and focal progress highlights.
- **Light Mode Canvas**:
  - Pure `#F7F8FB` background (matching the official logo reference canvas) with crisp `#FFFFFF` cards and `#0F1B3D` typography.
- **Semantic Difficulties**:
  - **Easy**: Emerald (`#10B981`, badge text `#047857` in light, `#34D399` in dark).
  - **Medium**: Amber (`#F5A524`, badge text `#B45309` in light, `#FBBF24` in dark).
  - **Hard**: Rose (`#EF4444`, badge text `#BE123C` in light, `#FB7185` in dark).

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
  - Main problem table / company matrix: 8 columns.
  - Contextual sidebar / filters / bookmarks: 4 columns.
- Sticky navigation header with LeetCode sync status indicator, clear navigation links, and theme toggle.
