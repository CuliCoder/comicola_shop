import { createSlice } from "@reduxjs/toolkit";

export type Product = {
  id: number;
  price: number;
  quantity: number;
};
const initialState: { productsWait: Product[] } = {
  productsWait: [],
};

const productsWaitSlice = createSlice({
  name: "productsWait",
  initialState,
  reducers: {
    addProductsWait: (state, action) => {
      const product = state.productsWait.find(
        (product: Product) => product.id === action.payload.id
      );
      if (product) {
        product.quantity += action.payload.quantity;
      } else {
        state.productsWait.push(action.payload);
      }
    },
    removeProductsWait: (state, action) => {
      state.productsWait = state.productsWait.filter(
        (product: Product) => product.id !== action.payload
      );
    },
  },
});

export const { addProductsWait, removeProductsWait } =
  productsWaitSlice.actions;
export default productsWaitSlice.reducer;
