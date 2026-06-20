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
        for (let i = 0; i < 10; i++) {
            gallery.append(
                loadingTemplate.content.cloneNode(true)
            )
        }
    }else if(state.loading === 'error'){
        galleryParent.append(errorTemplate.content.cloneNode(true))
    }else if(state.loading === false ){
        const loaders = document.querySelectorAll('.loader');
        loaders.forEach(loader => {
            loader.remove()
        })
    }
} // DONE 

const renderImages = (obj) => {
    obj.forEach(item => {
        const imageUrl = item.urls.small;
        gallery.innerHTML += `
            <div class="grid_item"><img src="${imageUrl}"  alt="image" loading="lazy"></div>
        `
    })
    
}

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
        renderImages(data)
        
    } catch (error) {
        console.log(error);
        state.loading = 'error';
        isGalleryLoading();
        // SHOW THE ERROR UI HERE ON ERROR

    } finally{
        state.loading = false;
        isGalleryLoading();
    }
} // DONE

// paginationLogic();

// networkAbortController();