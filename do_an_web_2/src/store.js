import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./Slice/cartSlice.js";
import productReducer from "./Slice/products.js";
import loginReducer from "./Slice/loginSlice.js";
import statusReducer from "./Slice/status.js";
import categoryReducer from "./Slice/categorySlice.js";
import registerReducer from "./Slice/registerSlice.js";
import userReducer from "./Slice/userSlice.js";
import addressReducer from "./Slice/addressSlice.js";
import MyToast from "./Slice/MyToastSlice.js";
import author from "./Slice/authorSlice.js";
import discountSlice from "./Slice/discountSlice.js";
export default configureStore({
  reducer: {
    discount: discountSlice,
    cart: cartReducer,
    products: productReducer,
    login: loginReducer,
    status: statusReducer,
    category: categoryReducer,
    register: registerReducer,
    user: userReducer,
    address: addressReducer,
    toast: MyToast,
    author: author,
  },
});
