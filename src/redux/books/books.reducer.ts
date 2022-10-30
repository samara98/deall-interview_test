import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { Book, getBookList } from 'src/apis/booksApi';
import { RootState } from '../store';

const booksAdapter = createEntityAdapter<Book>();

interface InitialState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: any;
  filter: {
    categoryId?: number;
    size?: number;
    page?: number;
  };
}

const initialState = booksAdapter.getInitialState<InitialState>({
  status: 'idle',
  error: null,
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

    if (!state.books.filter.categoryId) {
      booksAdapter.setAll(state.books, []);
      throw new Error('No categoryId');
    }

    const response = await getBookList(state.books.filter);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  },
);

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setBooksFilter(
      state,
      action: { type: string; payload: { categoryId?: number; size?: number; page?: number } },
    ) {
      const { categoryId, size, page } = action.payload;

      state.filter.categoryId = categoryId;
      state.filter.size = size;
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

export const { setBooksFilter } = booksSlice.actions;

export const getBooksFilter = (state: RootState) => state.books.filter;

export const {
  selectAll: selectAllBooks,
  selectById: selectBookById,
  selectEntities: selectBooksEntities,
} = booksAdapter.getSelectors<RootState>((state) => state.books);
