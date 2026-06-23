import { fetchData } from "./imageGallery.js";

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

// profile modal popup (optional);

// arrow on scrollDown

fetchData()

