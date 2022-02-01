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

after that we are running git commit -m 'Initial commit' -m stands for message and after -m we are naming commit as string. And after that all files on side bar all looking "normal" again. without any letters on the side such are U, A, M.

git reset --hard HEAD -> will reset code to the last version of code. It will delete all added code and code it will look like same as after we run git add -A last time.

Coming back to previous commit and deleting something that was commited ====>

run in terminal git log
we will get list with all commits.
copy ID of commit where you want to come back 

TYPE ====> Q
With Q we will quit/exit of git log

after that
run in terminal git reset --hard id  -> id is the one that we copied from the git log
and after that we will return to commit with id that we declared.

BRANCH

run in terminal git branch 
and that will simply list all brances that we are currently having. 
To exit out of recived log, we need to write Q. 

CREATING NEW BRANCH

New branch is the copy of the current branch(master branch) in which we can develop a new code, add a new features, but without affecting the code that is in the master branch. It's basicly a parallel tarck where we can develope a new code without affecting the origanl code that we already have. 

1. creating new branch
git branch name-of-branch

2. after creating a new branch, we should switch to the new branch
git checkout name-of-branch

3. going back to master branch

git checkout master

After step 3 code that we added in the new brach will go away 

4. merge branches

when we want to merge new code from name-of-branch into master branch, we should transfer to the master branch and run in the terminal git merge name-of-branch
and new code will be added into master branch.

GIT CHEATSHEET
https://education.github.com/git-cheat-sheet-education.pdf
*/
