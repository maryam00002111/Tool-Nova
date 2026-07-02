// ============================================================
// TOOLNOVA — tool implementations (all client-side, no server, no paid APIs)
// ============================================================

/* ---------------- TEXT TOOLS ---------------- */

function updateWordCount() {
  const text = document.getElementById('wcInput').value;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const sentences = text.trim() ? (text.match(/[.!?]+(\s|$)/g) || []).length || (text.trim() ? 1 : 0) : 0;
  const minutes = words / 200;
  const timeStr = minutes < 1 ? Math.max(1, Math.round(minutes * 60)) + 's' : Math.round(minutes) + ' min';
  document.getElementById('wcWords').textContent = words;
  document.getElementById('wcChars').textContent = chars;
  document.getElementById('wcSentences').textContent = sentences;
  document.getElementById('wcTime').textContent = words ? timeStr : '0s';
}

function updateCharCount() {
  const text = document.getElementById('ccInput').value;
  document.getElementById('ccWith').textContent = text.length;
  document.getElementById('ccWithout').textContent = text.replace(/\s/g, '').length;
}

function updateLineCount() {
  const text = document.getElementById('lineInput').value;
  const lines = text ? text.split('\n') : [];
  const nonEmpty = lines.filter(l => l.trim().length > 0).length;
  document.getElementById('lineTotal').textContent = lines.length;
  document.getElementById('lineNonEmpty').textContent = nonEmpty;
  document.getElementById('lineEmpty').textContent = lines.length - nonEmpty;
}

function convertCase(mode) {
  const el = document.getElementById('caseInput');
  const t = el.value;
  if (mode === 'upper') el.value = t.toUpperCase();
  else if (mode === 'lower') el.value = t.toLowerCase();
  else if (mode === 'title') el.value = t.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase());
  else if (mode === 'sentence') el.value = t.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
  tnToast('Text converted', 'success');
}

function dedupeLines() {
  const el = document.getElementById('dedupeInput');
  const lines = el.value.split('\n');
  const seen = new Set();
  const out = [];
  for (const line of lines) {
    const key = line.trim();
    if (!seen.has(key)) { seen.add(key); out.push(line); }
  }
  el.value = out.join('\n');
  tnToast(`Removed ${lines.length - out.length} duplicate line(s)`, 'success');
}

function trimSpaces() {
  const el = document.getElementById('trimInput');
  el.value = el.value
    .split('\n')
    .map(l => l.replace(/\s+/g, ' ').trim())
    .filter(l => l.length)
    .join('\n');
  tnToast('Extra spaces removed', 'success');
}

function sortLines(mode) {
  const el = document.getElementById('sortInput');
  let lines = el.value.split('\n').filter(l => l.trim().length);
  if (mode === 'az') lines.sort((a, b) => a.localeCompare(b));
  else if (mode === 'za') lines.sort((a, b) => b.localeCompare(a));
  else if (mode === 'len') lines.sort((a, b) => a.length - b.length);
  el.value = lines.join('\n');
  tnToast('Sorted', 'success');
}

const LOREM_WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat".split(' ');
function generateLorem() {
  const count = Math.max(1, Math.min(20, parseInt(document.getElementById('loremCount').value) || 3));
  const paras = [];
  for (let p = 0; p < count; p++) {
    let words = [];
    const len = 40 + Math.floor(Math.random() * 30);
    for (let i = 0; i < len; i++) words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
    let sentence = words.join(' ');
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
    paras.push(sentence);
  }
  document.getElementById('loremOutput').value = paras.join('\n\n');
}

const RANDOM_WORDS = "time person year way day thing man world life hand part child eye woman place work week case point government company number group problem fact house system water home room mother area money story month book word body music paper history idea market process design garden light sound river mountain travel journey coffee culture science energy ocean forest island bridge signal engine planet future market question answer language color animal building weather season friend student teacher doctor computer phone letter picture window door street city village river cloud rain snow wind fire earth stone metal glass wood cotton silk paint brush canvas".split(' ');
function randomWordPick() { return RANDOM_WORDS[Math.floor(Math.random() * RANDOM_WORDS.length)]; }
function randomSentence() {
  const len = 6 + Math.floor(Math.random() * 7);
  let words = [];
  for (let i = 0; i < len; i++) words.push(randomWordPick());
  let s = words.join(' ');
  return s.charAt(0).toUpperCase() + s.slice(1) + '.';
}
function generateRandomText() {
  const type = document.getElementById('randType').value;
  const count = Math.max(1, Math.min(50, parseInt(document.getElementById('randCount').value) || 10));
  let out = '';
  if (type === 'words') {
    out = Array.from({ length: count }, randomWordPick).join(' ');
  } else if (type === 'sentences') {
    out = Array.from({ length: count }, randomSentence).join(' ');
  } else {
    out = Array.from({ length: count }, () => {
      const numSentences = 3 + Math.floor(Math.random() * 4);
      return Array.from({ length: numSentences }, randomSentence).join(' ');
    }).join('\n\n');
  }
  document.getElementById('randOutput').value = out;
  tnToast('Random text generated', 'success');
}

