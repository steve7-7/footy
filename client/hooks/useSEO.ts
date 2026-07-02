import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  ogImage?: string;
}

const BASE_URL = "https://dailyfreepredictions.hyper.co.ke";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;

function setMetaTag(name: string, content: string, property = false) {
  const attr = property ? "property" : "name";
  let meta = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attr, name);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function setLinkTag(rel: string, href: string) {
  let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

export function useSEO({
  title,
  description,
  keywords,
  canonicalUrl,
  noIndex = false,
  ogImage = DEFAULT_OG_IMAGE,
}: SEOProps) {
  useEffect(() => {
    // Document title
    document.title = title;

    // Standard meta
    setMetaTag("title", title);
    setMetaTag("description", description);
    if (keywords) setMetaTag("keywords", keywords);
    setMetaTag("robots", noIndex ? "noindex, nofollow" : "index, follow");

    // Open Graph
    setMetaTag("og:title", title, true);
    setMetaTag("og:description", description, true);
    setMetaTag("og:image", ogImage, true);
    if (canonicalUrl) setMetaTag("og:url", canonicalUrl, true);

    // Twitter
    setMetaTag("twitter:title", title, true);
    setMetaTag("twitter:description", description, true);
    setMetaTag("twitter:image", ogImage, true);
    if (canonicalUrl) setMetaTag("twitter:url", canonicalUrl, true);

    // Canonical
    if (canonicalUrl) setLinkTag("canonical", canonicalUrl);
  }, [title, description, keywords, canonicalUrl, noIndex, ogImage]);
}
