// Renders model cards on the homepage.
// Decap CMS (the /admin dashboard) writes one small text file per model into
// /models/*.md. A Netlify Build Plugin (netlify/plugins/build-models-json)
// runs automatically on every publish and combines them into
// /models/models.json, which this script fetches. You never touch this file
// or run any build step yourself — it's all automatic once deployed.

const FALLBACK_MODELS = [
  { name: "Amara O.", category: "Runway", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80" },
  { name: "Tomiwa K.", category: "Editorial", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80" },
  { name: "Zainab I.", category: "Streetwear", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&q=80" },
  { name: "Kwame D.", category: "Runway", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80" },
];

async function loadModels() {
  const grid = document.getElementById('model-grid');
  let models = FALLBACK_MODELS;
  try {
    const res = await fetch('/models/models.json', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length) models = data;
    }
  } catch (e) {
    // stay on fallback silently — page still looks complete
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
