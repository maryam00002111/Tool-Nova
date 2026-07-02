// ============================================================
// TOOLNOVA — shared site behavior
// ============================================================

// ---- Theme toggle (persists for the session) ----
(function initTheme() {
  const stored = sessionStorage.getItem('tn-theme');
  const theme = stored || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.textContent = theme === 'dark' ? '☾' : '☀';
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      sessionStorage.setItem('tn-theme', next);
      btn.textContent = next === 'dark' ? '☾' : '☀';
    });
  });
})();

// ---- Mobile nav burger ----
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');
  if (burger && links) {
    burger.addEventListener('click', () => links.classList.toggle('open'));
  }
});

// ---- FAQ accordion ----
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
});

// ---- Back to top ----
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 500);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});

// ---- Scroll reveal ----
document.addEventListener('DOMContentLoaded', () => {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
});

// ---- Toasts ----
function tnToast(message, type = 'default') {
  let stack = document.querySelector('.toast-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    document.body.appendChild(stack);
  }
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  stack.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    el.style.transition = 'opacity .2s ease, transform .2s ease';
    setTimeout(() => el.remove(), 200);
  }, 2600);
}

// ---- Copy to clipboard helper ----
function tnCopy(text, label = 'Copied to clipboard') {
  navigator.clipboard.writeText(text).then(
    () => tnToast(label, 'success'),
    () => tnToast('Could not copy — select and copy manually', 'error')
  );
}

// ---- Site-wide tool + category search (used on homepage + tools hub) ----
const TOOL_INDEX = [
  { name: 'Merge PDF', cat: 'PDF Tools', href: 'tools.html#merge-pdf', icon: '📄' },
  { name: 'Split PDF', cat: 'PDF Tools', href: 'tools.html#split-pdf', icon: '📄' },
  { name: 'Rotate PDF', cat: 'PDF Tools', href: 'tools.html#rotate-pdf', icon: '📄' },
  { name: 'Compress PDF', cat: 'PDF Tools', href: 'tools.html#compress-pdf', icon: '📄' },
  { name: 'Image to PDF', cat: 'PDF Tools', href: 'tools.html#pdf-tools', icon: '📄' },
  { name: 'Word Counter', cat: 'Text Tools', href: 'tools.html#word-counter', icon: '📝' },
  { name: 'Character Counter', cat: 'Text Tools', href: 'tools.html#char-counter', icon: '🔤' },
  { name: 'Case Converter', cat: 'Text Tools', href: 'tools.html#case-converter', icon: '🔠' },
  { name: 'Remove Duplicate Lines', cat: 'Text Tools', href: 'tools.html#dedupe-lines', icon: '📋' },
  { name: 'Remove Extra Spaces', cat: 'Text Tools', href: 'tools.html#trim-spaces', icon: '␣' },
  { name: 'Text Sorter', cat: 'Text Tools', href: 'tools.html#text-sorter', icon: '↕' },
  { name: 'Line Counter', cat: 'Text Tools', href: 'tools.html#line-counter', icon: '≡' },
  { name: 'Lorem Ipsum Generator', cat: 'Text Tools', href: 'tools.html#lorem-ipsum', icon: '📄' },
  { name: 'Random Text Generator', cat: 'Text Tools', href: 'tools.html#random-text-generator', icon: '🎲' },
  { name: 'Password Generator', cat: 'Text Tools', href: 'tools.html#password-generator', icon: '🔒' },
  { name: 'UUID Generator', cat: 'Developer Tools', href: 'tools.html#uuid-generator', icon: '🆔' },
  { name: 'JSON Formatter & Validator', cat: 'Developer Tools', href: 'tools.html#json-formatter', icon: '{ }' },
  { name: 'Base64 Encoder / Decoder', cat: 'Developer Tools', href: 'tools.html#base64', icon: '⇄' },
  { name: 'URL Encoder / Decoder', cat: 'Developer Tools', href: 'tools.html#url-encode', icon: '🔗' },
  { name: 'HTML Encoder / Decoder', cat: 'Developer Tools', href: 'tools.html#html-encode', icon: '</>' },
  { name: 'CSS Minifier', cat: 'Developer Tools', href: 'tools.html#css-minifier', icon: '🎨' },
  { name: 'JavaScript Minifier', cat: 'Developer Tools', href: 'tools.html#js-minifier', icon: 'JS' },
  { name: 'XML Formatter', cat: 'Developer Tools', href: 'tools.html#xml-formatter', icon: '⟨/⟩' },
  { name: 'Markdown to HTML', cat: 'Developer Tools', href: 'tools.html#markdown-html', icon: 'M↓' },
  { name: 'QR Code Generator', cat: 'QR Tools', href: 'tools.html#qr-generator', icon: '▦' },
  { name: 'Color Picker', cat: 'Color Tools', href: 'tools.html#color-picker', icon: '🎨' },
  { name: 'HEX ↔ RGB Converter', cat: 'Color Tools', href: 'tools.html#hex-rgb', icon: '#' },
  { name: 'Gradient Generator', cat: 'Color Tools', href: 'tools.html#gradient-generator', icon: '🌈' },
  { name: 'Image Compressor', cat: 'Image Tools', href: 'tools.html#image-compressor', icon: '🖼' },
  { name: 'Image Resizer', cat: 'Image Tools', href: 'tools.html#image-resizer', icon: '📐' },
  { name: 'JPG ↔ PNG Converter', cat: 'Image Tools', href: 'tools.html#image-convert', icon: '🔄' },
  { name: 'Crop Image', cat: 'Image Tools', href: 'tools.html#image-crop', icon: '✂️' },
  { name: 'Rotate Image', cat: 'Image Tools', href: 'tools.html#image-rotate', icon: '🔃' },
  { name: 'QR Code Scanner', cat: 'QR Tools', href: 'tools.html#qr-scanner', icon: '▦' },
  { name: 'Scientific Calculator', cat: 'Calculators', href: 'tools.html#scientific-calculator', icon: '🧮' },
  { name: 'Age Calculator', cat: 'Calculators', href: 'tools.html#age-calculator', icon: '🎂' },
  { name: 'BMI Calculator', cat: 'Calculators', href: 'tools.html#bmi-calculator', icon: '⚖' },
  { name: 'Percentage Calculator', cat: 'Calculators', href: 'tools.html#percentage-calculator', icon: '%' },
  { name: 'Discount Calculator', cat: 'Calculators', href: 'tools.html#discount-calculator', icon: '🏷' },
  { name: 'EMI / Loan Calculator', cat: 'Calculators', href: 'tools.html#loan-calculator', icon: '🏦' },
];

function initSiteSearch(inputId, resultsId) {
  const input = document.getElementById(inputId);
  const results = document.getElementById(resultsId);
  if (!input || !results) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.innerHTML = ''; results.style.display = 'none'; return; }
    const matches = TOOL_INDEX.filter(t => t.name.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q)).slice(0, 8);
    if (!matches.length) {
      results.innerHTML = `<div style="padding:14px;color:var(--muted);font-size:13.5px;">No tools match "${q}"</div>`;
    } else {
      results.innerHTML = matches.map(t => `
        <a href="${t.href}" style="display:flex;align-items:center;gap:10px;padding:10px 14px;font-size:14px;border-bottom:1px solid var(--border);">
          <span>${t.icon}</span><span>${t.name}</span><span style="margin-left:auto;color:var(--muted);font-size:11.5px;">${t.cat}</span>
        </a>`).join('');
    }
    results.style.display = 'block';
  });
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !results.contains(e.target)) results.style.display = 'none';
  });
}