function generatePassword() {
  const len = parseInt(document.getElementById('pwLen').value);
  const useUpper = document.getElementById('pwUpper').checked;
  const useLower = document.getElementById('pwLower').checked;
  const useNum = document.getElementById('pwNum').checked;
  const useSym = document.getElementById('pwSym').checked;
  let charset = '';
  if (useUpper) charset += 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  if (useLower) charset += 'abcdefghijkmnopqrstuvwxyz';
  if (useNum) charset += '23456789';
  if (useSym) charset += '!@#$%^&*()_+-=[]{}';
  if (!charset) { tnToast('Select at least one character type', 'error'); return; }
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  let pw = '';
  for (let i = 0; i < len; i++) pw += charset[arr[i] % charset.length];
  document.getElementById('pwOutput').value = pw;
  tnToast('Password generated', 'success');
}

/* ---------------- DEVELOPER TOOLS ---------------- */

function generateUUIDs() {
  const count = Math.max(1, Math.min(50, parseInt(document.getElementById('uuidCount').value) || 5));
  const out = [];
  for (let i = 0; i < count; i++) out.push(crypto.randomUUID());
  document.getElementById('uuidOutput').value = out.join('\n');
}

function formatJSON() {
  const input = document.getElementById('jsonInput').value;
  const status = document.getElementById('jsonStatus');
  try {
    const parsed = JSON.parse(input);
    document.getElementById('jsonInput').value = JSON.stringify(parsed, null, 2);
    status.textContent = '✓ Valid JSON';
    status.style.color = 'var(--success)';
  } catch (e) {
    status.textContent = '✕ ' + e.message;
    status.style.color = 'var(--danger)';
  }
}

function base64Encode() {
  const el = document.getElementById('b64Input');
  try { el.value = btoa(unescape(encodeURIComponent(el.value))); tnToast('Encoded', 'success'); }
  catch (e) { tnToast('Could not encode this text', 'error'); }
}
function base64Decode() {
  const el = document.getElementById('b64Input');
  try { el.value = decodeURIComponent(escape(atob(el.value))); tnToast('Decoded', 'success'); }
  catch (e) { tnToast('Invalid Base64 input', 'error'); }
}

function urlEncode() {
  const el = document.getElementById('urlInput');
  el.value = encodeURIComponent(el.value);
}
function urlDecode() {
  const el = document.getElementById('urlInput');
  try { el.value = decodeURIComponent(el.value); }
  catch (e) { tnToast('Invalid encoded URL', 'error'); }
}

function htmlEncode() {
  const el = document.getElementById('htmlInput');
  el.value = el.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function htmlDecode() {
  const el = document.getElementById('htmlInput');
  const txt = document.createElement('textarea');
  txt.innerHTML = el.value;
  el.value = txt.value;
}

function minifyCSS() {
  const el = document.getElementById('cssInput');
  el.value = el.value
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .replace(/\s+/g, ' ')
    .trim();
  tnToast('CSS minified', 'success');
}

function minifyJS() {
  const el = document.getElementById('jsInput');
  el.value = el.value
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
    .replace(/\n\s*/g, '\n')
    .replace(/\s{2,}/g, ' ')
    .trim();
  tnToast('JavaScript minified (basic pass)', 'success');
}

function formatXML() {
  const input = document.getElementById('xmlInput').value.trim();
  const status = document.getElementById('xmlStatus');
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, 'application/xml');
    if (doc.querySelector('parsererror')) throw new Error('Malformed XML');
    let formatted = '';
    let indent = '';
    const nodes = input.replace(/>\s*</g, '><').split(/(?=<)/);
    nodes.forEach(node => {
      if (node.match(/^<\/\w/)) indent = indent.substring(2);
      formatted += indent + node + '\n';
      if (node.match(/^<\w[^>]*[^\/]>$/) && !node.match(/^<\?/)) indent += '  ';
    });
    document.getElementById('xmlInput').value = formatted.trim();
    status.textContent = '✓ Formatted';
    status.style.color = 'var(--success)';
  } catch (e) {
    status.textContent = '✕ ' + e.message;
    status.style.color = 'var(--danger)';
  }
}

