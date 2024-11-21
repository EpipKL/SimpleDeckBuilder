// Deck Builder
export let deck = {
  commander: [],
  mainboard: [],
  sideboard: [],
  maybeboard: [],
  companion: null,
  name: null,
};

// Function to render deck
export const renderDeck = () => {
  const commanderText = document.getElementById('commander-text');
  const commanderList = document.getElementById('commander-list');
  const mainboardText = document.getElementById('mainboard-text');
  const mainboardList = document.getElementById('mainboard-list');
  const sideboardText = document.getElementById('sideboard-text');
  const sideboardList = document.getElementById('sideboard-list');
  const cardNumber = document.getElementById('card-number');

  // Clear previous deck display
  commanderList.innerHTML = '';
  mainboardList.innerHTML = '';
  sideboardList.innerHTML = '';

  // Render commander(s)
  if (deck.commander && deck.commander.length > 0) {
    commanderText.classList.remove('d-none');
    mainboardText.classList.add('mt-3');
    deck.commander.forEach((commanderCard) => {
      const commanderCardElement = createDeckCard(commanderCard, 'commander', 1);
      commanderList.appendChild(commanderCardElement);
    });
  }

  // Render mainboard
  deck.mainboard.forEach((card) => {
    const mainboardCardElement = createDeckCard(card, 'mainboard', card.quantity);
    mainboardList.appendChild(mainboardCardElement);
  });

  // Render sideboard
  deck.sideboard.forEach((card) => {
    sideboardText.classList.remove('d-none');
    mainboardText.classList.add('mb-3');
    const sideboardCardElement = createDeckCard(card, 'sideboard', card.quantity);
    sideboardList.appendChild(sideboardCardElement);
  });

  // Update card count
  const totalCards =
    deck.mainboard.reduce((acc, card) => acc + card.quantity, 0) +
    deck.sideboard.reduce((acc, card) => acc + card.quantity, 0) +
    deck.commander.length;

  cardNumber.textContent = totalCards === 1 ? `${totalCards} card` : `${totalCards} cards`;
};

// Function to create card element
const createDeckCard = (card, type, quantity) => {
  const cardName = card.card_faces
    ? card.card_faces.map((face) => face.name).join(' // ')
    : card.name;
  const imageUrl = card.card_faces
    ? card.card_faces[0].image_uris?.normal
    : card.image_uris?.normal;

  const cardElement = document.createElement('div');
  cardElement.className = 'd-flex align-items-center';
  cardElement.innerHTML = `
        <button class="list-group-item list-group-item-action flex-grow-1" data-bs-toggle="modal" data-bs-target="#cardModal${card.id}">
            <div class="">${cardName} (x${quantity})</div>
        </button>

        <button type="button" class="btn btn-outline-danger ms-2 remove-card" data-type="${type}" data-id="${card.id}">
            <i class="bi bi-trash"></i>
        </button>
    `;
  // Add event listener to remove card
  cardElement.querySelector('.remove-card').addEventListener('click', (event) => {
    removeCardFromDeck(type, card.id);
  });

  return cardElement;
};

// Function to remove card from deck
const removeCardFromDeck = (type, id) => {
  if (type === 'commander') {
    deck.commander = deck.commander.filter((card) => card.id !== id);
  } else if (type === 'mainboard') {
    deck.mainboard = deck.mainboard.filter((card) => card.id !== id);
  } else if (type === 'sideboard') {
    deck.sideboard = deck.sideboard.filter((card) => card.id !== id);
  }
  renderDeck();
};
