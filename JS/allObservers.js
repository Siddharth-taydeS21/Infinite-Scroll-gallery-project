import { state } from "./galleryStates.js";
import { fetchData } from "./galleryAPI.js";
import { renderImages } from "./galleryUI.js";
import { addRelatedImages } from "./imageDetailsUI.js";
import { fetchRelatedImages } from "./imageDetailsAPI.js";
import { getMainModalGrid } from "./utils.js";

export { LayoutObserver, Observer, modalObserver }

const desktopContainer = document.querySelector('.desktop_container');
const tabletContainer = document.querySelector('.tablets_container');
const mobileContainer = document.querySelector('.mobiles_container');

const ModalMobileContainer = document.querySelector('.modal_mobile_container')
const ModalDesktopContainer = document.querySelector('.modal_desktop_container')

const sentinel = document.querySelector('.sentinel');

// ================================= MAIN MASONRY GRID'S INFINITE SCROLL OBSERVER FOR PAGINATION ========================================
// =================== INTERSECTION OBSERVER LOGIC FOR PAGINATION (INFINITE SCROLL LOGIC) =====================

const Observer = new IntersectionObserver(entries => {
    const lastElem = entries[0];
    if (!lastElem.isIntersecting) return;

    if (state.loading) return;

    if (state.isUserSearching === false) {
        state.page++;
        fetchData(state.page);
    } else {
        state.queryPage++;
        fetchData(state.queryPage, state.query);
    }

}, {
    rootMargin: "300px",
});

// ============================== INTERSECTION OBSERVER FOR INFINITE SCROLL IN IMAGE MODAL POPUP ===============================
const modalSentinel = document.querySelector('.modal_sentinel');

const modalObserver = new IntersectionObserver((entries) => {
    const el = entries[0];
    if(!el.isIntersecting) return;

    if(state.modalLoading === true) return; 

    state.modalPage++;
    fetchRelatedImages(state.mainPhotoIDOnModal, state.modalPage);
}, {
    rootMargin: "300px",
})

modalObserver.observe(modalSentinel)

// ================================= MAIN MASONRY GRID'S LAYOUT SHIFTS OBSERVER ========================================
const LayoutObserver = new IntersectionObserver((entries) => {
    let desktopLayout;
    let tabletLayout;
    let mobileLayout;

    entries.forEach(entry => {
        if (entry.target.className.includes("desktop_container")) {
            desktopLayout = entry
        }
        else if(entry.target.className.includes("tablets_container")){
            tabletLayout = entry
        }
        else if(entry.target.className.includes("mobiles_container")){
            mobileLayout = entry
        }
        
    })

    // console.log(desktopLayout)
    // console.log(tabletLayout)
    // console.log(mobileLayout)

    // IF LAYOUT SIFTED TO DESKTOP
    if (desktopLayout &&  desktopLayout.isIntersecting) {
        Observer.unobserve(sentinel)
        // IF LAYOUT SIFTED TO DESKTOP LAYOUT, THEN CLEAR ALL COLUMNS IN PREVIOUS AND OTHER LAYOUTS 
        const columns  = document.querySelectorAll('.col');
        columns.forEach(column => {
            column.innerHTML = '';
        })

        // RENDER FUNCTION WILL DO THE REST FOR US, RENDER FUNCTION CAN FIND THE CURRENT LAYOUT BY HIMSELF
        if (state.allImagesData.length === 0) return;
        renderImages(state.allImagesData);
    }

    // IF LAYOUT SIFTED TO TABLETS
    if (tabletLayout &&  tabletLayout.isIntersecting) {
        Observer.unobserve(sentinel)
        const columns  = document.querySelectorAll('.col');
        columns.forEach(column => {
            column.innerHTML = '';
        })

        if (state.allImagesData.length === 0) return;
        renderImages(state.allImagesData);
    }

    // IF LAYOUT SIFTED TO MOBILE
    if (mobileLayout &&  mobileLayout.isIntersecting) {
        Observer.unobserve(sentinel)
        const columns  = document.querySelectorAll('.col');
        columns.forEach(column => {
            column.innerHTML = '';
        })
        
        if (state.allImagesData.length === 0) return;
        renderImages(state.allImagesData);
    }
})

LayoutObserver.observe(desktopContainer);
LayoutObserver.observe(tabletContainer);
LayoutObserver.observe(mobileContainer);

// SINGLE OBSERVER FOR THE MODAL DESKTOP CONTAINER BECAUSE PRIMARY OBSERVER FUNCTION IS NOT WORKING ON THIS CONTAINER 
const ModalLayoutObserver = new IntersectionObserver((entries) => {
    let modalDesktopContainer;
    let modalMobileContainer;

    entries.forEach(entry => {
        if (entry.target.className.includes("modal_desktop_container")) {
            modalDesktopContainer = entry
        }
        if (entry.target.className.includes("modal_mobile_container")) {
            modalMobileContainer = entry
        }

    })

    if (modalDesktopContainer && modalDesktopContainer.isIntersecting) {
        const container = getMainModalGrid();
        const columns = container.querySelectorAll('.modal_col');
        let testColumn;
        columns.forEach(col => {
            testColumn = col.querySelectorAll('.grid_item_parent');
        });

        if (testColumn.length > 0) return;
        const newColumns = document.querySelectorAll('.modal_col');
        newColumns.forEach(col => {
            col.innerHTML = '';
        })
        addRelatedImages(state.relatedImagesDataArray);
    }

    if (modalMobileContainer && modalMobileContainer.isIntersecting) {
        const container = getMainModalGrid();
        const columns = container.querySelectorAll('.modal_col');
        let testColumn;
        columns.forEach(col => {
            testColumn = col.querySelectorAll('.grid_item_parent');
        });

        if (testColumn.length > 0) return;
        const newColumns = document.querySelectorAll('.modal_col');
        newColumns.forEach(col => {
            col.innerHTML = '';
        })
        addRelatedImages(state.relatedImagesDataArray);
    }
})

ModalLayoutObserver.observe(ModalDesktopContainer);
ModalLayoutObserver.observe(ModalMobileContainer);