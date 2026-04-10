import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import Admin from './models/Admin.js';
import Service from './models/Service.js';
import Portfolio from './models/Portfolio.js';
import BlogPost from './models/BlogPost.js';
import Lead from './models/Lead.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const services = [
  {
    title: 'Static & Dynamic Websites',
    slug: 'static-dynamic-websites',
    summary: 'Modern business websites that are fast, secure, and conversion-focused.',
    details:
      'We build responsive websites with polished visuals, SEO optimization, and easy content management for MSMEs and global clients.',
    features: ['Mobile-first design', 'Fast loading pages', 'SEO optimized content', 'Custom CMS-ready structure'],
  },
  {
    title: 'E-commerce Development',
    slug: 'ecommerce-development',
    summary: 'Scalable online stores built for sales and customer trust.',
    details:
      'From product onboarding to secure checkout, our e-commerce platforms support catalogs, subscriptions, and native payment integrations.',
    features: ['Payment gateways', 'Inventory automation', 'Customer accounts', 'Performance optimization'],
  },
  {
    title: 'CRM / LMS / SaaS Platforms',
    slug: 'crm-lms-saas-platforms',
    summary: 'Tailored workflows to manage customers, courses, and subscriptions.',
    details:
      'Custom SaaS products and business automation platforms designed to scale operations and improve user engagement.',
    features: ['Workflow automation', 'Team dashboards', 'User roles', 'Reporting & analytics'],
  },
  {
    title: 'Learning Management Systems, CRM & Business Platforms',
    slug: 'lms-crm-enterprise-platforms',
    summary: 'Purpose-built LMS and CRM solutions with integrations your teams actually use every day.',
    details:
      'We design and build learning management systems for training academies and enterprises, customer relationship platforms for sales and support, and connected business modules—auth, roles, billing, and third-party integrations—so operations stay in sync.',
    features: [
      'LMS: courses, assessments, and learner progress',
      'CRM: pipelines, contacts, and activity tracking',
      'SSO, roles, and audit-friendly permissions',
      'APIs and integrations with your existing stack',
    ],
  },
  {
    title: 'AI & Chatbot Solutions',
    slug: 'ai-chatbot-solutions',
    summary: 'Intelligent assistants that automate sales, support, and lead capture.',
    details:
      'We create chatbot experiences for websites, WhatsApp, and internal systems that deliver personalized service round the clock.',
    features: ['WhatsApp integration', 'Lead qualification', 'Conversational flows', 'AI-driven responses'],
  },
  {
    title: 'Blockchain Solutions',
    slug: 'blockchain-solutions',
    summary: 'Secure decentralized applications for modern business use cases.',
    details:
      'Build audit-ready blockchain tools for supply chain, asset tracking, digital contracts, and tokenized business models.',
    features: ['Smart contracts', 'Transparent workflows', 'Immutable data', 'Web3 integration'],
  },
  {
    title: 'Digital Marketing & SEO',
    slug: 'digital-marketing-seo',
    summary: 'Growth marketing that increases organic traffic and lead flow.',
    details:
      'Our SEO and digital campaigns are designed to improve visibility, generate qualified leads, and support your business goals.',
    features: ['SEO strategy', 'Content marketing', 'PPC campaigns', 'Analytics reporting'],
  },
  {
    title: 'Portfolio Websites for PhD Scholars & Scientists',
    slug: 'phd-scientist-portfolio-websites',
    summary: 'Globally accessible academic portfolios that showcase research, publications, and impact.',
    details:
      'We build publication-ready portfolio sites for PhD scholars, scientists, and academicians—structured to highlight papers, conferences, grants, and collaborations with a professional, trustworthy presence.',
    features: [
      'Publications & citation layout',
      'Research themes & projects',
      'Conference and awards sections',
      'Global reach and SEO for researchers',
    ],
  },
];

const portfolio = [
  {
    title: 'Green Bento Foods',
    slug: 'green-bento-foods',
    client: 'Green Bento Foods',
    industry: 'MSME',
    summary: 'A full e-commerce launch for a premium food brand with inventory and order automation.',
    challenges: 'Sales were mostly offline; manual orders limited scale and visibility.',
    solution: 'E-commerce storefront with catalog, secure checkout, and order workflows aligned to their operations.',
    results: '50% uplift in monthly online sales and streamlined order processing.',
    tags: ['ecommerce', 'msme'],
  },
  {
    title: 'Dr. Priya Sharma Research Portfolio',
    slug: 'priya-sharma-portfolio',
    client: 'Dr. Priya Sharma',
    industry: 'Research',
    summary: 'A modern academic portfolio highlighting publications, conferences, and collaborations.',
    challenges: 'Research impact was hard to discover online; no single professional hub for collaborators.',
    solution: 'Structured portfolio with publications, talks, and clear contact paths for academic outreach.',
    results: 'Increased research inquiries and speaking invitations.',
    tags: ['portfolio', 'research', 'academia'],
  },
];

const posts = [
  {
    title: 'Best Website Solutions for MSMEs in India',
    slug: 'best-website-solutions-msmes-india',
    excerpt: 'How MSMEs can win online with mobile-friendly, SEO-optimized sites built for conversion.',
    content:
      'MSMEs in India need websites that load fast, build trust, and convert visitors into customers. A clear value proposition, strong local SEO, and mobile-first design are essential to stand out in a competitive market. At Flora Technologies, we build scalable digital experiences that help you grow with measurable business impact.',
    tags: ['MSMEs', 'SEO', 'website'],
  },
  {
    title: 'How AI Chatbots Can Grow Your Business',
    slug: 'how-ai-chatbots-can-grow-your-business',
    excerpt: 'AI chatbots automate lead generation, support, and customer journeys for modern SMEs and startups.',
    content:
      'Chatbots enable business growth by responding instantly, capturing leads, and guiding visitors through service paths. When integrated with your website and WhatsApp, they can nurture prospects and reduce manual support effort. Flora Technologies designs chatbot experiences that reflect your brand voice and business goals.',
    tags: ['AI', 'chatbot', 'automation'],
  },
];

const leads = [
  {
    name: 'Rahul Mehta',
    email: 'rahul.mehta@example.com',
    phone: '+91 98765 43210',
    service: 'E-commerce Development',
    message: 'I need a catalog with secure payments and easy shipping management.',
  },
];

async function seed() {
  await connectDB(process.env.MONGODB_URI);
  await Admin.deleteMany();
  await Service.deleteMany();
  await Portfolio.deleteMany();
  await BlogPost.deleteMany();
  await Lead.deleteMany();

  await Admin.create({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
  await Service.insertMany(services);
  await Portfolio.insertMany(portfolio);
  await BlogPost.insertMany(posts);
  await Lead.insertMany(leads);

  console.log('Sample data seeded');
  process.exit();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
