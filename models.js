// Renders model cards on the homepage.
// Decap CMS (the /admin dashboard) writes one small text file per model into
// /models/*.md. A Netlify Build Plugin combines them into /models/models.json
// automatically on every publish. This script reads that file.

async function loadModels() {
  const grid = document.getElementById('model-grid');
  let models = [];
  try {
    const res = await fetch('/models/models.json', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) models = data;
    }
  } catch (e) {
    // stay empty silently
  }

  if (!models.length) {
    grid.innerHTML = `<div class="empty-state">New faces coming soon.</div>`;
    return;
  }

  grid.innerHTML = models.map(m => `
    <a class="model-card" href="#">
      <img src="${m.image}" alt="${m.name}" loading="lazy">
      <div class="model-info">
        <div class="model-name">${m.name}</div>
        <div class="model-meta">${m.category || ''}</div>
      </div>
    </a>
  `).join('');
}

document.addEventListener('DOMContentLoaded', loadModels);
