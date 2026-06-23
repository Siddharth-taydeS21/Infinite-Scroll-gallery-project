export { fetchData };

// ============================= STATE FOR ALL FUNCTIONS ==============================
const state = {
    page: 1,
    query: '',
    loading: false
}

// ======================================= UI FUNCTIONS =======================================
const loadingTemplate = document.getElementById('loading_images_template');
const errorTemplate = document.getElementById('gallery_error_template')
const galleryParent = document.querySelector('.image_grid_parent');
const gallery = document.querySelector('.main_image_grid');


const isGalleryLoading = () => {
    if (state.loading === true) {
        galleryParent.append(
            loadingTemplate.content.cloneNode(true)
        )
    } else if (state.loading === 'error') {
        galleryParent.append(errorTemplate.content.cloneNode(true))
    } else if (state.loading === false) {
        const loader = document.querySelector('.loading_card');
        loader.remove();
    }
} // DONE 


const renderImages = (obj) => {

    obj.forEach(img => {
        const imageUrl = img.urls.small;
        gallery.innerHTML += `
        <div class="grid_item"><img src="${imageUrl}"  alt="image" loading="lazy"></div>
    `;
    })

    const lastElem = document.querySelector('.grid_item:last-of-type');
    Observer.observe(lastElem)

}


const Observer = new IntersectionObserver(entries => {
    const lastElem = entries[0];
    if (!lastElem.isIntersecting) return
    state.page++;
    console.log(state.page);

    fetchData(state.page);
    Observer.unobserve(lastElem.target);

    const newLast = document.querySelector('.grid_item:last-of-type')
    if (newLast) Observer.observe(newLast);
}, {
    threshold: 1
})



const fetchData = async (num = 1) => {
    // MAKE UI FUNCTION THAT SHOWS LOADING SKELETONS IN IMAGE GRID WHEN FETCHING  
    const key = import.meta.env.VITE_key;

    // loading state before API call
    state.loading = true;
    isGalleryLoading()

    try {
        const response = await fetch(`https://api.unsplash.com/photos?client_id=${key}&page=${num}&per_page=15`)
        if (!response.ok) {
            throw new Error('Response is not OK for Unsplash')
        };

        const data = await response.json();
        renderImages(data);

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

// debounce on search logic 

// networkAbortController();