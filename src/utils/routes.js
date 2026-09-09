import { projects } from '../data/projects';

export const DEFAULT_PAGE_TITLE = 'Karthik Satheesh · Lead Product Designer & Creative Developer';

// Common aliases mapping alternate URLs or legacy slugs to canonical project IDs
const PROJECT_ALIASES = {
  kaira: 'kaira-os',
  kairaos: 'kaira-os',
  'kaira-os': 'kaira-os',
  draun: 'draun',
  vw: 'vw-tracking',
  'vw-tracking': 'vw-tracking',
  vitacore: 'vitacore-nexus',
  vitacorenexus: 'vitacore-nexus',
  'vitacore-nexus': 'vitacore-nexus',
  que: 'que-workspace',
  queworkspace: 'que-workspace',
  'que-workspace': 'que-workspace',
  funnelfox: 'funnelfox',
  'funnelfox-360': 'funnelfox',
  funnelfox360: 'funnelfox',
  'funnelfox 360': 'funnelfox',
  luna: 'luna'
};

/**
 * Normalizes a raw pathname and returns the matching project object, or null.
 * Supports /project/:slug, /work/:slug, or /:slug directly.
 */
export function getProjectByPath(pathname = '') {
  if (!pathname) return null;

  try {
    const decoded = decodeURIComponent(pathname);
    const cleanPath = decoded.replace(/^\/+|\/+$/g, '');
    if (!cleanPath) return null;

    // Handle prefixed routes e.g. "project/kaira-os" or "work/draun"
    const segments = cleanPath.split('/');
    let targetSlug = segments[segments.length - 1].toLowerCase().trim();

    // Check direct alias map
    const mappedId = PROJECT_ALIASES[targetSlug];
    if (mappedId) {
      const match = projects.find((p) => p.id === mappedId);
      if (match) return match;
    }

    // Direct match against project ID
    const directMatch = projects.find((p) => p.id.toLowerCase() === targetSlug);
    if (directMatch) return directMatch;

    // Match against slugified title
    const titleMatch = projects.find((p) => {
      const titleSlug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      return titleSlug === targetSlug;
    });
    if (titleMatch) return titleMatch;

    // Match without hyphens
    const strippedSlug = targetSlug.replace(/[^a-z0-9]/g, '');
    const strippedMatch = projects.find((p) => p.id.replace(/[^a-z0-9]/g, '') === strippedSlug);
    if (strippedMatch) return strippedMatch;

    return null;
  } catch {
    return null;
  }
}

/**
 * Checks if the current path points to the resume modal (/resume or /Resume).
 */
export function isResumePath(pathname = '') {
  if (!pathname) return false;
  const clean = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  return clean === 'resume';
}

/**
 * Returns the canonical URL path for a project.
 */
export function getProjectUrl(project) {
  if (!project?.id) return '/';
  return `/project/${project.id}`;
}

/**
 * Returns the dynamic document title for a project.
 */
export function getProjectPageTitle(project) {
  if (!project?.title) return DEFAULT_PAGE_TITLE;
  return `${project.title} · Karthik Satheesh`;
}
