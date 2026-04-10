export default function manifest() {
  return {
    name: 'Flora Technologies',
    short_name: 'Flora',
    description:
      'Naturally Intelligent digital solutions for MSMEs, startups, and researchers—websites, AI, blockchain, and SEO.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7faf8',
    theme_color: '#1d8b54',
    lang: 'en',
    icons: [
      {
        src: '/flora-logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
