import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

const initialState = {
  orderStatus: { list: [], loading: false },
};

export const fetchOrderStatus = createAsyncThunk(
  "orderStatus/fetchOrderStatus",
  async () => {
    const response = await axios.get(
      "/api/v2/order/get-order-status"
    );
    return response.data;
  }
);

const orderStatusSlice = createSlice({
  name: "orderStatus",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderStatus.pending, (state) => {
        state.orderStatus.loading = true;
      })
      .addCase(fetchOrderStatus.fulfilled, (state, action) => {
        state.orderStatus.list = action.payload;
        state.orderStatus.loading = false;
      })
      .addCase(fetchOrderStatus.rejected, (state) => {
        state.orderStatus.loading = false;
      });
  },
});

export default orderStatusSlice.reducer;
