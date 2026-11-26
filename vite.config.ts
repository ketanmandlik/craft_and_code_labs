import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    const site = env.VITE_SITE_URL ? new URL('/', env.VITE_SITE_URL).href : '';
    if (site && !/^https?:\/\/[\w.-]+(?::\d+)?\/$/.test(site)) throw Error('VITE_SITE_URL must be an HTTP(S) origin');
    const description = 'Craft and Code Labs designs and engineers web experiences, mobile applications, AI systems and scalable software for ambitious businesses.';
    return {
        plugins: [react(), tailwind(), 
            {
            name: 'studio-metadata', transformIndexHtml() {
                return [
                    { tag: 'meta', attrs: { name: 'description', content: description } },
                    { tag: 'meta', attrs: { property: 'og:description', content: description } },
                    { tag: 'script', attrs: { type: 'application/ld+json' }, children: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Craft and Code Labs', description, slogan: 'Turn Ideas Into Innovation.', ...(site ? { url: site } : {}) }) },
                    ...(site ? [{ tag: 'link', attrs: { rel: 'canonical', href: site } }, { tag: 'meta', attrs: { property: 'og:url', content: site } }, { tag: 'meta', attrs: { property: 'og:image', content: site + 'assets/social.png' } }] : [])
                ]
            }, generateBundle() { this.emitFile({ type: 'asset', fileName: 'robots.txt', source: 'User-agent: *\nAllow: /\n' + (site ? 'Sitemap: ' + site + 'sitemap.xml\n' : '') }); this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + (site ? '<url><loc>' + site + '</loc></url>' : '') + '</urlset>' }) }
        }],
    };
});
