export { fetchImageData };
import { state } from "./galleryStates.js";
import { addHeroCardDetails, addRelatedImages, isModalGalleryLoading } from "./imageDetailsUI.js";
import { clearModalColumns } from "./utils.js";


const key = import.meta.env.VITE_key;
const imgModal = document.getElementById('image_modal');


window.addEventListener('click', (e) => {
    // we can check the target is image or not here 
    const id = e.target.getAttribute('data-id');
    if (!id) return;
    clearModalColumns();
    fetchImageData(id);
})

const fetchRelatedImages = async ( id, pageNum = 1) => {
    console.log('fetchRelatedImages async function ran')
    state.modalLoading = true;
    isModalGalleryLoading();


    let url = `https://api.unsplash.com/photos/${id}/related?page=${pageNum}&per_page=14`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Client-ID ${key}`
            }
        })

        if (!response.ok) {
            throw new Error('response is not OK for when searching for an image')
        }

        const data = await response.json();
        console.log(data);
        addRelatedImages(data.results);
    }
    catch (error) {
        console.log(error);
        state.modalLoading = 'error';
        isModalGalleryLoading();
    } finally{
        state.modalLoading = false;
        isModalGalleryLoading();
    }
}

// ======================= FETCHING HERO IMAGE CARD DATA ======================== 
const fetchImageData = async (id) => {
    // important checks checks for render function no need of these here
    // if (state.heroImageDataArray.length === 0) return;
    // if (state.relatedImagesDataArray.length === 0) return;

    if (!id) return;
    let url = `https://api.unsplash.com/photos/${id}`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Client-ID ${key}`
            }
        })

        if (!response.ok) {
            throw new Error('response is not OK for when searching for an image')
        }

        const data = await response.json();
        console.log(data);
        addHeroCardDetails(data)
        fetchRelatedImages(id);
    }
    catch (error) {
        console.log(error);
    }
}