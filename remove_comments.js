const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Remove single line JSX comments like {/* Comment */}
  content = content.replace(/^[ \t]*\{\/\*.*?\*\/\}[ \t]*\r?\n/gm, '');
  // Remove trailing JSX comments like <div /> {/* Comment */}
  content = content.replace(/[ \t]*\{\/\*.*?\*\/\}/g, '');
  
  // Remove single line JS comments like // Comment
  // But preserve eslint rules
  content = content.split('\n').map(line => {
    if (line.includes('eslint-disable')) return line;
    
    // Check if it's a full line comment
    if (line.match(/^[ \t]*\/\//)) {
      return null;
    }
    
    // Check for trailing comments (basic handling)
    const commentIdx = line.indexOf('//');
    if (commentIdx !== -1 && !line.includes('://')) {
      return line.substring(0, commentIdx).replace(/\s+$/, '');
    }
    return line;
  }).filter(line => line !== null).join('\n');
  
  fs.writeFileSync(file, content);
});

console.log('Comments removed from ' + files.length + ' files.');
