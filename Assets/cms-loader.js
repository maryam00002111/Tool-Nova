// ============================================================
// TOOLNOVA — CMS content loader
// Fetches blog posts and ad settings directly from the GitHub repo
// that Decap CMS commits to. No build step, no backend — same pattern
// used for dynamic content loading on your other Decap CMS projects.
// ============================================================

function cmsConfigured() {
  return !!(SITE_CONFIG.githubOwner && SITE_CONFIG.githubRepo);
}

function ghRawUrl(path) {
  return `https://raw.githubusercontent.com/${SITE_CONFIG.githubOwner}/${SITE_CONFIG.githubRepo}/${SITE_CONFIG.githubBranch}/${path}`;
}

function ghContentsUrl(path) {
  return `https://api.github.com/repos/${SITE_CONFIG.githubOwner}/${SITE_CONFIG.githubRepo}/contents/${path}?ref=${SITE_CONFIG.githubBranch}`;
}

// Fetch every blog post JSON file in content/blog/, newest first.
async function fetchBlogList() {
  if (!cmsConfigured()) return [];
  const listRes = await fetch(ghContentsUrl('content/blog'));
  if (!listRes.ok) throw new Error('Could not list blog posts (status ' + listRes.status + ')');
  const files = (await listRes.json()).filter(f => f.name.endsWith('.json'));
  const posts = await Promise.all(files.map(async f => {
    const res = await fetch(ghRawUrl('content/blog/' + f.name));
    if (!res.ok) return null;
    return res.json();
  }));
  return posts.filter(Boolean).sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Fetch a single post by its slug (== filename, since the CMS slug field drives the filename).
async function fetchBlogPost(slug) {
  if (!cmsConfigured()) return null;
  const res = await fetch(ghRawUrl('content/blog/' + slug + '.json'));
  if (!res.ok) return null;
  return res.json();
}

async function fetchAdSettings() {
  if (!cmsConfigured()) return null;
  try {
    const res = await fetch(ghRawUrl('content/settings/ads.json'));
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

// Populates every .ad-slot[data-ad-slot] on the page with the matching
// CMS-managed code, if any has been set. Leaves the placeholder text
// alone for any slot that's still empty.
async function loadAdsIntoPage() {
  const slots = document.querySelectorAll('.ad-slot[data-ad-slot]');
  if (!slots.length) return;
  const settings = await fetchAdSettings();
  if (!settings) return;
  slots.forEach(slot => {
    const key = slot.getAttribute('data-ad-slot');
    const code = settings[key];
    if (code && code.trim()) {
      slot.innerHTML = code;
      slot.classList.remove('ad-slot');
    }
  });
}

document.addEventListener('DOMContentLoaded', loadAdsIntoPage);
