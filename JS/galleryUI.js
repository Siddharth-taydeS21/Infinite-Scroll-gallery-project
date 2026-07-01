export { Observer, renderImages, isGalleryLoading };
import { getShortestColumn, LoadImages, getMainGrid } from "./utils.js";
import { state } from "./galleryStates.js";
import { fetchData } from "./galleryAPI.js";


const loadingTemplate = document.getElementById('modal_gallery_loading_temp');
const spinLoadingTemplate = document.getElementById('loading_spinner_template');
const errorTemplate = document.getElementById('gallery_error_template');
const invalidErrorTemplate = document.getElementById('Invalid_error_template');
const galleryParent = document.querySelector('.image_grid_parent');

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
});

// ======================= FUNCTION FOR LOADING & ERROR SATES OF UI ========================
const isGalleryLoading = () => {
    if (state.loading === true) {
        galleryParent.append(
            loadingTemplate.content.cloneNode(true)
        )
        // console.log('loaders appended')
    } else if (state.loading === 'error') {
        galleryParent.append(errorTemplate.content.cloneNode(true));
        Observer.unobserve(sentinel);
    }
    else if (state.loading === 'invalid') {
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
    console.log('render function ran')
    console.log('all images data array: ', state.allImagesData)
    // /*
    //  * GET MAIN GRID BY SCREEN SIZE
    //  * columns = GET ALL COLUMNS IN MAIN GRID
    //  * 
    //  * checks = 1) if (state.queryPage <= 1) columns.forEach => col.clearHTML first then append
    //  * 
    //  * PHOTOS.forEach => 
    //  * heightsArray = GET HEIGHT ARRAY FROM STATE.COLUMN HEIGHTS
    //  * shortIndex = GET SHORTEST INDEX FORM STATE.COLUMN HEIGHTS IN STATE OBJECT == [WE NEED TO CHANGE THE LENGTH OF THIS ARRAY ON THE BASIC OF SCREEN SIZE] 
    //  * columns[shortIndex].append(photo);
    //  * heightsArray[shortIndex] += photo.height / photo.width
    //  */

    const htmlContainer = getMainGrid();
    // console.log(htmlContainer);
    const columns = htmlContainer.querySelectorAll('.col');
    // console.log(columns)


    // IF USER IS SEARCHING WITH NEW QUERY, MAKING THE HTML CONTAINER EMPTY
    if (clear && state.queryPage === 1) {
        // if we got 'clear string in this call back; it means clear the container
        columns.forEach(col => {
            col.innerHTML = '';
        })
    }
    // console.log('state query page check done')

    let query;
    if (Query) {
        query = Query
    } else {
        query = null;
    };
    // console.log('query null check done')

    // WHILE FETCHING NEXT PAGE, IF WE GOT ERROR, THEN RETURN AND SHOW ERROR MASSAGE  
    if (photos.length === 0) {
        console.log(photos, 'searching for :', query);
        const errorCard = document.querySelector('.error_card');
        if (errorCard) {
            errorCard.remove();
        }
        state.loading = 'invalid'; // SHOW ERROR : "INVALID KEYWORD" 
        isGalleryLoading();
        return;
    }
    // else{
    //     errorTemplate.remove()
    //     galleryParent.append(
    //         spinLoadingTemplate.content.cloneNode(true)
    //     )
    // }
    // console.log('photos length is not 0')

    // console.log(photos)
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
        // console.log(heights)
        // console.log(index)


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
}