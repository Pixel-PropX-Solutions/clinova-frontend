const fs = require('fs');
const path = require('path');

const srcDir = 'd:\\coding\\clients\\clinova-frontend\\src';

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else if (name.endsWith('.tsx') || name.endsWith('.jsx')) {
      files.push(name);
    }
  }
  return files;
}

const files = getFiles(srcDir);
const results = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  let i = 0;
  while (i < content.length) {
    if (content.startsWith('<Button', i) || content.startsWith('<button', i)) {
      const isWord = (content[i + 7] === ' ' || content[i + 7] === '>' || content[i + 7] === '\t' || content[i + 7] === '\n' || content[i + 6] === 'o'); // button vs Button
      const name = content.startsWith('<Button', i) ? 'Button' : 'button';
      const offset = name.length + 1;

      let tagContent = name;
      let j = i + offset;
      let braceDepth = 0;
      let inString = null;

      while (j < content.length) {
        const char = content[j];
        
        if (inString) {
          if (char === inString) inString = null;
        } else {
          if (char === '"' || char === "'" || char === '`') inString = char;
          else if (char === '{') braceDepth++;
          else if (char === '}') braceDepth--;
          else if (char === '>' && braceDepth === 0) {
            tagContent += content.slice(i + offset, j);
            break;
          }
        }
        j++;
      }

      const attrs = tagContent;
      const hasOnClick = /onClick\b/.test(attrs);
      
      let isSuspicious = false;
      let reason = '';

      if (!hasOnClick) {
        const isSubmit = /type\s*=\s*["']submit["']/.test(attrs);
        const isAsChild = /asChild/.test(attrs);
        const isComponent = name === 'Button'; 
        
        if (!isSubmit && !isAsChild) {
           isSuspicious = true;
           reason = 'No onClick found';
        }
      } else {
        const onClickMatch = attrs.match(/onClick\s*=\s*\{([\s\S]*?)\}/);
        if (onClickMatch) {
           const val = onClickMatch[1].trim();
           if (val === '() => {}' || val.includes('console.log') || val === 'undefined' || val === 'null' || val === '()=>{}') {
              isSuspicious = true;
              reason = `Placeholder onClick: ${val}`;
           }
        }
      }

      const linesBefore = content.slice(0, i).split('\n');
      const lineNumber = linesBefore.length;

      // Always save for debugging
      results.push({
        file: path.relative(srcDir, file),
        line: lineNumber,
        tag: name,
        attrs: attrs.replace(/\s+/g, ' ').trim(),
        hasOnClick: hasOnClick,
        reason: reason || (hasOnClick ? 'Found onClick' : 'No onClick')
      });

      i = j; // jump to end of tag
    } else {
      i++;
    }
  }
});

fs.writeFileSync('results_all.json', JSON.stringify(results, null, 2), 'utf-8');

// Filter for suspicious ones
const suspicious = results.filter(r => {
  const isSubmit = /type\s*=\s*["']submit["']/.test(r.attrs);
  const isAsChild = /asChild/.test(r.attrs);
  
  if (!r.hasOnClick) {
     return !isSubmit && !isAsChild && r.tag !== 'components\\ui\\button.tsx'; // exclude base definition file if you want
  } else {
     const onClickMatch = r.attrs.match(/onClick\s*=\s*\{([\s\S]*?)\}/);
     if (onClickMatch) {
       const val = onClickMatch[1].trim();
       return val === '() => {}' || val.includes('console.log') || val === 'undefined';
     }
  }
  return false;
});

fs.writeFileSync('results.json', JSON.stringify(suspicious, null, 2), 'utf-8');
console.log(`Found ${results.length} total buttons, ${suspicious.length} suspicious`);
