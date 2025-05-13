import { createSlice } from "@reduxjs/toolkit";

const MyToast = createSlice({
  name: "MyToast",
  initialState: {
    show: false,
    type: null,
    message: "",
  },
  reducers: {
    setShowToast: (state, action) => {
      state.show = action.payload.show;
      state.type = action.payload.type;
      state.message = action.payload.message;
    },
    setCloseToast: (state) => {
      state.show = false;
      state.type = null;
      state.message = "";
    },
  },
});
export const { setShowToast, setCloseToast } = MyToast.actions;
export default MyToast.reducer;