#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ignore = require('ignore');

// Basic ANSI color codes
const RESET = '\x1b[0m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';

/**
 * Create an "ignore" instance that reads patterns from `.gitignore` in targetDir (if it exists).
 * @param {string} targetDir - The root directory whose .gitignore we respect
 * @returns {ignore.Ignore} An ignore instance configured by the contents of .gitignore
 */
function createIgnoreInstance(targetDir) {
  const ig = ignore();
  const gitignorePath = path.join(targetDir, '.gitignore');

  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    ig.add(gitignoreContent);
  }

  // Always ignore .git and node_modules
  ig.add(['.git', 'node_modules']);

  return ig;
}

/**
 * Recursively prints the directory structure of dirPath, ignoring files/folders from .gitignore
 * and skipping .git + node_modules by default.
 * @param {string} dirPath - Current directory to traverse.
 * @param {string} rootDir - The root directory (needed so we can build correct relative paths).
 * @param {ignore.Ignore} ig - The ignore instance configured by .gitignore.
 * @param {string[]} prefixParts - Prefix parts for indicating tree depth.
 */
function printStructure(dirPath, rootDir, ig, prefixParts = []) {
  const items = fs.readdirSync(dirPath);

  // Sort so directories appear first, then files; both alphabetically
  items.sort((a, b) => {
    const aIsDir = fs.statSync(path.join(dirPath, a)).isDirectory();
    const bIsDir = fs.statSync(path.join(dirPath, b)).isDirectory();
    if (aIsDir && !bIsDir) return -1;
    if (!aIsDir && bIsDir) return 1;
    return a.localeCompare(b);
  });

  items.forEach((item, index) => {
    const fullPath = path.join(dirPath, item);
    const relativePath = path.relative(rootDir, fullPath);

    if (ig.ignores(relativePath)) return;

    const isLast = index === items.length - 1;
    const stats = fs.statSync(fullPath);

    const prefix = prefixParts.join('') + (isLast ? '└── ' : '├── ');
    const nextPrefixParts = [...prefixParts, isLast ? '    ' : '│   '];

    if (stats.isDirectory()) {
      console.log(`${prefix}${CYAN}${item}/${RESET}`);
      printStructure(fullPath, rootDir, ig, nextPrefixParts);
    } else {
      console.log(`${prefix}${YELLOW}${item}${RESET}`);
    }
  });
}

if (require.main === module) {
  const targetDir = process.argv[2] || '.';
  const resolvedDir = path.resolve(targetDir);
  const ig = createIgnoreInstance(resolvedDir);

  console.log(`${CYAN}${path.basename(resolvedDir)}/${RESET}`);
  printStructure(resolvedDir, resolvedDir, ig);
}

module.exports = { printStructure };