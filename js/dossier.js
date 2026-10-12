/**
 * MAIDEN — Operator CV & Stats Dossier
 * "stats only on detail page, it's her CV bassically, change a bit like add work experience, learning model, etc"
 */

(function () {
  const DossierModal = {
    modalEl: null,
    currentOperator: null,
    currentVersionId: 'dg',

    init() {
      this.createModalDOM();
      this.bindEvents();
    },

    createModalDOM() {
      let modal = document.getElementById('dossierModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'dossierModal';
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
          <div class="modal-window" style="max-width: 960px;">
            <button class="modal-close-btn" id="closeDossierModal" aria-label="Close">
              <i class="ti ti-x"></i>
            </button>
            <div id="dossierContentContainer">
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
      this.currentVersionId = versionId || this.currentOperator?.versions[0]?.versionId || 'dg';
      this.render();
      this.modalEl.classList.add('open');
      document.body.style.overflow = 'hidden';
    },

    close() {
      this.modalEl.classList.remove('open');
      document.body.style.overflow = '';
    },

    switchVersion(vId) {
      this.currentVersionId = vId;
      this.render();
    },

    render() {
      const container = document.getElementById('dossierContentContainer');
      if (!container || !this.currentOperator) return;

      const op = this.currentOperator;
      const ver = op.versions.find(v => v.versionId === this.currentVersionId) || op.versions[0];
      const cv = ver.cv || {};
      const stats = ver.stats || {};
      const abilities = ver.abilities || [];

      container.innerHTML = `
        <div class="dossier-layout">
          <!-- Header -->
          <div class="dossier-header">
            <div style="text-align: center;">
              <img src="${ver.image}" alt="${op.name} - ${ver.versionName}" class="dossier-avatar">
            </div>
            <div class="dossier-header-info">
              <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px; flex-wrap: wrap;">
                <span class="badge badge-primary">${ver.code}</span>
                <span class="badge badge-outline">${ver.tag} Class</span>
                <span class="rating-badge"><i class="ti ti-star-filled"></i> ${op.rating} / 5.0</span>
                <span class="favorites-badge"><i class="ti ti-heart-filled"></i> ${op.favorites.toLocaleString()}</span>
              </div>
              <h2>${op.name}</h2>
              <h3>${ver.versionName}</h3>
              <p style="font-style: italic; color: var(--text-muted); margin-bottom: 14px;">"${ver.quote}"</p>

              <!-- Version Switcher Pills -->
              <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                ${op.versions.map(v => `
                  <button type="button" class="btn btn-sm ${v.versionId === ver.versionId ? 'btn-primary' : 'btn-outline'}"
                          onclick="window.DossierModal.switchVersion('${v.versionId}')">
                    <i class="ti ti-layers-subtract"></i> ${v.versionName}
                  </button>
                `).join('')}
              </div>

              <div style="display: flex; gap: 12px; align-items: center;">
                <button class="btn btn-dark" onclick="window.DossierModal.close(); window.DeployModal.open(window.DossierModal.currentOperator, '${ver.versionId}');">
                  <i class="ti ti-send"></i> Deploy This Operator
                </button>
                <div style="font-weight: 800; font-size: 1.25rem;">$${ver.price.toLocaleString()} <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">(Free on Relief)</span></div>
              </div>
            </div>
          </div>

          <!-- Dossier / CV Body -->
          <div class="dossier-body">
            <!-- Overview -->
            <div>
              <h4 class="cv-section-title"><i class="ti ti-file-text"></i> Operator Profile & Overview</h4>
              <p style="color: var(--text-muted); line-height: 1.8;">${ver.description}</p>
            </div>

            <!-- In-Game Stats Bars -->
            <div>
              <h4 class="cv-section-title"><i class="ti ti-chart-bar"></i> Combat & Performance Metrics</h4>
              <div class="stats-bars-grid">
                <div class="stat-bar-item">
                  <div class="stat-bar-label"><span>STR (Strength)</span><span>${stats.str || 90}/100</span></div>
                  <div class="stat-bar-track"><div class="stat-bar-fill" style="width: ${stats.str || 90}%;"></div></div>
                </div>
                <div class="stat-bar-item">
                  <div class="stat-bar-label"><span>AGI (Agility)</span><span>${stats.agi || 90}/100</span></div>
                  <div class="stat-bar-track"><div class="stat-bar-fill" style="width: ${stats.agi || 90}%;"></div></div>
                </div>
                <div class="stat-bar-item">
                  <div class="stat-bar-label"><span>INT (Intelligence)</span><span>${stats.int || 90}/100</span></div>
                  <div class="stat-bar-track"><div class="stat-bar-fill" style="width: ${stats.int || 90}%;"></div></div>
                </div>
                <div class="stat-bar-item">
                  <div class="stat-bar-label"><span>PWR (Psionic / Firepower)</span><span>${stats.pwr || 90}/100</span></div>
                  <div class="stat-bar-track"><div class="stat-bar-fill" style="width: ${stats.pwr || 90}%;"></div></div>
                </div>
                <div class="stat-bar-item">
                  <div class="stat-bar-label"><span>DEF (Durability & Shield)</span><span>${stats.def || 90}/100</span></div>
                  <div class="stat-bar-track"><div class="stat-bar-fill" style="width: ${stats.def || 90}%;"></div></div>
                </div>
                <div class="stat-bar-item">
                  <div class="stat-bar-label"><span>SYNC (Neural Resonance)</span><span>${stats.sync || 90}/100</span></div>
                  <div class="stat-bar-track"><div class="stat-bar-fill" style="width: ${stats.sync || 90}%;"></div></div>
                </div>
              </div>
            </div>

            <!-- CV / Career Credentials -->
            <div>
              <h4 class="cv-section-title"><i class="ti ti-certificate"></i> Operational CV & Architecture</h4>
              <div class="cv-grid">
                <div class="cv-card">
                  <div class="cv-card-label">Neural Learning Model</div>
                  <div class="cv-card-val">${cv.learningModel || 'Core Matrix v9.2'}</div>
                </div>
                <div class="cv-card">
                  <div class="cv-card-label">Hardware Generation</div>
                  <div class="cv-card-val">${cv.generation || 'Mark II'}</div>
                </div>
                <div class="cv-card">
                  <div class="cv-card-label">First Commission Date</div>
                  <div class="cv-card-val">${cv.activationDate || '2024'}</div>
                </div>
                <div class="cv-card">
                  <div class="cv-card-label">Primary Specializations</div>
                  <div class="cv-card-val">${(cv.specializations || []).join(' • ')}</div>
                </div>
              </div>
            </div>

            <!-- Work Experience Timeline -->
            <div>
              <h4 class="cv-section-title"><i class="ti ti-briefcase"></i> Deployment History & Work Experience</h4>
              <div class="experience-list">
                ${(cv.workExperience || []).map(exp => `
                  <div class="experience-item">
                    <div class="exp-role">${exp.role}</div>
                    <div class="exp-meta">${exp.org} | ${exp.period}</div>
                    <div class="exp-desc">${exp.desc}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Certifications -->
            <div>
              <h4 class="cv-section-title"><i class="ti ti-shield-check"></i> Verified Licenses & Accreditations</h4>
              <ul style="list-style: none; display: flex; flex-wrap: wrap; gap: 8px;">
                ${(cv.certifications || []).map(cert => `
                  <li style="background: var(--bg-surface); border: 1px solid var(--border-light); padding: 6px 14px; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                    <i class="ti ti-check" style="color: var(--accent-emerald);"></i> ${cert}
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Abilities -->
            <div>
              <h4 class="cv-section-title"><i class="ti ti-bolt"></i> Combat & Protocol Capabilities</h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
                ${abilities.map(ab => `
                  <div style="background: var(--bg-surface); border: 1px solid var(--border-light); padding: 16px; border-radius: var(--radius-sm);">
                    <div style="font-weight: 700; color: var(--text-main); margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                      <i class="ti ti-sparkles" style="color: var(--primary);"></i> ${ab.name}
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">${ab.desc}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Footer Action -->
            <div style="text-align: center; padding-top: 16px; border-top: 1px solid var(--border-light);">
              <button class="btn btn-primary btn-lg" onclick="window.DossierModal.close(); window.DeployModal.open(window.DossierModal.currentOperator, '${ver.versionId}');">
                <i class="ti ti-rocket"></i> Proceed to Deploy ${op.name} (${ver.versionName})
              </button>
            </div>
          </div>
        </div>
      `;
    },

    bindEvents() {
      document.addEventListener('click', (e) => {
        if (e.target.id === 'closeDossierModal' || e.target.closest('#closeDossierModal')) {
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

  window.DossierModal = DossierModal;
})();
