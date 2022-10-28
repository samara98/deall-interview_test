import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Category, getCategoryList } from 'src/apis/categoriesApi';

const initialState: {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  data: Category[];
  selectedCategory: Category | null;
} = {
  status: 'idle',
  data: [],
  selectedCategory: null,
};

export const getCategoryListAsync = createAsyncThunk(
  'categories/getCategoryListAsync',
  async () => {
    const response = await getCategoryList();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  },
);

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    selectCategory(state, action: { payload: { id: number }; type: string }) {
      const selectedCategory = state.data.find((category) => {
        return category.id === action.payload.id;
      });
      if (selectedCategory) {
        state.selectedCategory = selectedCategory;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategoryListAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCategoryListAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(getCategoryListAsync.rejected, (state) => {
        state.status = 'failed';
      });
  },
});
