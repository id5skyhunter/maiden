/**
 * MAIDEN — Operator Catalog (Vocaloid Voicebank Grid Architecture)
 * "kiana, has version so current has 2 kiana, but kiana also just need to be shown 1 with version selector"
 */

(function () {
  const OperatorCatalog = {
    selectedVersions: {}, // Map of operatorId -> versionId

    init(containerId) {
      const container = document.getElementById(containerId || 'operatorCatalogGrid');
      if (!container) return;

      const operators = window.appState?.operators || [];
      this.render(container, operators);
    },

    render(container, operators) {
      if (!operators || operators.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--text-muted);">No operators currently listed. Check back after next production run.</div>`;
        return;
      }

      container.innerHTML = operators.map(op => {
        const defaultVerId = this.selectedVersions[op.id] || op.versions[0]?.versionId || 'dg';
        const currentVer = op.versions.find(v => v.versionId === defaultVerId) || op.versions[0];

        return `
          <div class="product-card" id="card-${op.id}">
            <!-- Thumb / Presentation -->
            <div class="product-thumb-wrap">
              <span class="product-rating-overlay">
                <i class="ti ti-star-filled"></i> ${op.rating} (${op.ratingCount || 1200})
              </span>
              <img src="${currentVer.image}" alt="${op.name} ${currentVer.versionName}" class="product-thumb" id="thumb-${op.id}">
            </div>

            <!-- Card Body -->
            <div class="product-card-body">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; gap: 8px; flex-wrap: wrap;">
                <span class="product-tag" id="tag-${op.id}">${currentVer.affiliation || currentVer.tag || 'Tactical Division'}</span>
                <span class="status-pill status-${(currentVer.status || op.status || 'Available').toLowerCase()}" id="status-pill-${op.id}">
                  <span class="status-dot"></span> ${currentVer.status || op.status || 'Available'}
                </span>
              </div>

              <h3 class="product-name">${op.name}</h3>
              <p class="product-subtitle" id="subtitle-${op.id}">${currentVer.versionName} — ${currentVer.code}</p>

              <!-- Version Selector (Toggle between versions) -->
              <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px;">Select Version:</div>
              <div class="product-version-selector">
                ${op.versions.map(v => `
                  <button type="button"
                          class="card-version-btn ${v.versionId === currentVer.versionId ? 'active' : ''}"
                          onclick="window.OperatorCatalog.selectVersion('${op.id}', '${v.versionId}')">
                    ${v.versionName}
                  </button>
                `).join('')}
              </div>

              <!-- Price & Actions -->
              <div class="product-price-row">
                <div>
                  <div class="product-price" id="price-${op.id}"><i class="ti ti-diamond"></i> ${currentVer.price.toLocaleString()}</div>
                </div>
              </div>

              <div class="product-card-actions" style="grid-template-columns: 1fr 1fr auto; gap: 6px;">
                <button class="btn btn-outline btn-sm" onclick="window.DossierModal.open(window.appState.operators.find(o => o.id === '${op.id}'), window.OperatorCatalog.selectedVersions['${op.id}'] || '${currentVer.versionId}')">
                  <i class="ti ti-file-text"></i> Details
                </button>
                <button class="btn btn-primary btn-sm" onclick="window.DeployModal.open(window.appState.operators.find(o => o.id === '${op.id}'), window.OperatorCatalog.selectedVersions['${op.id}'] || '${currentVer.versionId}')">
                  <i class="ti ti-rocket"></i> Deploy
                </button>
                <button class="btn btn-outline btn-sm" title="Schedule Appointment" onclick="window.AppointmentModal.open(window.appState.operators.find(o => o.id === '${op.id}'), window.OperatorCatalog.selectedVersions['${op.id}'] || '${currentVer.versionId}')">
                  <i class="ti ti-calendar-event"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    },

    selectVersion(operatorId, versionId) {
      this.selectedVersions[operatorId] = versionId;
      const op = window.appState?.operators.find(o => o.id === operatorId);
      if (!op) return;

      const ver = op.versions.find(v => v.versionId === versionId);
      if (!ver) return;

      // Update thumb, tag, subtitle, price without re-rendering entire card DOM
      const card = document.getElementById(`card-${operatorId}`);
      if (!card) return;

      const thumb = card.querySelector(`#thumb-${operatorId}`);
      if (thumb) thumb.src = ver.image;

      const tag = card.querySelector(`#tag-${operatorId}`);
      if (tag) tag.textContent = ver.affiliation || 'MAIDEN Division';

      const statusPill = card.querySelector(`#status-pill-${operatorId}`);
      const st = ver.status || op.status || 'Available';
      if (statusPill) {
        statusPill.className = `status-pill status-${st.toLowerCase()}`;
        statusPill.innerHTML = `<span class="status-dot"></span> ${st}`;
      }

      const subtitle = card.querySelector(`#subtitle-${operatorId}`);
      if (subtitle) subtitle.textContent = `${ver.versionName} — ${ver.code}`;

      const price = card.querySelector(`#price-${operatorId}`);
      if (price) price.innerHTML = `<i class="ti ti-diamond"></i> ${ver.price.toLocaleString()}`;

      // Update button active states
      const buttons = card.querySelectorAll('.card-version-btn');
      buttons.forEach(btn => {
        if (btn.textContent.trim() === ver.versionName) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  };

  window.OperatorCatalog = OperatorCatalog;
})();
