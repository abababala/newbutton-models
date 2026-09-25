const fs = require('fs');
const path = require('path');

function stripQuotes(val) {
  return val.trim().replace(/^["']|["']$/g, '');
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const lines = match[1].split('\n');
  const obj = {};
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) { i++; continue; }

    const key = line.slice(0, colonIdx).trim();
    const rest = line.slice(colonIdx + 1).trim();

    if (rest === '') {
      // Possible block: either a "- image: ..." list (CMS "list" widget with
      // a sub-field) or a plain "- ..." list of scalars.
      const items = [];
      let j = i + 1;
      while (j < lines.length && /^\s*-\s/.test(lines[j])) {
        const itemLine = lines[j].replace(/^\s*-\s*/, '');
        const subColon = itemLine.indexOf(':');
        if (subColon !== -1) {
          // "- image: /images/models/foo.jpg" -> take the value
          items.push(stripQuotes(itemLine.slice(subColon + 1)));
        } else {
          items.push(stripQuotes(itemLine));
        }
        j++;
      }
      obj[key] = items;
      i = j;
    } else {
      obj[key] = stripQuotes(rest);
      i++;
    }
  }
  return obj;
}

module.exports = {
  onPreBuild: ({ utils }) => {
    const modelsDir = path.join(process.cwd(), 'models');
    if (!fs.existsSync(modelsDir)) return;

    const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.md'));
    const models = files.map(f => {
      const raw = fs.readFileSync(path.join(modelsDir, f), 'utf8');
      const meta = parseFrontmatter(raw);
      if (!meta) return null;
      const gallery = Array.isArray(meta.images) ? meta.images.filter(Boolean) : [];
      const mainImage = meta.image || '';
      return {
        name: meta.name || '',
        gender: (meta.gender || 'women').toLowerCase(),
        category: meta.category || '',
        image: mainImage,
        // Full photo set: main cover photo first, then any gallery extras.
        images: [mainImage, ...gallery].filter(Boolean),
        height: meta.height || '',
        city: meta.city || '',
        active: meta.active !== 'false',
      };
    }).filter(m => m && m.active);

    fs.writeFileSync(path.join(modelsDir, 'models.json'), JSON.stringify(models, null, 2));
    console.log(`Built models.json with ${models.length} active model(s).`);
  },
};
