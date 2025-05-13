import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

const initState = {
  authors: [],
  category: [],
};

export const fetchAuthors = createAsyncThunk(
  "category/fetchAuthors",
  async () => {
    const response = await axios.get("/api/v2/author");
    return response.data;
  }
);

export const fetchCategory = createAsyncThunk(
  "category/fetchCategory",
  async () => {
    const response = await axios.get("/api/v2/category");
    return response.data;
  }
);

const categorySlice = createSlice({
  name: "category_author",
  initialState: initState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.authors = action.payload;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.category = action.payload;
      });
  },
});

export default categorySlice.reducer;
