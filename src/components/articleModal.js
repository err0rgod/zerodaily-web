import { CATEGORIES } from '../api.js';

export function renderArticleModal() {
  const modal = document.createElement('div');
  modal.id = 'article-modal';
  modal.className = 'fixed inset-0 z-50 hidden items-center justify-center p-4 sm:p-6 overflow-y-auto modal-backdrop';

  modal.innerHTML = `
    <div
      id="modal-card"
      class="relative w-full max-w-2xl bg-[#0D131F] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden my-8"
    >
      <!-- Modal Close Button -->
      <button
        id="modal-close-btn"
        class="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#07090E]/80 border border-[#1E293B] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      <!-- Modal Image -->
      <div class="relative h-60 w-full bg-[#07090E]">
        <img id="modal-image" src="" alt="" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#0D131F] via-[#0D131F]/40 to-transparent"></div>

        <div class="absolute bottom-4 left-6 right-6 flex items-center justify-between">
          <span id="modal-category" class="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider"></span>
          <span id="modal-date" class="text-xs font-mono text-slate-400 bg-[#07090E]/80 px-2 py-0.5 rounded border border-[#1E293B]"></span>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="p-6 sm:p-8 space-y-6">
        
        <h2 id="modal-heading" class="text-2xl sm:text-3xl font-extrabold text-white leading-tight"></h2>

        <!-- Satirical Roast Box -->
        <div class="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1">
          <div class="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            <span>The 60-Second Roast</span>
          </div>
          <p id="modal-short-roast" class="text-sm text-slate-200 leading-relaxed"></p>
        </div>

        <!-- Serious Breakdown -->
        <div class="space-y-2">
          <h4 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">The Actual Facts</h4>
          <div id="modal-full-summary" class="text-sm text-slate-300 leading-relaxed space-y-3"></div>
        </div>

        <!-- In-Modal App Download Banner -->
        <div class="p-4 rounded-xl bg-[#121927] border border-[#1E293B] flex items-center justify-between gap-4">
          <div>
            <h5 class="text-xs font-bold text-white">Enjoying ZeroDaily?</h5>
            <p class="text-[11px] text-slate-400 font-mono">Get instant breaking alerts on your phone with zero ads.</p>
          </div>
          <a
            href="#app-showcase"
            id="modal-download-cta"
            class="flex-shrink-0 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono transition-colors"
          >
            Get App
          </a>
        </div>

        <!-- Action Bar -->
        <div class="pt-4 border-t border-[#1E293B] flex items-center justify-between flex-wrap gap-3">
          <a
            id="modal-source-link"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            <span>Read Original Source Article</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>

          <button
            id="modal-share-btn"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121927] border border-[#1E293B] text-slate-300 hover:text-white text-xs font-mono transition-colors"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
            <span>Share Story</span>
          </button>
        </div>

      </div>
    </div>
  `;

  // Close handlers
  const closeBtn = modal.querySelector('#modal-close-btn');
  const modalDownloadCta = modal.querySelector('#modal-download-cta');

  const closeModal = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);
  modalDownloadCta.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  return {
    element: modal,
    open: (article) => {
      const catMeta = CATEGORIES.find(c => c.key === article.category) || { name: article.category, color: '#06B6D4' };
      const fallbackImg = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80';

      modal.querySelector('#modal-image').src = article.image_url || fallbackImg;
      modal.querySelector('#modal-heading').textContent = article.heading || 'ZeroDaily News';
      modal.querySelector('#modal-short-roast').textContent = article.shortSummary || '';
      modal.querySelector('#modal-full-summary').textContent = article.fullSummary || article.shortSummary || '';
      modal.querySelector('#modal-source-link').href = article.link || '#';

      const catBadge = modal.querySelector('#modal-category');
      catBadge.textContent = catMeta.name;
      catBadge.style.backgroundColor = `${catMeta.color}20`;
      catBadge.style.color = catMeta.color;
      catBadge.style.border = `1px solid ${catMeta.color}40`;

      const dateBadge = modal.querySelector('#modal-date');
      dateBadge.textContent = article.published_at ? new Date(article.published_at).toLocaleDateString() : '';

      const shareBtn = modal.querySelector('#modal-share-btn');
      shareBtn.onclick = () => {
        const shareUrl = `${window.location.origin}/?id=${encodeURIComponent(article.id)}`;
        if (navigator.share) {
          navigator.share({
            title: article.heading,
            text: article.shortSummary,
            url: shareUrl
          }).catch(() => {});
        } else {
          navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Article link copied to clipboard!');
          });
        }
      };

      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }
  };
}
