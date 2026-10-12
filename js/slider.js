/**
 * MAIDEN — Hero Product Slider (Star Wars / Vocaloid Clean Edition)
 * "it should showcase rating and favorites, add parameter to that, like avg rating 4.5 favorites 523100"
 */

(function () {
  const HeroSlider = {
    currentIndex: 0,
    operator: null,
    autoPlayTimer: null,

    init(operator) {
      this.operator = operator || window.appState?.operators[0];
      if (!this.operator || !this.operator.versions || this.operator.versions.length === 0) return;

      this.render();
      this.bindControls();
    },

    render() {
      const container = document.getElementById('heroSliderContainer');
      if (!container || !this.operator) return;

      const op = this.operator;
      const ver = op.versions[this.currentIndex] || op.versions[0];

      container.innerHTML = `
        <div class="slider-container">
          <!-- Text Info Column -->
          <div class="hero-info">
            <div class="hero-meta-row">
              <span class="badge badge-primary"><i class="ti ti-check-circle"></i> S-Rank Verified</span>
              <span class="badge badge-outline">${ver.code}</span>
              <span class="rating-badge">
                <i class="ti ti-star-filled"></i> ${op.rating} <span style="font-weight: normal; color: #78350f;">(${op.ratingCount || 1200})</span>
              </span>
              <span class="favorites-badge">
                <i class="ti ti-heart-filled"></i> ${op.favorites.toLocaleString()} favorites
              </span>
            </div>

            <div>
              <h1 class="hero-title">${op.name}</h1>
              <span class="hero-version-name">${ver.versionName}</span>
            </div>

            <p class="hero-quote">"${ver.quote}"</p>
            <p class="hero-desc">${ver.description}</p>

            <!-- Version Switcher Pills -->
            <div class="version-switcher-wrap">
              <div class="version-switcher-label"><i class="ti ti-adjustments-horizontal"></i> Select Operational Version:</div>
              <div class="version-pills">
                ${op.versions.map((v, i) => `
                  <button type="button" class="version-pill ${i === this.currentIndex ? 'active' : ''}"
                          onclick="window.HeroSlider.goToSlide(${i})">
                    <i class="ti ti-layers-subtract"></i> ${v.versionName}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Price & Specs -->
            <div class="hero-price-row">
              <div class="hero-price">$${ver.price.toLocaleString()}</div>
              <div class="hero-price-note">Credits / Unit (Grant available for relief operations)</div>
            </div>

            <!-- Action Buttons -->
            <div class="hero-cta-group">
              <button class="btn btn-primary btn-lg" onclick="window.DeployModal.open(window.HeroSlider.operator, '${ver.versionId}')">
                <i class="ti ti-rocket"></i> Deploy Now
              </button>
              <button class="btn btn-outline btn-lg" onclick="window.DossierModal.open(window.HeroSlider.operator, '${ver.versionId}')">
                <i class="ti ti-file-certificate"></i> View Full CV & Stats
              </button>
              <button class="btn btn-lucky btn-lg" onclick="window.LuckyDispatch.roll()">
                <i class="ti ti-dice-5"></i> I'm Feeling Lucky
              </button>
            </div>
          </div>

          <!-- Visual Column (Cutout Character + Box Mockup) -->
          <div class="hero-visual">
            <div class="hero-box-backdrop"></div>
            ${ver.boxImage ? `
              <img src="${ver.boxImage}" alt="${op.name} Product Box" class="hero-img-box" title="Official Box Mockup">
            ` : ''}
            <img src="${ver.image}" alt="${op.name} ${ver.versionName}" class="hero-img-char" id="heroCharImg">
          </div>
        </div>

        <!-- Slider Arrows -->
        <div class="slider-nav-arrows">
          <button class="slider-arrow" id="sliderPrevBtn" aria-label="Previous Version" onclick="window.HeroSlider.prevSlide()">
            <i class="ti ti-chevron-left"></i>
          </button>
          <button class="slider-arrow" id="sliderNextBtn" aria-label="Next Version" onclick="window.HeroSlider.nextSlide()">
            <i class="ti ti-chevron-right"></i>
          </button>
        </div>
      `;
    },

    goToSlide(index) {
      if (!this.operator || !this.operator.versions) return;
      this.currentIndex = (index + this.operator.versions.length) % this.operator.versions.length;
      this.render();
    },

    nextSlide() {
      this.goToSlide(this.currentIndex + 1);
    },

    prevSlide() {
      this.goToSlide(this.currentIndex - 1);
    },

    bindControls() {
      // Key navigation
      document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
        if (e.key === 'ArrowRight') this.nextSlide();
        if (e.key === 'ArrowLeft') this.prevSlide();
      });
    }
  };

  window.HeroSlider = HeroSlider;
})();
