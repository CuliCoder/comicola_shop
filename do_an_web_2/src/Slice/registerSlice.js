import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/configAxios";
import * as regex from "../utils/regex";
export const register = createAsyncThunk(
  "register/register",
  async (data) => {}
);

export const getCode = createAsyncThunk(
  "register/getCode",
  async (email, { _, rejectWithValue }) => {
    try {
      if (!regex.rgEmail.test(email)) {
        return { error: 1, message: "Email không hợp lệ" };
      }
      const response = await axios.post("/auth/sendCode", { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const checkCode = createAsyncThunk(
  "register/checkCode",
  async ({ email, code }, { rejectWithValue }) => {
    try {
      if (!regex.rgEmail.test(email)) {
        return { error: 1, message: "Email không hợp lệ" };
      }
      if (code === "" || code === null) {
        return { error: 1, message: "Mã xác thực không được để trống" };
      }
      const response = await axios.post("/auth/verifyCode", { email, code });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const registerUser = createAsyncThunk(
  "register/registerUser",
  async ({ email, password, confirmPassword }, { rejectWithValue }) => {
    try {
      if (!regex.rgEmail.test(email)) {
        return { error: 1, message: "Email không hợp lệ" };
      }
      if (!password) {
        return { error: 1, message: "Mật khẩu không được để trống" };
      }
      if (!regex.rgPw.test(password)) {
        return {
          error: 1,
          message:
            "Mật khẩu phải có ít nhất 8 ký tự, trong đó có ít nhất 1 ký tự viết hoa",
        };
      }
      if (password !== confirmPassword) {
        return { error: 1, message: "Mật khẩu không khớp" };
      }
      const response = await axios.post("/auth/register", { email, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const registerSlice = createSlice({
  name: "register",
  initialState: {
    getCode: {
      error: null,
      loading: false,
      message: "",
    },
    checkCode: {
      error: null,
      loading: false,
      message: "",
    },
    registerUser: {
      error: null,
      loading: false,
      message: "",
    },
  },
  reducers: {
    clearState: (state) => {
      state.getCode.error = null;
      state.getCode.message = "";
      state.checkCode.error = null;
      state.checkCode.message = "";
      state.registerUser.error = null;
      state.registerUser.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCode.pending, (state) => {
        state.getCode.loading = true;
      })
      .addCase(getCode.fulfilled, (state, action) => {
        state.getCode.loading = false;
        state.getCode.message = action.payload.message;
        state.getCode.error = action.payload.error;
      })
      .addCase(getCode.rejected, (state, action) => {
        state.getCode.loading = false;
        state.getCode.message = action.payload.message;
      })
      .addCase(checkCode.pending, (state) => {
        state.checkCode.loading = true;
      })
      .addCase(checkCode.fulfilled, (state, action) => {
        state.checkCode.loading = false;
        state.checkCode.message = action.payload.message;
        state.checkCode.error = action.payload.error;
      })
      .addCase(checkCode.rejected, (state, action) => {
        state.checkCode.loading = false;
        state.checkCode.message = action.payload.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.registerUser.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerUser.loading = false;
        state.registerUser.message = action.payload.message;
        state.registerUser.error = action.payload.error;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerUser.loading = false;
        state.registerUser.message = action.payload.message;
      });
  },
});

export default registerSlice.reducer;
export const { clearState } = registerSlice.actions;
