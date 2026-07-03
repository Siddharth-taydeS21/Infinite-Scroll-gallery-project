import { state } from "./galleryStates.js";
import { fetchData } from "./galleryAPI.js";
import { renderImages } from "./galleryUI.js";
import { addRelatedImages } from "./imageDetailsUI.js";
import { fetchRelatedImages } from "./imageDetailsAPI.js";

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
        console.log('main page: ' ,state.page);
        fetchData(state.page);
    } else {
        state.queryPage++;
        console.log('query page: ',state.queryPage);
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
    console.log('modal page: ', state.modalPage);
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

    let modalMobileLayout;

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
        else if(entry.target.className.includes("modal_mobile_container")){
            modalMobileLayout = entry
        }
        
    })

    // console.log(desktopLayout)
    // console.log(tabletLayout)
    // console.log(mobileLayout)

    // IF LAYOUT SIFTED TO DESKTOP
    if (desktopLayout &&  desktopLayout.isIntersecting) {
        Observer.unobserve(sentinel)
        console.log('layout shifted to desktop')
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
        console.log('layout shifted to tablet')
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
        console.log('layout shifted to mobile')
        const columns  = document.querySelectorAll('.col');
        columns.forEach(column => {
            column.innerHTML = '';
        })
        
        if (state.allImagesData.length === 0) return;
        renderImages(state.allImagesData);
    }

    if (modalMobileLayout &&  modalMobileLayout.isIntersecting) {
        console.log('Modal layout shifted to mobile');
        const columns  = document.querySelectorAll('.modal_col');
        columns.forEach(column => {
            column.innerHTML = '';
        })
        
        if (state.relatedImagesDataArray.length === 0) return;
        addRelatedImages(state.relatedImagesDataArray);
    } 
})

LayoutObserver.observe(desktopContainer);
LayoutObserver.observe(tabletContainer);
LayoutObserver.observe(mobileContainer);
LayoutObserver.observe(ModalMobileContainer);

// SINGLE OBSERVER FOR THE MODAL DESKTOP CONTAINER BECAUSE PRIMARY OBSERVER FUNCTION IS NOT WORKING ON THIS CONTAINER 
const newObserver = new IntersectionObserver((entries) => {
    const el = entries[0];
    if (el.isIntersecting) {
        console.log('Modal layout shifted to desktop');
        const columns  = document.querySelectorAll('.modal_col');
        columns.forEach(column => {
            column.innerHTML = '';
        })
        
        if (state.relatedImagesDataArray.length === 0) return;
        addRelatedImages(state.relatedImagesDataArray);
    }
})

newObserver.observe(ModalDesktopContainer);