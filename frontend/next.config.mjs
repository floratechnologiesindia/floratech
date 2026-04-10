const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'www.floratechnologies.in' },
      { protocol: 'https', hostname: 'floratechnologies.in' },
      { protocol: 'http', hostname: 'localhost', port: '4000' },
      { protocol: 'http', hostname: '127.0.0.1', port: '4000' },
      { protocol: 'http', hostname: 'backend', port: '4000' },
    ],
  },
};

export default nextConfig;
