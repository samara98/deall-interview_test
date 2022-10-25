import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Category, getCategoryList } from 'src/apis/categoriesApi';

const initialState: {
  status: string;
  data: Category[];
} = {
  status: 'idle',
  data: [],
};

export const getCategoryListAsync = createAsyncThunk('categories/fetchCount', async () => {
  const response = await getCategoryList();
  // The value we return becomes the `fulfilled` action payload
  return response.data;
});

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategoryListAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCategoryListAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.data = action.payload;
      })
      .addCase(getCategoryListAsync.rejected, (state) => {
        state.status = 'failed';
      });
  },
});
