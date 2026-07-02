export { addHeroCardDetails, addRelatedImages, isModalGalleryLoading };
import { state } from "./galleryStates.js";
import { getFormattedDate, trunCateText, LoadImages, getMainModalGrid, getShortestColumn, clearModalContent } from "./utils.js";
import { modalObserver } from "./allObservers.js";

const imgModal = document.getElementById('image_modal');
const modalGalleryParent = document.querySelector('.modal_gallery_parent');

const mainImgElement = document.querySelector('.main_img_wrapper');
const userNameElement = document.querySelector('.user_Name');
const userBioElement = document.querySelector('.user_bio');
const userImageElement = document.querySelector('.user_img');
const DateElement = document.querySelector('.img_pub_date');
const likesElement = document.getElementById('img-Likes');
const viewsElement = document.getElementById('img-views');
const downloadsElement = document.getElementById('img-downloads');

const mainImageContainer = document.querySelector('.main_image_container');

const loadingTemplate = document.getElementById('modal_gallery_loading_temp');
const mainImgLoading = document.querySelector('.spinner')
const errorTemplate = document.getElementById('gallery_error_template');
const imgErrorTemp = document.getElementById('img_error_temp');
const invalidErrorTemplate = document.getElementById('Invalid_error_template');

const modalSentinel = document.querySelector('.modal_sentinel');
// ============================== LIKE UNLIKE EFFECT FOR IMAGE MODAL ===============================

const likeBtn = document.getElementById('like_btn');
const likeIcon = document.getElementById('like_icon');
const unlikeIcon = document.getElementById('unlike_icon')


const like = () => {
    likeIcon.classList.toggle('hidden');
    unlikeIcon.classList.toggle('hidden');

    let likesCount;

    const likes = document.querySelector('#img-Likes');
    if (likes.textContent.includes(',')) {
        likesCount = Number(likes.textContent.replace(',', ''));
    }else{
        likesCount = Number(likes.textContent);
    }
    let num = likesCount + 1;
    likesElement.textContent = num.toLocaleString('en-US');
}
likeBtn.addEventListener('click', like)

// ================================ LOADING STATE FOR MODAL GALLERY =====================================

const isModalGalleryLoading = () => {
    if (state.modalLoading === true) {
        modalGalleryParent.append(
            loadingTemplate.content.cloneNode(true)
        )
    }
    else if (state.modalLoading === 'error') {
        // if there already error warning exists then remove it first then show a new and just 1 error card 
        const errorCard = modalGalleryParent.querySelector('.error_card');
        if (errorCard) {
            errorCard.remove()
        }
        modalGalleryParent.append(
            errorTemplate.content.cloneNode(true)
        );

        const userImageElement = document.querySelector('.user_img');
        userImageElement.src = './assets/user-image-error.png';

        const spinner = mainImageContainer.querySelector('.spinner')
        if (spinner) {
            spinner.remove();
        }
        const ImgError = mainImageContainer.querySelector('.img_error_card');
        if (ImgError) {
            ImgError.remove();
        }
        mainImageContainer.append(
            imgErrorTemp.content.cloneNode(true)
        )

        modalObserver.unobserve(modalSentinel);
    }
    else if (state.modalLoading === 'invalid') {
        // if there already error warning exists then remove it first then show a new and just 1 error card 
        const errorCard = modalGalleryParent.querySelector('.invalid_error_card');
        if (errorCard) {
            errorCard.remove()
        }
        modalGalleryParent.append(
            invalidErrorTemplate.content.cloneNode(true)
        )
        modalObserver.unobserve(modalSentinel);
    }
    else if (state.modalLoading === false) {
        const loader = modalGalleryParent.querySelector('.spinner');
        if (loader) {
            loader.remove();
        }
    }
}

// ================================ PRIMARY RENDER FUNCTION FOR MODAL GALLERY =====================================

const addRelatedImages = (photos) => {
    console.log('fetchRelatedImages UI function ran!');
    console.log('items in backup data array: ', state.relatedImagesDataArray.length)

    const htmlContainer = getMainModalGrid();
    const columns = htmlContainer.querySelectorAll('.modal_col');

    // WHILE FETCHING NEXT PAGE, IF WE GOT ERROR, THEN RETURN AND SHOW ERROR MASSAGE  
    if (photos.length === 0) {
        const errorCard = document.querySelector('.error_card');
        if (errorCard) {
            errorCard.remove();
        }
        state.modalLoading = 'invalid'; // SHOW ERROR : "INVALID KEYWORD" 
        isModalGalleryLoading();
        return;
    };

    photos.forEach(img => {
        const imgId = img.id;
        const blurredImgUlr = img.urls.thumb;
        const imageUrl = img.urls.small;

        // WE NEED TO GET SMALL ITEM FORM COLUMNS HEIGHT ARRAY
        // SHORT INDEX = FIND SMALL ITEMS INDEX 
        let heights;
        let index;
        if (columns.length === 2) {
            heights = state.modalMobileColumnHeights
            index = getShortestColumn(heights);
        }
        else if (columns.length === 3) {
            heights = state.modalDesktopColumnHeights
            index = getShortestColumn(heights);
        };
        // console.log(heights)
        // console.log(index)


        // COLUMN =  columns[SHORT INDEX]
        const column = columns[index];

        column.innerHTML += `
        <div class="grid_item_parent mb-4 overflow-hidden bg-gray-300 animate-pulse">
            <div class="grid_item bg-[url(${blurredImgUlr})] bg-cover bg-no-repeat blur-xl opacity-0">
                <img src="${imageUrl}" alt="image" data-id="${imgId}" class="transition-opacity duration-200 opacity-0" loading="lazy">
            </div>
        </div>
        `;

        heights[index] += img.height / img.width;
    })
    LoadImages('grid_item_parent', 'grid_item');
    imgModal.showModal();
    
    // OBSERVE SENTINEL, IF IT'S INTERSECTING THEN FETCH NEXT PAGE AND SHOW RESULTS ON UI
    modalObserver.observe(modalSentinel);

    // EVENT LISTENER TO CLOSE THE IMAGE POPUP MODAL, MAKING SURE THAT WE ARE CLEARING THE CURRENT MODAL UI CONTENT & COLUMNS WHEN THE USER CLOSES IMAGE MODAL
    const closeModelBtn = document.getElementById('close-modal');
    closeModelBtn.addEventListener('click', () => {
        clearModalContent();
        imgModal.close();
    });
}

// ============================== HERO IMAGE CARD ON THE IMAGE POPUP MODAL LOGIC ===============================

const addHeroCardDetails = (obj) => {
    // if (!obj.length) return;
    // console.log(obj)
    const mainImgUrl = obj.urls.full;
    const userName = obj.user.first_name;
    const bio = trunCateText(obj.user.bio, 60);
    const profileImg = obj.user.profile_image.medium;
    const publishedDate = getFormattedDate(obj.updated_at);
    const likes = obj.likes.toLocaleString('en-US');
    const views = obj.views.toLocaleString('en-US');
    const downloads = obj.downloads.toLocaleString('en-US');

    mainImgElement.innerHTML = `<img src="${mainImgUrl}" alt="" class="main_img relative h-full object-contain mx-auto transition-opacity duration-400 opacity-0 z-10" loading="lazy">`;
    userNameElement.textContent = userName;
    userBioElement.textContent = bio;
    userImageElement.src = profileImg;
    DateElement.textContent = publishedDate;
    likesElement.textContent = likes;
    viewsElement.textContent = views;
    downloadsElement.textContent = downloads;


    LoadImages('main_image_container', 'main_img_wrapper');
}
