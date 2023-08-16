import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CONST_TIMEOUT } from '../lib/config.js';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async () => {
  try {
    const hashId = window.location.hash.slice(1);
    if (!hashId) return;

    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());

    await model.loadRecipe(hashId);

    const { recipe } = model.state;
    recipeView.render(recipe);

    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
    console.log(err);
  }
};

const controlSearchResults = async () => {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();

    if (!query) return;

    await model.loadSearchResult(query);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlAddBookmark = () => {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

const controlPagination = page => {
  resultsView.render(model.getSearchResultsPage(page));
  paginationView.render(model.state.search);
};

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async newRecipe => {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    model.addBookmark(model.state.recipe);

    addRecipeView.renderSuccess();

    recipeView.render(model.state.recipe);

    setTimeout(() => addRecipeView.toggleModal(), MODAL_CONST_TIMEOUT);

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
};

const init = () => {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addServingsClickHandler(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addClickHandler(controlPagination);
  recipeView.addBookMarkHandler(controlAddBookmark);
  bookmarksView.addBookmarkLoadHander(controlBookmarks);
  addRecipeView._btnUploadHandler(controlAddRecipe);
};

const controlServings = servings => {
  const { recipe } = model.state;
  model.updateServings(servings);
  //recipeView.render(recipe);
  recipeView.update(recipe);
};

init();
