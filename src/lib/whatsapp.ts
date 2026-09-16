import { contact, site } from '@/data/site';

/**
 * Builds a wa.me link to the company's configured WhatsApp number with a
 * useful prefilled message. Never call wa.me directly — route every link
 * through here so the number lives in one place.
 */
export function whatsappLink(message: string): string {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Generic enquiry used by the header, the floating button and page CTAs. */
export const generalEnquiry = whatsappLink(
  `Hi ${site.name}, I'd like a quote for waterproofing / flooring work.`,
);

/** Enquiry scoped to one service line. */
export function serviceEnquiry(topic: string): string {
  return whatsappLink(`Hi ${site.name}, I'd like a quote for ${topic}.`);
}

/** Enquiry sent after browsing the project record. */
export const projectsEnquiry = whatsappLink(
  `Hi ${site.name}, I'd like a free site inspection for my property.`,
);
