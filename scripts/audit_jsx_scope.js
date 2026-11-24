import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import traversePkg from '@babel/traverse';
const traverse = traversePkg.default || traversePkg;

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = getFiles('./src');
let totalErrors = 0;

console.log(`Auditing ${files.length} files in ./src for undeclared JSX components & identifiers...\n`);

files.forEach(filePath => {
  const code = fs.readFileSync(filePath, 'utf-8');
  try {
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx']
    });

    traverse(ast, {
      JSXOpeningElement(path) {
        const node = path.node;
        if (node.name.type === 'JSXIdentifier') {
          const name = node.name.name;
          // React components start with capital letter
          if (/^[A-Z]/.test(name)) {
            if (!path.scope.hasBinding(name)) {
              console.log(`[UNDEFINED JSX TAG] ${filePath}:${node.loc ? node.loc.start.line : '?'} -> <${name}> is not defined/imported!`);
              totalErrors++;
            }
          }
        }
      },
      Identifier(path) {
        // Also check if an identifier is used in expression context and undeclared
        const node = path.node;
        const parent = path.parent;
        // Skip properties, imports, declarations
        if (
          parent.type === 'MemberExpression' && parent.property === node && !parent.computed
        ) return;
        if (parent.type === 'ObjectProperty' && parent.key === node && !parent.shorthand) return;
        if (parent.type === 'FunctionDeclaration' && parent.id === node) return;
        if (parent.type === 'VariableDeclarator' && parent.id === node) return;
        if (parent.type === 'ImportSpecifier' || parent.type === 'ImportDefaultSpecifier') return;
        if (parent.type === 'JSXAttribute') return;

        const name = node.name;
        const globals = new Set([
          'console', 'window', 'document', 'fetch', 'setTimeout', 'clearTimeout', 
          'setInterval', 'clearInterval', 'localStorage', 'sessionStorage', 
          'Date', 'Math', 'JSON', 'Object', 'Array', 'String', 'Number', 'Boolean', 
          'Promise', 'Error', 'RegExp', 'Map', 'Set', 'FormData', 'Blob', 'URL', 
          'alert', 'confirm', 'prompt', 'navigator', 'location', 'history', 'Intl',
          'URLSearchParams', 'Event', 'CustomEvent', 'FileReader', 'AbortController',
          'encodeURIComponent', 'decodeURIComponent', 'parseInt', 'parseFloat', 'isNaN', 'isFinite'
        ]);

        if (globals.has(name)) return;

        // If capitalized and looks like an icon passed as prop e.g. { icon: FileCheck }
        if (/^[A-Z]/.test(name) && !path.scope.hasBinding(name)) {
          console.log(`[UNDEFINED IDENTIFIER] ${filePath}:${node.loc ? node.loc.start.line : '?'} -> '${name}' is not in scope!`);
          totalErrors++;
        }
      }
    });
  } catch (err) {
    console.error(`Parse error in ${filePath}: ${err.message}`);
    totalErrors++;
  }
});

console.log(`\nAudit completed. Total issues found: ${totalErrors}`);
