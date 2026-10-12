/**
 * MAIDEN — News & PR Blog Manager
 * "remove mission, instead add blog so it's our PR"
 */

(function () {
  const BlogManager = {
    posts: [],
    modalEl: null,

    init(containerId, isLimited) {
      this.createPostModal();
      this.loadPosts().then(posts => {
        this.posts = posts;
        const container = document.getElementById(containerId || 'newsGridContainer');
        if (container) {
          const displayed = isLimited ? posts.slice(0, 3) : posts;
          this.renderGrid(container, displayed);
        }
      });
    },

    async loadPosts() {
      if (window.appState?.posts?.length > 0) {
        return window.appState.posts;
      }

      // Hardcoded fallback or pre-loaded posts from static directory
      const postFiles = [
        'content/posts/maiden-humanitarian-initiative.json',
        'content/posts/kiana-mark2-firmware-update.json',
        'content/posts/make-it-real-keynote.json'
      ];

      const loaded = [];
      for (const file of postFiles) {
        try {
          const res = await fetch(file);
          if (res.ok) {
            const data = await res.json();
            loaded.push(data);
          }
        } catch (e) {
          console.warn('Could not load', file, e);
        }
      }

      // If fetch failed due to file:// protocol, use default static array
      if (loaded.length === 0) {
        return [
          {
            id: 'maiden-humanitarian-initiative',
            title: 'Project MAIDEN Launches Humanitarian Deployment Grant',
            category: 'Press Release',
            date: '2026-10-10',
            author: 'MAIDEN Public Relations',
            excerpt: 'Under our new charter, certified civilian relief efforts, disaster response, and medical logistics can request priority Operator deployment at 0 Credits.',
            content: 'MAIDEN Core Technologies is proud to announce the formal launch of the Humanitarian Assistance Charter. While elite operator syntheses like KIANA (Mark II) are engineered for apex tactical security, our fundamental vision is to safeguard human life. Starting this quarter, vetted NGOs and civic groups may apply through the Deploy Request portal under the "Humanitarian / Public Relief" tier to obtain fully subsidized deployments at zero cost.',
            readTime: '3 min read',
            featured: true
          },
          {
            id: 'kiana-mark2-firmware-update',
            title: 'Firmware Matrix v9.2: Dual-Persona Synchronization & Energy Tuning',
            category: 'Product Update',
            date: '2026-10-04',
            author: 'Engineering Division',
            excerpt: 'A deep dive into KIANA\'s dual mode architecture (Divine Goddess & White Blossom) and the latest neural safety patches.',
            content: 'Firmware matrix update v9.2 is rolling out to all deployed KIANA Mark II units. This patch optimizes power draw during Sub-Space Lance Volley calculations by 18.4% and refines the White Blossom persona switch latency to sub-12 milliseconds. Clients running executive protection profiles will notice smoother interpersonal dialogue modeling and adaptive hospitality scheduling.',
            readTime: '4 min read',
            featured: false
          },
          {
            id: 'make-it-real-keynote',
            title: 'Annual Keynote: "Make It Real" — Bridging Concept Art and Autonomous Reality',
            category: 'Vision & Keynote',
            date: '2026-09-28',
            author: 'Executive Council',
            excerpt: 'At our fall keynote, Project MAIDEN unveiled our motto "Make It Real" and our open catalog roadmap for next-generation operators.',
            content: 'What began as hyper-detailed digital archetypes has now materialized. At Project MAIDEN, our conviction is captured in three simple words: "Make It Real". Every unit built in our orbital fabrication bays represents real mechanics, real neural synthesis, and unwavering dedication to the master\'s safety and service. Explore our live catalog and prepare for the next generation.',
            readTime: '5 min read',
            featured: false
          }
        ];
      }

      return loaded;
    },

    renderGrid(container, posts) {
      container.innerHTML = posts.map(post => `
        <article class="news-card" onclick="window.BlogManager.openPost('${post.id}')">
          <div class="news-card-meta">
            <span class="badge ${post.featured ? 'badge-primary' : 'badge-outline'}">${post.category}</span>
            <span><i class="ti ti-calendar"></i> ${post.date}</span>
          </div>
          <h3 class="news-card-title">${post.title}</h3>
          <p class="news-card-excerpt">${post.excerpt}</p>
          <div class="news-card-foot">
            <span><i class="ti ti-clock"></i> ${post.readTime}</span>
            <span>Read Release <i class="ti ti-arrow-right"></i></span>
          </div>
        </article>
      `).join('');
    },

    createPostModal() {
      let modal = document.getElementById('postModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'postModal';
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
          <div class="modal-window" style="max-width: 760px;">
            <button class="modal-close-btn" id="closePostModal" aria-label="Close">
              <i class="ti ti-x"></i>
            </button>
            <div id="postModalBody" style="padding: 36px 40px;">
              <!-- Dynamic post content -->
            </div>
          </div>
        `;
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
          if (e.target.id === 'closePostModal' || e.target.closest('#closePostModal') || e.target === modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
          }
        });
      }
      this.modalEl = modal;
    },

    openPost(postId) {
      const post = this.posts.find(p => p.id === postId);
      if (!post || !this.modalEl) return;

      const body = document.getElementById('postModalBody');
      body.innerHTML = `
        <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 12px;">
          <span class="badge badge-primary">${post.category}</span>
          <span style="font-size: 0.8rem; color: var(--text-muted);"><i class="ti ti-calendar"></i> ${post.date}</span>
          <span style="font-size: 0.8rem; color: var(--text-muted);">• ${post.readTime}</span>
        </div>
        <h1 style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: var(--text-main); line-height: 1.25; margin-bottom: 16px;">
          ${post.title}
        </h1>
        <div style="font-size: 0.85rem; color: var(--text-muted); border-bottom: 1px solid var(--border-light); padding-bottom: 16px; margin-bottom: 24px;">
          Published by <strong>${post.author}</strong>
        </div>
        <div style="font-size: 1rem; color: var(--text-main); line-height: 1.8;">
          <p style="font-size: 1.1rem; font-weight: 500; color: var(--text-muted); margin-bottom: 20px; line-height: 1.7;">
            ${post.excerpt}
          </p>
          <p>${post.content}</p>
        </div>
        <div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.8rem; color: var(--text-muted);">MAIDEN PR & Media Relations</span>
          <button class="btn btn-outline btn-sm" onclick="document.getElementById('postModal').classList.remove('open'); document.body.style.overflow = '';">
            Close Article
          </button>
        </div>
      `;

      this.modalEl.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.BlogManager = BlogManager;
})();
