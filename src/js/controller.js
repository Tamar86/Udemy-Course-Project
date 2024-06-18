import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_WINDOW } from './config.js';

//For polyfill
import 'core-js/stable';
import 'regenerator-runtime/runtime';

//Coming from parcel
//To maintain state while changes in code
if (module.hot) {
  module.hot.accept();
}

const controlRecipe = async function () {
  try {
    // window.location is entire URL
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 1)Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 2) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 3) Loading recipe
    await model.loadRecipe(id);

    // 4) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    console.log(resultsView);
    //Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //Load search results
    await model.loadSearchResults(query);

    //Render results

    resultsView.render(model.getSearchResultsPage()); //start from page 1

    //Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage)); //start from page 1
  //Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update recipe servings (in the state)
  model.updateServings(newServings);
  //Update recipe View
  // recipeView.render(model.state.recipe);

  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1 Add/Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2 Update recipe view
  recipeView.update(model.state.recipe);

  //Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in url
    window.history.pushState(null, '', `${model.state.recipe.id}`);

    //Close form window
    setTimeout(
      (function () {
        addRecipeView.toggleWindow();
      },
      MODAL_CLOSE_WINDOW * 1000)
    );
  } catch (err) {
    console.log('wrong format', err);
    addRecipeView.renderError(err.message);
  }
  //Upload new Recipe
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
