/**
 * MAIDEN — Deploy Operator Modal & Dispatch Simulator
 * "Showcase operators, then if you can afford to deploy, you will need a form,
 *  some might free if you want to like humanitarian stuff..."
 */

(function () {
  const DeployModal = {
    modalEl: null,
    currentOperator: null,
    currentVersion: null,

    init() {
      this.createModalDOM();
      this.bindEvents();
    },

    createModalDOM() {
      let modal = document.getElementById('deployModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'deployModal';
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
          <div class="modal-window">
            <button class="modal-close-btn" id="closeDeployModal" aria-label="Close">
              <i class="ti ti-x"></i>
            </button>
            <div id="deployFormContainer" class="deploy-form-wrap">
              <!-- Dynamically populated -->
            </div>
          </div>
        `;
        document.body.appendChild(modal);
      }
      this.modalEl = modal;
    },

    open(operator, versionId) {
      this.currentOperator = operator || window.appState?.operators[0];
      const versions = this.currentOperator?.versions || [];
      this.currentVersion = versions.find(v => v.versionId === versionId) || versions[0];

      this.renderForm();
      this.modalEl.classList.add('open');
      document.body.style.overflow = 'hidden';
    },

    close() {
      this.modalEl.classList.remove('open');
      document.body.style.overflow = '';
    },

    renderForm() {
      const container = document.getElementById('deployFormContainer');
      if (!container || !this.currentOperator || !this.currentVersion) return;

      const op = this.currentOperator;
      const ver = this.currentVersion;

      container.innerHTML = `
        <div class="deploy-header">
          <div class="badge badge-primary"><i class="ti ti-send"></i> Mission Dispatch Portal</div>
          <h2 class="deploy-form-title" style="margin-top: 8px;">Deploy Operator: ${op.name}</h2>
          <p class="deploy-form-subtitle">Specify operational sector, assignment classification, and authorization credentials.</p>
        </div>

        <form id="dispatchForm" onsubmit="event.preventDefault(); window.DeployModal.submitDispatch();">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label"><i class="ti ti-user-check"></i> Selected Entity & Persona</label>
              <select id="deployVersionSelect" class="form-control" onchange="window.DeployModal.onVersionChange(this.value)">
                ${op.versions.map(v => `
                  <option value="${v.versionId}" ${v.versionId === ver.versionId ? 'selected' : ''}>
                    ${op.name} — ${v.versionName} (${v.code})
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label"><i class="ti ti-category"></i> Mission Category</label>
              <select id="deployCategorySelect" class="form-control" onchange="window.DeployModal.updateCostCalculation()">
                <option value="humanitarian" data-price="0">Humanitarian & Public Relief [FREE / 0 Credits]</option>
                <option value="sar" data-price="0">Disaster Search & Rescue [FREE / 0 Credits]</option>
                <option value="general" data-price="${ver.price}">General Civilian Defense (◆ ${ver.price.toLocaleString()} Credits)</option>
                <option value="private" data-price="${Math.round(ver.price * 1.25)}">Private Executive VIP Detail (◆ ${Math.round(ver.price * 1.25).toLocaleString()} Credits)</option>
                <option value="tactical" data-price="${Math.round(ver.price * 1.5)}">Classified High-Threat Combat (◆ ${Math.round(ver.price * 1.5).toLocaleString()} Credits)</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label"><i class="ti ti-map-pin"></i> Deployment Destination / Location</label>
            <input type="text" id="deployLocationInput" class="form-control" placeholder="e.g. Sector-07 Sub-Spire, Geneva Crisis Zone, or Neo-Tokyo Arcology" value="Geneva Humanitarian Medical Center" required>
            <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
              <button type="button" class="btn btn-outline btn-sm" onclick="document.getElementById('deployLocationInput').value='Sector-04 Flood Relief Zone'">Sector-04 Flood Zone</button>
              <button type="button" class="btn btn-outline btn-sm" onclick="document.getElementById('deployLocationInput').value='Neo-Elysium Central Arcology'">Neo-Elysium Arcology</button>
              <button type="button" class="btn btn-outline btn-sm" onclick="document.getElementById('deployLocationInput').value='Orbital Station Artemis Bay 3'">Orbital Station Bay 3</button>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label"><i class="ti ti-id"></i> Dispatcher / Commander Name</label>
              <input type="text" id="dispatcherNameInput" class="form-control" placeholder="Your Name or Call-sign" value="Commander Nova" required>
            </div>
            <div class="form-group">
              <label class="form-label"><i class="ti ti-alarm"></i> Operational Window</label>
              <select id="deployDurationSelect" class="form-control">
                <option value="24h">24 Hours (Standard Tour)</option>
                <option value="72h">72 Hours (Extended Engagement)</option>
                <option value="7d">7 Days (Full Crisis Operation)</option>
                <option value="indefinite">Permanent Stationing</option>
              </select>
            </div>
          </div>

          <div class="cost-calculator-box">
            <div>
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Estimated Deployment Cost</div>
              <div id="costTierNote" style="font-size: 0.85rem; color: var(--text-muted);">Covered under Project MAIDEN Humanitarian Charter</div>
            </div>
            <div id="calculatedCostDisplay" class="cost-val cost-free">FREE (0 Credits)</div>
          </div>

          <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px;">
            <button type="button" class="btn btn-outline" onclick="window.DeployModal.close()">Cancel</button>
            <button type="submit" class="btn btn-primary btn-lg" style="min-width: 180px;">
              <i class="ti ti-rocket"></i> Authorize Dispatch
            </button>
          </div>
        </form>
      `;

      this.updateCostCalculation();
    },

    onVersionChange(newVersionId) {
      if (!this.currentOperator) return;
      this.currentVersion = this.currentOperator.versions.find(v => v.versionId === newVersionId);
      this.renderForm();
    },

    updateCostCalculation() {
      const catSelect = document.getElementById('deployCategorySelect');
      const costDisplay = document.getElementById('calculatedCostDisplay');
      const costNote = document.getElementById('costTierNote');
      if (!catSelect || !costDisplay || !costNote) return;

      const selectedOption = catSelect.options[catSelect.selectedIndex];
      const price = parseInt(selectedOption.getAttribute('data-price') || '0', 10);

      if (price === 0) {
        costDisplay.innerHTML = 'FREE (0 CR)';
        costDisplay.className = 'cost-val cost-free';
        costNote.textContent = '100% Subsidized by MAIDEN Humanitarian Assistance Charter';
      } else {
        costDisplay.innerHTML = `<i class="ti ti-diamond"></i> ${price.toLocaleString()} Credits`;
        costDisplay.className = 'cost-val';
        costNote.textContent = 'Standard commercial invoice billed upon deployment completion';
      }
    },

    submitDispatch() {
      const container = document.getElementById('deployFormContainer');
      const location = document.getElementById('deployLocationInput').value;
      const dispatcher = document.getElementById('dispatcherNameInput').value;
      const duration = document.getElementById('deployDurationSelect').value;
      const catSelect = document.getElementById('deployCategorySelect');
      const categoryName = catSelect.options[catSelect.selectedIndex].text;
      const costDisplay = document.getElementById('calculatedCostDisplay').textContent;

      const orderId = 'MDN-' + Math.floor(100000 + Math.random() * 900000);
      const eta = Math.floor(4 + Math.random() * 12);

      container.innerHTML = `
        <div class="dispatch-receipt-screen">
          <div class="receipt-icon"><i class="ti ti-circle-check"></i></div>
          <h2 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: var(--text-main);">Dispatch Order Authorized</h2>
          <p style="color: var(--text-muted); margin-bottom: 24px;">Operator telemetry engaged. Sub-space orbital pod loaded for drop.</p>

          <div class="receipt-card">
            <div style="border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px; margin-bottom: 12px; font-weight: bold; text-align: center;">
              PROJECT MAIDEN // OFFICIAL DISPATCH DOCKET
            </div>
            <div><strong>ORDER ID:</strong> ${orderId}</div>
            <div><strong>OPERATOR:</strong> ${this.currentOperator.name} (${this.currentVersion.versionName})</div>
            <div><strong>MODEL CODE:</strong> ${this.currentVersion.code}</div>
            <div><strong>ASSIGNMENT TIER:</strong> ${categoryName}</div>
            <div><strong>LOCATION:</strong> ${location}</div>
            <div><strong>COMMANDER:</strong> ${dispatcher}</div>
            <div><strong>DURATION:</strong> ${duration}</div>
            <div><strong>TOTAL FEE:</strong> ${costDisplay}</div>
            <div><strong>STATUS:</strong> <span style="color: #166534; font-weight: bold;">EN ROUTE (ETA: ${eta} MINS)</span></div>
          </div>

          <div style="display: flex; gap: 12px; justify-content: center; margin-top: 24px;">
            <button class="btn btn-outline" onclick="window.print()">
              <i class="ti ti-printer"></i> Print / Save Docket
            </button>
            <button class="btn btn-primary" onclick="window.DeployModal.close()">
              <i class="ti ti-check"></i> Complete & Close
            </button>
          </div>
        </div>
      `;
    },

    bindEvents() {
      document.addEventListener('click', (e) => {
        if (e.target.id === 'closeDeployModal' || e.target.closest('#closeDeployModal')) {
          this.close();
        } else if (e.target === this.modalEl) {
          this.close();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modalEl.classList.contains('open')) {
          this.close();
        }
      });
    }
  };

  window.DeployModal = DeployModal;
})();
