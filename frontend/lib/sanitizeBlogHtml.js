import sanitizeHtml from 'sanitize-html';

/**
 * Sanitize blog HTML from the CMS (Quill) before rendering with dangerouslySetInnerHTML.
 */
export function sanitizeBlogHtml(html) {
  if (!html || typeof html !== 'string') return '';

  return sanitizeHtml(html, {
    allowedTags: [
      'p',
      'br',
      'span',
      'div',
      'strong',
      'b',
      'em',
      'i',
      'u',
      's',
      'strike',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'a',
      'blockquote',
      'pre',
      'code',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      li: ['data-list'],
      '*': ['class'],
    },
    allowedClasses: {
      '*': [
        /^ql-indent-\d+$/,
        /^ql-align-(right|center|justify)$/,
        'ql-syntax',
      ],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    transformTags: {
      a: (tagName, attribs) => {
        const href = (attribs.href || '').trim();
        const safe =
          /^https?:\/\//i.test(href) ||
          /^mailto:/i.test(href) ||
          /^tel:/i.test(href) ||
          (href.startsWith('/') && !href.startsWith('//'));
        if (!safe) {
          return { tagName: 'span', attribs: {} };
        }
        const out = { ...attribs };
        if (out.target === '_blank') {
          out.rel = 'noopener noreferrer';
        } else {
          delete out.target;
        }
        return { tagName: 'a', attribs: out };
      },
    },
  });
}
