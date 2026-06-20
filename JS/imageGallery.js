export { fetchData };

// ============================= STATE FOR ALL FUNCTIONS ==============================
const state = {
    page: 1,
    query: '',
    loading: 'false'
}

const fetchData = async (num = 1) => {
    // MAKE UI FUNCTION THAT SHOWS LOADING SKELETONS IN IMAGE GRID WHEN FETCHING  
    const key = import.meta.env.VITE_key;
    try {
        const response = await fetch(`https://api.unsplash.com/photos?client_id=${key}&page=${num}&per_page=15`)
        if(!response.ok){
            throw new Error('Response is not OK for Unsplash')
        };

        const data = await response.json();
        console.log(data)
    } catch (error) {
        console.log(error);
        // SHOW THE ERROR UI HERE ON ERROR
    }
}
// fetchData();

// paginationLogic();

// networkAbortController();

// ======================================= UI FUNCTIONS =======================================

// loading state UI

// render function