import { state } from "./galleryStates";
import { renderImages, Observer } from "./galleryUI.js";

export { LayoutObserver }

const desktopContainer = document.querySelector('.desktop_container');
const tabletContainer = document.querySelector('.tablets_container');
const mobileContainer = document.querySelector('.mobiles_container');

const sentinel = document.querySelector('.sentinel');

const LayoutObserver = new IntersectionObserver((entries) => {
    let desktopLayout;
    let tabletLayout;
    let mobileLayout
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
        console.log('layout shifted to desktop')
        // IF LAYOUT SIFTED TO DESKTOP LAYOUT, THEN CLEAR ALL COLUMNS IN PREVIOUS AND OTHER LAYOUTS 
        const columns  = document.querySelectorAll('.col');
        columns.forEach(column => {
            column.innerHTML = '';
        })

        // RENDER FUNCTION WILL DO THE REST FOR US, RENDER FUNCTION CAN FIND THE CURRENT LAYOUT BY HIMSELF
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

        renderImages(state.allImagesData);
    }
})

LayoutObserver.observe(desktopContainer)
LayoutObserver.observe(tabletContainer)
LayoutObserver.observe(mobileContainer)