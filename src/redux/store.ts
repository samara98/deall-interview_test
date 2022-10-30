import { configureStore, combineReducers, Middleware } from '@reduxjs/toolkit';
import { addBookmark, bookmarksSlice, deleteBookmark } from './bookmarks/bookmarks.reducer';
import { booksSlice } from './books/books.reducer';
import { categoriesSlice } from './categories/categories.reducer';

const rootReducer = combineReducers({
  categories: categoriesSlice.reducer,
  books: booksSlice.reducer,
  bookmarks: bookmarksSlice.reducer,
});

const bookmarksLocalStorage = (() => {
  const bookmarks = localStorage.getItem('bookmarks')
    ? JSON.parse(localStorage.getItem('bookmarks')!)
    : {};
  if (!Array.isArray(bookmarks) && bookmarks.entities && bookmarks.ids) {
    return bookmarks;
  }
  return {};
})();

const saveBookmark: Middleware<any, any> = (store) => (next) => (action) => {
  next(action);
  if (addBookmark.match(action) || deleteBookmark.match(action)) {
    const state: RootState = store.getState();
    const bookmarks = {
      ids: state.bookmarks.ids,
      entities: state.bookmarks.entities,
    };
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }
};

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    bookmarks: {
      ids: [],
      entities: {},
      ...bookmarksLocalStorage,
    },
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(saveBookmark),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