function convertMarkdown() {
  let md = document.getElementById('mdInput').value;
  let html = md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => '<ul>\n' + m + '</ul>\n');
  html = html.split('\n').map(line => {
    if (line.match(/^<(h1|h2|h3|ul|li|\/ul)/)) return line;
    if (line.trim() === '') return '';
    return '<p>' + line + '</p>';
  }).filter(Boolean).join('\n');
  document.getElementById('mdOutput').value = html;
}

/* ---------------- QR TOOLS ---------------- */

function generateQR() {
  const text = document.getElementById('qrInput').value.trim();
  const out = document.getElementById('qrOutput');
  if (!text) { tnToast('Enter a link or text first', 'error'); return; }
  if (typeof qrcode === 'undefined') { tnToast('QR library failed to load — check your connection', 'error'); return; }
  const qr = qrcode(0, 'M');
  qr.addData(text);
  qr.make();
  out.innerHTML = qr.createSvgTag(6, 0);
  const svg = out.querySelector('svg');
  if (svg) {
    svg.style.background = '#fff';
    svg.style.borderRadius = '8px';
    svg.style.padding = '12px';
  }
  const dlBtn = document.createElement('button');
  dlBtn.className = 'btn btn-ghost btn-sm';
  dlBtn.style.marginTop = '12px';
  dlBtn.textContent = 'Download PNG';
  dlBtn.onclick = () => downloadQRAsPng(svg, text);
  out.appendChild(dlBtn);
}

function downloadQRAsPng(svgEl, name) {
  const svgData = new XMLSerializer().serializeToString(svgEl);
  const img = new Image();
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  img.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = img.width; canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    const a = document.createElement('a');
    a.download = 'toolnova-qr.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  };
  img.src = url;
}

/* ---------------- COLOR TOOLS ---------------- */

