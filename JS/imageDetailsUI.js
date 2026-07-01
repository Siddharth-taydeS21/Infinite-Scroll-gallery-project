export { addHeroCardDetails, addRelatedImages, isModalGalleryLoading };
import { state } from "./galleryStates.js";
import { getFormattedDate, trunCateText, LoadImages, getMainModalGrid, getShortestColumn } from "./utils.js";

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

const loadingTemplate = document.getElementById('modal_gallery_loading_temp');
const errorTemplate = document.getElementById('gallery_error_template');
const invalidErrorTemplate = document.getElementById('Invalid_error_template');

// ============================== LIKE UNLIKE EFFECT FOR IMAGE MODAL ===============================

const likeBtn = document.getElementById('like_btn');
const likeIcon = document.getElementById('like_icon');
const unlikeIcon = document.getElementById('unlike_icon')

let likesCount = 0;

const like = () => {
    likeIcon.classList.toggle('hidden');
    unlikeIcon.classList.toggle('hidden');
    const likes = likesElement.textContent;
    likesCount++; 
    likesElement.textContent = Number(likes) + 1;
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
        modalGalleryParent.append(
            errorTemplate.content.cloneNode(true)
        )
    }
    else if (state.modalLoading === 'invalid') {
        modalGalleryParent.append(
            invalidErrorTemplate.content.cloneNode(true)
        )
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
    console.log('fetchRelatedImages UI function ran')
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

    // ADDING CLICK EVENT LISTENER, SO WE CAN GRAB THE CLICKED IMG ELEMENT AND REPEAT THIS SHOW NEW IMAGE MODAL FLOW;
    htmlContainer.addEventListener('click', (e) => {
        // we can check the target is image or not here 
        const id = e.target.getAttribute('data-id');
        if (!id) return;
        console.log(id, e.target);
    })

    // WE NEED TO ADD EVENT LISTENER HERE TO CLOSE THE IMAGE POPUP MODAL, MAKE SURE YOUR CLEARING THE CURRENT HTML CONTAINER COLUMNS BEFORE CLOSING THE IMAGE MODAL
    const closeModelBtn = document.getElementById('close-modal');
    closeModelBtn.addEventListener('click', () => {
        // removing the hero image before closing the image modal so when user clicks on other image to see the image with new modal popup, we are making sure the previous image should not be there
        const img = mainImgElement.querySelector('.main_img')

        // REMOVING THE PREVIOUS MODELS IMAGE SO THE NEW MODEL WILL NEWLY LOAD IT'S IMAGE  
        img.remove();

        // IF USER LIKED THE IMAGE, THEN MAKING THE LIKE ICON BLACK AGAIN SO I DOSEN'T STAY LIKED WHEN USER OPENS NEW IMAG MODAL 
        likeIcon.classList.add('hidden');
        unlikeIcon.classList.remove('hidden');
        imgModal.close();

        columns.forEach(col => {
            col.innerHTML = '';
        })
    });
}

// ============================== HERO IMAGE CARD ON THE IMAGE POPUP MODAL LOGIC ===============================

const addHeroCardDetails = (obj) => {
    // if (!obj.length) return;
    console.log(obj)
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
