import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { Category, getCategoryList } from 'src/apis/categoriesApi';
import { RootState } from '../store';

const categoriesAdapter = createEntityAdapter<Category>();

interface InitialState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: any;
  selectedCategoryId: number | null;
}

const initialState = categoriesAdapter.getInitialState<InitialState>({
  status: 'idle',
  error: null,
  selectedCategoryId: null,
});

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
      state.selectedCategoryId = action.payload.id;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategoryListAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCategoryListAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        categoriesAdapter.setAll(state, action);
      })
      .addCase(getCategoryListAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { selectAll: selectAllCategories, selectById: selectCategoryById } =
  categoriesAdapter.getSelectors<RootState>((state) => state.categories);
