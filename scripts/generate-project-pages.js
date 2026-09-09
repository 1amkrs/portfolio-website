import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { projects } from '../src/data/projects.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const distIndexHtmlPath = path.resolve(distDir, 'index.html');

function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function generateProjectPages() {
  if (!fs.existsSync(distIndexHtmlPath)) {
    console.error('dist/index.html not found! Please run vite build first.');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(distIndexHtmlPath, 'utf-8');

  console.log('Generating separate direct pages for projects...');

  projects.forEach((project) => {
    const pageTitle = `${project.title} · ${project.subtitle} · Karthik Satheesh`;
    const pageDesc = project.description;
    const pageUrl = `https://iamkrs.work/project/${project.id}`;
    const pageImage = project.image.startsWith('http')
      ? project.image
      : `https://iamkrs.work${encodeURI(project.image)}`;

    let html = baseHtml;

    // Replace Title
    html = html.replace(
      /<title>.*?<\/title>/i,
      `<title>${escapeHtml(pageTitle)}</title>`
    );

    // Replace Meta Description
    html = html.replace(
      /<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta name="description" content="${escapeHtml(pageDesc)}" />`
    );

    // Replace Canonical Link
    html = html.replace(
      /<link\s+rel=["']canonical["']\s+href=["'].*?["']\s*\/?>/i,
      `<link rel="canonical" href="${escapeHtml(pageUrl)}" />`
    );

    // Replace OpenGraph Tags
    html = html.replace(
      /<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta property="og:title" content="${escapeHtml(pageTitle)}" />`
    );

    html = html.replace(
      /<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta property="og:description" content="${escapeHtml(pageDesc)}" />`
    );

    html = html.replace(
      /<meta\s+property=["']og:url["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta property="og:url" content="${escapeHtml(pageUrl)}" />`
    );

    html = html.replace(
      /<meta\s+property=["']og:image["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta property="og:image" content="${escapeHtml(pageImage)}" />`
    );

    html = html.replace(
      /<meta\s+property=["']og:image:secure_url["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta property="og:image:secure_url" content="${escapeHtml(pageImage)}" />`
    );

    html = html.replace(
      /<meta\s+property=["']og:image:alt["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta property="og:image:alt" content="${escapeHtml(project.title)} Showcase" />`
    );

    // Replace Twitter Tags
    html = html.replace(
      /<meta\s+name=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta name="twitter:title" content="${escapeHtml(pageTitle)}" />`
    );

    html = html.replace(
      /<meta\s+name=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta name="twitter:description" content="${escapeHtml(pageDesc)}" />`
    );

    html = html.replace(
      /<meta\s+name=["']twitter:image["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta name="twitter:image" content="${escapeHtml(pageImage)}" />`
    );

    // Emit 1: Canonical /project/:id/index.html
    const canonicalDir = path.resolve(distDir, 'project', project.id);
    ensureDir(canonicalDir);
    fs.writeFileSync(path.resolve(canonicalDir, 'index.html'), html, 'utf-8');

    // Emit 2: Direct short alias /:id/index.html
    const aliasDir = path.resolve(distDir, project.id);
    ensureDir(aliasDir);
    fs.writeFileSync(path.resolve(aliasDir, 'index.html'), html, 'utf-8');

    console.log(`✓ Emitted /project/${project.id} and /${project.id}`);
  });

  // Emit Resume Page: /resume/index.html
  const resumeTitle = 'Resume · Karthik Satheesh · Lead Product Designer';
  const resumeDesc = 'Experience, capabilities, and design leadership track record of Karthik Satheesh.';
  const resumeUrl = 'https://iamkrs.work/resume';

  let resumeHtml = baseHtml;
  resumeHtml = resumeHtml.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(resumeTitle)}</title>`);
  resumeHtml = resumeHtml.replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="description" content="${escapeHtml(resumeDesc)}" />`);
  resumeHtml = resumeHtml.replace(/<link\s+rel=["']canonical["']\s+href=["'].*?["']\s*\/?>/i, `<link rel="canonical" href="${escapeHtml(resumeUrl)}" />`);
  resumeHtml = resumeHtml.replace(/<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(resumeTitle)}" />`);
  resumeHtml = resumeHtml.replace(/<meta\s+property=["']og:url["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:url" content="${escapeHtml(resumeUrl)}" />`);

  const resumeDir = path.resolve(distDir, 'resume');
  ensureDir(resumeDir);
  fs.writeFileSync(path.resolve(resumeDir, 'index.html'), resumeHtml, 'utf-8');
  console.log('✓ Emitted /resume');

  console.log('All static project pages generated successfully.');
}

generateProjectPages();
