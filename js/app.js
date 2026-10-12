// MAIDEN // MULTIPURPOSE AUTONOMOUS INORGANIC DIVINE ENTITY
// Core Application Controller

// Default fallback data if running via static file protocol without fetch permissions
const DEFAULT_OPERATORS = [
  {
    id: "kiana-dg",
    name: "KIANA KASLANA",
    title: "HERRSCHER OF FLAMESCION // VOID CELESTIAL",
    code: "M-DIV-001X",
    type: "DIVINE",
    price: 14999,
    durability: 98,
    image: "assets/images/kiana-dg.png",
    box_image: "assets/images/kiana-box-final.png",
    quote: "Ignite the dawn of tomorrow. The flame of humanity never extinguishes.",
    lore: "The premier Divine Entity synthesized under Project MAIDEN. Anchored with high-dimensional Herrscher core matrix, she bends spacetime and emits superluminal psionic radiant flames. Capable of planetary orbital stabilization and localized reality reconfiguration.",
    stats: { str: 95, agi: 96, int: 91, pwr: 99, def: 94, sync: 99 },
    abilities: [
      { name: "Sub-Space Lance Volley", desc: "Deploys 6 micro-wormhole apertures delivering relativistic kinetic hyper-projectiles." },
      { name: "Corona Flare Dominion", desc: "Ignites high-frequency divine flame shield, neutralizing 99.4% energy bombardment." },
      { name: "Superluminal Leap", desc: "Instantly teleports across tactical zones through hyper-dimensional coordinates." }
    ]
  },
  {
    id: "kiana-wb",
    name: "KIANA // WHITE BLOSSOM",
    title: "TACTICAL MAIDROID // COMBAT AUTOMATON",
    code: "M-DROID-002B",
    type: "DROID",
    price: 8499,
    durability: 94,
    image: "assets/images/kiana-wb.png",
    box_image: "assets/images/kiana-box-final.png",
    quote: "Master, operational parameters loaded. Tactical protocol White Blossom initiated.",
    lore: "Engineered for high-tempo executive security and combat maid hospitality. Features dual sub-micro turbine thrusters, titanium-graphene reinforced skeletal frame, and an adaptive neural personality emulator tuned for absolute fidelity and culinary perfection.",
    stats: { str: 88, agi: 95, int: 92, pwr: 86, def: 89, sync: 99 },
    abilities: [
      { name: "Neko-Curtsy EMP Strike", desc: "Discharges high-density ionic wave disabling enemy cyber-implants within 35 meters." },
      { name: "Graphene Apron Deflector", desc: "Nanotech kinetic absorption mesh absorbs heavy ballistic rounds with zero frame strain." },
      { name: "Executive Tea & Firepower", desc: "Multi-barrel micro-piston hidden weaponry delivering suppressive precision bursts." }
    ]
  },
  {
    id: "raiden-mei",
    name: "RAIDEN // ETERNAL BLADE",
    title: "ELECTRO SHRINE MAIDEN // CELESTIAL JUDICATOR",
    code: "M-DIV-003E",
    type: "DIVINE",
    price: 13800,
    durability: 97,
    image: "assets/images/raiden-divine.jpg",
    quote: "Thunder is the heartbeat of eternity. Clear your mind, and let steel speak.",
    lore: "Harnesses raw atmospheric ionization and storm harmonics. Raiden's divine matrix synthesizes high-frequency plasma blades that sever physical matter and digital firewalls alike. Built to guard critical sanctuaries and lead fleet vanguard operations.",
    stats: { str: 94, agi: 98, int: 93, pwr: 98, def: 88, sync: 96 },
    abilities: [
      { name: "Musou Plasma Cleave", desc: "Slices through quantum space, ignoring physical armor and particle barrier shields." },
      { name: "Ominous Thunder Halo", desc: "Emits electromagnetic pulse storm, buffing allied squad reflexes by 40%." },
      { name: "Zero-Lag Parrying Matrix", desc: "Predicts hypersonic projectiles 0.12 milliseconds before launch vector calculations." }
    ]
  },
  {
    id: "bronya-zaychik",
    name: "BRONYA // CYBER MAID",
    title: "TACTICAL DRONE COMMANDER // HAXOR AUTOMATON",
    code: "M-DROID-004H",
    type: "DROID",
    price: 9200,
    durability: 95,
    image: "assets/images/bronya-droid.jpg",
    quote: "Bronya has already calculated 1,024 outcomes. Victory rate: 99.98%.",
    lore: "A masterpiece of micro-electronics and automated aerial reconnaissance. Equipped with twin photon-emitter wings and orbital drone links, Bronya manages battlefield telemetry while serving Earl Grey tea with absolute stoic poise.",
    stats: { str: 84, agi: 91, int: 99, pwr: 92, def: 95, sync: 97 },
    abilities: [
      { name: "Orbital Drone Swarm", desc: "Commands 12 micro-drones for 360-degree radar surveillance and laser interception." },
      { name: "Quantum Firewall Hijack", desc: "Decrypts enemy command protocols and redirects automated turrets within seconds." },
      { name: "Nanite Field Maintenance", desc: "Instantly repairs armor damage and restores squad shield capacitors in combat." }
    ]
  },
  {
    id: "elysia-pristine",
    name: "ELYSIA // CELESTIAL ORIGIN",
    title: "PRISTINE GODDESS // CRYSTAL REVERIE",
    code: "M-DIV-000E",
    type: "DIVINE",
    price: 16500,
    durability: 99,
    image: "assets/images/elysia-divine.jpg",
    quote: "Hi~ Did you miss me? Every maiden was born to bring wonder to this world.",
    lore: "The prototype celestial archetype of the MAIDEN series. Woven from harmonic crystal resonance and pure divine intent. Radiates an unyielding field of optimism, restoring squad morale and transmuting destructive energy into scintillating starlight.",
    stats: { str: 86, agi: 93, int: 96, pwr: 100, def: 91, sync: 100 },
    abilities: [
      { name: "Prism Bloom Sanctuary", desc: "Creates a shimmering dome of crystalline light, granting squad invulnerability for 6 seconds." },
      { name: "Arrow of Pure Reverie", desc: "Fires superluminal photon arrow that pierces spatial barriers and heals allied systems." },
      { name: "Infinite Flirtation Pulse", desc: "Subdues hostile combat algorithms, inducing sensory recalibration across all enemy units." }
    ]
  }
];

