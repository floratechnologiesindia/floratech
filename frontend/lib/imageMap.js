/** Local images under /public/images/flora — curated to match Flora Technologies content */

export const heroImage = {
  src: '/images/flora/hero-team.jpg',
  alt: 'Team collaborating on digital strategy in a bright modern office',
};

export const trustImages = [
  {
    key: 'msme',
    src: '/images/flora/trust-msme.jpg',
    alt: 'Small business owner using a tablet in a welcoming workspace',
  },
  {
    key: 'research',
    src: '/images/flora/trust-research.jpg',
    alt: 'Researcher reviewing scientific work in a focused academic setting',
  },
  {
    key: 'ai',
    src: '/images/flora/trust-ai.jpg',
    alt: 'Abstract visualization suggesting intelligent automation and connectivity',
  },
];

export const serviceImages = {
  'static-dynamic-websites': {
    src: '/images/flora/service-websites.jpg',
    alt: 'Laptop displaying analytics and web performance metrics',
  },
  'ecommerce-development': {
    src: '/images/flora/service-ecommerce.jpg',
    alt: 'Customer completing a purchase on a modern online store',
  },
  'crm-lms-saas-platforms': {
    src: '/images/flora/service-saas.jpg',
    alt: 'Business dashboard with charts for CRM and SaaS operations',
  },
  'lms-crm-enterprise-platforms': {
    src: '/images/flora/service-lms-crm.jpg',
    alt: 'Learning management and customer relationship platform interfaces',
  },
  'ai-chatbot-solutions': {
    src: '/images/flora/service-ai.jpg',
    alt: 'AI and conversational technology concept with soft green tones',
  },
  'blockchain-solutions': {
    src: '/images/flora/service-blockchain.jpg',
    alt: 'Abstract blockchain network and secure digital ledger concept',
  },
  'digital-marketing-seo': {
    src: '/images/flora/service-seo.jpg',
    alt: 'Digital marketing analytics growth and SEO performance',
  },
  'phd-scientist-portfolio-websites': {
    src: '/images/flora/service-academic.jpg',
    alt: 'Scientific research workspace with notes and precision instruments',
  },
};

export const industryImages = {
  msmes: {
    src: '/images/flora/industry-msmes.jpg',
    alt: 'Local MSME retail and service business environment',
  },
  startups: {
    src: '/images/flora/industry-startups.jpg',
    alt: 'Startup team brainstorming product growth on a whiteboard',
  },
  researchers: {
    src: '/images/flora/industry-researchers.jpg',
    alt: 'Laboratory and academic research setting',
  },
  'blockchain-technologies': {
    src: '/images/flora/industry-blockchain.jpg',
    alt: 'Secure blockchain network visualization for enterprise technology',
  },
};

export const portfolioImages = {
  'green-bento-foods': {
    src: '/images/flora/portfolio-food.jpg',
    alt: 'Fresh packaged food and sustainable brand retail concept',
  },
  'priya-sharma-portfolio': {
    src: '/images/flora/portfolio-academic.jpg',
    alt: 'Academic research publications and scholarly work presentation',
  },
};

export const blogImages = {
  'best-website-solutions-msmes-india': {
    src: '/images/flora/blog-msme-web.jpg',
    alt: 'Small business website and mobile-friendly online presence',
  },
  'how-ai-chatbots-can-grow-your-business': {
    src: '/images/flora/blog-ai-chat.jpg',
    alt: 'Chat interface and automation supporting customer conversations',
  },
};

export const pricingImages = {
  starter: {
    src: '/images/flora/pricing-starter.jpg',
    alt: 'Launch essentials — simple website and digital foundation',
  },
  growth: {
    src: '/images/flora/pricing-growth.jpg',
    alt: 'Business scaling with marketing analytics and integrations',
  },
  advanced: {
    src: '/images/flora/pricing-advanced.jpg',
    alt: 'Advanced automation, AI, and platform engineering at scale',
  },
};

export const pageImages = {
  contact: {
    src: '/images/flora/contact.jpg',
    alt: 'Friendly consultation and project discussion',
  },
  cta: {
    src: '/images/flora/cta-growth.jpg',
    alt: 'Team celebrating digital growth and successful launch',
  },
  phdSection: {
    src: '/images/flora/section-phd.jpg',
    alt: 'Scholar presenting research and academic achievements',
  },
};

/** Wide banners for listing pages */
export const listPageBanners = {
  services: {
    src: '/images/flora/service-websites.jpg',
    alt: 'Digital design and web development workspace',
  },
  industries: {
    src: '/images/flora/industry-startups.jpg',
    alt: 'Teams building industry-focused digital products',
  },
  portfolio: {
    src: '/images/flora/portfolio-food.jpg',
    alt: 'Brand and e-commerce project showcase',
  },
  blog: {
    src: '/images/flora/blog-msme-web.jpg',
    alt: 'Insights on websites, SEO, and intelligent automation',
  },
};

export function getServiceImage(slug) {
  return (
    serviceImages[slug] || {
      src: '/images/flora/service-websites.jpg',
      alt: 'Flora Technologies digital service',
    }
  );
}

export function getIndustryImage(slug) {
  return (
    industryImages[slug] || {
      src: '/images/flora/industry-msmes.jpg',
      alt: 'Industry-focused digital solutions',
    }
  );
}

export function getPortfolioImage(slug) {
  return (
    portfolioImages[slug] || {
      src: '/images/flora/portfolio-food.jpg',
      alt: 'Client project case study',
    }
  );
}

export function getBlogImage(slug) {
  return (
    blogImages[slug] || {
      src: '/images/flora/blog-msme-web.jpg',
      alt: 'Flora Technologies insights article',
    }
  );
}

export function getPricingImage(packageName) {
  const key = String(packageName).toLowerCase();
  if (key.includes('starter')) return pricingImages.starter;
  if (key.includes('growth')) return pricingImages.growth;
  if (key.includes('advanced')) return pricingImages.advanced;
  return pricingImages.starter;
}
