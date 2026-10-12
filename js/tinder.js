// TINDER-STYLE ENTITY DISPATCHER DECK
class TinderDispatcher {
  constructor(operators) {
    this.operators = operators || [];
    this.deckContainer = document.getElementById('tinder-card-deck');
    this.cardHistory = [];
    this.isDragging = false;
    this.currentCard = null;
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.init();
  }

  init() {
    this.renderDeck();
    this.bindControls();
  }

  renderDeck() {
    if (!this.deckContainer) return;
    this.deckContainer.innerHTML = '';
    this.cardHistory = [];

    // Render cards from bottom to top
    // The top card is the first in array
    [...this.operators].reverse().forEach((op, reversedIdx) => {
      const idx = this.operators.length - 1 - reversedIdx;
      const card = this.createCardElement(op, idx);
      this.deckContainer.appendChild(card);
    });

    this.updateCardTransforms();
  }

  createCardElement(op, index) {
    const card = document.createElement('div');
    card.className = 'tinder-card';
    card.dataset.id = op.id;
    card.dataset.index = index;

    card.innerHTML = `
      <div class="tinder-stamp stamp-dispatch">DISPATCH</div>
      <div class="tinder-stamp stamp-pass">STANDBY</div>

      <div class="tinder-card-image-wrap">
        <img src="${op.image}" alt="${op.name}" class="tinder-card-img" draggable="false">
        <div class="tinder-card-gradient"></div>
        <div class="tinder-card-tags">
          <span class="tag-class ${op.type.toLowerCase()}">${op.type} ENTITY</span>
          <span class="tag-rating">SS RANK</span>
        </div>
      </div>

      <div class="tinder-card-body">
        <div class="tinder-header">
          <h3 class="tinder-name">${op.name}</h3>
          <span class="tinder-code">${op.code}</span>
        </div>
        <p class="tinder-title">${op.title}</p>

        <!-- In-game quick stats bar preview -->
        <div class="tinder-quick-stats">
          <div class="q-stat">
            <span class="q-label">STR</span>
            <div class="q-bar-bg"><div class="q-bar-fill" style="width: ${op.stats.str}%;"></div></div>
            <span class="q-val">${op.stats.str}</span>
          </div>
          <div class="q-stat">
            <span class="q-label">INT</span>
            <div class="q-bar-bg"><div class="q-bar-fill" style="width: ${op.stats.int}%;"></div></div>
            <span class="q-val">${op.stats.int}</span>
          </div>
          <div class="q-stat">
            <span class="q-label">PWR</span>
            <div class="q-bar-bg"><div class="q-bar-fill" style="width: ${op.stats.pwr}%;"></div></div>
            <span class="q-val">${op.stats.pwr}</span>
          </div>
        </div>

        <div class="tinder-card-footer">
          <button class="tinder-inspect-btn" data-id="${op.id}">
            <span>⚡ TAP FOR FULL IN-GAME STATS & DOSSIER</span>
          </button>
        </div>
      </div>
    `;

    this.attachDragEvents(card);

    // Tap on card or inspect button to open full dossier
    card.querySelector('.tinder-inspect-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      window.openDossierModal(op.id);
    });

    card.addEventListener('click', (e) => {
      // If was dragging significantly, ignore click
      if (Math.abs(this.currentX) > 10 || Math.abs(this.currentY) > 10) return;
      // If clicking stamps or buttons, ignore
      if (e.target.closest('.tinder-inspect-btn')) return;
      window.openDossierModal(op.id);
    });

