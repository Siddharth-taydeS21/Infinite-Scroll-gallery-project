export { renderImages, isGalleryLoading };
import { getShortestColumn, LoadImages, getMainGrid } from "./utils.js";
import { state } from "./galleryStates.js";
import { Observer } from "./allObservers.js";


const loadingTemplate = document.getElementById('modal_gallery_loading_temp');
const spinLoadingTemplate = document.getElementById('loading_spinner_template');
const errorTemplate = document.getElementById('gallery_error_template');
const invalidErrorTemplate = document.getElementById('Invalid_error_template');
const galleryParent = document.querySelector('.image_grid_parent');

// SENTINEL DIV ELEMENT FOR CONTINUOUS OBSERVATION
const sentinel = document.querySelector('.sentinel');

// ======================= FUNCTION FOR LOADING & ERROR SATES OF UI ========================
const isGalleryLoading = () => {
    if (state.loading === true) {
        galleryParent.append(
            loadingTemplate.content.cloneNode(true)
        )
        // console.log('loaders appended')
    } else if (state.loading === 'error') {
        // if there already error warning exists then remove it first then show a new and just 1 error card 
        const errorCard = galleryParent.querySelector('.error_card');
        if (errorCard) {
            errorCard.remove()
        }
        galleryParent.append(errorTemplate.content.cloneNode(true));
        Observer.unobserve(sentinel);
    }
    else if (state.loading === 'invalid') {
        // if there already error warning exists then remove it first then show a new and just 1 error card 
        const errorCard = galleryParent.querySelector('.invalid_error_card');
        if (errorCard) {
            errorCard.remove()
        }
        galleryParent.append(
            invalidErrorTemplate.content.cloneNode(true)
        )
        Observer.unobserve(sentinel);
    }
    else if (state.loading === false) {
        const loader = galleryParent.querySelector('.spinner');
        if (loader) {
            loader.remove();
        }
    }
}

// ========================= PRIMARY RENDER FUNCTION ============================
const renderImages = (photos, clear, Query) => {
    console.log('render function ran!')

    const htmlContainer = getMainGrid();
    const columns = htmlContainer.querySelectorAll('.col');

    // IF USER IS SEARCHING WITH NEW QUERY, MAKING THE HTML CONTAINER EMPTY
    if (clear && state.queryPage === 1) {
        // if we got 'clear string in this call back; it means clear the container
        columns.forEach(col => {
            col.innerHTML = '';
        })
    }

    // RESETTING THE COLUMNS HEIGHTS ARRAY IF USER SEARCHING WITH NEW QUERY
    if (state.queryPage === 1 && columns.length === 1) {
        state.mobileColumnHeights = [0];
    }
    else if (state.queryPage === 1 && columns.length === 2) {
        state.tabletColumnHeights = [0, 0];
    }
    else if (state.queryPage === 1 && columns.length === 3) {
        state.desktopColumnHeights = [0, 0, 0];
    }

    let query;
    if (Query) {
        query = Query
    } else {
        query = null;
    };

    photos.forEach(img => {
        const imgId = img.id;
        const blurredImgUlr = img.urls.thumb;
        const imageUrl = img.urls.small;

        // WE NEED TO GET SMALL ITEM FORM COLUMNS HEIGHT ARRAY
        // SHORT INDEX = FIND SMALL ITEMS INDEX 
        let heights;
        let index;
        if (columns.length === 1) {
            heights = state.mobileColumnHeights
            index = getShortestColumn(heights);
        }
        else if (columns.length === 2) {
            heights = state.tabletColumnHeights
            index = getShortestColumn(heights);
        }
        else if (columns.length === 3) {
            heights = state.desktopColumnHeights
            index = getShortestColumn(heights);
        };

        // COLUMN =  columns[SHORT INDEX]
        const column = columns[index];

        column.innerHTML += `
        <div class="grid_item_parent mb-4 overflow-hidden bg-gray-300 animate-pulse">
            <div class="grid_item bg-[url(${blurredImgUlr})] bg-cover bg-no-repeat blur-xl opacity-0">
                <img src="${imageUrl}" alt="image" data-id="${imgId}" class="transition-opacity duration-200 opacity-0" loading="lazy">
            </div>
        </div>
        `;

        heights[index] += img.height / img.width;
    })
    LoadImages('grid_item_parent', 'grid_item');
    Observer.observe(sentinel);

    // IF FACED ERROR IN PREVIOUS SEARCHES
    const error = galleryParent.querySelector('#error');
    if (error) {
        error.remove();
    }
}