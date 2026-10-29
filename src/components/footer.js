import { CONTAINER } from './header.js';

export const CONTACT_EMAIL = 'hi@zerodaily.in';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '/wire', label: "Today's Wire" },
      { href: '/download', label: 'Download for Android' },
      { href: '/join', label: 'Join the waitlist' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/contact', label: 'Contact us' },
      { href: '/feedback', label: 'Send feedback' },
      { href: `mailto:${CONTACT_EMAIL}?subject=Press%20enquiry`, label: 'Press' },
      { href: `mailto:${CONTACT_EMAIL}?subject=Partnership%20enquiry`, label: 'Partnerships' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy policy' },
      { href: '/terms', label: 'Terms of use' },
      { href: '/delete-account', label: 'Delete account' },
    ],
  },
];

const MAIL_ICON = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>';

export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'border-t border-rule dark:border-night-rule bg-paper-raised/60 dark:bg-night-raised';

  const year = new Date().getFullYear();
  const link = 'text-ink-soft dark:text-paper-soft hover:text-ink dark:hover:text-paper-ink transition-colors';

  footer.innerHTML = `
    <div class="${CONTAINER} pt-14 pb-10 grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
      <div class="max-w-sm">
        <a href="/" class="inline-flex items-center gap-2">
          <img src="/favicon.svg" alt="" class="w-7 h-7 rounded-md" />
          <span class="text-lg font-semibold tracking-tight text-ink dark:text-paper-ink">ZeroDaily</span>
        </a>
        <p class="mt-4 font-serif text-xl leading-snug text-ink dark:text-paper-ink">Zero fluff. Daily stop for Tech News.</p>
        <p class="mt-2 text-sm leading-relaxed text-ink-soft dark:text-paper-soft">
          The stories that matter across security, AI/ML, engineering, robotics, defense, VLSI and finance.
        </p>
        <a href="mailto:${CONTACT_EMAIL}" class="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink dark:text-paper-ink hover:text-brand dark:hover:text-brand-dark transition-colors">
          ${MAIL_ICON}<span>${CONTACT_EMAIL}</span>
        </a>
        <div class="mt-5 flex flex-wrap gap-2">
          <a href="https://www.nvidia.com/en-us/startups/" target="_blank" rel="noopener" class="flex w-fit items-center gap-2 rounded-full border border-rule dark:border-night-rule px-3 py-1.5 text-xs font-medium text-ink-soft dark:text-paper-soft hover:text-ink dark:hover:text-paper-ink transition-colors">
            <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="NVIDIA"><path d="M8.948 8.798v-1.43a6.7 6.7 0 0 1 .424-.018c3.922-.124 6.493 3.374 6.493 3.374s-2.774 3.851-5.75 3.851c-.398 0-.787-.062-1.158-.185v-4.346c1.528.185 1.837.857 2.747 2.385l2.04-1.714s-1.492-1.952-4-1.952a6.016 6.016 0 0 0-.796.035m0-4.735v2.138l.424-.027c5.45-.185 9.01 4.47 9.01 4.47s-4.08 4.964-8.33 4.964c-.37 0-.733-.035-1.095-.097v1.325c.3.035.61.062.91.062 3.957 0 6.82-2.023 9.593-4.408.459.371 2.34 1.263 2.73 1.652-2.633 2.208-8.772 3.984-12.253 3.984-.335 0-.653-.018-.971-.053v1.864H24V4.063zm0 10.326v1.131c-3.657-.654-4.673-4.46-4.673-4.46s1.758-1.944 4.673-2.262v1.237H8.94c-1.528-.186-2.73 1.245-2.73 1.245s.68 2.412 2.739 3.11M2.456 10.9s2.164-3.197 6.5-3.533V6.201C4.153 6.59 0 10.653 0 10.653s2.35 6.802 8.948 7.42v-1.237c-4.84-.6-6.492-5.936-6.492-5.936z"/></svg>
            <span>Member of NVIDIA Inception</span>
          </a>
          <a href="https://aws.amazon.com/startups/" target="_blank" rel="noopener" class="flex w-fit items-center gap-2 rounded-full border border-rule dark:border-night-rule px-3 py-1.5 text-xs font-medium text-ink-soft dark:text-paper-soft hover:text-ink dark:hover:text-paper-ink transition-colors">
            <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="AWS"><path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.272-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.383.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z"/></svg>
            <span>Member of AWS Activate</span>
          </a>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-10 lg:contents">
        ${COLUMNS.map(col => `
          <nav aria-label="${col.title}">
            <h2 class="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint dark:text-paper-faint">${col.title}</h2>
            <ul class="mt-4 space-y-3 text-sm">
              ${col.links.map(l => `<li><a href="${l.href}" class="${link}">${l.label}</a></li>`).join('')}
            </ul>
          </nav>
        `).join('')}
      </div>
    </div>

    <div class="border-t border-rule dark:border-night-rule">
      <div class="${CONTAINER} py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-faint dark:text-paper-faint">
        <p>&copy; ${year} ZeroDaily. All rights reserved.</p>
        <p>Seven desks &middot; Updated every 15 minutes</p>
      </div>
    </div>
  `;

  return footer;
}
