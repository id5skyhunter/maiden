// ENTITY ACQUISITION & REQUISITION CATALOG ("BUY A DIVINE OR DROID ENTITY")
class EntityCatalog {
  constructor(operators) {
    this.operators = operators || [];
    this.currentFilter = 'ALL';
    this.gridContainer = document.getElementById('catalog-grid');
    this.purchaseModalEl = document.getElementById('purchase-modal');
    this.activeOperator = null;
    this.init();
  }

  init() {
    this.renderCatalog();
    this.bindFilters();
    this.bindPurchaseModal();
  }

  bindFilters() {
    const filterBtns = document.querySelectorAll('.catalog-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundEngine.click();
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.renderCatalog();
      });
    });
  }

  renderCatalog() {
    if (!this.gridContainer) return;
    this.gridContainer.innerHTML = '';

    const filtered = this.operators.filter(op => {
      if (this.currentFilter === 'ALL') return true;
      return op.type === this.currentFilter;
    });

    filtered.forEach(op => {
      const card = document.createElement('div');
      card.className = `catalog-card ${op.type.toLowerCase()}`;

      card.innerHTML = `
        <div class="cat-img-wrap">
          <img src="${op.image}" alt="${op.name}" class="cat-img" loading="lazy">
          <div class="cat-badge ${op.type.toLowerCase()}">${op.type}</div>
          <div class="cat-durability">INTEGRITY: ${op.durability}%</div>
        </div>

        <div class="cat-content">
          <div class="cat-header">
            <span class="cat-code">${op.code}</span>
            <span class="cat-rank">EX-GRADE</span>
          </div>

          <h3 class="cat-name">${op.name}</h3>
          <p class="cat-title">${op.title}</p>

          <div class="cat-stats-mini">
            <div class="c-stat"><span>STR</span><b>${op.stats.str}</b></div>
            <div class="c-stat"><span>AGI</span><b>${op.stats.agi}</b></div>
            <div class="c-stat"><span>INT</span><b>${op.stats.int}</b></div>
            <div class="c-stat"><span>PWR</span><b>${op.stats.pwr}</b></div>
          </div>

          <div class="cat-footer">
            <div class="cat-price">
              <span class="price-num">${Number(op.price).toLocaleString()}</span>
              <span class="price-cur">LUMINA</span>
            </div>
            <div class="cat-actions">
              <button class="cat-btn-inspect" data-id="${op.id}" title="Inspect Stats">📊</button>
              <button class="cat-btn-buy" data-id="${op.id}">REQUISITION</button>
            </div>
          </div>
        </div>
      `;

      card.querySelector('.cat-btn-inspect').addEventListener('click', () => {
        window.openDossierModal(op.id);
      });

      card.querySelector('.cat-btn-buy').addEventListener('click', () => {
        this.openPurchaseModal(op.id);
      });

      this.gridContainer.appendChild(card);
    });
  }

  bindPurchaseModal() {
    const closeBtn = document.getElementById('purchase-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closePurchaseModal());
    }

    if (this.purchaseModalEl) {
      this.purchaseModalEl.addEventListener('click', (e) => {
        if (e.target === this.purchaseModalEl) this.closePurchaseModal();
      });
    }

    const confirmBtn = document.getElementById('btn-confirm-purchase');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => this.executePurchase());
    }
  }

  openPurchaseModal(opId) {
    const op = this.operators.find(o => o.id === opId);
    if (!op) return;

    this.activeOperator = op;
    window.soundEngine.click();

    const nameEl = document.getElementById('purchase-op-name');
    const titleEl = document.getElementById('purchase-op-title');
    const priceEl = document.getElementById('purchase-op-price');
    const imgEl = document.getElementById('purchase-op-img');
    const codeEl = document.getElementById('purchase-op-code');
    const typeEl = document.getElementById('purchase-op-type');

    if (nameEl) nameEl.textContent = op.name;
    if (titleEl) titleEl.textContent = op.title;
    if (priceEl) priceEl.textContent = `${Number(op.price).toLocaleString()} LUMINA CREDITS`;
    if (imgEl) imgEl.src = op.image;
    if (codeEl) codeEl.textContent = op.code;
    if (typeEl) {
      typeEl.textContent = `${op.type} ENTITY`;
      typeEl.className = `p-badge ${op.type.toLowerCase()}`;
    }

    // Reset certificate display
    document.getElementById('purchase-form-step').style.display = 'block';
    document.getElementById('purchase-cert-step').style.display = 'none';

    this.purchaseModalEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closePurchaseModal() {
    window.soundEngine.click();
    this.purchaseModalEl.classList.remove('active');
    document.body.style.overflow = '';
  }

  executePurchase() {
    if (!this.activeOperator) return;

    const op = this.activeOperator;
    const currentCredits = window.getCommanderCredits();

    if (currentCredits < op.price) {
      window.showToast("INSUFFICIENT LUMINA CREDITS. Complete more dispatch missions!");
      return;
    }

    // Deduct credits
    window.updateCommanderCredits(currentCredits - op.price);
    window.soundEngine.purchaseSuccess();

    // Add to owned roster
    window.addRosterOperator(op);

    // Show requisition certificate
    const certSerial = 'MDN-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4);
    document.getElementById('cert-serial-id').textContent = certSerial;
    document.getElementById('cert-op-name').textContent = op.name;
    document.getElementById('cert-op-type').textContent = `${op.type} PROTOCOL`;

    document.getElementById('purchase-form-step').style.display = 'none';
    document.getElementById('purchase-cert-step').style.display = 'block';

    window.showToast(`ACQUISITION CONFIRMED: ${op.name} added to your command roster!`);
  }
}

window.EntityCatalog = EntityCatalog;
