import { API_KEY, API_URL, RES_PER_PAGE } from '../lib/config';
import { getJSON, sendJSON } from '../lib/helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = recipeData => {
  const { recipe } = recipeData;
  console.log('recipe', recipe);
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
  };
};

export const loadRecipe = async hashId => {
  try {
    const url = `${API_URL}/${hashId}?key=${API_KEY}`;
    const data = await getJSON(url);

    state.recipe = createRecipeObject(data.data);

    if (
      state.bookmarks.some(
        singleBookmark => singleBookmark.id === state.recipe.id
      )
    ) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const loadSearchResult = async query => {
  try {
    state.search.query = query;
    const url = `${API_URL}?search=${query}&key=${API_KEY}`;
    const data = await getJSON(url);
    state.search.results = data.data.recipes.map(singleRecipe => {
      return {
        id: singleRecipe.id,
        title: singleRecipe.title,
        publisher: singleRecipe.publisher,
        image: singleRecipe.image_url,
        ...(singleRecipe.key && { key: singleRecipe.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = (page = state.search.page) => {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = newServings => {
  if (newServings < 1) return;
  const ingredients = [
    ...state.recipe.ingredients.map(singleIngredient => {
      return {
        ...singleIngredient,
        quantity:
          (singleIngredient.quantity / state.recipe.servings) * newServings,
      };
    }),
  ];
  state.recipe.servings = newServings;
  state.recipe.ingredients = ingredients;
};

export const addBookmark = recipe => {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  persistBookmarks();
};

export const deleteBookmark = id => {
  const recipeIndex = state.bookmarks.findIndex(
    singleBookmark => singleBookmark.id === id
  );
  state.bookmarks.splice(recipeIndex, 1);
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  persistBookmarks();
};

const persistBookmarks = () => {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const clearBookmarks = () => {
  localStorage.clear('bookmarks');
};

const init = () => {
  const bookmarks = localStorage.getItem('bookmarks');
  if (bookmarks) {
    state.bookmarks = JSON.parse(bookmarks);
  }
};
init();

export const uploadRecipe = async newRecipeData => {
  try {
    const ingredients = Object.entries(newRecipeData)
      .filter(entry => {
        return entry[0].startsWith('ingredient') && entry[1] !== '';
      })
      .map(singleIngredient => {
        let ingredientsArray = singleIngredient[1]
          .replaceAll(' ', '')
          .split(',');
        if (ingredientsArray.length !== 3) {
          throw new Error('Different ingredient format');
        }
        const [quantity, unit, description] = ingredientsArray;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });
    const recipe = {
      id: 'recipe.id',
      title: newRecipeData.title,
      publisher: newRecipeData.publisher,
      source_url: newRecipeData.sourceUrl,
      image_url: newRecipeData.image,
      servings: +newRecipeData.servings,
      cooking_time: +newRecipeData.cookingTime,
      ingredients: ingredients,
    };

    const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);

    state.recipe = createRecipeObject(data.data);
  } catch (err) {
    throw err;
  }
};
