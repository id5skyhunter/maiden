// OPERATOR PRODUCT SLIDER (Inspired by Star Wars Imperial Army Slider)
class OperatorSlider {
  constructor(operators) {
    this.operators = operators || [];
    this.currentIndex = 0;
    this.wrapper = document.querySelector('.operator-slider-wrapper');
    this.slides = [];
    this.images = [];
    this.init();
  }

  init() {
    this.renderSlider();
    this.bindEvents();
    this.updateActiveSlide(0, false);
  }

  renderSlider() {
    const imagesContainer = document.getElementById('slider-cutouts');
    const cardsContainer = document.getElementById('slider-cards-wrp');

    if (!imagesContainer || !cardsContainer) return;

    imagesContainer.innerHTML = '';
    cardsContainer.innerHTML = '';

    this.operators.forEach((op, idx) => {
      // Cutout 3D floating image item
      const imgItem = document.createElement('div');
      imgItem.className = `slider-cutout-item ${idx === 0 ? 'active' : ''}`;
      imgItem.id = `cutout-${op.id}`;
      imgItem.innerHTML = `
        <div class="cutout-glow"></div>
        <img src="${op.image}" alt="${op.name}" class="cutout-img">
        <div class="cutout-badge">
          <span class="badge-type">${op.type}</span>
          <span class="badge-code">${op.code}</span>
        </div>
      `;
      imagesContainer.appendChild(imgItem);

      // Card item
      const card = document.createElement('div');
      card.className = `slider-card-item ${idx === 0 ? 'active' : ''}`;
      card.dataset.index = idx;
      card.dataset.target = `cutout-${op.id}`;

      // Calculate stroke dash for circular percent meter (radius 47, circum ~ 295.3)
      const pct = op.durability || 95;
      const strokeVal = Math.round((pct / 100) * 295.3);

      card.innerHTML = `
        <div class="slider-card-inner">
          <div class="card-bg-grid"></div>
          <div class="card-header-tag">
            <span class="tag-status">TACTICAL SPECIFICATION // ${op.type} ENTITY</span>
            <span class="tag-serial">#${op.code}</span>
          </div>

          <h2 class="slider-card-title">
            <span class="title-sub">${op.title}</span>
            <span class="title-main">${op.name}</span>
          </h2>

          <div class="slider-card-price">
            <span class="price-val">${Number(op.price).toLocaleString()}</span>
            <span class="price-unit">LUMINA CREDITS</span>
          </div>

          <p class="slider-card-quote">“${op.quote}”</p>

          <div class="slider-card-specs">
            <div class="spec-group">
              <span class="spec-label">CHASSIS CORE</span>
              <div class="spec-options">
                <label class="spec-radio">
                  <input type="radio" name="core-${op.id}" checked>
                  <span>${op.type === 'DIVINE' ? 'ETHER-V9' : 'CHRONOS-X'}</span>
                </label>
                <label class="spec-radio">
                  <input type="radio" name="core-${op.id}">
                  <span>${op.type === 'DIVINE' ? 'VOID-AETHEL' : 'NANO-ALLOY'}</span>
                </label>
              </div>

              <span class="spec-label" style="margin-top: 10px;">TACTICAL PROTOCOL</span>
              <div class="spec-options">
                <label class="spec-radio">
                  <input type="radio" name="proto-${op.id}" checked>
                  <span>DOMINION</span>
                </label>
                <label class="spec-radio">
                  <input type="radio" name="proto-${op.id}">
                  <span>MAID HOSP.</span>
                </label>
                <label class="spec-radio">
                  <input type="radio" name="proto-${op.id}">
                  <span>OVERDRIVE</span>
                </label>
              </div>
            </div>

            <div class="spec-separator"></div>

            <div class="spec-gauge">
              <div class="gauge-circle">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="47" class="gauge-bg" />
                  <circle cx="50" cy="50" r="47" class="gauge-val" style="stroke-dasharray: ${strokeVal}, 300;" />
                </svg>
                <div class="gauge-text">${pct}%</div>
              </div>
              <span class="gauge-title">NEURAL INTEGRITY</span>
            </div>
          </div>

          <div class="slider-card-actions">
            <button class="btn-primary buy-btn" data-id="${op.id}">
              <span class="btn-icon">⚡</span>
              <span>REQUISITION / BUY</span>
            </button>
            <button class="btn-secondary inspect-btn" data-id="${op.id}">
              <span class="btn-icon">📊</span>
              <span>IN-GAME STATS</span>
            </button>
            <button class="btn-wishlist js-wishlist" title="Add to Wishlist">
              <span class="heart-icon">♥</span>
            </button>
          </div>
        </div>
      `;

      cardsContainer.appendChild(card);
    });

    this.slides = cardsContainer.querySelectorAll('.slider-card-item');
    this.images = imagesContainer.querySelectorAll('.slider-cutout-item');
  }

  bindEvents() {
    const prevBtn = document.querySelector('.slider-nav-prev');
    const nextBtn = document.querySelector('.slider-nav-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        window.soundEngine.click();
        this.prev();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        window.soundEngine.click();
        this.next();
      });
    }

    // Parallax effect on mouse move over slider
    const sliderContainer = document.querySelector('.operator-slider-section');
    if (sliderContainer) {
      sliderContainer.addEventListener('mousemove', (e) => {
        const rect = sliderContainer.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const activeImg = document.querySelector('.slider-cutout-item.active .cutout-img');
        if (activeImg) {
          activeImg.style.transform = `translate(${x * 24}px, ${y * 18}px) scale(1.02)`;
        }
      });

      sliderContainer.addEventListener('mouseleave', () => {
        const activeImg = document.querySelector('.slider-cutout-item.active .cutout-img');
        if (activeImg) {
          activeImg.style.transform = `translate(0px, 0px) scale(1)`;
        }
      });
    }

    // Wishlist toggles
    document.querySelectorAll('.js-wishlist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.soundEngine.click();
        btn.classList.toggle('active');
        const isFav = btn.classList.contains('active');
        window.showToast(isFav ? "Added to Commander Wishlist" : "Removed from Wishlist");
      });
    });

    // Inspect stats button inside slider
    document.querySelectorAll('.inspect-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const opId = btn.dataset.id;
        window.openDossierModal(opId);
      });
    });

    // Requisition buy button inside slider
    document.querySelectorAll('.buy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const opId = btn.dataset.id;
        window.openPurchaseModal(opId);
      });
    });
  }

  next() {
    if (this.currentIndex < this.slides.length - 1) {
      this.updateActiveSlide(this.currentIndex + 1);
    } else {
      this.updateActiveSlide(0); // loop
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.updateActiveSlide(this.currentIndex - 1);
    } else {
      this.updateActiveSlide(this.slides.length - 1); // loop
    }
  }

  updateActiveSlide(index, playSound = true) {
    this.currentIndex = index;
    if (playSound) window.soundEngine.click();

    this.slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    this.images.forEach((img, i) => {
      img.classList.toggle('active', i === index);
      const imgEl = img.querySelector('.cutout-img');
      if (imgEl) imgEl.style.transform = 'translate(0px, 0px) scale(1)';
    });

    // Update nav buttons disabled state if not looping, or update active dots
    const counterEl = document.querySelector('.slider-counter');
    if (counterEl) {
      counterEl.textContent = `0${index + 1} / 0${this.slides.length}`;
    }
  }
}

window.OperatorSlider = OperatorSlider;
