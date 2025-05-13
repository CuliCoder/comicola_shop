import { configureStore } from "@reduxjs/toolkit";
import roleReducer from "./Slice/role";
import orderReducer from "./Slice/order_status";
import productWait from "./Slice/products_wait";
import toast from "./Slice/toast";
import category_author from "./Slice/category_author";

const store = configureStore({
  reducer: {
    role: roleReducer,
    order_status: orderReducer,
    productsWait: productWait,
    toast: toast,
    category_author: category_author,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
