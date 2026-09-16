type WhatsAppIconProps = {
  size?: number;
  className?: string;
};

/** WhatsApp glyph. Lucide has no brand marks, so this one is inline. */
export function WhatsAppIcon({ size = 18, className }: WhatsAppIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.4A10 10 0 1 0 12 2Zm5.4 14.1c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.6-.1a11 11 0 0 1-4.3-2.8 9.6 9.6 0 0 1-2-3.3c-.2-.8 0-1.5.4-1.9l.5-.5c.3-.2.7-.2.9.2l.8 1.5c.1.3.1.5-.1.7l-.4.5c-.2.2-.2.4-.1.6a7.6 7.6 0 0 0 3.3 3.2c.3.1.5.1.7-.1l.5-.6c.2-.2.4-.3.7-.2l1.6.8c.3.2.4.5.3.8Z" />
    </svg>
  );
}
