import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/configAxios.js";
import { clearState } from "./registerSlice.js";
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, rejectWithValue) => {
    try {
      const response = await axios.get("/api/cart/getCart");
      const cart = [];
      for (let key in response.data) {
        cart.push(JSON.parse(response.data[key]));
      }
      return cart;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const fetchAddToCart = createAsyncThunk(
  "cart/fetchAddToCart",
  async ({ id_product, quantity, price }, { rejectWithValue }) => {
    try {
      if (quantity <= 0 || isNaN(quantity))
        return {
          message: "Số lượng không hợp lệ",
          error: 1,
        };

      const response = await axios.post("/api/cart/addToCart", {
        id_product,
        quantity,
        price,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const changeQuantity = createAsyncThunk(
  "cart/changeQuantity",
  async ({ item, offset }, { _, rejectWithValue }) => {
    try {
      const quantity = item.quantity + offset;
      if (quantity > 0) {
        const response = await axios.post("/api/cart/addToCart", {
          id_product: item.id,
          quantity: offset,
          price: item.price,
        });
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (id_product, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/cart/removeFromCart", {
        id_product,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    getCart: {
      items: [],
      loading: false,
    },
    addCart: {
      loading: false,
      message: null,
      error: null,
    },
    removeCart: {
      loading: false,
      message: null,
      error: null,
    },
  },
  reducers: {
    addProduct: (state, action) => {
      if (action.payload.quantity <= 0 || isNaN(action.payload.quantity))
        return;
      const existingItem = state.getCart.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.getCart.items.push(action.payload);
      }
    },
    deleteProduct: (state, action) => {
      state.getCart.items = state.getCart.items.filter(
        (item) => item.id !== action.payload.id
      );
    },
    unincreaseQuantity: (state, action) => {
      const existingItem = state.getCart.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem.quantity > 1) {
        existingItem.quantity--;
        existingItem.total_price = existingItem.quantity * existingItem.price;
      }
    },
    increaseQuantity: (state, action) => {
      const existingItem = state.getCart.items.find(
        (item) => item.id === action.payload.id
      );
      existingItem.quantity++;
      existingItem.total_price = existingItem.quantity * existingItem.price;
    },
    clearCart: (state, action) => {
      state.getCart.items = [];
    },
    clearStateCart: (state) => {
      state.addCart.error = null;
      state.addCart.message = null;
      state.removeCart.error = null;
      state.removeCart.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.getCart.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.getCart.items = action.payload;
        state.getCart.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.getCart.loading = false;
      })
      .addCase(fetchAddToCart.pending, (state) => {
        state.addCart.loading = true;
      })
      .addCase(fetchAddToCart.fulfilled, (state, action) => {
        state.addCart.loading = false;
        state.addCart.message = action.payload.message;
        state.addCart.error = action.payload.error;
      })
      .addCase(fetchAddToCart.rejected, (state, action) => {
        state.addCart.loading = false;
        state.addCart.message = action.payload.message;
        state.addCart.error = action.payload.error;
      })
      .addCase(changeQuantity.pending, (state) => {
        state.addCart.loading = true;
      })
      .addCase(changeQuantity.fulfilled, (state, action) => {
        state.addCart.loading = false;
        state.addCart.message = action.payload.message;
        state.addCart.error = action.payload.error;
      })
      .addCase(changeQuantity.rejected, (state, action) => {
        state.addCart.loading = false;
        state.addCart.message = action.payload.message;
        state.addCart.error = action.payload.error;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.removeCart.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.removeCart.loading = false;
        state.removeCart.message = action.payload.message;
        state.removeCart.error = action.payload.error;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.removeCart.loading = false;
        state.removeCart.message = action.payload.message;
        state.removeCart.error = action.payload.error;
      });
  },
});

export const {
  addProduct,
  deleteProduct,
  unincreaseQuantity,
  increaseQuantity,
  clearCart,
  clearStateCart,
} = cartSlice.actions;
export default cartSlice.reducer;
