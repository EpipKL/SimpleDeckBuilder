// Navigation Search
const generalSearch = document.getElementById('general-search');
const generalSearchButton = document.getElementById('general-search-button');
const searchResultsContainer = document.getElementById('search-results');

// Fetch Card Data
const fetchCardData = async (query) => {
  try {
    const response = await fetch(`https://api.scryfall.com/cards/search?q=${query}`);
    return await response.json();
  } catch (error) {
    console.error('Counter Spell: Error fetching data:', error);
    throw new Error('Counter Spell: Error fetching data');
  }
};

// Generate cleaned oracle data
const getCleanedOracleText = (card) => {
  const isMDFC = card.card_faces && card.card_faces.length > 0;

  const oracleTextArray = isMDFC
    ? card.card_faces.map((face) => face.oracle_text || 'No oracle text available')
    : [card.oracle_text || 'No oracle text available'];

  console.log('Oracle Text:', oracleTextArray);
  console.log('Type:', typeof oracleTextArray);

  // Clean each oracle text entry
  const cleanedOracleText = oracleTextArray.map(
    (text) =>
      text
        .replace(/^\s+|\s+$/g, '') // Remove leading and trailing whitespace
        .replace(/\s{2,}/g, ' ') // Replace multiple spaces with a single space
        .replace(/\n/g, '<br>') // Replace newlines with <br> for HTML rendering
  );

  return cleanedOracleText.join('<br><br>');
};

// Generate card information
const generateCardInfo = (card) => {
  const isMDFC = card.card_faces && card.card_faces.length > 0;
  const cardName = isMDFC ? card.card_faces.map((face) => face.name).join(' // ') : card.name;

  const typeLine = isMDFC
    ? card.card_faces.map((face) => face.type_line).join(' // ')
    : card.type_line;

  const imageUrl = isMDFC
    ? card.card_faces[0].image_uris
      ? card.card_faces[0].image_uris.normal
      : 'https://placehold.co/400'
    : card.image_uris.normal;

  const modalImageUrl = isMDFC
    ? card.card_faces[0].image_uris && card.card_faces[0].image_uris.art_crop
      ? card.card_faces[0].image_uris.art_crop
      : 'https://placehold.co/400'
    : card.image_uris.art_crop;

  const powerToughness = isMDFC
    ? card.card_faces
        .map((face) =>
          face.power && face.toughness
            ? `<p class="fs-3 fw-bold m-0 mb-2 px-2 py-1 bg-black bg-opacity-50 rounded-1">${face.power} / ${face.toughness}</p>`
            : ''
        )
        .filter((pt) => pt)
        .join(' // ')
    : card.power && card.toughness
    ? `<p class="fs-3 fw-bold m-0 mb-2 px-2 py-1 bg-black bg-opacity-50 rounded-1">${card.power} / ${card.toughness}</p>`
    : '';

  return { cardName, typeLine, imageUrl, modalImageUrl, powerToughness };
};

