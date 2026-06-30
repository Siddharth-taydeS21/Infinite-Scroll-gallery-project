export { addHeroCardDetails };
import { getFormattedDate, trunCateText, LoadImages } from "./utils.js";

const imgModal = document.getElementById('image_modal');

const mainImgElement = document.querySelector('.main_img_wrapper');
const userNameElement = document.querySelector('.user_Name');
const userBioElement = document.querySelector('.user_bio');
const userImageElement = document.querySelector('.user_img');
const DateElement = document.querySelector('.img_pub_date');
const likesElement = document.getElementById('img-Likes');
const viewsElement = document.getElementById('img-views');
const downloadsElement = document.getElementById('img-downloads');

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

    imgModal.showModal();
    LoadImages('main_image_container', 'main_img_wrapper');
    // const spinner = document.querySelector('.main_image_container .spinner');
    // spinner.remove()

    const closeModelBtn = document.getElementById('close-modal');
    closeModelBtn.addEventListener('click', () => {
        // removing the hero image before closing the image modal so when user clicks on other image to see the image with new modal popup, we are making sure the previous image should not be there
        const img = mainImgElement.querySelector('.main_img')
        img.remove();
        imgModal.close();
    });
}

// ============================== LIKE UNLIKE EFFECT FOR IMAGE MODAL ===============================

const likeBtn =  document.getElementById('like_btn');
const likeIcon = document.getElementById('like_icon');
const unlikeIcon = document.getElementById('unlike_icon')

let likesCount = 0;

const like = () => {
    likeIcon.classList.toggle('hidden');
    unlikeIcon.classList.toggle('hidden');
    const likes = likesElement.textContent;
    likesCount++;
    if (likesCount % 2 === 0 ) {
        likesElement.textContent = Number(likes) - 1;
    }else{
        likesElement.textContent = Number(likes) + 1;
    }
}
likeBtn.addEventListener('click', like)