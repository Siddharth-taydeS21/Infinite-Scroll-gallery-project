import { state } from "./galleryStates.js";
import { addHeroCardDetails } from "./imageDetailsUI.js";


export { fetchImageData }; 

window.addEventListener('click', (e) => {
    // we can check the target is image or not here 
    const id = e.target.getAttribute('data-id');
    if (!id) return;
    fetchImageData(id);
})

// ======================= FETCHING HERO IMAGE CARD DATA ======================== 
const fetchImageData = async (id) => {
    // important checks checks for render function no need of these here
    // if (state.heroImageDataArray.length === 0) return;
    // if (state.relatedImagesDataArray.length === 0) return;
    
    if (!id) return;
    const key = import.meta.env.VITE_key;
    let url = `https://api.unsplash.com/photos/${id}`;

    try{
        const response = await fetch(url, {
            headers:{
                Authorization: `Client-ID ${key}`
            }
        })

        if (!response.ok) {
            throw new Error('response is not OK for when searching for an image')
        }

        const data = await response.json();
        // console.log(data);
        addHeroCardDetails(data)
    }
    catch (error){
        console.log(error);
    }
}