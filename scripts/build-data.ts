import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Types ───────────────────────────────────────────────────────────────────────
interface CsvRow {
  ID: string;
  Title: string;
  Acceptance: string;
  Difficulty: string;
  Frequency: string;
  'Leetcode Question Link': string;
}

interface Question {
  id: number;
  title: string;
  acceptance: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  frequency: number;
  link: string;
}

interface CompanyMeta {
  slug: string;
  name: string;
  periods: string[];
  questionCount: number;
}

interface CompanyData {
  slug: string;
  name: string;
  periods: Record<string, Question[]>;
}

interface GlobalQuestion extends Question {
  companies: string[];
}

interface FileResult {
  file: string;
  company: string;
  period: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  warnings: string[];
}

interface Report {
  timestamp: string;
  totalFiles: number;
  totalFilesProcessed: number;
  totalFilesSkipped: number;
  totalRecords: number;
  totalValidRecords: number;
  totalInvalidRecords: number;
  totalDuplicateRecords: number;
  uniqueQuestions: number;
  uniqueCompanies: number;
  timePeriods: string[];
  files: FileResult[];
  errors: string[];
}

// ── Helpers ─────────────────────────────────────────────────────────────────────

const KNOWN_PERIODS = ['6months', '1year', '2year', 'alltime'];

const SPECIAL_NAMES: Record<string, string> = {
  'ibm': 'IBM',
  'hbo': 'HBO',
  'sap': 'SAP',
  'emc': 'EMC',
  'hrt': 'HRT',
  'c3ai': 'C3.ai',
  'c3-iot': 'C3 IoT',
  'de-shaw': 'D. E. Shaw',
  'ge-digital': 'GE Digital',
  'iit-bombay': 'IIT Bombay',
  'jpmorgan': 'JPMorgan',
  'jp-morgan-chase': 'JP Morgan Chase',
  'bytedancetoutiao': 'ByteDance/Toutiao',
  'bookingcom': 'Booking.com',
  'f5-networks': 'F5 Networks',
  'gsn-games': 'GSN Games',
  'maq-software': 'MAQ Software',
  'gilt-groupe': 'Gilt Groupe',
  'ponyai': 'Pony.ai',
  'uipath': 'UiPath',
  'vmware': 'VMware',
  'ixl': 'IXL',
};