function hexToRgbVals(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  return [num >> 16 & 255, num >> 8 & 255, num & 255];
}
function rgbToHexVals(r, g, b) {
  return '#' + [r, g, b].map(x => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0')).join('').toUpperCase();
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function updatePicker() {
  const hex = document.getElementById('pickerInput').value;
  const [r, g, b] = hexToRgbVals(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  document.getElementById('pickHex').textContent = hex.toUpperCase();
  document.getElementById('pickRgb').textContent = `${r},${g},${b}`;
  document.getElementById('pickHsl').textContent = `${h},${s}%,${l}%`;
}

function hexToRgb() {
  const hex = document.getElementById('hexInput').value.trim();
  if (!/^#?[0-9A-Fa-f]{3}$|^#?[0-9A-Fa-f]{6}$/.test(hex)) return;
  const [r, g, b] = hexToRgbVals(hex);
  document.getElementById('rgbInput').value = `${r},${g},${b}`;
  document.getElementById('hexRgbSwatch').style.background = hex.startsWith('#') ? hex : '#' + hex;
}
function rgbToHex() {
  const parts = document.getElementById('rgbInput').value.split(',').map(v => parseInt(v.trim()));
  if (parts.length !== 3 || parts.some(isNaN)) return;
  const hex = rgbToHexVals(...parts);
  document.getElementById('hexInput').value = hex;
  document.getElementById('hexRgbSwatch').style.background = hex;
}

function updateGradient() {
  const a = document.getElementById('gradA').value;
  const b = document.getElementById('gradB').value;
  const angle = document.getElementById('gradAngle').value;
  document.getElementById('gradAngleVal').textContent = angle;
  const css = `linear-gradient(${angle}deg, ${a}, ${b})`;
  document.getElementById('gradPreview').style.background = css;
  document.getElementById('gradCode').value = `background: ${css};`;
}
document.addEventListener('DOMContentLoaded', () => { if (document.getElementById('gradPreview')) updateGradient(); });

/* ---------------- IMAGE CROP ---------------- */

let cropState = { img: null, canvas: null, ctx: null, displayScale: 1, start: null, end: null, dragging: false };

function loadCropImage(input) {
  const file = input.files[0];
  if (!file) return;
  loadImageFile(file).then(img => {
    const canvas = document.getElementById('cropCanvas');
    const maxW = 520;
    const scale = Math.min(1, maxW / img.width);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    cropState = { img, canvas, ctx, displayScale: scale, start: null, end: null, dragging: false };
    attachCropEvents(canvas);
    document.getElementById('cropResult').innerHTML = '';
  });
}

function attachCropEvents(canvas) {
  const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * (canvas.width / rect.width), y: (clientY - rect.top) * (canvas.height / rect.height) };
  };
  const start = (e) => { e.preventDefault(); cropState.dragging = true; cropState.start = getPos(e); cropState.end = cropState.start; };
  const move = (e) => { if (!cropState.dragging) return; e.preventDefault(); cropState.end = getPos(e); redrawCrop(); };
  const end = () => { cropState.dragging = false; };
  canvas.onmousedown = start; canvas.onmousemove = move; canvas.onmouseup = end; canvas.onmouseleave = end;
  canvas.ontouchstart = start; canvas.ontouchmove = move; canvas.ontouchend = end;
}

function redrawCrop() {
  const { img, ctx, canvas, start, end } = cropState;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  if (start && end) {
    ctx.strokeStyle = '#FF6B4A'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
    const x = Math.min(start.x, end.x), y = Math.min(start.y, end.y);
    const w = Math.abs(end.x - start.x), h = Math.abs(end.y - start.y);
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = 'rgba(255,107,74,0.15)';
    ctx.fillRect(x, y, w, h);
  }
}

function resetCropSelection() { cropState.start = null; cropState.end = null; if (cropState.ctx) redrawCrop(); }

function applyCrop() {
  const { img, start, end, displayScale } = cropState;
  const result = document.getElementById('cropResult');
  if (!img) { tnToast('Choose an image first', 'error'); return; }
  if (!start || !end) { tnToast('Drag on the image to select a crop area', 'error'); return; }
  const x = Math.min(start.x, end.x) / displayScale, y = Math.min(start.y, end.y) / displayScale;
  const w = Math.abs(end.x - start.x) / displayScale, h = Math.abs(end.y - start.y) / displayScale;
  if (w < 2 || h < 2) { tnToast('Selection too small', 'error'); return; }
  const out = document.createElement('canvas');
  out.width = w; out.height = h;
  out.getContext('2d').drawImage(img, x, y, w, h, 0, 0, w, h);
  const dataUrl = out.toDataURL('image/png');
  result.innerHTML = `<img src="${dataUrl}" style="max-width:220px;border-radius:8px;border:1px solid var(--border);margin-bottom:10px;">`;
  const a = document.createElement('a');
  a.className = 'btn btn-ghost btn-sm'; a.style.display = 'inline-block';
  a.textContent = 'Download';
  a.href = dataUrl; a.download = 'cropped.png';
  result.appendChild(a);
  document.getElementById('cropInput').value = '';
  tnToast('Image cropped', 'success');
}

/* ---------------- IMAGE ROTATE ---------------- */

async function rotateImage(angle) {
  const input = document.getElementById('rotateImgInput');
  const result = document.getElementById('rotateImgResult');
  if (!input.files[0]) { tnToast('Choose an image first', 'error'); return; }
  const img = await loadImageFile(input.files[0]);
  const rad = angle * Math.PI / 180;
  const swap = Math.abs(angle) === 90;
  const canvas = document.createElement('canvas');
  canvas.width = swap ? img.height : img.width;
  canvas.height = swap ? img.width : img.height;
  const ctx = canvas.getContext('2d');
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rad);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  const dataUrl = canvas.toDataURL('image/png');
  result.innerHTML = `<img src="${dataUrl}" style="max-width:220px;border-radius:8px;border:1px solid var(--border);margin-bottom:10px;">`;
  const a = document.createElement('a');
  a.className = 'btn btn-ghost btn-sm'; a.style.display = 'inline-block';
  a.textContent = 'Download';
  a.href = dataUrl; a.download = 'rotated.png';
  result.appendChild(a);
  input.value = '';
  tnToast('Image rotated', 'success');
}

/* ---------------- QR SCANNER ---------------- */

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function scanQRFromFile(input) {
  const file = input.files[0];
  const result = document.getElementById('qrScanResult');
  if (!file) return;
  if (typeof jsQR === 'undefined') { tnToast('QR scanner library failed to load — check your connection', 'error'); return; }
  loadImageFile(file).then(img => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width; canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);
    if (code) {
      result.innerHTML = `<div class="pill">Decoded: <b>${escapeHtml(code.data)}</b></div>`;
      input.value = '';
      tnToast('QR code decoded', 'success');
    } else {
      result.innerHTML = `<div class="pill" style="border-color:var(--danger);">No QR code found in that image</div>`;
    }
  });
}

let qrCameraStream = null;
let qrCameraLoopId = null;