    return card;
  }

  attachDragEvents(card) {
    const onStart = (clientX, clientY) => {
      const topCard = this.getTopCard();
      if (topCard !== card) return;

      this.isDragging = true;
      this.currentCard = card;
      this.startX = clientX;
      this.startY = clientY;
      this.currentX = 0;
      this.currentY = 0;
      card.style.transition = 'none';
    };

    const onMove = (clientX, clientY) => {
      if (!this.isDragging || this.currentCard !== card) return;

      this.currentX = clientX - this.startX;
      this.currentY = clientY - this.startY;

      const rotate = this.currentX * 0.08;
      card.style.transform = `translate(${this.currentX}px, ${this.currentY}px) rotate(${rotate}deg)`;

      // Stamp opacity based on drag
      const passStamp = card.querySelector('.stamp-pass');
      const dispatchStamp = card.querySelector('.stamp-dispatch');

      if (this.currentX > 20) {
        dispatchStamp.style.opacity = Math.min(1, (this.currentX - 20) / 100);
        passStamp.style.opacity = 0;
      } else if (this.currentX < -20) {
        passStamp.style.opacity = Math.min(1, (-this.currentX - 20) / 100);
        dispatchStamp.style.opacity = 0;
      } else {
        passStamp.style.opacity = 0;
        dispatchStamp.style.opacity = 0;
      }
    };

    const onEnd = () => {
      if (!this.isDragging || this.currentCard !== card) return;
      this.isDragging = false;
      card.style.transition = 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease';

      const passStamp = card.querySelector('.stamp-pass');
      const dispatchStamp = card.querySelector('.stamp-dispatch');

      if (this.currentX > 110) {
        this.swipeRight(card);
      } else if (this.currentX < -110) {
        this.swipeLeft(card);
      } else {
        // Snap back to position
        card.style.transform = '';
        passStamp.style.opacity = 0;
        dispatchStamp.style.opacity = 0;
      }
    };

    // Mouse events
    card.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', () => onEnd());

    // Touch events
    card.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) onStart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('touchend', () => onEnd());
  }

  getTopCard() {
    const cards = this.deckContainer.querySelectorAll('.tinder-card:not(.swiped)');
    return cards.length > 0 ? cards[cards.length - 1] : null;
  }

  swipeRight(card) {
    if (!card) card = this.getTopCard();
    if (!card) return;

    window.soundEngine.swipeMatch();
    const opId = card.dataset.id;
    const op = this.operators.find(o => o.id === opId);

    const dispatchStamp = card.querySelector('.stamp-dispatch');
    if (dispatchStamp) dispatchStamp.style.opacity = 1;

    card.classList.add('swiped', 'swiped-right');
    card.style.transform = `translate(${window.innerWidth + 300}px, -40px) rotate(35deg)`;
    card.style.opacity = '0';

    this.cardHistory.push({ card, direction: 'right', op });
    window.showToast(`DISPATCHED: ${op ? op.name : 'OPERATOR'} Assigned to Mission Queue!`);
    window.addRosterOperator(op);

    setTimeout(() => {
      this.updateCardTransforms();
      this.checkDeckEmpty();
    }, 300);
  }

  swipeLeft(card) {
    if (!card) card = this.getTopCard();
    if (!card) return;

    window.soundEngine.swipePass();
    const opId = card.dataset.id;
    const op = this.operators.find(o => o.id === opId);

    const passStamp = card.querySelector('.stamp-pass');
    if (passStamp) passStamp.style.opacity = 1;

    card.classList.add('swiped', 'swiped-left');
    card.style.transform = `translate(-${window.innerWidth + 300}px, -40px) rotate(-35deg)`;
    card.style.opacity = '0';

    this.cardHistory.push({ card, direction: 'left', op });
    window.showToast(`STANDBY: ${op ? op.name : 'OPERATOR'} Placed on Reserve`);

    setTimeout(() => {
      this.updateCardTransforms();
      this.checkDeckEmpty();
    }, 300);
  }

  rewind() {
    if (this.cardHistory.length === 0) {
      window.showToast("No previous operator in dispatch history.");
      return;
    }

    window.soundEngine.click();
    const last = this.cardHistory.pop();
    const card = last.card;
    card.classList.remove('swiped', 'swiped-left', 'swiped-right');
    card.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
    card.style.opacity = '1';
    card.style.transform = '';

    const passStamp = card.querySelector('.stamp-pass');
    const dispatchStamp = card.querySelector('.stamp-dispatch');
    if (passStamp) passStamp.style.opacity = 0;
    if (dispatchStamp) dispatchStamp.style.opacity = 0;

    this.updateCardTransforms();
    window.showToast(`Restored ${last.op ? last.op.name : 'Operator'} to dispatch deck`);
  }

  updateCardTransforms() {
    const unswiped = Array.from(this.deckContainer.querySelectorAll('.tinder-card:not(.swiped)'));
    const total = unswiped.length;

    unswiped.forEach((card, index) => {
      const fromTop = total - 1 - index;
      card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

      if (fromTop === 0) {
        // Top active card
        card.style.transform = 'translate(0px, 0px) scale(1)';
        card.style.zIndex = '30';
        card.style.pointerEvents = 'auto';
        card.style.opacity = '1';
      } else if (fromTop === 1) {
        card.style.transform = 'translate(0px, 14px) scale(0.96)';
        card.style.zIndex = '20';
        card.style.pointerEvents = 'none';
        card.style.opacity = '0.9';
      } else if (fromTop === 2) {
        card.style.transform = 'translate(0px, 28px) scale(0.92)';
        card.style.zIndex = '10';
        card.style.pointerEvents = 'none';
        card.style.opacity = '0.75';
      } else {
        card.style.transform = 'translate(0px, 36px) scale(0.88)';
        card.style.zIndex = '5';
        card.style.pointerEvents = 'none';
        card.style.opacity = '0.4';
      }
    });
  }

  checkDeckEmpty() {
    const remaining = this.deckContainer.querySelectorAll('.tinder-card:not(.swiped)');
    const emptyNotice = document.getElementById('deck-empty-notice');
    if (emptyNotice) {
      emptyNotice.style.display = remaining.length === 0 ? 'flex' : 'none';
    }
  }

  bindControls() {
    const passBtn = document.getElementById('btn-tinder-pass');
    const dispatchBtn = document.getElementById('btn-tinder-dispatch');
    const rewindBtn = document.getElementById('btn-tinder-rewind');
    const infoBtn = document.getElementById('btn-tinder-info');
    const reloadBtn = document.getElementById('btn-tinder-reload');

    if (passBtn) passBtn.addEventListener('click', () => this.swipeLeft());
    if (dispatchBtn) dispatchBtn.addEventListener('click', () => this.swipeRight());
    if (rewindBtn) rewindBtn.addEventListener('click', () => this.rewind());
    if (reloadBtn) reloadBtn.addEventListener('click', () => {
      window.soundEngine.click();
      this.renderDeck();
      window.showToast("Operator Deck Shuffled & Re-initialized");
    });
    if (infoBtn) infoBtn.addEventListener('click', () => {
      const topCard = this.getTopCard();
      if (topCard) {
        window.openDossierModal(topCard.dataset.id);
      }
    });
  }
}

window.TinderDispatcher = TinderDispatcher;
