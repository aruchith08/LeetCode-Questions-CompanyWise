# CodeWise — 200 company logo images

This archive contains **200 image assets**, one per company slug in the provided list.

## Contents

- `png/` — 200 transparent-background 512 × 512 PNG images.
- `svg/` — 200 scalable SVG images.
- `png-on-dark/` — 200 transparent PNG images adapted for dark UI backgrounds.
- `manifest.csv` / `manifest.json` — exact name, slug, source and verification status for every item.
- `needs_official_logos.csv` — companies whose authoritative logo was NOT available in the bundled collections.
- `preview.png` — visual contact sheet.

## Coverage and accuracy

- `custom-recreation`: **1** assets
- `font-awesome`: **4** assets
- `simple-icons`: **92** assets
- `wordmark-fallback`: **103** assets

**Important:** This collection is an offline, best-effort build from preinstalled icon collections. The 103 fallback wordmarks are typographic placeholders, **not verified corporate logos**. The sourced icons are recognizable brand glyphs rather than necessarily official downloadable logo masters, and may not reflect later rebrands. Microsoft's tile mark is a handmade reconstruction, not a downloaded official file.

Do not claim the full archive contains 200 verified official corporate logos. Check `needs_official_logos.csv` and replace those images with company-published assets before presenting them as official branding.

## Use in CodeWise

For React/Vite, copy `png/` into `public/company-logos/` then use: `src={'/company-logos/' + company.slug + '.png'}` (illustrative JSX). Use `png-on-dark/` variants for dark themes where a logo would otherwise have insufficient contrast.

## Source and license notes

- **Simple Icons**: glyphs extracted from the locally bundled **Simple Icons 14.9** font. Brand icon project https://simpleicons.org/ . Icons generally made available under CC0, but trademarks/brand guidelines still apply and individual brand assets may have other requirements.
- **Font Awesome**: glyphs extracted from locally bundled Font Awesome Free brands. Icons licensed **CC BY 4.0**; attribution required. https://fontawesome.com/license/free . See included `FONT_AWESOME_LICENSE.txt`.
- **Fallback wordmarks**: custom typography-only artwork created for this ZIP. These are not official company marks.

Company names and logos remain the trademarks of their respective owners. No endorsement is implied.
