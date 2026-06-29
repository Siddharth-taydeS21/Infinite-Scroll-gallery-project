export { fetchData, Observer };
import { state } from "./galleryStates.js";
import { Observer, renderImages, isGalleryLoading } from './galleryUI.js';
import { debounce, getMainGrid } from "./utils.js";

// ========== DEBOUNCING SEARCH FIELD ===========
const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', (e) => {
    let query = e.target.value;
    // check for input value 
    if (query.trim() === '') return;
    state.query = query;
    debounceSearch(state.query);
})

// ================== PRIMARY REUSABLE FETCH DATA FUNCTION ==============
const fetchData = async (pageNum = 1, query) => {
    const key = import.meta.env.VITE_key;

    // loading state before API call
    state.loading = true;
    isGalleryLoading()

    let url;
    if (query) {
        url = `https://api.unsplash.com/search/photos?page=${pageNum}&per_page=14&query=${query}`;
        state.isUserSearching = true;
    } else {
        url = `https://api.unsplash.com/photos?page=${pageNum}&per_page=14`;
    }

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Client-ID ${key}`
            }
        })
        if (!response.ok) {
            throw new Error('Response is not OK for Unsplash')
        };

        const data = await response.json();

        if (query) {
            console.log(data.results, 'searching for :', query);
            data.results.forEach(el => {
                state.allImagesData.push(el);
            });
            renderImages(data.results, 'clear', query);
        } else {
            // console.log(data);
            data.forEach(el => {
                state.allImagesData.push(el);
            });
            renderImages(data);
        }
        console.log('all images data array: ' ,state.allImagesData)


    } catch (error) {
        console.log(error);
        // SHOW THE ERROR UI HERE ON ERROR
        state.loading = 'error';
        isGalleryLoading();

    } finally {
        state.loading = false;
        isGalleryLoading();
    }
}


// ============ INPUT HANDLER FUNCTION (USER IS SEARCHING FOR QUERY) ============== 
const debounceSearch = debounce(text => {
    // we can call our API with the text as api query instead of this console log 
    if (!text) {
        return;
    } else {
        // RESTING THE QUERY DETAILS IN STATE ON EVERY SEARCH
        state.query = text;
        state.queryPage = 1;
        state.columnHeights = [0, 0, 0];
        state.allImagesData = [];

        // IF GALLERY HAS ERROR ELEMENT, THEN REMOVE IT
        const errorCard = document.querySelector('.error_card')
        if (errorCard) {
            errorCard.remove();
        }

        fetchData(state.queryPage, state.query);
    }

    // lose focus of search input 
    searchInput.blur();
}, 1000)

// networkAbortController();