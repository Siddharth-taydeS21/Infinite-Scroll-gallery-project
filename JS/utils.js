export { getShortestColumn, columns, LoadImages, debounce };
import { state } from "./galleryStates.js";

// =================== GETTING SHORT COLUMN TO APPEND IMAGES FROM API RESPONSE ================= 
const columns = document.querySelectorAll('.col');

const getShortestColumn = () => {
    const cols = state.columnHeights
    const shortestIndex = cols.indexOf(
        Math.min(...cols)
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
