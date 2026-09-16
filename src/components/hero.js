export function renderHero() {
  const section = document.createElement('section');
  section.id = 'app-showcase';
  section.className = 'relative overflow-hidden border-b border-[#1E293B] bg-gradient-to-b from-[#0B0F17] to-[#07090E] py-12 md:py-16';

  section.innerHTML = `
    <!-- Background Glow -->
    <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none rounded-full"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        <!-- Left Text & CTAs -->
        <div class="lg:col-span-7 space-y-5 text-center lg:text-left">
          
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            ZeroDaily Mobile App Now In Early Access
          </div>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Tech news is full of corporate fluff. <br class="hidden sm:inline" />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300">We roast the facts in 60 words.</span>
          </h1>

          <p class="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Curated daily across Cybersecurity, AI, Software Engineering, Robotics, Defense, and Semiconductors. Powered by Bedrock DeepSeek summarization, WebP image caching, and FCM breaking alerts.
          </p>

          <!-- Feature Bullets -->
          <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-slate-300 font-mono">
            <div class="flex items-center gap-1.5 bg-[#121927] border border-[#1E293B] px-2.5 py-1 rounded-lg">
              <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              <span>Zero PR Spin</span>
            </div>
            <div class="flex items-center gap-1.5 bg-[#121927] border border-[#1E293B] px-2.5 py-1 rounded-lg">
              <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              <span>Offline Inshorts Feed</span>
            </div>
            <div class="flex items-center gap-1.5 bg-[#121927] border border-[#1E293B] px-2.5 py-1 rounded-lg">
              <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              <span>Breaking 0-Day Pushes</span>
            </div>
          </div>

          <!-- Download Action Buttons -->
          <div class="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
            <a
              href="https://github.com/err0rgod/zerodaily/releases"
              target="_blank"
              class="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 transition-all hover:scale-[1.02]"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a1.986 1.986 0 0 1-.61-.924V2.738c.11-.343.32-.66.61-.924zm11.59 11.59l2.42-2.42a1.39 1.39 0 0 0 0-1.968l-2.42-2.42-7.58 7.58 7.58-7.58zm1.406-3.376l-2.185-1.261-3.648 3.648 3.648 3.648 2.185-1.261a1.442 1.442 0 0 0 0-2.398l-.001-.001zM4.995 1.428l8.016 8.016-8.016 8.016a.48.48 0 0 1-.386-.145L4.61 17.3a1.41 1.41 0 0 0 0-1.996l3.99-3.99-3.99-3.99a1.41 1.41 0 0 0 0-1.996L4.61 5.313a.478.478 0 0 1 .385-.145z"/>
              </svg>
              <span>Download Android APK</span>
            </a>

            <a
              href="#app-showcase"
              onclick="alert('iOS TestFlight build is being reviewed by Apple. Download the Android APK or use this web reader in the meantime!')"
              class="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-[#121927] border border-[#1E293B] text-slate-200 font-semibold text-sm hover:border-slate-600 hover:text-white transition-all"
            >
              <svg class="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.98.6-2.61 1.34-.55.63-1.03 1.68-.9 2.71 1 .08 2-.45 2.59-1.2z"/>
              </svg>
              <span>iOS TestFlight</span>
            </a>
          </div>

        </div>

        <!-- Right Visual Mockup -->
        <div class="lg:col-span-5 flex justify-center">
          <div class="relative w-72 sm:w-80 p-3 rounded-[36px] bg-[#121927] border-2 border-[#1E293B] shadow-2xl shadow-cyan-950/40">
            <!-- Camera Notch -->
            <div class="w-28 h-4 bg-[#07090E] mx-auto rounded-b-xl mb-3 flex items-center justify-center">
              <div class="w-2.5 h-2.5 rounded-full bg-[#1E293B]"></div>
            </div>

            <!-- Mini App Screen -->
            <div class="bg-[#07090E] rounded-[24px] p-3.5 space-y-3 border border-[#1E293B]/60 text-left">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">Cybersecurity</span>
                <span class="text-[10px] font-mono text-slate-500">12m ago</span>
              </div>
              <div class="h-28 rounded-lg bg-gradient-to-br from-red-950/40 via-[#1E293B] to-slate-900 overflow-hidden relative border border-red-900/30">
                <div class="absolute inset-0 flex items-center justify-center text-xs font-mono text-red-300 font-bold p-2 text-center">
                  CROWDSTRIKE SENSOR CORRUPT
                </div>
              </div>
              <h4 class="text-xs font-bold text-white line-clamp-2 leading-snug">
                Sysadmins Globally Rediscover Analog Pen and Paper
              </h4>
              <p class="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                A single null pointer in a sensor driver halts international aviation, reminding humanity that software engineering is largely luck.
              </p>
              <div class="pt-2 border-t border-[#1E293B] flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Swipe up for next</span>
                <span class="text-cyan-400 font-bold">1/25</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
  `;

  return section;
}
