export { getShortestColumn, columns, columnHeights, LoadImages, debounceSearch };
import { state } from "./galleryStates.js";
import { fetchData, searchInput } from "./galleryAPI.js";

// =================== GETTING SHORT COLUMN TO APPEND IMAGES FROM API RESPONSE ================= 
const columns = document.querySelectorAll('.col');
let columnHeights = [0, 0, 0];

const getShortestColumn = () => {
    const shortestIndex = columnHeights.indexOf(
        Math.min(...columnHeights)
    );
    return shortestIndex;
}

// =================== BLUR LOAD + PULSE ANIMATION LOGIC FOR IMAGES =====================
const LoadImages = () => {
    const GridItemParents = document.querySelectorAll('.grid_item_parent');
  
    GridItemParents.forEach(gridItem => {
      const wrapper = gridItem.querySelector('.grid_item');
      const img = wrapper.querySelector('img');
  
      function loaded() {
          wrapper.classList.replace('opacity-0', 'opacity-100');
          img.classList.replace('opacity-0', 'opacity-100')
          gridItem.classList.remove('animate-pulse')
          
          setTimeout(() => {
              wrapper.classList.remove('blur-xl');
          }, 1500)
      }
  
      if (img.complete) {
          loaded();
      }else{
          img.addEventListener('load', loaded)
      }
    })
  
  }
  

// ==========================  DEBOUNCING ON SEARCH LOGIC ==============================

// ===== CORE DEBOUNCING LOGIC =======
const debounce = (callBack, delay = 500) => {
    let timeout;

    return function (...args) {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => {
            callBack(...args);
        }, delay)
    }

}

// ============ INOUT HANDLER FUNCTION (USER IS SEARCHING FOR QUERY) ============== 
const debounceSearch = debounce(text => {
    // we can call our API with the text as api query instead of this console log 
    if (!text) {
        return;
    } else {
        // RESTING THE QUERY DETAILS IN STATE ON EVERY SEARCH
        state.query = text;
        state.queryPage = 1;
        columnHeights = [0, 0, 0];

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