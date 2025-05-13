import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProvinces = createAsyncThunk(
  "address/fetchProvinces",
  async (_, rejectWithValue) => {
    try {
      const response = await axios.get("https://provinces.open-api.vn/api/p");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchDistricts = createAsyncThunk(
  "address/fetchDistricts",
  async (code, rejectWithValue) => {
    try {
      const response = await axios.get(`https://provinces.open-api.vn/api/d`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchWards = createAsyncThunk(
  "address/fetchWards",
  async (code, rejectWithValue) => {
    try {
      const response = await axios.get(`https://provinces.open-api.vn/api/w`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    provinces: [],
    districts: [],
    wards: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProvinces.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProvinces.fulfilled, (state, action) => {
      state.loading = false;
      state.provinces = action.payload;
    });
    builder.addCase(fetchProvinces.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(fetchDistricts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDistricts.fulfilled, (state, action) => {
      state.loading = false;
      state.districts = action.payload;
    });
    builder.addCase(fetchDistricts.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(fetchWards.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchWards.fulfilled, (state, action) => {
      state.loading = false;
      state.wards = action.payload;
    });
    builder.addCase(fetchWards.rejected, (state, action) => {
      state.loading = false;
    });
  },
});
export default addressSlice.reducer;
