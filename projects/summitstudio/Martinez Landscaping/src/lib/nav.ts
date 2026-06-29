/**
 * Primary navigation structure. Section labels and anchors are template-level
 * (not business content) — they stay constant across businesses generated
 * from this template, since they describe the page's own section layout.
 */
export const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Why us', href: '#why-us' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Service area', href: '#service-area' },
] as const;
