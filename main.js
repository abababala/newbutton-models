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
let currentGender = 'female';
let allModels = [];

function renderModels() {
  const grid = document.getElementById('model-grid');
  const filtered = allModels.filter(m => (m.gender || 'female').toLowerCase() === currentGender);

  if (!filtered.length) {
    grid.innerHTML = `<div class="empty-state">New faces coming soon.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(m => `
    <a class="model-card" href="#">
      <img src="${m.image}" alt="${m.name}" loading="lazy">
      <div class="model-info">
        <div class="model-name">${m.name}</div>
        <div class="model-meta">${m.category || ''}</div>
      </div>
    </a>
  `).join('');
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
        currentGender = gender;
        renderModels();
      }
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
  renderModels();
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
      `Name: ${name}\nEmail: ${email}\nGender: ${gender}\nHeight: ${height}\nCity: ${city}\n\nMessage:\n${message}`
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
