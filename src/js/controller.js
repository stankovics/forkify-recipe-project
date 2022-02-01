import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import boomarksView from './views/boomarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
// Parcel code -> Hot Module Replacement (HMR) exchanges, adds, or removes modules while an application is running, without a full reload.
//if (module.hot) {
//module.hot.accept();
//}

const recipeContainer = document.querySelector('.recipe');

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();
    // 0  Update results view to mark selected search  result
    resultsView.update(model.getSearchResultsPage());
    // 1 updating bookmarksView
    boomarksView.update(model.state.bookmarks);
    // 2. Loading recipe
    await model.loadRecipe(id);

    // 3 Rendering recipe

    recipeView.render(model.state.recipe); //same as const recipeView = new recipeView(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1 get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2 load search results
    await model.loadSearchResults(query);
    // 3 render results
    resultsView.render(model.getSearchResultsPage());
    //4 render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (goToPage) {
  //1 render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  //2 render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //1. update the recipe servings(in the state)
  model.updateServings(newServings);
  //2. update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe); // update the recipe view with a DOM updating algorithm
};

const controlAddBookmark = function () {
  // 1. add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //2. update recipe view
  recipeView.update(model.state.recipe);
  // 3. render bookmarks
  boomarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  boomarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Showing loading spinner
    addRecipeView.renderSpinner();
    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    // Render the new recipe
    recipeView.render(model.state.recipe);
    // Display Success message
    addRecipeView.renderMessage();

    // Render bookmark view -> adding new element to the bookmark view
    boomarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    /* history API
    history.pushState(state, title , url)
    In an HTML document, the history.pushState() method adds an entry to the browser's session history stack.
    */
    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  // with this we implemented publisher-subscriber pattern
  boomarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerRenderUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
/*
Final building up before deployment

1. Change "main": "index.html" to "default": index.html

2.in "scripts" object, after "parcel build index.html" add --dist-dir ./dist to create dist directorium. It should look like this "parcel build index.html --dist-dir ./dist"

3. after all steps above open new terminal or stop existing with ctrl+c and run command npm run build


Installing GIT

1. 
Dowload GIT https://git-scm.com/

2.
run in terminal 
git init

3.
git configuration 
git config --global user.name stankovics
git config --global user.email stankovicnstefan@gmail.com

Fundamentals
U in VS Code by files means that those files are untracked

.gitignore -> inside this files we should put only files that we want git to ignore or not to be included in our repository (e.g. node_modules)

run in terminal git status -> it will show list of untracked files

run in terminal git add -A -> With git add we are adding files to track. -A represents all

After running command above U that is on side by each file will change to A, that means ADDED/ACTIVE or that they are tacked. 

When we add/cahnge some code in files, A will change to M and vs code will add green line by line number letting us know where change happen. And when we click that line it will show us change, + sign represents added code/change. 

After all changes, when we are ready to commit files we should run in terminal again git status and it will show as add files and files where changes happend. After that we should run in terminal again git add -A and all files are redy to be commited. All green lines, that are representing changes, will disappear after running  git add -A. 


*/
