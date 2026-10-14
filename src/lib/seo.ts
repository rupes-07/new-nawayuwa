import { useEffect } from 'react';

export interface PageMetaOptions {
  title: string;
  description: string;
  canonicalPath: string;
  noIndex?: boolean;
}

export function updatePageMeta({ title, description, canonicalPath, noIndex }: PageMetaOptions) {
  // Update Title
  document.title = title;

  // Update Meta Description
  let descMeta = document.querySelector('meta[name="description"]');
  if (!descMeta) {
    descMeta = document.createElement('meta');
    descMeta.setAttribute('name', 'description');
    document.head.appendChild(descMeta);
  }
  descMeta.setAttribute('content', description);

  // Update Robots Meta tag for noindex/nofollow
  let robotsMeta = document.querySelector('meta[name="robots"]');
  if (!robotsMeta) {
    robotsMeta = document.createElement('meta');
    robotsMeta.setAttribute('name', 'robots');
    document.head.appendChild(robotsMeta);
  }
  robotsMeta.setAttribute('content', noIndex ? 'noindex, nofollow' : 'index, follow');

  // Update OG Title & Description
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);
  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', description);

  // Update Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  const fullUrl = `${window.location.origin}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', fullUrl);
}

export function usePageMeta(options: PageMetaOptions) {
  useEffect(() => {
    updatePageMeta(options);
  }, [options.title, options.description, options.canonicalPath, options.noIndex]);
}
