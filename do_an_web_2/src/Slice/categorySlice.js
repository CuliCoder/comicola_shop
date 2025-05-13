import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/configAxios.js";
export const fetchAllCategory = createAsyncThunk(
  "category/fetchAllCategory",
  async (_, rejectWithValue) => {
    try {
      const response = await axios.get("/api/category");
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: false,
    category_current: null,
  },
  reducers: {
    findCategory: (state, action) => {
      const { id } = action.payload;
      const categories = JSON.parse(JSON.stringify(state.categories));
      state.category_current = categories.find(
        (category) => category.value === parseInt(id)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCategory.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllCategory.rejected, (state) => {
        state.loading = false;
      });
  },
});
export default categorySlice.reducer;
export const { findCategory } = categorySlice.actions;
