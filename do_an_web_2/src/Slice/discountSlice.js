import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/configAxios.js";
export const fetchApplyDiscount = createAsyncThunk(
  "discount",
  async ({ coupon, value_apply }, { _, rejectWithValue }) => {
    try {
      const response = await axios.post("/api/user/check-coupon", {
        coupon,
        value_apply,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const discountSlice = createSlice({
  name: "discount",
  initialState: {
    discount: {
      code: "",
      value: null,
      id: null,
      error: null,
      loading: false,
      message: null,
    },
  },
  reducers: {
    clearApplyDiscount: (state) => {
      state.discount.error = null;
      state.discount.message = null;
    },
    setCodeDiscount: (state, action) => {
      state.discount.code = action.payload;
    },
    clearDiscount: (state) => {
      state.discount.code = "";
      state.discount.value = null;
      state.discount.id = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplyDiscount.pending, (state) => {
        state.discount.loading = true;
      })
      .addCase(fetchApplyDiscount.fulfilled, (state, action) => {
        state.discount.loading = false;
        state.discount.error = action.payload.error;
        state.discount.message = action.payload.message;
        state.discount.value = action.payload.discount_value;
        state.discount.id = action.payload.id;
      })
      .addCase(fetchApplyDiscount.rejected, (state, action) => {
        state.discount.loading = false;
        state.discount.error = action.payload.error;
        state.discount.message = action.payload.message;
        state.discount.value = action.payload.discount_value;
        state.discount.id = action.payload.id;
      });
  },
});

export const { clearApplyDiscount, setCodeDiscount, clearDiscount } = discountSlice.actions;

export default discountSlice.reducer;
