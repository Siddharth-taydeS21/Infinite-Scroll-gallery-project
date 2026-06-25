export { fetchData };

// ============================= STATE FOR ALL FUNCTIONS ==============================
const state = {
    page: 1,
    query: '',
    queryPage: 1,
    loading: false
}

// ======================================= UI FUNCTIONS =======================================
const loadingTemplate = document.getElementById('loading_images_template');
const errorTemplate = document.getElementById('gallery_error_template')
const galleryParent = document.querySelector('.image_grid_parent');
const gallery = document.querySelector('.main_image_grid');
const searchInput = document.getElementById('search-input');

const columns = document.querySelectorAll('.col');
const columnHeights = [0, 0, 0];

// SENTINEL DIV ELEMENT FOR CONTINUOUS OBSERVATION
const sentinel = document.querySelector('.sentinel');

// 
let isUserSearching = false;


// debounce on search logic \
const debounce = (callBack, delay = 500) => {
    let timeout;

    return function (...args) {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => {
            callBack(...args);
        }, delay)
    }

}

// input handler function 
const debounceSearch = debounce(text => {
    // we can call our API with the text as api query instead of this console log 
    if (!text) {
        return;
    } else {
        // RESTING THE QUERY DETAILS IN STATE ON EVERY SEARCH
        state.query = text;
        state.queryPage = 1;

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

searchInput.addEventListener('input', (e) => {
    let query = e.target.value;
    // check for input value 
    if (query.trim() === '') return;
    state.query = query;
    debounceSearch(state.query);
})

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
        galleryParent.append(errorTemplate.content.cloneNode(true))
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
} // DONE 


const Observer = new IntersectionObserver(entries => {
    const lastElem = entries[0];
    if (!lastElem.isIntersecting) return;

    if (state.loading) return;

    if (isUserSearching === false) {
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
})

const renderImages = (photos, str, str2) => {
    // IF USER IS SEARCHING WITH NEW QUERY, MAKING THE HTML CONTAINER EMPTY
    if (str && state.queryPage === 1) {
        columns.forEach(col => {
            col.innerHTML = '';
        })
    }

    let query;
    if (str2) {
        query = str2
    } else {
        query = null;
    };

    if (photos.length === 0) {
        console.log(photos, 'searching for :', query);
        state.loading = 'error'; // SHOW ERROR : "INVALID KEYWORD" 
        isGalleryLoading();
        Observer.unobserve(sentinel);
        return;
    }

    photos.forEach(img => {
        const imageUrl = img.urls.small;

        // WE NEED TO GET SMALL ITEM FORM COLUMNS HEIGHT ARRAY
        // SHORT INDEX = FIND SMALL ITEMS INDEX 
        const shortestIndex = columnHeights.indexOf(
            Math.min(...columnHeights)
        );
        
        // COLUMN =  columns[SHORT INDEX]
        const column = columns[shortestIndex];

        column.innerHTML += `
        <div class="grid_item bg-gray-300 rounded">
            <img src="${imageUrl}"  alt="image" loading="lazy">
        </div>
        `;

        columnHeights[shortestIndex] += img.height;
    })
    Observer.observe(sentinel);
}

const fetchData = async (num = 1, query) => {
    // MAKE UI FUNCTION THAT SHOWS LOADING SKELETONS IN IMAGE GRID WHEN FETCHING  
    const key = import.meta.env.VITE_key;

    // loading state before API call
    state.loading = true;
    isGalleryLoading()

    let url;
    if (query) {
        url = `https://api.unsplash.com/search/photos?page=${num}&per_page=15&query=${query}`;
        isUserSearching = true;
    } else {
        url = `https://api.unsplash.com/photos?page=${num}&per_page=15`;
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
            renderImages(data.results, 'clear', query);
        } else {
            console.log(data);
            renderImages(data);
        }


    } catch (error) {
        console.log(error);
        // SHOW THE ERROR UI HERE ON ERROR
        state.loading = 'error';
        isGalleryLoading();

    } finally {
        state.loading = false;
        isGalleryLoading();
    }
} // DONE


// networkAbortController();