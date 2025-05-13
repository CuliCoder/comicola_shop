import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/configAxios";

export const fetchInfoUser = createAsyncThunk(
  "user/fetchInfoUser",
  async (_, rejectWithValue) => {
    try {
      const response = await axios.get("/api/user/info");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchOrderUser = createAsyncThunk(
  "user/fetchOrderUser",
  async (_, rejectWithValue) => {
    try {
      const response = await axios.get("/api/user/order");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchCouponUser = createAsyncThunk(
  "user/fetchCouponUser",
  async (_, rejectWithValue) => {
    try {
      const response = await axios.get("/api/user/coupon");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchAddressWithId = createAsyncThunk(
  "address/fetchAddressWithId",
  async (_, rejectWithValue) => {
    try {
      const response = await axios.get(`/api/user/address`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const fetchChangeInfo = createAsyncThunk(
  "user/fetchChangeInfo",
  async (
    { firstName, lastName, fullName, password, newPassword, repeatPassword },
    { _, rejectWithValue }
  ) => {
    try {
      const response = await axios.put("/api/user/info/edit", {
        firstName,
        lastName,
        fullName,
        password,
        newPassword,
        repeatPassword,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchAddAddress = createAsyncThunk(
  "user/fetchAddAddress",
  async (
    {
      phone_number,
      email,
      firstName,
      lastName,
      province,
      district,
      ward,
      detail,
    },
    { _, rejectWithValue }
  ) => {
    try {
      const response = await axios.post("/api/user/address/add", {
        phone_number,
        email,
        firstName,
        lastName,
        province,
        district,
        ward,
        detail,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchSelectAddress = createAsyncThunk(
  "user/fetchSelectAddress",
  async (id_address, { _, rejectWithValue }) => {
    try {
      const response = await axios.put("/api/user/address/select", {
        id_address,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchEditAddress = createAsyncThunk(
  "user/fetchEditAddress",
  async (
    {
      id_address,
      phone_number,
      email,
      firstName,
      lastName,
      province,
      district,
      ward,
      detail,
    },
    { _, rejectWithValue }
  ) => {
    try {
      const response = await axios.put("/api/user/address/edit", {
        id_address,
        phone_number,
        email,
        firstName,
        lastName,
        province,
        district,
        ward,
        detail,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchDeleteAddress = createAsyncThunk(
  "user/fetchDeleteAddress",
  async (id_address, { _, rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `/api/user/address/delete/${id_address}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchAddOrder = createAsyncThunk(
  "user/fetchAddOrder",
  async (
    {
      fullname,
      phoneNumber,
      email,
      address,
      products,
      note,
      id_coupon,
    },
    { _, rejectWithValue }
  ) => {
    try {
      const response = await axios.post("/api/user/order/add", {
        fullname,
        phoneNumber,
        email,
        address,
        products,
        note,
        id_coupon,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchCancelOrder = createAsyncThunk(
  "user/fetchCancelOrder",
  async (id_order, { _, rejectWithValue }) => {
    try {
      const response = await axios.put("/api/user/order/cancel", {
        id_order,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const userSlice = createSlice({
  name: "user",
  initialState: {
    information: {
      loading: false,
      info: null,
    },
    order: {
      loading: false,
      orders: [],
    },
    coupon: {
      loading: false,
      coupons: [],
    },
    changeInfo: {
      loading: false,
      error: null,
      message: null,
    },
    address: {
      loading: false,
      list: [],
    },
    addAddress: {
      loading: false,
      error: null,
      message: null,
    },
    selectAddress: {
      loading: false,
      error: null,
      message: null,
    },
    editAddress: {
      loading: false,
      error: null,
      message: null,
    },
    deleteAddress: {
      loading: false,
      error: null,
      message: null,
    },
    addOrder: {
      loading: false,
      error: null,
      message: null,
    },
    cancelOrder: {
      loading: false,
      error: null,
      message: null,
    },
  },
  reducers: {
    clearChagneInfo: (state) => {
      state.changeInfo.error = null;
      state.changeInfo.message = null;
    },
    clearSelectAddress: (state) => {
      state.selectAddress.error = null;
      state.selectAddress.message = null;
    },
    clearAddAddress: (state) => {
      state.addAddress.error = null;
      state.addAddress.message = null;
    },
    clearEditAddress: (state) => {
      state.editAddress.error = null;
      state.editAddress.message = null;
    },
    clearDeleteAddress: (state) => {
      state.deleteAddress.error = null;
      state.deleteAddress.message = null;
    },
    clearAddOrder: (state) => {
      state.addOrder.error = null;
      state.addOrder.message = null;
    },
    clearCancelOrder: (state) => {
      state.cancelOrder.error = null;
      state.cancelOrder.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInfoUser.pending, (state) => {
        state.information.loading = true;
      })
      .addCase(fetchInfoUser.fulfilled, (state, action) => {
        state.information.info = action.payload;
        state.information.loading = false;
      })
      .addCase(fetchInfoUser.rejected, (state) => {
        state.information.loading = false;
      })
      .addCase(fetchOrderUser.pending, (state) => {
        state.order.loading = true;
      })
      .addCase(fetchOrderUser.fulfilled, (state, action) => {
        state.order.orders = action.payload;
        state.order.loading = false;
      })
      .addCase(fetchOrderUser.rejected, (state) => {
        state.order.loading = false;
      })
      .addCase(fetchCouponUser.pending, (state) => {
        state.coupon.loading = true;
      })
      .addCase(fetchCouponUser.fulfilled, (state, action) => {
        state.coupon.coupons = action.payload.coupons;
        state.coupon.loading = false;
      })
      .addCase(fetchCouponUser.rejected, (state) => {
        state.coupon.loading = false;
      })
      .addCase(fetchChangeInfo.pending, (state) => {
        state.changeInfo.loading = true;
      })
      .addCase(fetchChangeInfo.fulfilled, (state, action) => {
        state.changeInfo.error = action.payload.error;
        state.changeInfo.message = action.payload.message;
        state.changeInfo.loading = false;
      })
      .addCase(fetchChangeInfo.rejected, (state, action) => {
        state.changeInfo.loading = false;
        state.changeInfo.message = action.payload.message;
        state.changeInfo.loading = false;
      })
      .addCase(fetchAddressWithId.pending, (state) => {
        state.address.loading = true;
      })
      .addCase(fetchAddressWithId.fulfilled, (state, action) => {
        state.address.list = action.payload;
        state.address.loading = false;
      })
      .addCase(fetchAddressWithId.rejected, (state) => {
        state.address.loading = false;
      })
      .addCase(fetchAddAddress.pending, (state) => {
        state.addAddress.loading = true;
      })
      .addCase(fetchAddAddress.fulfilled, (state, action) => {
        state.addAddress.error = action.payload.error;
        state.addAddress.message = action.payload.message;
        state.addAddress.loading = false;
      })
      .addCase(fetchAddAddress.rejected, (state, action) => {
        state.addAddress.error = action.payload.error;
        state.addAddress.message = action.payload.message;
        state.addAddress.loading = false;
      })
      .addCase(fetchSelectAddress.pending, (state) => {
        state.selectAddress.loading = true;
      })
      .addCase(fetchSelectAddress.fulfilled, (state, action) => {
        state.selectAddress.error = action.payload.error;
        state.selectAddress.message = action.payload.message;
        state.selectAddress.loading = false;
      })
      .addCase(fetchSelectAddress.rejected, (state, action) => {
        state.selectAddress.error = action.payload.error;
        state.selectAddress.message = action.payload.message;
        state.selectAddress.loading = false;
      })
      .addCase(fetchEditAddress.pending, (state) => {
        state.editAddress.loading = true;
      })
      .addCase(fetchEditAddress.fulfilled, (state, action) => {
        state.editAddress.error = action.payload.error;
        state.editAddress.message = action.payload.message;
        state.editAddress.loading = false;
      })
      .addCase(fetchEditAddress.rejected, (state, action) => {
        state.editAddress.error = action.payload.error;
        state.editAddress.message = action.payload.message;
        state.editAddress.loading = false;
      })
      .addCase(fetchDeleteAddress.pending, (state) => {
        state.deleteAddress.loading = true;
      })
      .addCase(fetchDeleteAddress.fulfilled, (state, action) => {
        state.deleteAddress.error = action.payload.error;
        state.deleteAddress.message = action.payload.message;
        state.deleteAddress.loading = false;
      })
      .addCase(fetchDeleteAddress.rejected, (state, action) => {
        state.deleteAddress.error = action.payload.error;
        state.deleteAddress.message = action.payload.message;
        state.deleteAddress.loading = false;
      })
      .addCase(fetchAddOrder.pending, (state) => {
        state.addOrder.loading = true;
      })
      .addCase(fetchAddOrder.fulfilled, (state, action) => {
        state.addOrder.error = action.payload.error;
        state.addOrder.message = action.payload.message;
        state.addOrder.loading = false;
      })
      .addCase(fetchAddOrder.rejected, (state, action) => {
        state.addOrder.error = action.payload.error;
        state.addOrder.message = action.payload.message;
        state.addOrder.loading = false;
      })
      .addCase(fetchCancelOrder.pending, (state) => {
        state.cancelOrder.loading = true;
      })
      .addCase(fetchCancelOrder.fulfilled, (state, action) => {
        state.cancelOrder.error = action.payload.error;
        state.cancelOrder.message = action.payload.message;
        state.cancelOrder.loading = false;
      })
      .addCase(fetchCancelOrder.rejected, (state, action) => {
        state.cancelOrder.error = action.payload.error;
        state.cancelOrder.message = action.payload.message;
        state.cancelOrder.loading = false;
      });
  },
});
export default userSlice.reducer;
export const {
  clearChagneInfo,
  clearAddAddress,
  clearSelectAddress,
  clearEditAddress,
  clearDeleteAddress,
  clearAddOrder,
  clearCancelOrder,
} = userSlice.actions;
