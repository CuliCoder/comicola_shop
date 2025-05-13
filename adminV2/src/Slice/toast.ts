import { createSlice } from "@reduxjs/toolkit";

export interface Toast {
  id: number;
  toast: ToastItem;
}

export interface ToastState {
  toasts: Toast[];
}

export interface ToastItem {
  type: "success" | "error" | "warning";
  message: string;
}

const initialState: ToastState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.toasts.push({ id: Date.now(), toast: action.payload });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
    },
  },
});

export const { showToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;
