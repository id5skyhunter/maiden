// IN-GAME RPG STATS DOSSIER & RADAR CHART MODAL
class DossierModal {
  constructor(operators, missions) {
    this.operators = operators || [];
    this.missions = missions || [];
    this.modalEl = document.getElementById('dossier-modal');
    this.currentOperator = null;
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    const closeBtn = document.getElementById('dossier-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    if (this.modalEl) {
      this.modalEl.addEventListener('click', (e) => {
        if (e.target === this.modalEl) this.close();
      });
    }

    // Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalEl && this.modalEl.classList.contains('active')) {
        this.close();
      }
    });
  }

  open(operatorId) {
    const op = this.operators.find(o => o.id === operatorId);
    if (!op) return;

    this.currentOperator = op;
    window.soundEngine.dossierOpen();

    this.renderDossierContent(op);
    this.modalEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    window.soundEngine.click();
    this.modalEl.classList.remove('active');
    document.body.style.overflow = '';
  }

  renderDossierContent(op) {
    const nameEl = document.getElementById('dossier-name');
    const titleEl = document.getElementById('dossier-title');
    const codeEl = document.getElementById('dossier-code');
    const typeEl = document.getElementById('dossier-type');
    const quoteEl = document.getElementById('dossier-quote');
    const loreEl = document.getElementById('dossier-lore');
    const imgEl = document.getElementById('dossier-img');
    const abilitiesEl = document.getElementById('dossier-abilities');
    const statsContainer = document.getElementById('dossier-stat-bars');
    const radarContainer = document.getElementById('dossier-radar-svg');
    const missionsContainer = document.getElementById('dossier-missions-select');

    if (nameEl) nameEl.textContent = op.name;
    if (titleEl) titleEl.textContent = op.title;
    if (codeEl) codeEl.textContent = `SERIAL // ${op.code}`;
    if (typeEl) {
      typeEl.textContent = `${op.type} ENTITY`;
      typeEl.className = `dossier-badge ${op.type.toLowerCase()}`;
    }
    if (quoteEl) quoteEl.textContent = `“${op.quote}”`;
    if (loreEl) loreEl.textContent = op.lore;
    if (imgEl) {
      imgEl.src = op.image;
      imgEl.alt = op.name;
    }

    // Render 6 RPG stats
    const stats = [
      { key: 'STR', label: 'Physical Impact / Strike', val: op.stats.str, color: '#FF3366' },
      { key: 'AGI', label: 'Kinetic Agility / Speed', val: op.stats.agi, color: '#00F0FF' },
      { key: 'INT', label: 'Quantum Neural Processing', val: op.stats.int, color: '#9D00FF' },
      { key: 'PWR', label: 'Psionic Energy Output', val: op.stats.pwr, color: '#FFD700' },
      { key: 'DEF', label: 'Shielding & Armor Matrix', val: op.stats.def, color: '#00FF66' },
      { key: 'SYNC', label: 'Commander Resonance (SYNC)', val: op.stats.sync, color: '#FF00EA' }
    ];

    if (statsContainer) {
      statsContainer.innerHTML = stats.map(s => `
        <div class="stat-bar-item">
          <div class="stat-header">
            <span class="stat-code" style="color: ${s.color};">${s.key}</span>
            <span class="stat-label">${s.label}</span>
            <span class="stat-numeric">${s.val} / 100</span>
          </div>
          <div class="stat-track">
            <div class="stat-fill" style="width: ${s.val}%; background: linear-gradient(90deg, ${s.color}66, ${s.color});"></div>
          </div>
        </div>
      `).join('');
    }

    // Render SVG Polygon Hexagon Radar
    if (radarContainer) {
      radarContainer.innerHTML = this.generateRadarSVG(op.stats);
    }

    // Render Abilities
    if (abilitiesEl && op.abilities) {
      abilitiesEl.innerHTML = op.abilities.map((ab, i) => `
        <div class="ability-card">
          <div class="ability-num">0${i + 1}</div>
          <div class="ability-info">
            <h4 class="ability-name">${ab.name}</h4>
            <p class="ability-desc">${ab.desc}</p>
          </div>
        </div>
      `).join('');
    }

    // Render Quick Mission Dispatch selector
    if (missionsContainer) {
      missionsContainer.innerHTML = this.missions.map(m => `
        <div class="dispatch-mission-card" data-mission="${m.id}">
          <div class="mission-top">
            <span class="mission-sector">${m.sector}</span>
            <span class="mission-diff">${m.difficulty}</span>
          </div>
          <h4 class="mission-title">${m.title}</h4>
          <div class="mission-bottom">
            <span>⏳ ${m.duration_minutes}m duration</span>
            <span>💎 +${m.reward_credits} Lumina</span>
          </div>
          <button class="btn-dispatch-now" data-op="${op.id}" data-mission="${m.id}">
            ASSIGN MISSION ➔
          </button>
        </div>
      `).join('');

      missionsContainer.querySelectorAll('.btn-dispatch-now').forEach(btn => {
        btn.addEventListener('click', () => {
          const mId = btn.dataset.mission;
          const mission = this.missions.find(m => m.id === mId);
          window.deployOperatorToMission(op, mission);
          this.close();
        });
      });
    }
  }

  generateRadarSVG(stats) {
    const size = 260;
    const center = size / 2;
    const maxR = 95;
    const labels = ['STR', 'AGI', 'INT', 'PWR', 'DEF', 'SYNC'];
    const values = [stats.str, stats.agi, stats.int, stats.pwr, stats.def, stats.sync];

    // Points for polygon
    const points = values.map((val, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const r = (val / 100) * maxR;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    // Background concentric hexagons
    const rings = [0.25, 0.5, 0.75, 1.0].map(ratio => {
      const hexPoints = [0, 1, 2, 3, 4, 5].map(i => {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        const r = ratio * maxR;
        return `${(center + r * Math.cos(angle)).toFixed(1)},${(center + r * Math.sin(angle)).toFixed(1)}`;
      }).join(' ');
      return `<polygon points="${hexPoints}" class="radar-grid-ring" />`;
    }).join('');

    // Axis lines and labels
    const axes = labels.map((label, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const x = center + maxR * Math.cos(angle);
      const y = center + maxR * Math.sin(angle);
      const labelX = center + (maxR + 20) * Math.cos(angle);
      const labelY = center + (maxR + 20) * Math.sin(angle) + 4;

      return `
        <line x1="${center}" y1="${center}" x2="${x}" y2="${y}" class="radar-axis" />
        <text x="${labelX}" y="${labelY}" class="radar-label" text-anchor="middle">${label}</text>
      `;
    }).join('');

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <defs>
          <linearGradient id="radarFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00F0FF" stop-opacity="0.6" />
            <stop offset="100%" stop-color="#FF2A6D" stop-opacity="0.6" />
          </linearGradient>
        </defs>
        ${rings}
        ${axes}
        <polygon points="${points}" class="radar-poly" fill="url(#radarFillGrad)" stroke="#00F0FF" stroke-width="2.5" />
      </svg>
    `;
  }
}

window.DossierModal = DossierModal;