const DEFAULT_MISSIONS = [
  {
    id: "void-patrol",
    title: "OPERATION: VOID HORIZON SWEEP",
    sector: "SECTOR-07 // ORBITAL RUINS",
    difficulty: "RANK A",
    duration_minutes: 15,
    reward_credits: 3500,
    preferred_class: "DIVINE"
  },
  {
    id: "sanctuary-breach",
    title: "OPERATION: APEX SANCTUARY DEFENSE",
    sector: "SECTOR-01 // CELESTIAL VAULT",
    difficulty: "RANK EX",
    duration_minutes: 30,
    reward_credits: 7800,
    preferred_class: "DIVINE"
  },
  {
    id: "cyber-heist",
    title: "OPERATION: QUANTUM INFILTRATION",
    sector: "SECTOR-09 // CYBERNETIC METROPOLIS",
    difficulty: "RANK S",
    duration_minutes: 20,
    reward_credits: 5200,
    preferred_class: "DROID"
  }
];

// Global State
window.appState = {
  operators: DEFAULT_OPERATORS,
  missions: DEFAULT_MISSIONS,
  credits: 50000,
  roster: [],
  dispatches: []
};

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
  initStorage();
  await loadContentFiles();
  initSubsystems();
  initBackgroundCanvas();
  initUIBindings();
});

// Load storage
function initStorage() {
  const savedCredits = localStorage.getItem('maiden_credits');
  if (savedCredits !== null) {
    window.appState.credits = parseInt(savedCredits, 10);
  } else {
    localStorage.setItem('maiden_credits', window.appState.credits.toString());
  }

  const savedRoster = localStorage.getItem('maiden_roster');
  if (savedRoster) {
    try {
      window.appState.roster = JSON.parse(savedRoster);
    } catch (e) {}
  }

  const savedDispatches = localStorage.getItem('maiden_dispatches');
  if (savedDispatches) {
    try {
      window.appState.dispatches = JSON.parse(savedDispatches);
    } catch (e) {}
  }

  updateCreditsUI();
  updateRosterBadge();
}

// Attempt to load from JSON static files
async function loadContentFiles() {
  const operatorFiles = ['kiana-dg.json', 'kiana-wb.json', 'raiden-mei.json', 'bronya-zaychik.json', 'elysia-pristine.json'];
  const loadedOps = [];

  for (const file of operatorFiles) {
    try {
      const res = await fetch(`content/operators/${file}`);
      if (res.ok) {
        const data = await res.json();
        loadedOps.push(data);
      }
    } catch (e) {
      // Offline or file:// protocol, will retain default operators
      break;
    }
  }

  if (loadedOps.length > 0) {
    window.appState.operators = loadedOps;
  }
}

// Initialize slider, tinder deck, catalog, and dossier
function initSubsystems() {
  window.sliderInstance = new window.OperatorSlider(window.appState.operators);
  window.tinderInstance = new window.TinderDispatcher(window.appState.operators);
  window.dossierInstance = new window.DossierModal(window.appState.operators, window.appState.missions);
  window.catalogInstance = new window.EntityCatalog(window.appState.operators);
}

