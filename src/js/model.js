import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, API_KEY } from './config';
// import { getJSON, sendJSON } from './helpers';  Import for getJSON and sendJSON before AJAX was created
import { AJAX } from './helpers';
export const state = {
  // loadRecipe function(and other functions) is manipulating state variable with state.recipe
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
    /*If recipe.key don't exist nothing happens.
    If recipe.key exist than second part of operator { key: recipe.key } is executed and returned and whole that expression ( recipe.key && { key: recipe.key }) is becoming an object and than we can use spread operator and finall result will be same as key: recipe.key. 
     */
  };
};
export const loadRecipe = async function (id) {
  try {
    // async function will return promise, and we need to handle that promise(we need to await loadRecipe function when it's imported at controller.js)
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`); // ADDING ?key=${API_KEY} WILL LOAD ALL RECEPIES INCLUDING ONES THAT HAVE KEY, THAT WE UPLOADED
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      // keeping saved bookmark icon
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    console.log(state.recipe);
  } catch (err) {
    // temp err handling
    console.error(`❌❌❌ ${err} ❌❌❌`);
    throw err;
  }
};
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`); // ADDING ?key=${API_KEY} WILL LOAD ALL RECEPIES INCLUDING ONES THAT HAVE KEY, THAT WE UPLOADED
    console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1; // reseting page to 1 for a new search
  } catch (err) {
    console.error(`❌❌❌ ${err} ❌❌❌`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  // this function manipulates search results per page.
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; //0;
  const end = page * state.search.resultsPerPage; //9;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings  // 2 * 8 /4 = 4
  });

  state.recipe.servings = newServings;
};
const persistBookmarks = function () {
  localStorage.setItem(
    'bookmarks',
    JSON.stringify(state.bookmarks)
  ); /* 1st step with saving into local storage
  localStorage.setItem first parameter, in this case bookmarks, is the name that we give to setItem. With the second parameter we need to set a string. We are calling JSON.stringify() and in the parentheses we define object that we want to convert into the string.  */
};

export const addBookmark = function (recipe) {
  // add bookmark
  state.bookmarks.push(recipe);

  // mark current recipe as bookmark
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true; //state.recipe.bookmarked -> On this way we are  setting a new property on the recipe object.
  }
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  // mark current recipe as NOT bookmark
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false; //state.recipe.bookmarked -> On this way we are  setting a new property on the recipe object.
  }
  persistBookmarks();
};
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);

  /* 2nd step with saving into local storage.
  getItem() method returns value of the specified Storage Object item, in this case returns string that we saved in local storage with persistBookmarks() method. 
  With the JSON.parse() we convert string into object. In this case string that we previously converted from object with stringify inside the presisBookmarks() method. 
  */
};
init(); // here we are calling init() function right in the begging so the all recepise that are saved inside the local storage can be loaded with page.
const clearBookmarks = function () {
  // function that we are using during the development - debugging function.
  localStorage.clear(bookmarks);
};
//clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    /*Object.entries() converts array into an object
  startsWith() method -> The startsWith() method returns true if a string starts with a specified string.
  Otherwise it returns false. The startsWith() method is case sensitive.
  */
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        //const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe); // adding bookmark into object that we are uploading into API.
  } catch (err) {
    throw err;
  }
};
