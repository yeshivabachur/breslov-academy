import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const indexPath = path.join(root, 'docs', 'v11', 'V11_MASTER_FEATURE_INDEX.md');
const featureConfigPath = path.join(root, 'src', 'components', 'config', 'features.jsx');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(indexPath)) {
  fail(`Missing ${indexPath}`);
}
if (!fs.existsSync(featureConfigPath)) {
  fail(`Missing ${featureConfigPath}`);
}

const content = fs.readFileSync(indexPath, 'utf8');
const startMarker = '<!-- V11_FEATURE_INDEX_START -->';
const endMarker = '<!-- V11_FEATURE_INDEX_END -->';

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);
if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
  fail('Missing feature index markers in V11_MASTER_FEATURE_INDEX.md');
}

const segment = content.slice(startIdx + startMarker.length, endIdx);
const lines = segment.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.startsWith('|'));
if (lines.length < 3) {
  fail('Feature index table is missing or incomplete');
}

const header = lines[0].split('|').map((cell) => cell.trim()).filter(Boolean);
const requiredHeaders = [
  'Feature ID',
  'Registry Key',
  'Name',
  'Roles',
  'Priority',
  'Status',
  'Owner',
  'Dependencies',
  'Acceptance Tests',
  'Migration Impact',
  'UX Surfaces',
  'API/Events'
];

requiredHeaders.forEach((col) => {
  if (!header.includes(col)) {
    fail(`Missing required column: ${col}`);
  }
});

const colIndex = Object.fromEntries(header.map((col, idx) => [col, idx]));
const rows = lines.slice(2).map((line) => {
  const cells = line.split('|').map((cell) => cell.trim()).filter(Boolean);
  const row = {};
  header.forEach((col) => {
    row[col] = cells[colIndex[col]] || '';
  });
  return row;
});

const ids = new Set();
const registryKeys = new Set();
const errors = [];

const isBlank = (value) => {
  const normalized = String(value || '').trim();
  return !normalized || normalized.toLowerCase() === 'tbd' || normalized === '-';
};

rows.forEach((row) => {
  if (!row['Feature ID']) {
    errors.push('Row missing Feature ID');
    return;
  }
  if (ids.has(row['Feature ID'])) {
    errors.push(`Duplicate Feature ID: ${row['Feature ID']}`);
  }
  ids.add(row['Feature ID']);

  const registryKey = row['Registry Key'];
  if (registryKey && registryKey !== 'N/A') {
    registryKeys.add(registryKey);
  }

  if (row['Priority'] === 'P0') {
    if (isBlank(row['Owner'])) {
      errors.push(`P0 missing Owner: ${row['Feature ID']} (${row['Name']})`);
    }
    if (isBlank(row['Acceptance Tests'])) {
      errors.push(`P0 missing Acceptance Tests: ${row['Feature ID']} (${row['Name']})`);
    }
  }
});

const featureConfig = fs.readFileSync(featureConfigPath, 'utf8');
const configKeys = new Set();
const keyRegex = /key:\s*'([^']+)'/g;
let match = null;
while ((match = keyRegex.exec(featureConfig))) {
  configKeys.add(match[1]);
}

const missingRegistryKeys = Array.from(configKeys).filter((key) => !registryKeys.has(key));
if (missingRegistryKeys.length > 0) {
  errors.push(`Missing registry keys in feature index: ${missingRegistryKeys.join(', ')}`);
}

if (errors.length > 0) {
  console.error('Spec validation failed:');
  errors.forEach((err) => console.error(`- ${err}`));
  process.exit(1);
}

console.log('Spec validation passed.');
