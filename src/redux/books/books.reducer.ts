import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Book, getBookList } from 'src/apis/booksApi';

const initialState: {
  status: string;
  data: Book[];
} = {
  status: 'idle',
  data: [],
};

export const getBookListAsync = createAsyncThunk('books/fetchCount', async () => {
  const response = await getBookList();
  // The value we return becomes the `fulfilled` action payload
  return response.data;
});

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBookListAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getBookListAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.data = action.payload;
      })
      .addCase(getBookListAsync.rejected, (state) => {
        state.status = 'failed';
      });
  },
});
