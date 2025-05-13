import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/configAxios";
export const fetchAllAuthor = createAsyncThunk(
  "author/fetchAllAuthor",
  async (_, rejectWithValue) => {
    try {
      const response = await axios.get("api/author");
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
const authorSlice = createSlice({
  name: "author",
  initialState: {
    authors: [],
    author_current: null,
    loading: false,
  },
  reducers: {
    findAuthor: (state, action) => {
      const { id } = action.payload;
      const authors = JSON.parse(JSON.stringify(state.authors));
      state.author_current = authors.find(
        (author) => author.value === parseInt(id)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAuthor.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchAllAuthor.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = action.payload;
      })
      .addCase(fetchAllAuthor.rejected, (state, action) => {
        state.loading = false;
      });
  },
});
export default authorSlice.reducer;
export const { findAuthor } = authorSlice.actions;