/**
 * MAIDEN — Clean Light Theme Hero Product Slideshow
 * Clean 2-column showcase featuring verified Top 10 Operators with smooth transitions
 */

(function () {
  const HeroSlider = {
    operators: [],
    currentIndex: 0,
    selectedVersions: {}, // Map of operatorId -> versionId
    isAnimating: false,
    autoplayTimer: null,

    init(operators) {
      this.operators = (operators && operators.length > 0) ? operators : (window.appState?.operators || []);
      if (!this.operators || this.operators.length === 0) return;

      // Initialize selected versions
      this.operators.forEach(op => {
        if (op.versions && op.versions.length > 0) {
          this.selectedVersions[op.id] = op.versions[0].versionId;
        }
      });

      this.render();
      this.bindEvents();
      this.startAutoplay();
    },

    getActiveVersion(op) {
      const vId = this.selectedVersions[op.id];
      return op.versions?.find(v => v.versionId === vId) || op.versions[0];
    },

    render() {
      const container = document.getElementById('heroSliderContainer');
      if (!container || this.operators.length === 0) return;

      const op = this.operators[this.currentIndex];
      const ver = this.getActiveVersion(op);
      const opIndex = this.currentIndex;

      container.innerHTML = `
        <div class="hero-slideshow-wrap" id="heroSlideshowWrap">
          <div class="slider-container" id="heroActiveSlide">
            <!-- Left Info Column -->
            <div class="hero-info">
              <!-- Meta Badges Row -->
              <div class="hero-meta-row">
                <span class="badge badge-primary"><i class="ti ti-trophy"></i> Top 10 Operator Deployed</span>
                <span class="badge badge-outline" id="slideCodeBadge">${ver.code}</span>
                <span class="badge badge-outline" id="slideAffilBadge"><i class="ti ti-shield"></i> ${ver.affiliation || 'MAIDEN Tactical Division'}</span>
                <span class="rating-badge">
                  <i class="ti ti-star-filled"></i> ${op.rating} <span style="font-weight: normal; color: #78350f;">(${op.ratingCount || 1200})</span>
                </span>
                <span class="favorites-badge">
                  <i class="ti ti-heart-filled"></i> ${op.favorites ? op.favorites.toLocaleString() : '1,200'} favorites
                </span>
              </div>

              <!-- Title & Persona Subtitle -->
              <div>
                <h1 class="hero-title">${op.name}</h1>
                <span class="hero-version-name" id="slideVersionName">${ver.versionName}</span>
              </div>

              <!-- Quote & Description -->
              <p class="hero-quote" id="slideQuote">"${ver.quote}"</p>
              <p class="hero-desc" id="slideDesc">${ver.description}</p>

              <!-- Version Switcher Pills (If unit has multiple versions) -->
              <div class="version-switcher-wrap">
                <div class="version-switcher-label"><i class="ti ti-adjustments-horizontal"></i> Select Operational Version:</div>
                <div class="version-pills" id="slideVersionPills">
                  ${op.versions.map(v => `
                    <button type="button" class="version-pill ${v.versionId === ver.versionId ? 'active' : ''}"
                            onclick="window.HeroSlider.selectVersion('${op.id}', '${v.versionId}')">
                      <i class="ti ti-layers-subtract"></i> ${v.versionName}
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Diamond Price & Notes -->
              <div class="hero-price-row">
                <div class="hero-price" id="slidePrice">
                  <i class="ti ti-diamond"></i> ${ver.price.toLocaleString()}
                </div>
                <div class="hero-price-note">Credits / Unit (100% Grant available on Relief)</div>
              </div>

              <!-- Action Buttons -->
              <div class="hero-cta-group">
                <button type="button" class="btn btn-primary btn-lg" onclick="window.HeroSlider.openDeploy()">
                  <i class="ti ti-rocket"></i> Deploy Operator
                </button>
                <button type="button" class="btn btn-outline btn-lg" onclick="window.HeroSlider.openDossier()">
                  <i class="ti ti-file-text"></i> Details
                </button>
                <button type="button" class="btn btn-lucky btn-lg" onclick="window.LuckyDispatch.roll()">
                  <i class="ti ti-dice-5"></i> Lucky Pick
                </button>
              </div>
            </div>

            <!-- Right Visual Column (3D Box Packaging Mockup) -->
            <div class="hero-visual">
              <div class="hero-box-backdrop"></div>
              <img src="${ver.boxImage}" alt="${op.name} 3D Packaging Mockup" class="hero-img-box" id="slideBoxImg" title="Official 3D Packaging Mockup: ${op.name}">
            </div>
          </div>

          <!-- Slideshow Navigation Arrows -->
          <button type="button" class="slider-arrow slider-arrow-prev" id="sliderPrevBtn" aria-label="Previous Operator" onclick="window.HeroSlider.prevSlide()">
            <i class="ti ti-chevron-left"></i>
          </button>
          <button type="button" class="slider-arrow slider-arrow-next" id="sliderNextBtn" aria-label="Next Operator" onclick="window.HeroSlider.nextSlide()">
            <i class="ti ti-chevron-right"></i>
          </button>

          <!-- Slideshow Pagination Indicator Dots -->
          <div class="slider-dots">
            ${this.operators.map((o, idx) => `
              <button type="button" class="slider-dot ${idx === this.currentIndex ? 'active' : ''}"
                      title="${o.name}"
                      onclick="window.HeroSlider.goToSlide(${idx})">
                <span class="dot-num">${idx + 1}</span>
                <span class="dot-name">${o.name}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;

      // Re-bind hover pause on the new DOM
      const wrapEl = document.getElementById('heroSlideshowWrap');
      if (wrapEl) {
        wrapEl.addEventListener('mouseenter', () => this.stopAutoplay());
        wrapEl.addEventListener('mouseleave', () => this.startAutoplay());
      }
    },

    openDeploy() {
      const op = this.operators[this.currentIndex];
      if (!op) return;
      const vId = this.selectedVersions[op.id];
      if (window.DeployModal) window.DeployModal.open(op, vId);
    },

    openDossier() {
      const op = this.operators[this.currentIndex];
      if (!op) return;
      const vId = this.selectedVersions[op.id];
      if (window.DossierModal) window.DossierModal.open(op, vId);
    },

    goToSlide(index) {
      if (this.isAnimating || index === this.currentIndex) return;
      if (index < 0 || index >= this.operators.length) return;

      this.isAnimating = true;
      const slideEl = document.getElementById('heroActiveSlide');

      if (slideEl) {
        slideEl.classList.add('slide-fade-out');
        setTimeout(() => {
          this.currentIndex = index;
          this.render();
          const newSlide = document.getElementById('heroActiveSlide');
          if (newSlide) {
            newSlide.classList.add('slide-fade-in');
            setTimeout(() => {
              newSlide.classList.remove('slide-fade-in');
              this.isAnimating = false;
            }, 300);
          } else {
            this.isAnimating = false;
          }
        }, 200);
      } else {
        this.currentIndex = index;
        this.render();
        this.isAnimating = false;
      }

      this.startAutoplay();
    },

    nextSlide() {
      const nextIdx = (this.currentIndex + 1) % this.operators.length;
      this.goToSlide(nextIdx);
    },

    prevSlide() {
      const prevIdx = (this.currentIndex - 1 + this.operators.length) % this.operators.length;
      this.goToSlide(prevIdx);
    },

    selectVersion(operatorId, versionId) {
      const op = this.operators.find(o => o.id === operatorId);
      if (!op) return;

      this.selectedVersions[operatorId] = versionId;
      const ver = op.versions.find(v => v.versionId === versionId);
      if (!ver) return;

      // Update text fields smoothly with quick transition
      const vName = document.getElementById('slideVersionName');
      if (vName) vName.textContent = ver.versionName;

      const codeBadge = document.getElementById('slideCodeBadge');
      if (codeBadge) codeBadge.textContent = ver.code;

      const affilBadge = document.getElementById('slideAffilBadge');
      if (affilBadge) affilBadge.innerHTML = `<i class="ti ti-shield"></i> ${ver.affiliation || 'MAIDEN Tactical Division'}`;

      const quote = document.getElementById('slideQuote');
      if (quote) quote.textContent = `"${ver.quote}"`;

      const desc = document.getElementById('slideDesc');
      if (desc) desc.textContent = ver.description;

      const price = document.getElementById('slidePrice');
      if (price) price.innerHTML = `<i class="ti ti-diamond"></i> ${ver.price.toLocaleString()}`;

      // Update pill buttons
      const pillsContainer = document.getElementById('slideVersionPills');
      if (pillsContainer) {
        pillsContainer.querySelectorAll('.version-pill').forEach(btn => {
          btn.classList.toggle('active', btn.textContent.trim().includes(ver.versionName));
        });
      }

      // Update 3D box image
      const boxImg = document.getElementById('slideBoxImg');
      if (boxImg && ver.boxImage) {
        boxImg.style.opacity = '0';
        boxImg.style.transform = 'scale(0.96)';
        setTimeout(() => {
          boxImg.src = ver.boxImage;
          boxImg.style.opacity = '1';
          boxImg.style.transform = 'scale(1)';
        }, 180);
      }

      this.startAutoplay();
    },

    startAutoplay() {
      this.stopAutoplay();
      this.autoplayTimer = setInterval(() => {
        this.nextSlide();
      }, 7000);
    },

    stopAutoplay() {
      if (this.autoplayTimer) {
        clearInterval(this.autoplayTimer);
        this.autoplayTimer = null;
      }
    },

    bindEvents() {
      // Key navigation
      document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
        if (e.key === 'ArrowRight') this.nextSlide();
        if (e.key === 'ArrowLeft') this.prevSlide();
      });

      // Touch swipe support for mobile
      const wrap = document.querySelector('.hero-slideshow-wrap');
      if (wrap) {
        let startX = 0;
        wrap.addEventListener('touchstart', (e) => {
          startX = e.changedTouches[0].screenX;
        }, { passive: true });

        wrap.addEventListener('touchend', (e) => {
          const endX = e.changedTouches[0].screenX;
          if (startX - endX > 50) this.nextSlide();
          else if (endX - startX > 50) this.prevSlide();
        }, { passive: true });
      }
    }
  };

  window.HeroSlider = HeroSlider;
})();
