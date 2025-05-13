import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/configAxios.js";

export const login = createAsyncThunk(
  "login",
  async ({ email, password }, { _, rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/login", { email, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState: {
    error: null,
    loading: false,
    message: "",
  },
  reducers: {
    setIsLogin: (state, action) => {
      state.error = action.payload;
    },
    clearStateLogin: (state) => {
      state.error = null;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = action.payload.error;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = action.payload.error;
      });
  },
});
export default loginSlice.reducer;
export const { setIsLogin, clearStateLogin } = loginSlice.actions;
