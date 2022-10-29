import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { Book, getBookList } from 'src/apis/booksApi';
import { RootState } from '../store';

const booksAdapter = createEntityAdapter<Book>();

interface InitialState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: any;
  selectedBookId: number | null;
  filter: {
    categoryId?: number;
    size?: number;
    page?: number;
  };
}

const initialState = booksAdapter.getInitialState<InitialState>({
  status: 'idle',
  error: null,
  selectedBookId: null,
  filter: {
    categoryId: undefined,
    size: 10,
    page: undefined,
  },
});

export const getBookListAsync = createAsyncThunk(
  'books/getBookListAsync',
  async (_, { getState }) => {
    const state = getState() as RootState;

    const response = await getBookList(state.books.filter);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  },
);

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    selectBook: (state, action: { type: string; payload: { id: number } }) => {
      state.selectedBookId = action.payload.id;
    },
    setBooksFilter(
      state,
      action: { type: string; payload: { categoryId?: number; size?: number; page?: number } },
    ) {
      const { categoryId, size, page } = action.payload;

      if (categoryId) state.filter.categoryId = categoryId;
      if (size) state.filter.size = size;
      state.filter.page = page;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBookListAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getBookListAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        booksAdapter.setAll(state, action);
      })
      .addCase(getBookListAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setBooksFilter, selectBook } = booksSlice.actions;

export const getBooksFilter = (state: RootState) => state.books.filter;

export const {
  selectAll: selectAllBooks,
  selectById: selectBookById,
  selectEntities: selectBooksEntities,
} = booksAdapter.getSelectors<RootState>((state) => state.books);
