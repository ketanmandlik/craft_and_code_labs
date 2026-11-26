function socialUrl(value: string | undefined) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export const config = {
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER?.trim() || '',
  instagram: socialUrl(import.meta.env.VITE_INSTAGRAM_URL),
  linkedin: socialUrl(import.meta.env.VITE_LINKEDIN_URL),
  site: import.meta.env.VITE_SITE_URL,
};
