import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Company Logos Assets & Mapping', () => {
  const publicDir = path.resolve(__dirname, '../public');
  const logosDir = path.join(publicDir, 'logos');
  const indexJsonPath = path.join(publicDir, 'data/index.json');
  const manifestPath = path.join(logosDir, 'manifest.json');

  it('contains the manifest file with all 200 company definitions', () => {
    expect(fs.existsSync(manifestPath)).toBe(true);
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    expect(Array.isArray(manifest)).toBe(true);
    expect(manifest.length).toBe(200);
  });

  it('ensures every company in index.json has PNG, PNG-on-dark, and SVG logo files', () => {
    expect(fs.existsSync(indexJsonPath)).toBe(true);
    const indexData = JSON.parse(fs.readFileSync(indexJsonPath, 'utf8'));
    expect(indexData.companies.length).toBe(200);

    const missingPng: string[] = [];
    const missingPngDark: string[] = [];
    const missingSvg: string[] = [];

    for (const company of indexData.companies) {
      const pngPath = path.join(logosDir, 'png', `${company.slug}.png`);
      const pngDarkPath = path.join(logosDir, 'png-on-dark', `${company.slug}.png`);
      const svgPath = path.join(logosDir, 'svg', `${company.slug}.svg`);

      if (!fs.existsSync(pngPath)) missingPng.push(company.slug);
      if (!fs.existsSync(pngDarkPath)) missingPngDark.push(company.slug);
      if (!fs.existsSync(svgPath)) missingSvg.push(company.slug);
    }

    expect(missingPng).toEqual([]);
    expect(missingPngDark).toEqual([]);
    expect(missingSvg).toEqual([]);
  });

  it('preserves licensing and attribution files for bundled brand icons', () => {
    expect(fs.existsSync(path.join(logosDir, 'FONT_AWESOME_LICENSE.txt'))).toBe(true);
    expect(fs.existsSync(path.join(logosDir, 'README.md'))).toBe(true);
  });
});
