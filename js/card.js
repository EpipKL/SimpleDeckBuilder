import { modalCache } from './caches.js';
import { getCardImageUrl, getCardPowerToughness, getCardCost } from './utils.js';
import { addCardButtonLogic } from './dom.js';

// Generate card information
export const generateCardInfo = (card) => {
  const isMDFC = card.card_faces && card.card_faces.length > 0;
  const cardName = isMDFC ? card.card_faces.map((face) => face.name).join(' // ') : card.name;
  const typeLine = isMDFC
    ? card.card_faces.map((face) => face.type_line).join(' // ')
    : card.type_line;

  const imageUrl = getCardImageUrl(card, isMDFC);
  const modalImageUrl = getCardImageUrl(card, isMDFC, true);

  const powerToughness = getCardPowerToughness(card, isMDFC);
  const cardCost = getCardCost(card, isMDFC);

  return { cardName, typeLine, imageUrl, modalImageUrl, powerToughness, cardCost };
};

// Generate card modal HTML
export const getCardModal = (card, cleanedOracleText) => {
  const { cardName, typeLine, imageUrl, modalImageUrl, powerToughness, cardCost } =
    generateCardInfo(card);
  const modalId = `cardModal${card.id}`;

  // If the modal is in the cache then return it
  if (modalCache[card.id]) {
    return modalCache[card.id];
  }

  // If not then generate the modal

  const modalHTML = `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border border-info">
                    <div class="modal-header">
                        <h5 class="modal-title" id="${modalId}Label">${cardName} <span class="lead"><small>${cardCost}</small></span></h5>
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
                        <div class="border border-info my-2 p-1 rounded-2 text-start">
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

  //  Cache the modal
  modalCache[card.id] = modalHTML;

  return modalHTML;
};

// Generate card HTML
export const generateCardDisplay = (card, cleanedOracleText) => {
  const { cardName, typeLine, imageUrl } = generateCardInfo(card);

  // Generate or retrive cached modal
  const modalHTML = getCardModal(card, cleanedOracleText);

  // Append to modal container but only once
  const modalContainer = document.getElementById('modal-container');
  if (!document.getElementById(`cardModal${card.id}`)) {
    modalContainer.insertAdjacentHTML('beforeend', modalHTML);
  }

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