function slugToName(slug: string): string {
  if (SPECIAL_NAMES[slug]) return SPECIAL_NAMES[slug];
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function parseFilename(filename: string): { company: string; period: string } | null {
  const base = path.basename(filename, '.csv');
  // Find the last underscore that separates company from period
  for (const period of KNOWN_PERIODS) {
    if (base.endsWith('_' + period)) {
      const company = base.slice(0, base.length - period.length - 1);
      return { company, period };
    }
  }
  return null;
}

let officialDifficulties: Record<number, 'Easy' | 'Medium' | 'Hard'> = {};
try {
  const diffPath = path.join(__dirname, 'leetcode-official-difficulties.json');
  if (fs.existsSync(diffPath)) {
    officialDifficulties = JSON.parse(fs.readFileSync(diffPath, 'utf8'));
  }
} catch (err) {
  console.warn('Could not load official difficulties file, using CSV values.');
}

function normalizeDifficulty(id: number, val: string): 'Easy' | 'Medium' | 'Hard' {
  if (officialDifficulties[id]) {
    return officialDifficulties[id];
  }
  const lower = val.trim().toLowerCase();
  if (lower === 'easy') return 'Easy';
  if (lower === 'medium') return 'Medium';
  if (lower === 'hard') return 'Hard';
  return 'Medium'; // fallback
}

function parseAcceptance(val: string): string {
  if (!val) return '0%';
  const trimmed = val.trim();
  if (trimmed.endsWith('%')) return trimmed;
  const num = parseFloat(trimmed);
  if (!isNaN(num)) return num.toFixed(1) + '%';
  return '0%';
}

function parseFrequency(val: string): number {
  if (!val) return 0;
  const num = parseFloat(val.trim());
  return isNaN(num) ? 0 : Math.round(num * 10000) / 10000;
}

function validateLink(link: string): string {
  if (!link) return '';
  const trimmed = link.trim();
  if (trimmed.startsWith('https://leetcode.com/problems/')) return trimmed;
  if (trimmed.startsWith('http://leetcode.com/problems/')) {
    return trimmed.replace('http://', 'https://');
  }
  return '';
}

// ── Main Pipeline ───────────────────────────────────────────────────────────────

function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const outDir = path.join(repoRoot, 'public', 'data');
  const companiesDir = path.join(outDir, 'companies');

  // Ensure output directories
  fs.mkdirSync(companiesDir, { recursive: true });

  // Discover all CSV files
  const allFiles = fs.readdirSync(repoRoot).filter(f => f.endsWith('.csv'));
  console.log(`\n📁 Discovered ${allFiles.length} CSV files\n`);

  const report: Report = {
    timestamp: new Date().toISOString(),
    totalFiles: allFiles.length,
    totalFilesProcessed: 0,
    totalFilesSkipped: 0,
    totalRecords: 0,
    totalValidRecords: 0,
    totalInvalidRecords: 0,
    totalDuplicateRecords: 0,
    uniqueQuestions: 0,
    uniqueCompanies: 0,
    timePeriods: [],
    files: [],
    errors: [],
  };

  // Company data accumulator
  const companyDataMap = new Map<string, CompanyData>();
  // Global question index: id → GlobalQuestion
  const globalQuestions = new Map<number, GlobalQuestion>();
  const allPeriods = new Set<string>();

  for (const file of allFiles) {
    const parsed = parseFilename(file);
    if (!parsed) {
      report.errors.push(`Could not parse filename: ${file}`);
      report.totalFilesSkipped++;
      continue;
    }

    const { company, period } = parsed;
    allPeriods.add(period);

    const filePath = path.join(repoRoot, file);
    const csvContent = fs.readFileSync(filePath, 'utf-8');

    const result = Papa.parse<CsvRow>(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h: string) => h.trim(),
    });

    const fileResult: FileResult = {
      file,
      company,
      period,
      totalRows: result.data.length,
      validRows: 0,
      invalidRows: 0,
      duplicateRows: 0,
      warnings: [],
    };

    // Ensure company data structure exists
    if (!companyDataMap.has(company)) {
      companyDataMap.set(company, {
        slug: company,
        name: slugToName(company),
        periods: {},
      });
    }

    const companyData = companyDataMap.get(company)!;
    if (!companyData.periods[period]) {
      companyData.periods[period] = [];
    }

    const seenIds = new Set<number>();

    for (const row of result.data) {
      report.totalRecords++;

      const idStr = row.ID?.toString().trim();
      if (!idStr) {
        fileResult.invalidRows++;
        report.totalInvalidRecords++;
        continue;
      }

      const id = parseInt(idStr, 10);
      if (isNaN(id) || id <= 0) {
        fileResult.invalidRows++;
        report.totalInvalidRecords++;
        fileResult.warnings.push(`Invalid ID: ${idStr}`);
        continue;
      }

      const title = row.Title?.trim();
      if (!title) {
        fileResult.invalidRows++;
        report.totalInvalidRecords++;
        fileResult.warnings.push(`Missing title for ID ${id}`);
        continue;
      }

      // Duplicate within same file
      if (seenIds.has(id)) {
        fileResult.duplicateRows++;
        report.totalDuplicateRecords++;
        continue;
      }
      seenIds.add(id);

      const question: Question = {
        id,
        title,
        acceptance: parseAcceptance(row.Acceptance),
        difficulty: normalizeDifficulty(id, row.Difficulty || 'Medium'),
        frequency: parseFrequency(row.Frequency),
        link: validateLink(row['Leetcode Question Link'] || ''),
      };

      companyData.periods[period].push(question);
      fileResult.validRows++;
      report.totalValidRecords++;

      // Update global index
      if (!globalQuestions.has(id)) {
        globalQuestions.set(id, {
          ...question,
          companies: [company],
        });
      } else {
        const existing = globalQuestions.get(id)!;
        if (!existing.companies.includes(company)) {
          existing.companies.push(company);
        }
        // Keep highest frequency
        if (question.frequency > existing.frequency) {
          existing.frequency = question.frequency;
        }
      }
    }

    report.files.push(fileResult);
    report.totalFilesProcessed++;

    // Progress output
    if (report.totalFilesProcessed % 50 === 0) {
      console.log(`  ✅ Processed ${report.totalFilesProcessed}/${allFiles.length} files...`);
    }
  }

  console.log(`  ✅ Processed ${report.totalFilesProcessed}/${allFiles.length} files total\n`);

  // Sort periods for each company and build meta
  const companiesMeta: CompanyMeta[] = [];
  const periodOrder = ['6months', '1year', '2year', 'alltime'];

  for (const [slug, data] of companyDataMap) {
    const periods = Object.keys(data.periods).sort(
      (a, b) => periodOrder.indexOf(a) - periodOrder.indexOf(b)
    );

    // Count unique questions across all periods and compute difficulty counts
    const uniqueQuestionsMap = new Map<number, Question>();
    const compDiffCounts = { Easy: 0, Medium: 0, Hard: 0 };
    for (const period of periods) {
      for (const q of data.periods[period]) {
        if (!uniqueQuestionsMap.has(q.id)) {
          uniqueQuestionsMap.set(q.id, q);
          compDiffCounts[q.difficulty]++;
        }
      }
    }

    companiesMeta.push({
      slug,
      name: data.name,
      periods,
      questionCount: uniqueQuestionsMap.size,
      difficultyCounts: compDiffCounts,
    });

    // Sort questions within each period by frequency desc
    for (const period of periods) {
      data.periods[period].sort((a, b) => b.frequency - a.frequency);
    }

    // Write company JSON
    fs.writeFileSync(
      path.join(companiesDir, `${slug}.json`),
      JSON.stringify(data)
    );
  }

  // Sort companies alphabetically
  companiesMeta.sort((a, b) => a.name.localeCompare(b.name));

  // Compute global difficulty counts
  const globalDifficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  for (const q of globalQuestions.values()) {
    globalDifficultyCounts[q.difficulty]++;
  }

  // Build index
  const index = {
    companies: companiesMeta,
    totalQuestions: globalQuestions.size,
    totalCompanies: companiesMeta.length,
    difficultyCounts: globalDifficultyCounts,
  };

  fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(index));

  // Build global questions list (sorted by number of companies desc)
  const globalQuestionsList = Array.from(globalQuestions.values())
    .map(q => ({
      ...q,
      companySlugs: q.companies,
      companyCount: q.companies.length,
    }))
    .sort((a, b) => b.companyCount - a.companyCount);

  fs.writeFileSync(path.join(outDir, 'questions.json'), JSON.stringify(globalQuestionsList));

  // Finalize report
  report.uniqueQuestions = globalQuestions.size;
  report.uniqueCompanies = companiesMeta.length;
  report.timePeriods = Array.from(allPeriods).sort(
    (a, b) => periodOrder.indexOf(a) - periodOrder.indexOf(b)
  );

  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));

  // Console summary
  console.log('═══════════════════════════════════════════════════════');
  console.log('  📊 CodeWise Data Ingestion Report');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  Total CSV files found:     ${report.totalFiles}`);
  console.log(`  Files processed:           ${report.totalFilesProcessed}`);
  console.log(`  Files skipped:             ${report.totalFilesSkipped}`);
  console.log(`  Total records parsed:      ${report.totalRecords}`);
  console.log(`  Valid records:             ${report.totalValidRecords}`);
  console.log(`  Invalid records:           ${report.totalInvalidRecords}`);
  console.log(`  Duplicate records:         ${report.totalDuplicateRecords}`);
  console.log(`  Unique questions:          ${report.uniqueQuestions}`);
  console.log(`  Unique companies:          ${report.uniqueCompanies}`);
  console.log(`  Time periods:              ${report.timePeriods.join(', ')}`);
  console.log('═══════════════════════════════════════════════════════');

  if (report.errors.length > 0) {
    console.log('\n⚠️  Errors:');
    report.errors.forEach(e => console.log(`   - ${e}`));
  }

  console.log(`\n✅ Output written to ${outDir}`);
  console.log(`   - index.json`);
  console.log(`   - questions.json`);
  console.log(`   - companies/ (${companiesMeta.length} files)`);
  console.log(`   - report.json\n`);
}

main();
