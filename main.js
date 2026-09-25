// Sidebar menu
function setupMenu() {
  const openBtn = document.getElementById('menu-open');
  const closeBtn = document.getElementById('menu-close');
  const overlay = document.getElementById('menu-overlay');
  openBtn.addEventListener('click', () => overlay.classList.add('open'));
  closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => overlay.classList.remove('open'));
  });
}

// Model gender tabs
let currentGender = 'women';
let allModels = [];
let modelsLoaded = false;

function renderModels() {
  const grid = document.getElementById('model-grid');
  const filtered = allModels.filter(m => (m.gender || 'women').toLowerCase() === currentGender);

  if (!modelsLoaded) {
    grid.innerHTML = `<div class="empty-state">Loading…</div>`;
    return;
  }

  if (!filtered.length) {
    grid.innerHTML = `<div class="empty-state">New faces coming soon.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(m => {
    const photos = Array.isArray(m.images) && m.images.length ? m.images : [m.image].filter(Boolean);
    const mainPhoto = photos[0] || '';
    return `
    <a class="model-card" href="#">
      <img src="${mainPhoto}" alt="${m.name}" loading="lazy">
      <div class="model-info">
        <div class="model-name">${m.name}</div>
        <div class="model-meta">${m.category || ''}${m.city ? ' · ' + m.city : ''}</div>
      </div>
    </a>
  `;
  }).join('');
}

function renderStats() {
  const statsEl = document.getElementById('agency-stats');
  if (!statsEl) return;
  const total = allModels.length;
  const women = allModels.filter(m => (m.gender || '').toLowerCase() === 'women').length;
  const men = allModels.filter(m => (m.gender || '').toLowerCase() === 'men').length;
  const cities = new Set(allModels.map(m => m.city).filter(Boolean)).size;

  statsEl.innerHTML = `
    <div class="stat"><div class="stat-num">${total}</div><div class="stat-label">Models</div></div>
    <div class="stat"><div class="stat-num">${women}</div><div class="stat-label">Women</div></div>
    <div class="stat"><div class="stat-num">${men}</div><div class="stat-label">Men</div></div>
    <div class="stat"><div class="stat-num">${cities}</div><div class="stat-label">Cities</div></div>
  `;
}

function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGender = btn.dataset.gender;
      renderModels();
    });
  });
}

// WOMEN | MEN hero links also jump to the matching tab
function setupHeroChoice() {
  document.querySelectorAll('.gender-choice a').forEach(link => {
    link.addEventListener('click', (e) => {
      const gender = link.dataset.gender;
      const tab = document.querySelector(`.tab-btn[data-gender="${gender}"]`);
      if (tab) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        tab.classList.add('active');
      }
      currentGender = gender;
      // Always re-render, whether or not models have finished loading yet —
      // once loadModels() resolves it calls renderModels() again with real data.
      renderModels();
    });
  });
}

async function loadModels() {
  try {
    const res = await fetch('/models/models.json', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) allModels = data;
    }
  } catch (e) {
    // stay empty silently
  }
  modelsLoaded = true;
  renderModels();
  renderStats();
}

// Get Scouted form — opens applicant's email app, pre-filled, addressed to the agency
function setupCastingForm() {
  const form = document.getElementById('casting-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name') || '';
    const email = data.get('email') || '';
    const gender = data.get('gender') || '';
    const height = data.get('height') || '';
    const city = data.get('city') || '';
    const message = data.get('message') || '';

    const subject = encodeURIComponent('Get Scouted — ' + name);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nGender: ${gender}\nHeight: ${height}\nCity: ${city}\n\nMessage:\n${message}\n\nReminder before sending: please attach two unedited photos (one close-up, one full length).`
    );
    window.location.href = `mailto:info@newbuttonmodels.com?subject=${subject}&body=${body}`;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupMenu();
  setupTabs();
  setupHeroChoice();
  setupCastingForm();
  loadModels();
});
