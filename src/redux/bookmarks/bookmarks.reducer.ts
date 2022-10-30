import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { Book } from 'src/apis/booksApi';
import { RootState } from '../store';

const bookmarksAdapter = createEntityAdapter<Book>();

interface InitialState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: any;
}

const initialState = bookmarksAdapter.getInitialState<InitialState>({
  status: 'idle',
  error: null,
});

export const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    setBookmarks: (state, action) => {
      bookmarksAdapter.setAll(state, action);
    },
    addBookmark: (state, action: { type: string; payload: Book }) => {
      bookmarksAdapter.addOne(state, action);
    },
    deleteBookmark: (state, action: { type: string; payload: number }) => {
      bookmarksAdapter.removeOne(state, action.payload);
    },
  },
});

export const { setBookmarks, addBookmark, deleteBookmark } = bookmarksSlice.actions;

export const {
  selectAll: selectAllBookmarks,
  selectById: selectBookmarkById,
  selectEntities: selectBookmarksEntities,
} = bookmarksAdapter.getSelectors<RootState>((state) => state.bookmarks);
