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
      if (window.AppointmentModal) window.AppointmentModal.init();
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
          status: "Available",
          rating: 4.5,
          ratingCount: 1283,
          favorites: 7523100,
          versions: [
            {
              versionId: "dg",
              versionName: "Moon Chanter",
              code: "M-DIV-001X",
              status: "Available",
              affiliation: "Hyperion",
              price: 14999,
              image: "assets/images/kiana-dg.png",
              boxImage: "assets/images/kiana-dg.png",
              quote: "Quote placeholder here.",
              description: "Description placeholder here.",
              stats: { str: 242, agi: 245, int: 232, pwr: 252, def: 240, sync: 252 },
              cv: {
                learningModel: "Learning model placeholder here",
                generation: "Generation placeholder here",
                activationDate: "2024-01-01",
                specializations: ["Specialization placeholder 1 here", "Specialization placeholder 2 here"],
                workExperience: [{ role: "Role placeholder", org: "Org placeholder", period: "2024 — Present", desc: "Work experience placeholder." }],
                certifications: ["Certification name here"]
              },
              abilities: [
                { name: "Abilities name here", desc: "Abilities description 1 here" }
              ]
            },
            {
              versionId: "wb",
              versionName: "Wintery Wishes",
              code: "M-DROID-002B",
              status: "Available",
              affiliation: "Hyperion",
              price: 8499,
              image: "assets/images/kiana-wb.png",
              boxImage: "assets/images/kiana-wb.png",
              quote: "Quote placeholder here.",
              description: "Description placeholder here.",
              stats: { str: 224, agi: 242, int: 235, pwr: 219, def: 227, sync: 252 },
              cv: {
                learningModel: "Learning model placeholder here",
                generation: "Generation placeholder here",
                activationDate: "2024-01-01",
                specializations: ["Specialization placeholder 1 here", "Specialization placeholder 2 here"],
                workExperience: [{ role: "Role placeholder", org: "Org placeholder", period: "2024 — Present", desc: "Work experience placeholder." }],
                certifications: ["Certification name here"]
              },
              abilities: [
                { name: "Abilities name here", desc: "Abilities description 1 here" }
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
