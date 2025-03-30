# 📁 Project Structure Tree

project-structure-tree is a simple CLI tool that prints a visual tree representation of a directory structure.

# Installation

```bash
npm install -g project-structure-tree
```
This will make the CLI commands project-structure-tree and pst available globally.

# Usage

```bash
project-structure-tree [target_directory]
```

or simply:

```bash
pst [target_directory]
```

If no directory is provided, it defaults to the current working directory.

## Example
```
pst .
my-project/
├── index.js
├── package.json
└── src/
    ├── components/
    └── utils/
```

## 🎯 Features

- Tree-style display of folders and files
- Ignores .gitignore, .git, and node_modules
- Color-coded output:
  - Cyan for directories
  - Yellow for files