// Generate card modal HTML
const generateCardModal = (card, cleanedOracleText) => {
  const { cardName, typeLine, imageUrl, modalImageUrl, powerToughness } = generateCardInfo(card);
  const modalId = `cardModal${card.id}`;

  return `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border border-info">
                    <div class="modal-header">
                        <h5 class="modal-title" id="${modalId}Label">Card Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body mb-2">
                        <div class="position-relative">
                            <img src="${modalImageUrl}" class="card-img-top rounded-2" alt="${cardName}">
                            <div class="position-absolute bottom-0 end-0 me-2 align-middle">${powerToughness}</div>
                            <div class="position-absolute bottom-0 start-0 ms-2 align-middle">
                                <p class="fs-3 fw-bold m-0 mb-2 px-2 py-1 bg-black bg-opacity-50 rounded-1 text-capitalize">${card.rarity}</p>
                            </div>
                        </div>
                        <div class="border border-info my-2 p-1 rounded-2">
                            <h5 class="card-title">${cardName}</h5>
                            <p>${typeLine}</p>
                            <p class="card-text">${cleanedOracleText}</p>
                        </div>
                        <div class="border border-info my-2 p-1 rounded-2 d-flex justify-content-between px-2">
                            <p class="card-text m-0"><span class="fw-bold">Set</span>: <span class="text-decoration-underline">${card.set_name}</span></p>
                            <p class="card-text"><span class="fw-bold">Artist</span>: <span class="text-decoration-underline">${card.artist}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// Generate card HTML
const generateCardDisplay = (card, cleanedOracleText) => {
  const { cardName, typeLine, imageUrl } = generateCardInfo(card);

  return `
     <div class="col-12 col-md-4 col-lg-3">
            <div class="card mb-2">
                <img src="${imageUrl}" class="card-img-top h-100 mx-auto mt-2" style="height:100px; width: 50%;" alt="${cardName}">
                <div class="card-body">
                    <h5 class="card-title">${cardName}</h5>
                    <p class="card-text">${typeLine}</p>
                    <div class="d-flex justify-content-between gap-2">
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#cardModal${
                      card.id
                    }">
                        View Card
                    </button>
                    ${addCardButtonLogic(card).outerHTML}
                    </div>
                </div>
            </div>
        </div>
    `;
};

// Update search results
const updateSearchResults = (data) => {
  searchResultsContainer.innerHTML = `
      <div class="d-flex align-items-center position-relative">
        <h2 class="ms-2">Search Results</h2>
        <p class="align-self-center m-0 ms-2 fw-light">
            <sm>Found ${data.total_cards} cards</sm>
        </p>
      </div>
      <div class="container text-center">
        <div class="row">
          ${data.data
            .map((card) => {
              const cleanedOracleText = getCleanedOracleText(card);
              return (
                generateCardDisplay(card, cleanedOracleText) +
                generateCardModal(card, cleanedOracleText)
              );
            })
            .join('')}
        </div>
      </div>
    `;

  searchResultsContainer.addEventListener('click', (event) => {
    if (event.target.matches('.btn-success')) {
      const cardId = event.target.getAttribute('data-card-id');
      const card = data.data.find((c) => c.id === cardId);
      if (card) {
        addCardToDeck(card);
      } else {
        console.error(`Card with ID ${cardId} not found`);
      }
    }
  });
};

// Handle search button click
generalSearchButton.addEventListener('click', async () => {
  const query = generalSearch.value.trim();

  if (!query) {
    searchResultsContainer.innerHTML =
      '<p class="ms-2 ms-md-5 text-danger">Please enter a search query</p>';
    return;
  }

  try {
    const data = await fetchCardData(query);
    updateSearchResults(data);
  } catch (error) {
    searchResultsContainer.innerHTML = `<p class="ms-2 ms-md-5 text-danger">Counter Spell: ${error.message}.</p>`;
  }

  generalSearch.value = '';
});

// Deck Builder
let deck = {
  commander: null,
  mainboard: [],
  sideboard: [],
  maybeboard: [],
  companion: null,
  name: null,
};

// Function to render deck
const renderDeck = () => {
  const commanderList = document.getElementById('commander-list');
  const mainboardList = document.getElementById('mainboard-list');
  const sideboardList = document.getElementById('sideboard-list');
  const cardNumber = document.getElementById('card-number');

  // Clear previous deck display
  commanderList.innerHTML = '';
  mainboardList.innerHTML = '';
  sideboardList.innerHTML = '';

  // Render commander
  if (deck.commander) {
    const commanderCardElement = createCardElement(deck.commander, 'commander', 1);
    commanderList.appendChild(commanderCardElement);
  }

  // Render mainboard
  deck.mainboard.forEach((card) => {
    const mainboardCardElement = createCardElement(card, 'mainboard', card.quantity);
    mainboardList.appendChild(mainboardCardElement);
  });

  // Render sideboard
  deck.sideboard.forEach((card) => {
    const sideboardCardElement = createCardElement(card, 'sideboard', card.quantity);
    sideboardList.appendChild(sideboardCardElement);
  });

  // Update card count
  const totalCards =
    deck.mainboard.reduce((acc, card) => acc + card.quantity, 0) +
    deck.sideboard.reduce((acc, card) => acc + card.quantity, 0) +
    (deck.commander ? 1 : 0); // Commander count is always 1
  cardNumber.textContent = `${totalCards} cards`;
};

// Function to create card element
const createCardElement = (card, type, quantity) => {
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

// Add modal for card sorting
const createAddCardModal = (card) => {
  if (!card) {
    console.error('Card is undefined in createAddCardModal');
    return; // Handle the case where card is undefined
  }

  //   Remove existing modal if it exists
  const existingModal = document.getElementById('addCardModal');
  if (existingModal) {
    existingModal.remove();
  }

  // Create modal elements
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = 'addCardModal';
  modal.tabIndex = '-1';
  modal.setAttribute('aria-labelledby', 'addCardModalLabel');
  modal.setAttribute('aria-hidden', 'true');

  modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addCardModalLabel">Add Card to Deck</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div id="alertPlaceholder"></div>
                    <div>
                        <label for="quantityInput" class="form-label">Quantity:</label>
                        <input type="number" id="quantityInput" class="form-control" value="1" min="1">
                    </div>
                    <div class="d-flex justify-content-center gap-2 mt-3">
                        <button class="btn btn-light btn-lg" id="addCommanderBtn">Commander</button>
                        <button class="btn btn-primary btn-lg" id="addMainboardBtn">Mainboard</button>
                        <button class="btn btn-secondary btn-lg" id="addSideboardBtn">Sideboard</button>
                    </div>
                </div>
            </div>
        </div>
    `;

  // Append modal to body
  document.body.appendChild(modal);

  // Initialize Bootstrap modal
  const addCardModal = new bootstrap.Modal(modal);

  const showAlert = (message, type) => {
    const alertPlaceholder = modal.querySelector('#alertPlaceholder');
    alertPlaceholder.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
  };

  const quantityInput = modal.querySelector('#quantityInput');

  // Event listeners for buttons
  modal.querySelector('#addCommanderBtn').onclick = () => {
    if (deck.commander) {
      showAlert(
        'You already have a commander. Please remove the existing commander before adding a new one.',
        'warning'
      );
      console.log('Commander already set.');
    } else {
      deck.commander = card; // Add as commander
      console.log('Commander set: ', card.name);
      addCardModal.hide(); // Close modal
      renderDeck();
    }
  };

  modal.querySelector('#addMainboardBtn').onclick = () => {
    const quantity = parseInt(quantityInput.value, 10);
    if (!deck.mainboard.find((existingCard) => existingCard.id === card.id)) {
      deck.mainboard.push({ ...card, quantity }); // Add to mainboard
      console.log(`Card added to mainboard: , ${card.name} x ${quantity}`);
      addCardModal.hide(); // Close modal
      renderDeck();
    } else {
      // If the card is already in the mainboard, we should update the quantity
      const existingCard = deck.mainboard.find((existingCard) => existingCard.id === card.id);
      existingCard.quantity += quantity;
      console.log(`Updated quantity for ${card.name} to ${existingCard.quantity}`);
      addCardModal.hide(); // Close modal
      renderDeck();
    }
  };

  modal.querySelector('#addSideboardBtn').onclick = () => {
    const quantity = parseInt(quantityInput.value, 10);
    if (!deck.sideboard.find((existingCard) => existingCard.id === card.id)) {
      deck.sideboard.push({ ...card, quantity }); // Add to sideboard
      console.log(`Card added to sideboard: ${card.name} x ${quantity}`);
      addCardModal.hide(); // Close modal
      renderDeck();
    } else {
      // If the card is already in the sideboard, we should update the quantity
      const existingCard = deck.sideboard.find((existingCard) => existingCard.id === card.id);
      existingCard.quantity += quantity;
      console.log(`Updated quantity for ${card.name} to ${existingCard.quantity}`);
      addCardModal.hide(); // Close modal
      renderDeck();
    }
  };

  return addCardModal;
};

