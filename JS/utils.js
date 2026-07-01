export { getShortestColumn, LoadImages, debounce, getMainGrid, getFormattedDate, trunCateText, getMainModalGrid, clearModalColumns };
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

const getMainGrid = () => {
    let column;

    // THIS CODE WILL RUN WHEN SOMEONE IS TRYING TO CHANGE THE BROWSER SCREEN SIZE 

    if (window.innerWidth < 640) {
        column = document.querySelector('.mobiles_container');

    }

    else if (window.innerWidth >= 640 && window.innerWidth < 1024) {
        column = document.querySelector('.tablets_container');

    }

    else if (window.innerWidth >= 1024) {
        column = document.querySelector('.desktop_container');

    }

    // console.log(column)
    return column;
}

const getMainModalGrid = () => {
    let column;

    if (window.innerWidth < 768) {
        column = document.querySelector('.modal_mobile_container');
    }

    else if (window.innerWidth >= 768) {
        column = document.querySelector('.modal_desktop_container');
    }

    return column;
}

// =================== BLUR LOAD + PULSE ANIMATION LOGIC FOR IMAGES =====================
const LoadImages = (ParentClassName, wrapperClassName) => {
    const GridItemParents = document.querySelectorAll(`.${ParentClassName}`);

    GridItemParents.forEach(gridItem => {
        const wrapper = gridItem.querySelector(`.${wrapperClassName}`);
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

// ==========================  DATE FORMATTER FOR HERO IMG CARD ==========================
const getFormattedDate = (dateString) => {
    const date = new Date(dateString);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formatter = new Intl.DateTimeFormat('en-US', options);

    const formattedDate = formatter.format(date);
    return formattedDate;
}

// ================================ TRUNCATE TEXT IF TOO LONG LOGIC ===================================
const trunCateText = (text, length) => {
    if (!text || text.length <= length) return text;
    return text.slice(0, length) + '...';
}

const clearModalColumns = () => {
    const likeIcon = document.getElementById('like_icon');
    const unlikeIcon = document.getElementById('unlike_icon')

    likeIcon.classList.add('hidden');
    unlikeIcon.classList.remove('hidden');

    const htmlContainer = getMainModalGrid();
    const columns = htmlContainer.querySelectorAll('.modal_col');

    columns.forEach(col => {
        col.innerHTML = '';
    })

    const modal = document.getElementById('image_modal');
    modal.scrollTop = 0;
}