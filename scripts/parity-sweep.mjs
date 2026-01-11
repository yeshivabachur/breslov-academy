import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featureConfigPath = path.join(root, 'src', 'components', 'config', 'features.jsx');
const pagesConfigPath = path.join(root, 'src', 'pages.config.js');
const publicPagesDir = path.join(root, 'src', 'portals', 'public', 'pages');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(featureConfigPath)) {
  fail(`Missing ${featureConfigPath}`);
}
if (!fs.existsSync(pagesConfigPath)) {
  fail(`Missing ${pagesConfigPath}`);
}
if (!fs.existsSync(publicPagesDir)) {
  fail(`Missing ${publicPagesDir}`);
}

const featureConfig = fs.readFileSync(featureConfigPath, 'utf8');
const featureKeys = new Set();
const featureRoutes = [];

featureConfig.split(/\r?\n/).forEach((line) => {
  if (!line.includes('key:')) return;
  const keyMatch = /key:\s*'([^']+)'/.exec(line);
  const routeMatch = /route:\s*'([^']+)'/.exec(line);
  if (keyMatch) featureKeys.add(keyMatch[1]);
  if (routeMatch) featureRoutes.push(routeMatch[1]);

  const aliasMatch = /aliases:\s*\[([^\]]+)\]/.exec(line);
  if (aliasMatch) {
    const aliasValues = aliasMatch[1].match(/'([^']+)'/g) || [];
    aliasValues.forEach((alias) => {
      const cleaned = alias.replace(/'/g, '');
      if (cleaned) featureRoutes.push(cleaned);
    });
  }
});

const pagesConfig = fs.readFileSync(pagesConfigPath, 'utf8');
const pageKeys = new Set();
const pageKeyRegex = /"([A-Za-z0-9_]+)":/g;
let match = null;
while ((match = pageKeyRegex.exec(pagesConfig))) {
  pageKeys.add(match[1]);
}

const publicFiles = new Set(
  fs.readdirSync(publicPagesDir)
    .filter((name) => name.endsWith('.jsx'))
    .map((name) => name.replace(/\.jsx$/, ''))
);

const explicitPublicMap = new Map([
  ['LegalPrivacy', 'LegalPrivacy'],
  ['LegalTerms', 'LegalTerms']
]);

function matchesPublicPage(key) {
  if (explicitPublicMap.has(key)) {
    return publicFiles.has(explicitPublicMap.get(key));
  }
  if (key.startsWith('Public')) {
    return publicFiles.has(key);
  }
  if (key.endsWith('Public')) {
    const trimmed = key.replace(/Public$/, '');
    return publicFiles.has(trimmed);
  }
  return false;
}

const missingPages = [];
featureKeys.forEach((key) => {
  if (pageKeys.has(key)) return;
  if (matchesPublicPage(key)) return;
  missingPages.push(key);
});

const missingRegistry = [];
pageKeys.forEach((key) => {
  if (!featureKeys.has(key)) missingRegistry.push(key);
});

const routeCounts = new Map();
featureRoutes.forEach((route) => {
  routeCounts.set(route, (routeCounts.get(route) || 0) + 1);
});
const duplicateRoutes = Array.from(routeCounts.entries()).filter(([, count]) => count > 1);

if (missingPages.length > 0 || missingRegistry.length > 0 || duplicateRoutes.length > 0) {
  console.error('Parity sweep failed.');
  if (missingPages.length > 0) {
    console.error(`- Registry keys missing pages: ${missingPages.join(', ')}`);
  }
  if (missingRegistry.length > 0) {
    console.error(`- Pages missing registry keys: ${missingRegistry.join(', ')}`);
  }
  if (duplicateRoutes.length > 0) {
    const dupes = duplicateRoutes.map(([route, count]) => `${route} (${count})`);
    console.error(`- Duplicate routes in registry: ${dupes.join(', ')}`);
  }
  process.exit(1);
}

console.log('Parity sweep passed.');