// Function to add card to deck
const addCardToDeck = (card) => {
  console.log('addCardToDeck function called');
  console.log(card); // This should log the card object

  if (!deck) {
    console.error('Deck not initialized');
    return;
  }

  if (!card) {
    console.error('Card is undefined in addCardToDeck');
    return; // Early exit if the card is not defined
  }

  // Create and show the modal with the card object
  const addCardModal = createAddCardModal(card);
  addCardModal.show();
};

// Function to remove card from deck
const removeCardFromDeck = (type, id) => {
  if (type === 'commander') {
    deck.commander = null;
  } else if (type === 'mainboard') {
    deck.mainboard = deck.mainboard.filter((card) => card.id !== id);
  } else if (type === 'sideboard') {
    deck.sideboard = deck.sideboard.filter((card) => card.id !== id);
  }
  renderDeck();
};

// Add event listener to clear deck button
document.getElementById('clear-button').addEventListener('click', () => {
  deck = {
    commander: null,
    mainboard: [],
    sideboard: [],
  };
  renderDeck();
});

// Add to deck button to search results
const addCardButtonLogic = (card) => {
  console.log('Creating add to deck button for card:', card.name);
  console.log('addCardToDeck called with: ', card);
  const addCardButton = document.createElement('button');
  addCardButton.textContent = 'Add to Deck';
  addCardButton.className = 'btn btn-success';
  addCardButton.setAttribute('data-card-id', card.id);
  addCardButton.setAttribute('data-card-name', card.name);
  addCardButton.addEventListener('click', () => {
    console.log(`Adding card to deck: ${card.name}`); // Log card name to console
    addCardToDeck(card);
    console.log('Deck:', deck); // Log deck to console
  });
  return addCardButton;
};

//
