export { fetchData }

const fetchData = async (num = 1) => {
    // MAKE UI FUNCTION THAT SHOWS LOADING SKELETONS IN IMAGE GRID WHEN FETCHING  
    try {
        const response = await fetch(`https://api.unsplash.com/photos?client_id=kgHRIgQcZWIMeC-KPnL0aDWUU_I1O8VrmWKQwUZTH-Q&page=${num}&per_page=30`)
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