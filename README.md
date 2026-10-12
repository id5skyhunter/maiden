# MAIDEN // Multipurpose Autonomous Inorganic Divine Entity

> *"Make it Real"* — A futuristic "WHAT-IF" tactical catalogue and dispatcher for MaidDroids and Anime Personas.

![MAIDEN Logo](assets/images/logo.png)

## Overview

**MAIDEN** (Multipurpose Autonomous Inorganic Divine Entity) is a futuristic tactical operator dispatch and requisition platform inspired by **Arknights: Endfield**, **Mihoyo (Honkai / Genshin)**, and **Vocaloid**. 

The system provides commander-level management for two primary entity classifications:
- **Divine Entities**: Celestial high-dimensional archetypes with reality-bending psionic matrices (e.g. *Kiana Kaslana Herrscher of Flamescion*, *Raiden Eternal Blade*, *Elysia Celestial Origin*).
- **Droid Automata**: Tactical combat maidroids engineered for high-tempo security, reconnaissance, and hospitality (e.g. *Kiana White Blossom*, *Bronya Cyber Maid*).

---

## Core Features

### 1. Operator Product Slider (Imperial Army Architecture)
- Built on the layered 3D cutout slider concept (inspired by Star Wars Imperial Army product showcase).
- Dynamic floating cutout character art (`assets/images/kiana-dg.png` & `assets/images/kiana-wb.png`) with interactive parallax responsiveness.
- Circular SVG neural integrity gauge (`stroke-dasharray` animation).
- Tactical core chassis configuration (`ETHER-V9`, `CHRONOS-X`) and operational protocol toggles (`DOMINION`, `MAID HOSP.`, `OVERDRIVE`).
- Live Lumina pricing with instant requisition and wishlist integration.

### 2. Tinder-Style Entity Dispatcher
- Physics-based swipeable card deck with mouse and touch support.
- Visual status stamps: **DISPATCH** (swiping right) vs. **STANDBY** (swiping left).
- Action controls: Rewind, Pass, Inspect Dossier, Dispatch, and Rotation Shuffle.
- Quick in-game RPG stats bar preview directly on each card.

### 3. In-Game RPG Stats Dossier Modal
- Tap any card or inspect button to open the full tactical combat dossier.
- **6-Axis Hexagon SVG Radar Polygon Chart**:
  - **STR** (Physical Force & Impact)
  - **AGI** (Kinetic Velocity & Response)
  - **INT** (Quantum Neural Processing)
  - **PWR** (Psionic Energy Output)
  - **DEF** (Shielding & Armor Matrix)
  - **SYNC** (Commander Resonance Frequency)
- Combat abilities breakdown with tactical lore.
- Immediate Mission Dispatch selector with real-time deployment status.

### 4. Entity Requisition & Acquisition Catalog ("Buy Divine or Droid Entity")
- Filterable catalog by archetype: `ALL`, `DIVINE ENTITIES`, `DROID MAIDROIDS`.
- Procurement modal with custom deployment vectors:
  - 🚀 **Orbital Drop Capsule**
  - ⚡ **Quantum Neural Link**
  - ❄️ **Armored Cryo-Stasis Transport**
- Generates official cryptographic MAIDEN Acquisition Certificate (`MDN-XXXX-XXXX`).
- Adds entities directly to Commander Roster in `localStorage`.

### 5. Static CMS (`/admin/`)
- Integrated **Sveltia CMS** & **Decap CMS** configuration in `/admin/`.
- No backend server required — saves directly to the GitHub repository using Git-based JSON models in `content/operators/` and `content/missions/`.
- Edit operator stats, lore, pricing, and missions directly from the web interface.

### 6. Tactile Web Audio Synthesizer
- Built-in zero-dependency Web Audio API synthesizer for futuristic clicks, radar pings, swipe swooshes, and contract celebration sounds.

---

## Repository Structure

```
├── .github/
│   └── workflows/
│       └── pages.yml          # GitHub Pages deployment workflow
├── .nojekyll                  # GitHub Pages Jekyll bypass
├── admin/
│   ├── config.yml             # Static CMS schema configuration
│   └── index.html             # Sveltia / Decap CMS interface
├── assets/
│   └── images/                # Cutouts, portraits, logos, and mockups
├── content/
│   ├── operators/             # JSON operator records for Static CMS
│   └── missions/              # JSON mission records for Static CMS
├── css/
│   └── style.css              # Cyberpunk HUD styling
├── js/
│   ├── app.js                 # App coordinator & state management
│   ├── audio.js               # Web Audio synthesizer
│   ├── catalog.js             # Requisition & purchase system
│   ├── dossier.js             # RPG stats & SVG radar chart
│   ├── slider.js              # Star Wars-inspired cutout slider
│   └── tinder.js              # Tinder-style swipe dispatcher
├── index.html                 # Main web application
└── README.md
```

---

## Live Deployment & GitHub Pages

- **GitHub Repository**: [https://github.com/id5skyhunter/maiden](https://github.com/id5skyhunter/maiden)
- **GitHub Pages**: [https://id5skyhunter.github.io/maiden/](https://id5skyhunter.github.io/maiden/)
- **Static CMS Portal**: [https://id5skyhunter.github.io/maiden/admin/](https://id5skyhunter.github.io/maiden/admin/)

---

## Local Development

You can run this project locally with any static web server:

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

Then visit `http://localhost:8080`.