// UI bindings
function initUIBindings() {
  // Audio toggle
  const audioToggle = document.getElementById('btn-audio-toggle');
  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      window.soundEngine.enabled = !window.soundEngine.enabled;
      audioToggle.classList.toggle('muted', !window.soundEngine.enabled);
      audioToggle.querySelector('.label').textContent = window.soundEngine.enabled ? 'AUDIO: ON' : 'AUDIO: OFF';
      if (window.soundEngine.enabled) window.soundEngine.click();
    });
  }

  // Roster Drawer toggle
  const rosterBtn = document.getElementById('nav-roster-btn');
  const rosterDrawer = document.getElementById('roster-drawer');
  const rosterClose = document.getElementById('roster-drawer-close');

  if (rosterBtn && rosterDrawer) {
    rosterBtn.addEventListener('click', () => {
      window.soundEngine.click();
      renderRosterDrawer();
      rosterDrawer.classList.add('active');
    });
  }

  if (rosterClose && rosterDrawer) {
    rosterClose.addEventListener('click', () => {
      window.soundEngine.click();
      rosterDrawer.classList.remove('active');
    });
  }
}

// Credits Helpers
window.getCommanderCredits = () => window.appState.credits;
window.updateCommanderCredits = (newCredits) => {
  window.appState.credits = newCredits;
  localStorage.setItem('maiden_credits', newCredits.toString());
  updateCreditsUI();
};

function updateCreditsUI() {
  const el = document.getElementById('commander-credits-val');
  if (el) {
    el.textContent = Number(window.appState.credits).toLocaleString();
  }
}

// Roster Helpers
window.addRosterOperator = (op) => {
  if (!window.appState.roster.some(r => r.id === op.id)) {
    window.appState.roster.push(op);
    localStorage.setItem('maiden_roster', JSON.stringify(window.appState.roster));
    updateRosterBadge();
  }
};

function updateRosterBadge() {
  const badge = document.getElementById('roster-count-badge');
  if (badge) {
    badge.textContent = window.appState.roster.length;
  }
}

// Mission Deploy
window.deployOperatorToMission = (op, mission) => {
  const dispatchRecord = {
    id: 'DSP-' + Date.now().toString().slice(-5),
    operator: op,
    mission: mission,
    startTime: Date.now(),
    durationMs: mission.duration_minutes * 60 * 1000,
    completed: false
  };

  window.appState.dispatches.push(dispatchRecord);
  localStorage.setItem('maiden_dispatches', JSON.stringify(window.appState.dispatches));

  window.soundEngine.swipeMatch();
  window.showToast(`🚀 ${op.name} DEPLOYED TO ${mission.sector}!`);
  renderRosterDrawer();
};

// Render Command Roster Drawer
function renderRosterDrawer() {
  const rosterContainer = document.getElementById('drawer-roster-list');
  const dispatchesContainer = document.getElementById('drawer-dispatches-list');

  if (rosterContainer) {
    if (window.appState.roster.length === 0) {
      rosterContainer.innerHTML = `<p class="drawer-empty">No entities contracted yet. Acquire Maidens via the catalog or dispatch deck!</p>`;
    } else {
      rosterContainer.innerHTML = window.appState.roster.map(op => `
        <div class="roster-item-card">
          <img src="${op.image}" alt="${op.name}" class="roster-item-thumb">
          <div class="roster-item-info">
            <div class="r-badge ${op.type.toLowerCase()}">${op.type}</div>
            <h4 class="roster-item-name">${op.name}</h4>
            <span class="roster-item-code">${op.code}</span>
          </div>
          <button class="btn-roster-inspect" onclick="window.openDossierModal('${op.id}')">DOSSIER</button>
        </div>
      `).join('');
    }
  }

  if (dispatchesContainer) {
    if (window.appState.dispatches.length === 0) {
      dispatchesContainer.innerHTML = `<p class="drawer-empty">All combat units currently on standby.</p>`;
    } else {
      dispatchesContainer.innerHTML = window.appState.dispatches.map(d => `
        <div class="dispatch-item-card">
          <div class="disp-header">
            <span class="disp-id">${d.id}</span>
            <span class="disp-sector">${d.mission.sector}</span>
          </div>
          <div class="disp-body">
            <b>${d.operator.name}</b> deployed to <i>${d.mission.title}</i>
          </div>
          <div class="disp-status">
            <span class="pulse-dot"></span> OPERATION IN PROGRESS (+${d.mission.reward_credits} Lumina)
          </div>
        </div>
      `).join('');
    }
  }
}

// Global modal triggers
window.openDossierModal = (opId) => {
  if (window.dossierInstance) {
    window.dossierInstance.open(opId);
  }
};

window.openPurchaseModal = (opId) => {
  if (window.catalogInstance) {
    window.catalogInstance.openPurchaseModal(opId);
  }
};

// Toast notification system
window.showToast = (message) => {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-alert';
  toast.innerHTML = `
    <span class="toast-marker">►</span>
    <span class="toast-txt">${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 3200);
};

// Dynamic particle cyber canvas
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-cyber-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 45 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    size: Math.random() * 2 + 1,
    color: Math.random() > 0.6 ? '#00F0FF' : (Math.random() > 0.5 ? '#FF2A6D' : '#F3A712'),
    alpha: Math.random() * 0.4 + 0.1
  }));

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    requestAnimationFrame(draw);
  };
  draw();
}
