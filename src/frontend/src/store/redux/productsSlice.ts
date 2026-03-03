import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { products as staticProducts } from "../../utils/productsData";
import type { RootState } from "./store";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  description: string;
  details?: string;
  shipping?: string;
  images?: string[];
}

interface ProductsState {
  items: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk<Product[]>(
  "products/fetchProducts",
  async () => {
    try {
      const response = await fetch("http://localhost:3001/products");
      if (!response.ok) {
        throw new Error("Server responded with error");
      }
      return (await response.json()) as Product[];
    } catch {
      // Fall back to static data when json-server is not running
      return staticProducts as Product[];
    }
  },
);

export const addProduct = createAsyncThunk<
  Product,
  Omit<Product, "id" | "rating" | "reviewCount" | "featured">
>("products/addProduct", async (productData) => {
  const newProduct: Product = {
    ...productData,
    id: Date.now(),
    rating: 0,
    reviewCount: 0,
    featured: false,
  };
  try {
    const response = await fetch("http://localhost:3001/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    if (!response.ok) {
      throw new Error("Failed to add product to server");
    }
    return (await response.json()) as Product;
  } catch {
    // Optimistic: still return the product so it's added locally
    return newProduct;
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        },
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch products";
        // Fallback to static data
        state.items = staticProducts as Product[];
      })
      .addCase(addProduct.pending, (state) => {
        state.error = null;
      })
      .addCase(
        addProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.items.push(action.payload);
        },
      )
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.error.message ?? "Failed to add product";
      });
  },
});

export default productsSlice.reducer;

// Selectors
export const selectAllProducts = (state: RootState) => state.products.items;
export const selectProductsStatus = (state: RootState) => state.products.status;
export const selectProductsError = (state: RootState) => state.products.error;
