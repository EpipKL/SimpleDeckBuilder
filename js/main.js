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
  const oracleText = isMDFC
    ? card.card_faces.map((face) => face.oracle_text || 'No oracle text available').join('<br><br>')
    : [card.oracle_text || 'No oracle text available'];

  return oracleText
    .map(
      (text) =>
        text
          .replace(/^\s+|\s+$/g, '') // Remove leading and trailing whitespace
          .replace(/\s{2,}/g, ' ') // Replace multiple spaces with a single space
          .replace(/\n/g, '<br>') // Replace newlines with <br> for HTML rendering
    )
    .join('<br><br>');
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

  return `
        <div class="modal fade" id="cardModal${card.id}" tabindex="-1" aria-labelledby="cardModalLabel${card.id}" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border border-info">
                    <div class="modal-header">
                        <h5 class="modal-title" id="cardModalLabel${card.id}">Card Details</h5>
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
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#cardModal${card.id}">
                        View Card
                    </button>
                </div>
            </div>
        </div>
    `;
};

// Update search results
const updateSearchResults = (data) => {
  const resultCount = data.total_cards || 0;
  searchResultsContainer.innerHTML = `
            <div class="d-flex align-items-center position-relative">
            <h2 class="ms-2">Search Results</h2>
            <p class="align-self-center m-0 ms-2 fw-light">
                <sm>Found ${resultCount} cards</sm>
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
