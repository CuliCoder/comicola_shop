import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/configAxios.js";

export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async (_, rejectWithValue) => {
    try {
      const response = await axios.get("/api/product");
      const result = response.data.filter((product) => {
        return product.quantity !== null || product.quantity > 0;
      });
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const fetchProducts_mainpage = createAsyncThunk(
  "products/fetchProducts_mainpage",
  async ({ category_id1, category_id2 }, { _, rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/product/mainpage?category_id1=${category_id1}&category_id2=${category_id2}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id_product, { _, rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/product/detail?id_product=${id_product}`
      );
      return response.data.product;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const fetchProductLimit = createAsyncThunk(
  "products/fetchProductLimit",
  async (limit, { _, rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/product/limit?limit=${limit}`);
      return response.data.products;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const fetchProductByCategory = createAsyncThunk(
  "products/fetchProductByCategory",
  async (id, { _, rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/product/category?id=${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products_mainpage: {
      loading: false,
      newProducts: [],
      byCategory1: [],
      byCategory2: [],
    },
    products_page: {
      loading: false,
      byUpdatedAt: null,
      byPriceAsc: null,
      byPriceDesc: null,
    },
    product_detail: {
      loading: false,
      product: null,
    },
    product_limit: {
      loading: false,
      products: null,
    },
    product_category: {
      loading: false,
      byUpdatedAt: [],
      byPriceAsc: [],
      byPriceDesc: [],
    },
  },
  reducers: {
    getProductsByCategory: (state, action) => {
      const { category_id, byUpdatedAt } = action.payload;
      const arr_products = create_by_category_array(category_id, byUpdatedAt);
      state.product_category.byUpdatedAt = arr_products;
      state.product_category.byPriceAsc = sortByPriceAsc(arr_products);
      state.product_category.byPriceDesc = sortByPriceDesc(arr_products);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.products_page.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.products_page.byUpdatedAt = action.payload;
        state.products_page.byPriceAsc = sortByPriceAsc(action.payload);
        state.products_page.byPriceDesc = sortByPriceDesc(action.payload);

        state.products_mainpage.newProducts = action.payload.slice(0, 8);
        state.products_mainpage.byCategory1 = create_by_category_array(
          7,
          action.payload
        ).slice(0, 8);
        state.products_mainpage.byCategory2 = create_by_category_array(
          6,
          action.payload
        ).slice(0, 8);

        state.products_page.loading = false;
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.products_page.loading = false;
      })
      .addCase(fetchProducts_mainpage.pending, (state) => {
        state.products_mainpage.loading = true;
      })
      .addCase(fetchProducts_mainpage.fulfilled, (state, action) => {
        state.products_mainpage.loading = false;
        state.products_mainpage.products = action.payload;
      })
      .addCase(fetchProducts_mainpage.rejected, (state) => {
        state.products_mainpage.loading = false;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.product_detail.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.product_detail.loading = false;
        state.product_detail.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state) => {
        state.product_detail.loading = false;
      })
      .addCase(fetchProductLimit.pending, (state) => {
        state.product_limit.loading = true;
      })
      .addCase(fetchProductLimit.fulfilled, (state, action) => {
        state.product_limit.loading = false;
        state.product_limit.products = action.payload;
      })
      .addCase(fetchProductLimit.rejected, (state) => {
        state.product_limit.loading = false;
      })
      .addCase(fetchProductByCategory.pending, (state) => {
        state.product_category.loading = true;
      })
      .addCase(fetchProductByCategory.fulfilled, (state, action) => {
        state.product_category.loading = false;
        state.product_category.products = action.payload;
      })
      .addCase(fetchProductByCategory.rejected, (state) => {
        state.product_category.loading = false;
      });
  },
});
export default productSlice.reducer;

const sortByPriceAsc = (products) => {
  return [...products].sort((a, b) => a.price - b.price);
};

const sortByPriceDesc = (products) => {
  return [...products].sort((a, b) => b.price - a.price);
};

const create_by_category_array = (id_category, products) => {
  return [...products].filter((product) =>
    product.category.some((cat) => cat.id === parseInt(id_category))
  );
};

export const { getProductsByCategory } = productSlice.actions;
