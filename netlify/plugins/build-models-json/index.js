const fs = require('fs');
const path = require('path');

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const obj = {};
  match[1].split('\n').forEach(line => {
    const i = line.indexOf(':');
    if (i === -1) return;
    const key = line.slice(0, i).trim();
    const val = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    obj[key] = val;
  });
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
      return {
        name: meta.name || '',
        category: meta.category || '',
        image: meta.image || '',
        height: meta.height || '',
        city: meta.city || '',
        active: meta.active !== 'false',
      };
    }).filter(m => m && m.active);

    fs.writeFileSync(path.join(modelsDir, 'models.json'), JSON.stringify(models, null, 2));
    console.log(`Built models.json with ${models.length} active model(s).`);
  },
};