async function toggleQRCamera() {
  const video = document.getElementById('qrVideo');
  const btn = document.getElementById('qrCamBtn');
  if (qrCameraStream) { stopQRCamera(); return; }
  if (typeof jsQR === 'undefined') { tnToast('QR scanner library failed to load — check your connection', 'error'); return; }
  try {
    qrCameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = qrCameraStream;
    video.style.display = 'block';
    await video.play();
    btn.textContent = 'Stop Camera';
    qrCameraLoop();
  } catch (e) {
    tnToast('Could not access camera — check permissions', 'error');
  }
}

function stopQRCamera() {
  if (qrCameraStream) { qrCameraStream.getTracks().forEach(t => t.stop()); qrCameraStream = null; }
  if (qrCameraLoopId) cancelAnimationFrame(qrCameraLoopId);
  const video = document.getElementById('qrVideo');
  if (video) video.style.display = 'none';
  const btn = document.getElementById('qrCamBtn');
  if (btn) btn.textContent = 'Scan with Camera';
}

function qrCameraLoop() {
  const video = document.getElementById('qrVideo');
  const result = document.getElementById('qrScanResult');
  if (!qrCameraStream) return;
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);
    if (code) {
      result.innerHTML = `<div class="pill">Decoded: <b>${escapeHtml(code.data)}</b></div>`;
      tnToast('QR code decoded', 'success');
      stopQRCamera();
      return;
    }
  }
  qrCameraLoopId = requestAnimationFrame(qrCameraLoop);
}

/* ---------------- SCIENTIFIC CALCULATOR ---------------- */

let calcAngleMode = 'deg';

function calcSetMode(mode) {
  calcAngleMode = mode;
  const degBtn = document.getElementById('calcDegBtn');
  const radBtn = document.getElementById('calcRadBtn');
  degBtn.className = 'btn btn-sm ' + (mode === 'deg' ? 'btn-primary' : 'btn-ghost');
  radBtn.className = 'btn btn-sm ' + (mode === 'rad' ? 'btn-primary' : 'btn-ghost');
}

function calcInput(val) { document.getElementById('calcDisplay').value += val; }

function calcFunc(name) {
  const map = { sin: 'sin(', cos: 'cos(', tan: 'tan(', log: 'log(', ln: 'ln(', sqrt: 'sqrt(', inv: 'inv(' };
  document.getElementById('calcDisplay').value += map[name];
}

function calcConst(name) { document.getElementById('calcDisplay').value += (name === 'pi' ? 'π' : 'e'); }
function calcClear() { document.getElementById('calcDisplay').value = ''; }
function calcDel() { const d = document.getElementById('calcDisplay'); d.value = d.value.slice(0, -1); }

function calcFactorial(n) {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  let r = 1; for (let i = 2; i <= n; i++) r *= i; return r;
}

