/**
 * MAIDEN — Core Application Controller
 * Slogan: "Make it Real"
 */

(function () {
  const App = {
    async init() {
      window.appState = {
        operators: [],
        posts: [],
        activePage: this.detectPage()
      };

      await this.loadOperators();

      // Initialize UI Components
      if (window.DeployModal) window.DeployModal.init();
      if (window.DossierModal) window.DossierModal.init();

      // Page-specific initialization
      if (window.appState.activePage === 'home') {
        if (window.HeroSlider) window.HeroSlider.init();
        if (window.OperatorCatalog) window.OperatorCatalog.init('featuredOperatorGrid');
        if (window.BlogManager) window.BlogManager.init('latestNewsGrid', true);
      } else if (window.appState.activePage === 'operators') {
        if (window.OperatorCatalog) window.OperatorCatalog.init('catalogFullGrid');
      } else if (window.appState.activePage === 'blog') {
        if (window.BlogManager) window.BlogManager.init('blogArchiveGrid', false);
      }

      this.bindGlobalEvents();
    },

    detectPage() {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('operators.html')) return 'operators';
      if (path.includes('blog.html')) return 'blog';
      if (path.includes('about.html')) return 'about';
      return 'home';
    },

    async loadOperators() {
      const operatorFiles = [
        'content/operators/kiana.json',
        'content/operators/mei.json',
        'content/operators/bronya.json',
        'content/operators/seele.json',
        'content/operators/uzuki.json',
        'content/operators/miku.json',
        'content/operators/mobius.json'
      ];

      const loaded = [];
      for (const file of operatorFiles) {
        try {
          const res = await fetch(file);
          if (res.ok) {
            const op = await res.json();
            loaded.push(op);
          }
        } catch (e) {
          console.warn('Operator fetch fallback for ' + file, e);
        }
      }

      if (loaded.length > 0) {
        window.appState.operators = loaded;
        return;
      }

      // Offline / fallback data structure
      window.appState.operators = [
        {
          id: "kiana",
          name: "KIANA",
          subtitle: "Multipurpose Autonomous Maiden",
          rating: 4.5,
          ratingCount: 1283,
          favorites: 7523100,
          versions: [
            {
              versionId: "dg",
              versionName: "Moon Chanter",
              code: "M-DIV-001X",
              affiliation: "MAIDEN Tactical Division",
              price: 14999,
              image: "assets/images/kiana-dg.png",
              boxImage: "assets/images/kiana-dg.png",
              quote: "Ignite the dawn of tomorrow. The flame of humanity never extinguishes.",
              description: "The premier synthesis under Project MAIDEN. Anchored with high-dimensional Herrscher core matrix, she bends spacetime and emits superluminal psionic radiant flames.",
              stats: { str: 95, agi: 96, int: 91, pwr: 99, def: 94, sync: 99 },
              cv: {
                learningModel: "Quanta 7.2",
                generation: "2nd Generation (Mark II)",
                activationDate: "2024-03-15",
                specializations: ["Reality Reconfiguration", "Orbital Stabilization", "Psionic Flame Projection"],
                workExperience: [
                  {
                    role: "Space Exploration Supervisor",
                    org: "MAIDEN Tactical Division",
                    period: "2024 — Present",
                    desc: "Lead strike operator for high-priority interdimensional breach containment."
                  }
                ],
                certifications: [
                  "Herrscher-Class Psionic License (S-Rank)",
                  "Multi-Dimensional Navigation Clearance",
                  "Advanced Close Quarters Combat Protocol"
                ]
              },
              abilities: [
                { name: "Sub-Space Lance Volley", desc: "Deploys 6 micro-wormhole apertures delivering relativistic kinetic hyper-projectiles." },
                { name: "Corona Flare Dominion", desc: "Ignites high-frequency divine flame shield, neutralizing 99.4% energy bombardment." }
              ]
            },
            {
              versionId: "wb",
              versionName: "Wintery Wishes",
              code: "M-DROID-002B",
              affiliation: "MAIDEN Domestic Operations",
              price: 8499,
              image: "assets/images/kiana-wb.png",
              boxImage: "assets/images/kiana-wb.png",
              quote: "Master, operational parameters loaded. Tactical protocol White Blossom initiated.",
              description: "Engineered for high-tempo executive security and combat maid hospitality. Features dual sub-micro turbine thrusters and an adaptive neural personality emulator.",
              stats: { str: 88, agi: 95, int: 92, pwr: 86, def: 89, sync: 99 },
              cv: {
                learningModel: "Neural Empathy Engine v7.4",
                generation: "2nd Generation (Mark II-B)",
                activationDate: "2024-06-22",
                specializations: ["Executive Protection", "Combat Hospitality Protocol", "Adaptive Personality Emulation"],
                workExperience: [
                  {
                    role: "Executive Security & Hospitality Maid",
                    org: "MAIDEN Domestic Operations",
                    period: "2024 — Present",
                    desc: "Primary operator for VIP protection detail with integrated hospitality services."
                  }
                ],
                certifications: [
                  "Graphene Armor Integration License",
                  "Adaptive Personality Framework Certified"
                ]
              },
              abilities: [
                { name: "Neko-Curtsy EMP Strike", desc: "Discharges high-density ionic wave disabling enemy cyber-implants within 35 meters." },
                { name: "Graphene Apron Deflector", desc: "Nanotech kinetic absorption mesh absorbs heavy ballistic rounds." }
              ]
            }
          ]
        }
      ];
    },

    bindGlobalEvents() {
      // Mobile menu toggle
      const menuBtn = document.getElementById('mobileMenuToggle');
      const navMenu = document.getElementById('mainNavMenu');
      if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          navMenu.classList.toggle('open');
          const isOpen = navMenu.classList.contains('open');
          menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          const icon = menuBtn.querySelector('i');
          if (icon) {
            icon.className = isOpen ? 'ti ti-x' : 'ti ti-menu-2';
          }
        });

        // Close menu when clicking any nav link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
          link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
            const icon = menuBtn.querySelector('i');
            if (icon) icon.className = 'ti ti-menu-2';
          });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
          if (!navMenu.contains(e.target) && !menuBtn.contains(e.target) && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
            const icon = menuBtn.querySelector('i');
            if (icon) icon.className = 'ti ti-menu-2';
          }
        });
      }
    }
  };

  window.App = App;
  document.addEventListener('DOMContentLoaded', () => App.init());
})();
