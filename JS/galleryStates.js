export { state };
// ============================= STATES FOR ALL JS FILES ==============================
const state = {
    page: 1,
    query: '',
    queryPage: 1,
    loading: false,
    isUserSearching: false,

    // THIS COLUMN HEIGHTS FOR GETTING SHORTEST COLUMN IN MAIN GALLERY GRID.
    // IN RENDER FUNCTION WE ARE USING COLUMN HEIGHTS FOR APPENDING EVERY NEW IMAGE TO THE SHORTEST GRID COLUMN - FOR AVOIDING THE PROBLEM OF (ONE COLUMN IS GETTING TO BIG AND OTHERS STAYS SHORT)
    desktopColumnHeights: [0, 0, 0],
    tabletColumnHeights: [0, 0],
    mobileColumnHeights: [0],

    // ============================ ALL IMAGES DATA ARRAY =================================
    allImagesData: [],
    // THIS ARRAY WILL COLLECT AND STORE ALL THE IMAGES DATA, WHICH WE ARE RECEIVING IN EVERY API RESPONSE 

    // WE WILL USE THIS IMAGE DATA ARRAY FOR DATA RENDERING,
    // WHEN USER WILL EXPAND OR SHRINK THE BROWSER SCREEN SIZE,  WE'LL GET COLUMNS COUNT FIRST THEN EQUALLY DISTRIBUTE ALL IMAGES IN THIS ARRAY TO OUR COLUMNS
}