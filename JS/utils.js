export { getShortestColumn, LoadImages, debounce, getMainGrid };
import { Observer } from "./galleryAPI.js";
import { state } from "./galleryStates.js";

// =================== GETTING SHORT COLUMN TO APPEND IMAGES FROM API RESPONSE ================= 

const resizeObserver = new ResizeObserver((entries) => {
    const main = entries[0];
    if (main.contentRect.width < 640) {
        getMainGrid('mobile-container');
    }

    else if (main.contentRect.width >= 640 && main.contentRect.width < 1024) {
        getMainGrid('tablet-container');
    }

    else if (main.contentRect.width >= 1024) {
        getMainGrid('desktop-container');
        return;
    }
})

const main = document.querySelector('main');
resizeObserver.observe(main);

const getShortestColumn = (heights) => {
    const shortestIndex = heights.indexOf(
        Math.min(...heights)
    );
    return shortestIndex;
}

const getMainGrid = (container) => {
    let column;

    // THIS CODE WILL RUN WHEN SOMEONE IS TRYING TO CHANGE THE BROWSER SCREEN SIZE 
    if (container === 'mobile-container') {
        column = document.querySelector('.mobiles_container'); 
    }

    else if (container === 'tablet-container') {
        column = document.querySelector('.tablets_container');
    }

    else if (container === 'desktop-container') {
        column = document.querySelector('.desktop_container');
    }

    // CHECKING THE WINDOW SCREEN SIZE MANUALLY 
    if (!container) {

        if (window.innerWidth < 640) {
            column = document.querySelector('.mobiles_container');

        }

        else if (window.innerWidth >= 640 && window.innerWidth < 1024) {
            column = document.querySelector('.tablets_container');

        }

        else if (window.innerWidth >= 1024) {
            column = document.querySelector('.desktop_container');

        }
    }

    // console.log(column)
    return column;
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
        } else {
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
