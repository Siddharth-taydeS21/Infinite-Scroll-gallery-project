export { fetchImageData, fetchRelatedImages };
import { state } from "./galleryStates.js";
import { addHeroCardDetails, addRelatedImages, isModalGalleryLoading } from "./imageDetailsUI.js";
import { clearModalContent, getMainModalGrid } from "./utils.js";


const key = import.meta.env.VITE_key;
const imgModal = document.getElementById('image_modal');


window.addEventListener('click', (e) => {
    // we can check the target is image or not here 
    const id = e.target.getAttribute('data-id');
    if (!id) return;

    //If the previous image model is left with some data rendered on UI, then clearing it fist
    clearModalContent();

    // Resetting Modal states for new image modal which gonna be created
    state.mainPhotoIDOnModal = id;
    state.modalPage = 1;
    state.relatedImagesDataArray = [];
    const container = getMainModalGrid();
    const columns = container.querySelectorAll('.modal_col');
    if (columns.length === 2) state.modalMobileColumnHeights = [0, 0];
    if (columns.length === 3) state.modalDesktopColumnHeights = [0, 0, 0];
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
        data.results.forEach(el => {
            state.relatedImagesDataArray.push(el);
        });
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
        // console.log(data);
        addHeroCardDetails(data)
        fetchRelatedImages(id);
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