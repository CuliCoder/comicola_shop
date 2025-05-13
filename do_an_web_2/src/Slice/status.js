import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/configAxios";

export const check_status = createAsyncThunk(
  "status",
  async (_, rejectWithValue) => {
    try {
      const response = await axios.post("/auth/checkLogin");
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const logout = createAsyncThunk(
  "logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/logout");
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const statusSlice = createSlice({
  name: "status",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(check_status.pending, (state) => {
        state.loading = true;
      })
      .addCase(check_status.fulfilled, (state, action) => {
        state.error = action.payload.error;
        state.loading = false;
      })
      .addCase(check_status.rejected, (state) => {
        state.loading = false;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.error = action.payload.error === 0 ? 1 : 0;
        state.loading = false;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default statusSlice.reducer;
