import { fetchData } from "./galleryAPI.js";
import { getMainGrid } from "./utils.js";

// MAIN LOGIC STARTER FUNCTION
// fetchData()

// ============================== SECTION TITLE TYPE WRITER EFFECT ===============================
const title = document.querySelector('.section_title');

const textArray = [
    `Search for 'Mountains'`,
    `Search for 'Gym'`,
    `Search for 'Nature'`,
    `Search for 'Sun-set'`,
    `Search for 'Aesthetics'`,
    `Search for 'Cats'`
]

let i = 0;
const setKeyword = () => {
    title.textContent = textArray[i];
    title.classList.add('my_element')
    i++;
    if (i === textArray.length) {
        i = 0;
        return;
    };
};

setInterval(() => {
    setKeyword();
}, 5000);

// ============================================== SCROLL UP ARROW APPEARING ON SCROLL DOWN LOGIC =====================================================
// const main = document.querySelector('main');
const scrollUp = document.querySelector('.scrollUp');
window.addEventListener('scroll', () => {
    if (window.scrollY >= 50) {
        scrollUp.classList.remove('-bottom-full')
        scrollUp.classList.add('bottom-12')
    } else {
        scrollUp.classList.remove('bottom-12')
        scrollUp.classList.add('-bottom-full')
    }
})

// ===================================================== FOOTER POPUP MODAL LOGIC ================================================================
const footerModal = document.getElementById('footer_Modal')

const footerOpen = document.getElementById('footer_toggle');
const footerWrapper = document.querySelector('.footer_wrapper');

footerOpen.addEventListener('click', () => {
    footerModal.showModal();
})

footerModal.addEventListener('click', (e) => {
    if (!footerWrapper.contains(e.target)) {
        footerModal.close();
    }
})

// ========================================================= SELECTORS FOR PROFILE POPUP MODAL LOGIC  ======================================================================
//  ================= Profile elements on navbar ===================
const userImages = document.querySelectorAll('.user-Image');
const userNameOnNavBar = document.querySelector('.user_name');

// ========================= profile elements im profile modal popup =====================
const addPhotoMsg = document.getElementById('photo-msg');
const userName = document.querySelector('.user_details > .user_Name');
const userBio = document.querySelector('.user_Bio');

// ====================== FROM INPUTS FOR EDIT PROFILE LOGIC =====================
const editForm = document.querySelector('.edit-form');
const editProfileBtn = document.getElementById('edit-profile-bnt');
const cancelBtn = document.getElementById('Cancel-btn');
const saveBtn = document.getElementById('save-btn');
const userNameInput = document.getElementById('input_userName')
const bioInput = document.getElementById('input_bio');
const imgInput = document.getElementById('input_photo');

const profileModal = document.getElementById('profile_Modal');
const ProfileContainer = document.querySelector('.profile_container')
const userProfile = document.querySelector('.user_profile');
const profileModalClose = document.querySelector('.profile_close');

const openProfile = () => {
    // if someone left the edit section opened, then closing it 
    if (!editForm.className.includes('hidden')) {
        editForm.classList.add('hidden')
    }
    if (!saveBtn.className.includes('hidden')) {
        saveBtn.classList.add('hidden')
    }
    if (!cancelBtn.className.includes('hidden')) {
        cancelBtn.classList.add('hidden')
    }
    if (editProfileBtn.className.includes('hidden')) {
        editProfileBtn.classList.remove('hidden')
    }
    // if someone left the the input fields uncleared, then clearing them
    userNameInput.value = '';
    bioInput.value = '';
    imgInput.value = '';

    profileModal.showModal();
}

// when user clicks on profile icon in nav bar profile modal will open
userProfile.addEventListener('click', openProfile)

// profile modal will be closed on close btn
profileModalClose.addEventListener('click', () => profileModal.close())

// if user clicks outside of the modal, the modal will close
profileModal.addEventListener('click', (e) => {
    if (!ProfileContainer.contains(e.target)) {
        profileModal.close();
    }
})


// =========================================================  PROFILE POPUP MODAL LOGIC (EDIT PROFILE LOGIC)  ======================================================================

const userData = {
    userName: '',
    userBio: '',
    userImage: '',
}

const addUserDetails = () => {
    // if user has already submitted his data then add the data to the UI
    const data = JSON.parse(localStorage.getItem("userInfo"));
    if (!data) {
        userNameOnNavBar.textContent = 'My profile';
        userImages.forEach(img => {
            img.src = './assets/dfault-user-img.png';
        })
        addPhotoMsg.textContent = 'Add your profile picture';
        userName.textContent = 'Add your nick name';
        userBio.textContent = 'Add your bio';
        editProfileBtn.textContent = 'Add your Info';
    }
    // if user has not submitted his data then add the default data on UI 
    else {
        userNameOnNavBar.textContent = data.userName;
        userImages.forEach(img => {
            img.src = data.userImage;
        })
        addPhotoMsg.textContent = 'Profile picture:';
        userName.textContent = data.userName;
        userBio.textContent = data.userBio;
        editProfileBtn.textContent = 'Edit profile';
    }
}

//  /* =================================== ALL PROFILE MODAL BUTTON RESPONSIBILITIES ======================================== */

editProfileBtn.addEventListener('click', () => {
    editForm.classList.replace('hidden', 'grid');
    cancelBtn.classList.remove('hidden');
    editProfileBtn.classList.add('hidden');
    saveBtn.classList.remove('hidden');
})

cancelBtn.addEventListener('click', () => {
    editForm.classList.replace('grid', 'hidden');
    cancelBtn.classList.add('hidden');
    editProfileBtn.classList.remove('hidden');
    saveBtn.classList.add('hidden');
    const data = JSON.parse(localStorage.getItem("userInfo"));
    if (!data) {
        editProfileBtn.textContent = 'Add your Info'
    } else {
        editProfileBtn.textContent = 'Edit profile'
    }

    // if user hits the cancel button after submitting something
    userNameInput.value = '';
    bioInput.value = '';
    imgInput.value = '';
})

saveBtn.addEventListener('click', () => {
    const newUserName = userNameInput.value;
    const newUserBio = bioInput.value;
    const newUserImage = imgInput.value;
    if (newUserName.trim() === '') {
        alert('please enter a valid User name');
    }
    else if (newUserBio.trim() === '') {
        alert('please enter a valid Bio');
    }
    else if (newUserImage.trim() === '') {
        alert('please enter a valid Bio');
    } else {
        userData.userName = newUserName;
        userData.userBio = newUserBio;
        userData.userImage = newUserImage;

        localStorage.setItem('userInfo', JSON.stringify(userData));
        addUserDetails();
    }
    cancelBtn.click();
})

addUserDetails();