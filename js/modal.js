import { deck, renderDeck } from './deck.js';

// Add modal for card sorting
export const createAddCardModal = (card) => {
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
    if (deck.commander && deck.commander.length >= 2) {
      showAlert(
        'You already have two commanders. Please remove an existing commander before adding a new one.',
        'warning'
      );
      console.log('Two commanders already set.');
    } else {
      deck.commander.push(card); // Add as commander
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
