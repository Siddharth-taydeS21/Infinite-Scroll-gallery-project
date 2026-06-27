export { Observer, renderImages, isGalleryLoading };
import { getShortestColumn, columns, LoadImages } from "./utils.js";
import { state } from "./galleryStates.js";
import { fetchData } from "./galleryAPI.js";


const loadingTemplate = document.getElementById('loading_images_template');
const errorTemplate = document.getElementById('gallery_error_template')
const galleryParent = document.querySelector('.image_grid_parent');
const gallery = document.querySelector('.main_image_grid');

// SENTINEL DIV ELEMENT FOR CONTINUOUS OBSERVATION
const sentinel = document.querySelector('.sentinel');

// =================== INTERSECTION OBSERVER LOGIC FOR PAGINATION (INFINITE SCROLL LOGIC) =====================
const Observer = new IntersectionObserver(entries => {
    const lastElem = entries[0];
    if (!lastElem.isIntersecting) return;

    if (state.loading) return;

    if (state.isUserSearching === false) {
        state.page++;
        fetchData(state.page);
        console.log(state.page);
    } else {
        state.queryPage++;
        console.log(state.queryPage);
        fetchData(state.queryPage, state.query);
    }

}, {
    rootMargin: '400px'
});

// ======================= FUNCTION FOR LOADING & ERROR SATES OF UI ========================
const isGalleryLoading = () => {
    if (state.loading === true) {
        columns.forEach(col => {
            for (let i = 0; i < 1; i++) {
                col.append(
                    loadingTemplate.content.cloneNode(true)
                )
            }
        })
    } else if (state.loading === 'error') {
        galleryParent.append(errorTemplate.content.cloneNode(true));
        Observer.unobserve(sentinel);
    }
    // SHOW ERROR : "INVALID KEYWORD" 
    else if (state.loading === false) {
        const loader = document.querySelectorAll('.loaders');
        if (loader) {
            loader.forEach(loader => {
                loader.remove();
            })
        }
    }
}


// ========================= PRIMARY RENDER FUNCTION ============================
const renderImages = (photos, clear, Query) => {

    // IF USER IS SEARCHING WITH NEW QUERY, MAKING THE HTML CONTAINER EMPTY
    if (clear && state.queryPage === 1) {
        // if we got 'clear string in this call back; it means clear the container
        columns.forEach(col => {
            col.innerHTML = '';
        })
    }

    let query;
    if (Query) {
        query = Query
    } else {
        query = null;
    };

    // WHILE FETCHING NEXT PAGE, IF WE GOT ERROR, THEN RETURN AND SHOW ERROR MASSAGE  
    if (photos.length === 0) {
        console.log(photos, 'searching for :', query);
        state.loading = 'error'; // SHOW ERROR : "INVALID KEYWORD" 
        isGalleryLoading();
        return;
    }

    photos.forEach(img => {
        const blurredImgUlr = img.urls.thumb;
        const imageUrl = img.urls.small;

        // WE NEED TO GET SMALL ITEM FORM COLUMNS HEIGHT ARRAY
        // SHORT INDEX = FIND SMALL ITEMS INDEX 
        const index = getShortestColumn();

        // COLUMN =  columns[SHORT INDEX]
        const column = columns[index];

        column.innerHTML += `
        <div class="grid_item_parent mb-4 overflow-hidden bg-gray-300 animate-pulse">
            <div class="grid_item bg-[url(${blurredImgUlr})] bg-cover bg-no-repeat blur-xl opacity-0">
                <img src="${imageUrl}" alt="image" class="transition-opacity duration-200 opacity-0" loading="lazy">
            </div>
        </div>
        `;

        state.columnHeights[index] += img.height / img.width;
    })

    LoadImages();
    Observer.observe(sentinel);
}