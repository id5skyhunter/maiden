/**
 * MAIDEN — "I'm Feeling Lucky" Dispatch Randomizer
 * "keep it, but move it like google 'i'm feeling lucky'"
 */

(function () {
  const luckyScenarios = [
    {
      location: "Geneva Medical & Refugee Center",
      category: "humanitarian",
      dispatcher: "Director Elena Wright",
      notes: "Emergency medical transport escort requested. Grant verified."
    },
    {
      location: "Sector-04 Sub-Terran Flood Zone",
      category: "sar",
      dispatcher: "Chief Warden Zhao",
      notes: "Sub-aquatic civ survival search. Sub-space barrier shield recommended."
    },
    {
      location: "Neo-Elysium Diamond Tower Suite 104",
      category: "private",
      dispatcher: "Councilor Kenneth Sterling",
      notes: "24-hour executive summit and high-tea protocol detail."
    },
    {
      location: "Orbital Relay Station Delta-9",
      category: "tactical",
      dispatcher: "Fleet Commander Valkyrie",
      notes: "Interdimensional perimeter monitoring and rift suppression."
    },
    {
      location: "Old Metropolis Cultural Archives",
      category: "general",
      dispatcher: "Archivist Lin",
      notes: "Artifact preservation and static perimeter patrol."
    }
  ];

  const LuckyDispatch = {
    roll() {
      const op = window.appState?.operators[0];
      if (!op || !op.versions || op.versions.length === 0) return;

      // Pick random version
      const randomVerIndex = Math.floor(Math.random() * op.versions.length);
      const version = op.versions[randomVerIndex];

      // Pick random scenario
      const scenario = luckyScenarios[Math.floor(Math.random() * luckyScenarios.length)];

      // Open Deploy Modal
      window.DeployModal.open(op, version.versionId);

      // Pre-fill randomized values
      setTimeout(() => {
        const catSelect = document.getElementById('deployCategorySelect');
        const locInput = document.getElementById('deployLocationInput');
        const dispInput = document.getElementById('dispatcherNameInput');

        if (catSelect) {
          catSelect.value = scenario.category;
          window.DeployModal.updateCostCalculation();
        }
        if (locInput) {
          locInput.value = scenario.location;
        }
        if (dispInput) {
          dispInput.value = scenario.dispatcher;
        }
      }, 50);
    }
  };

  window.LuckyDispatch = LuckyDispatch;
})();