function calcEquals() {
  const d = document.getElementById('calcDisplay');
  const expr = d.value;
  if (!expr) return;
  try {
    if (!/^[0-9+\-*/^().!%πe\sa-zA-Z]*$/.test(expr)) throw new Error('Invalid characters');
    let js = expr
      .replace(/π/g, '@PI@')
      .replace(/(\d)(@PI@|e)/g, '$1*$2')
      .replace(/sin\(/g, '@trig@("sin",')
      .replace(/cos\(/g, '@trig@("cos",')
      .replace(/tan\(/g, '@trig@("tan",')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/inv\(/g, '1/(')
      .replace(/\^/g, '**')
      .replace(/(\d+)!/g, '@fact@($1)')
      .replace(/@PI@/g, 'Math.PI')
      .replace(/\be\b/g, 'Math.E');

    const angleIsDeg = calcAngleMode === 'deg';
    const fn = new Function(
      '__trig', '__fact', 'angleIsDeg',
      'return (' + js.replace(/@trig@/g, '__trig').replace(/@fact@/g, '__fact') + ')'
    );
    const trig = (name, v) => { const rad = angleIsDeg ? v * Math.PI / 180 : v; return Math[name](rad); };
    const result = fn(trig, calcFactorial, angleIsDeg);

    if (typeof result !== 'number' || !isFinite(result)) throw new Error('Math error');
    d.value = String(Math.round(result * 1e10) / 1e10);
  } catch (e) {
    tnToast('Invalid expression', 'error');
  }
}



/* ---------------- CALCULATORS ---------------- */

function calcAge() {
  const dobVal = document.getElementById('ageDob').value;
  const result = document.getElementById('ageResult');
  if (!dobVal) { tnToast('Pick a date of birth', 'error'); return; }
  const dob = new Date(dobVal);
  const now = new Date();
  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days = now.getDate() - dob.getDate();
  if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
  if (months < 0) { years--; months += 12; }
  const totalDays = Math.floor((now - dob) / 86400000);
  result.innerHTML = `<div class="pill">Age: <b>${years}y ${months}m ${days}d</b></div><div class="pill">Total days lived: <b>${totalDays.toLocaleString()}</b></div>`;
}

function calcBMI() {
  const w = parseFloat(document.getElementById('bmiWeight').value);
  const h = parseFloat(document.getElementById('bmiHeight').value) / 100;
  const result = document.getElementById('bmiResult');
  if (!w || !h) { tnToast('Enter weight and height', 'error'); return; }
  const bmi = w / (h * h);
  let category = 'Normal weight';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi >= 25 && bmi < 30) category = 'Overweight';
  else if (bmi >= 30) category = 'Obese';
  result.innerHTML = `<div class="pill">BMI: <b>${bmi.toFixed(1)}</b></div><div class="pill">Category: <b>${category}</b></div>`;
}

function calcPercentage() {
  const a = parseFloat(document.getElementById('pctA').value);
  const b = parseFloat(document.getElementById('pctB').value);
  const result = document.getElementById('pctResult');
  if (isNaN(a) || isNaN(b)) { tnToast('Enter both numbers', 'error'); return; }
  result.innerHTML = `<div class="pill">${a} is <b>${((a / b) * 100).toFixed(2)}%</b> of ${b}</div>`;
}

function calcDiscount() {
  const price = parseFloat(document.getElementById('discPrice').value);
  const pct = parseFloat(document.getElementById('discPct').value);
  const result = document.getElementById('discResult');
  if (isNaN(price) || isNaN(pct)) { tnToast('Enter price and discount %', 'error'); return; }
  const saved = price * (pct / 100);
  const final = price - saved;
  result.innerHTML = `<div class="pill">You save: <b>${saved.toFixed(2)}</b></div><div class="pill">Final price: <b>${final.toFixed(2)}</b></div>`;
}

function calcEMI() {
  const P = parseFloat(document.getElementById('loanAmt').value);
  const annualRate = parseFloat(document.getElementById('loanRate').value);
  const n = parseInt(document.getElementById('loanMonths').value);
  const result = document.getElementById('loanResult');
  if (!P || !annualRate || !n) { tnToast('Fill in all loan fields', 'error'); return; }
  const r = annualRate / 12 / 100;
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPay = emi * n;
  const totalInterest = totalPay - P;
  result.innerHTML = `<div class="pill">Monthly EMI: <b>${emi.toFixed(2)}</b></div><div class="pill">Total interest: <b>${totalInterest.toFixed(2)}</b></div><div class="pill">Total payment: <b>${totalPay.toFixed(2)}</b></div>`;
}

/* ---------------- IMAGE TOOLS ---------------- */

function loadImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function compressImage() {
  const input = document.getElementById('compressInput');
  const result = document.getElementById('compressResult');
  if (!input.files[0]) { tnToast('Choose an image first', 'error'); return; }
  const img = await loadImageFile(input.files[0]);
  const canvas = document.createElement('canvas');
  canvas.width = img.width; canvas.height = img.height;
  canvas.getContext('2d').drawImage(img, 0, 0);
  const quality = parseInt(document.getElementById('compressQuality').value) / 100;
  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  const sizeKB = Math.round((dataUrl.length * 3 / 4) / 1024);
  result.innerHTML = `<img src="${dataUrl}" style="max-width:220px;border-radius:8px;border:1px solid var(--border);margin-bottom:10px;"><div class="stat-pills"><div class="pill">Est. size: <b>${sizeKB} KB</b></div></div>`;
  const a = document.createElement('a');
  a.className = 'btn btn-ghost btn-sm'; a.style.marginTop = '10px'; a.style.display = 'inline-block';
  a.textContent = 'Download';
  a.href = dataUrl; a.download = 'compressed.jpg';
  result.appendChild(a);
  input.value = '';
  tnToast('Image compressed', 'success');
}

async function resizeImage() {
  const input = document.getElementById('resizeInput');
  const result = document.getElementById('resizeResult');
  if (!input.files[0]) { tnToast('Choose an image first', 'error'); return; }
  const w = parseInt(document.getElementById('resizeW').value);
  const h = parseInt(document.getElementById('resizeH').value);
  if (!w || !h) { tnToast('Enter target width and height', 'error'); return; }
  const img = await loadImageFile(input.files[0]);
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  canvas.getContext('2d').drawImage(img, 0, 0, w, h);
  const dataUrl = canvas.toDataURL('image/png');
  result.innerHTML = `<img src="${dataUrl}" style="max-width:220px;border-radius:8px;border:1px solid var(--border);margin-bottom:10px;">`;
  const a = document.createElement('a');
  a.className = 'btn btn-ghost btn-sm'; a.style.display = 'inline-block';
  a.textContent = 'Download';
  a.href = dataUrl; a.download = `resized-${w}x${h}.png`;
  result.appendChild(a);
  input.value = '';
  tnToast('Image resized', 'success');
}

async function convertImage() {
  const input = document.getElementById('convertInput');
  const result = document.getElementById('convertResult');
  if (!input.files[0]) { tnToast('Choose an image first', 'error'); return; }
  const format = document.getElementById('convertFormat').value;
  const img = await loadImageFile(input.files[0]);
  const canvas = document.createElement('canvas');
  canvas.width = img.width; canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (format === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
  ctx.drawImage(img, 0, 0);
  const dataUrl = canvas.toDataURL(format, 0.92);
  const ext = format === 'image/png' ? 'png' : 'jpg';
  result.innerHTML = `<img src="${dataUrl}" style="max-width:220px;border-radius:8px;border:1px solid var(--border);margin-bottom:10px;">`;
  const a = document.createElement('a');
  a.className = 'btn btn-ghost btn-sm'; a.style.display = 'inline-block';
  a.textContent = 'Download .' + ext;
  a.href = dataUrl; a.download = 'converted.' + ext;
  result.appendChild(a);
  input.value = '';
  tnToast('Image converted', 'success');
}

/* ---------------- PDF TOOLS (pdf-lib) ---------------- */

function downloadBytes(bytes, filename, mime) {
  const blob = new Blob([bytes], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function pdfLibReady() {
  if (typeof PDFLib === 'undefined') { tnToast('PDF library failed to load — check your connection', 'error'); return false; }
  return true;
}

async function mergePDFs() {
  const input = document.getElementById('mergeInput');
  const status = document.getElementById('mergeStatus');
  if (input.files.length < 2) { tnToast('Choose at least two PDF files', 'error'); return; }
  if (!pdfLibReady()) return;
  status.textContent = 'Merging…';
  try {
    const { PDFDocument } = PDFLib;
    const merged = await PDFDocument.create();
    for (const file of input.files) {
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes);
      const pages = await merged.copyPages(src, src.getPageIndices());
      pages.forEach(p => merged.addPage(p));
    }
    const outBytes = await merged.save();
    downloadBytes(outBytes, 'merged.pdf', 'application/pdf');
    status.textContent = `✓ Merged ${input.files.length} files`;
    input.value = '';
    tnToast('Merged PDF downloaded', 'success');
  } catch (e) {
    status.textContent = '✕ ' + e.message;
    tnToast('Could not merge — check the files are valid PDFs', 'error');
  }
}

function parsePageRanges(rangeStr, maxPages) {
  const indices = new Set();
  rangeStr.split(',').forEach(part => {
    part = part.trim();
    if (!part) return;
    if (part.includes('-')) {
      let [a, b] = part.split('-').map(n => parseInt(n.trim()));
      if (isNaN(a)) return;
      if (isNaN(b)) b = a;
      for (let i = a; i <= b; i++) if (i >= 1 && i <= maxPages) indices.add(i - 1);
    } else {
      const n = parseInt(part);
      if (!isNaN(n) && n >= 1 && n <= maxPages) indices.add(n - 1);
    }
  });
  return Array.from(indices).sort((a, b) => a - b);
}

async function extractPages() {
  const input = document.getElementById('splitInput');
  const status = document.getElementById('splitStatus');
  const rangeStr = document.getElementById('splitRange').value.trim();
  if (!input.files[0]) { tnToast('Choose a PDF file', 'error'); return; }
  if (!rangeStr) { tnToast('Enter a page range, e.g. 1-3,5', 'error'); return; }
  if (!pdfLibReady()) return;
  try {
    const { PDFDocument } = PDFLib;
    const bytes = await input.files[0].arrayBuffer();
    const src = await PDFDocument.load(bytes);
    const total = src.getPageCount();
    const indices = parsePageRanges(rangeStr, total);
    if (!indices.length) { tnToast('No valid pages in that range', 'error'); return; }
    const out = await PDFDocument.create();
    const pages = await out.copyPages(src, indices);
    pages.forEach(p => out.addPage(p));
    const outBytes = await out.save();
    downloadBytes(outBytes, 'extracted.pdf', 'application/pdf');
    status.textContent = `✓ Extracted ${indices.length} of ${total} pages`;
    input.value = '';
    tnToast('Extracted PDF downloaded', 'success');
  } catch (e) {
    status.textContent = '✕ ' + e.message;
    tnToast('Could not read that PDF', 'error');
  }
}

async function splitIntoPages() {
  const input = document.getElementById('splitInput');
  const status = document.getElementById('splitStatus');
  if (!input.files[0]) { tnToast('Choose a PDF file', 'error'); return; }
  if (!pdfLibReady()) return;
  if (typeof JSZip === 'undefined') { tnToast('Zip library failed to load — check your connection', 'error'); return; }
  try {
    const { PDFDocument } = PDFLib;
    const bytes = await input.files[0].arrayBuffer();
    const src = await PDFDocument.load(bytes);
    const total = src.getPageCount();
    const zip = new JSZip();
    for (let i = 0; i < total; i++) {
      const out = await PDFDocument.create();
      const [page] = await out.copyPages(src, [i]);
      out.addPage(page);
      const outBytes = await out.save();
      zip.file(`page-${i + 1}.pdf`, outBytes);
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url; a.download = 'split-pages.zip'; a.click();
    URL.revokeObjectURL(url);
    status.textContent = `✓ Split into ${total} files`;
    input.value = '';
    tnToast('ZIP of pages downloaded', 'success');
  } catch (e) {
    status.textContent = '✕ ' + e.message;
    tnToast('Could not split that PDF', 'error');
  }
}

async function rotatePDF() {
  const input = document.getElementById('rotateInput');
  const status = document.getElementById('rotateStatus');
  const angle = parseInt(document.getElementById('rotateAngle').value);
  if (!input.files[0]) { tnToast('Choose a PDF file', 'error'); return; }
  if (!pdfLibReady()) return;
  try {
    const { PDFDocument, degrees } = PDFLib;
    const bytes = await input.files[0].arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    pdf.getPages().forEach(page => {
      const current = page.getRotation().angle;
      page.setRotation(degrees((current + angle) % 360));
    });
    const outBytes = await pdf.save();
    downloadBytes(outBytes, 'rotated.pdf', 'application/pdf');
    status.textContent = `✓ Rotated ${pdf.getPageCount()} page(s) by ${angle}°`;
    input.value = '';
    tnToast('Rotated PDF downloaded', 'success');
  } catch (e) {
    status.textContent = '✕ ' + e.message;
    tnToast('Could not rotate that PDF', 'error');
  }
}

async function compressPDF() {
  const input = document.getElementById('compressPdfInput');
  const status = document.getElementById('compressPdfStatus');
  if (!input.files[0]) { tnToast('Choose a PDF file', 'error'); return; }
  if (!pdfLibReady()) return;
  try {
    const file = input.files[0];
    const originalSize = file.size;
    const { PDFDocument } = PDFLib;
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const outBytes = await pdf.save({ useObjectStreams: true });
    const newSize = outBytes.byteLength;
    downloadBytes(outBytes, 'compressed.pdf', 'application/pdf');
    const pct = Math.max(0, Math.round((1 - newSize / originalSize) * 100));
    status.textContent = `Original ${(originalSize / 1024).toFixed(0)} KB → New ${(newSize / 1024).toFixed(0)} KB (${pct}% smaller)`;
    input.value = '';
    tnToast('Compressed PDF downloaded', 'success');
  } catch (e) {
    status.textContent = '✕ ' + e.message;
    tnToast('Could not compress that PDF', 'error');
  }
}

async function imagesToPdf() {
  const input = document.getElementById('imgToPdfInput');
  const status = document.getElementById('imgToPdfStatus');
  if (!input.files.length) { tnToast('Choose at least one image', 'error'); return; }
  if (typeof window.jspdf === 'undefined') { tnToast('PDF library failed to load — check your connection', 'error'); return; }
  status.textContent = 'Generating…';
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  for (let i = 0; i < input.files.length; i++) {
    const img = await loadImageFile(input.files[i]);
    const canvas = document.createElement('canvas');
    canvas.width = img.width; canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(pageW / img.width, pageH / img.height);
    const w = img.width * ratio, h = img.height * ratio;
    if (i > 0) pdf.addPage();
    pdf.addImage(dataUrl, 'JPEG', (pageW - w) / 2, (pageH - h) / 2, w, h);
  }
  pdf.save('toolnova-images.pdf');
  status.textContent = `✓ PDF generated from ${input.files.length} image(s)`;
  input.value = '';
  tnToast('PDF downloaded', 'success');
}
