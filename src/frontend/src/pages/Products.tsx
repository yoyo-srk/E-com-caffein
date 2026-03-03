import { useSearch } from "@tanstack/react-router";
import { AlertCircle, Loader2, Plus, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import FilterSidebar from "../components/products/FilterSidebar";
import ProductCard from "../components/products/ProductCard";
import { useAppDispatch, useAppSelector } from "../store/redux/hooks";
import {
  addProduct,
  fetchProducts,
  selectAllProducts,
  selectProductsError,
  selectProductsStatus,
} from "../store/redux/productsSlice";

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  minRating: number;
  sortBy: string;
}

interface AddProductForm {
  name: string;
  price: string;
  category: string;
  image: string;
  description: string;
}

const ITEMS_PER_PAGE = 12;

const CATEGORY_OPTIONS = ["Electronics", "Clothing", "Books", "Home & Garden"];

export default function Products() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts);
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);

  const searchParams = useSearch({ strict: false }) as Record<string, string>;
  const urlSearch = searchParams?.search || "";
  const urlCategory = searchParams?.category || "";

  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [filters, setFilters] = useState<FilterState>({
    categories: urlCategory ? [urlCategory] : [],
    priceRange: [0, 1500],
    minRating: 0,
    sortBy: "default",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormSubmitting, setAddFormSubmitting] = useState(false);
  const [addForm, setAddForm] = useState<AddProductForm>({
    name: "",
    price: "",
    category: "Electronics",
    image: "",
    description: "",
  });

  // Fetch products on mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  useEffect(() => {
    setSearchQuery(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    if (urlCategory) {
      setFilters((f) => ({ ...f, categories: [urlCategory] }));
    }
  }, [urlCategory]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }

    result = result.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1],
    );

    if (filters.minRating > 0) {
      result = result.filter((p) => p.rating >= filters.minRating);
    }

    switch (filters.sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return result;
  }, [searchQuery, filters, products]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const handleAddFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setAddForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.price || !addForm.description.trim())
      return;

    setAddFormSubmitting(true);
    await dispatch(
      addProduct({
        name: addForm.name.trim(),
        price: Number.parseFloat(addForm.price),
        category: addForm.category,
        image:
          addForm.image.trim() ||
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format",
        description: addForm.description.trim(),
      }),
    );
    setAddFormSubmitting(false);
    setAddForm({
      name: "",
      price: "",
      category: "Electronics",
      image: "",
      description: "",
    });
    setShowAddForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Products</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {status === "loading"
              ? "Loading..."
              : `${filtered.length} products found`}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full sm:w-64 pl-4 pr-10 py-2.5 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-ocid="products.search_input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors min-h-[44px]"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {/* Add Product Toggle Button */}
          <button
            type="button"
            onClick={() => setShowAddForm((prev) => !prev)}
            data-ocid="products.add_product_toggle"
            aria-expanded={showAddForm}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 min-h-[44px] ${
              showAddForm
                ? "bg-muted border border-border text-foreground hover:bg-accent"
                : "brand-gradient-bg text-white hover:opacity-90 shadow-sm"
            }`}
          >
            <motion.span
              animate={{ rotate: showAddForm ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              className="inline-flex"
            >
              <Plus className="w-4 h-4" />
            </motion.span>
            {showAddForm ? "Close Form" : "Add Product"}
          </button>
        </div>
      </div>

      {/* Add Product Form (collapsible) */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            key="add-product-form"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleAddProduct}
              data-ocid="products.add_product_form"
              className="bg-card border border-border rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Add New Product
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="prod-name"
                    className="text-sm font-medium text-foreground"
                  >
                    Product Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="prod-name"
                    name="name"
                    type="text"
                    value={addForm.name}
                    onChange={handleAddFormChange}
                    placeholder="e.g. Sony WH-1000XM5"
                    required
                    className="px-3 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    data-ocid="products.add_product_form.input"
                  />
                </div>

                {/* Price */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="prod-price"
                    className="text-sm font-medium text-foreground"
                  >
                    Price ($) <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="prod-price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={addForm.price}
                    onChange={handleAddFormChange}
                    placeholder="29.99"
                    required
                    className="px-3 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="prod-category"
                    className="text-sm font-medium text-foreground"
                  >
                    Category
                  </label>
                  <select
                    id="prod-category"
                    name="category"
                    value={addForm.category}
                    onChange={handleAddFormChange}
                    className="px-3 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    data-ocid="products.add_product_form.select"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image URL */}
                <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-3">
                  <label
                    htmlFor="prod-image"
                    className="text-sm font-medium text-foreground"
                  >
                    Image URL{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="prod-image"
                    name="image"
                    type="text"
                    value={addForm.image}
                    onChange={handleAddFormChange}
                    placeholder="https://example.com/image.jpg"
                    className="px-3 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-3">
                  <label
                    htmlFor="prod-desc"
                    className="text-sm font-medium text-foreground"
                  >
                    Description <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="prod-desc"
                    name="description"
                    value={addForm.description}
                    onChange={handleAddFormChange}
                    placeholder="Describe this product..."
                    required
                    rows={3}
                    className="px-3 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                    data-ocid="products.add_product_form.textarea"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-5 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-2.5 text-sm font-medium border border-border rounded-lg hover:bg-accent transition-colors min-h-[44px]"
                  data-ocid="products.add_product_form.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addFormSubmitting}
                  data-ocid="products.add_product_submit_button"
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold brand-gradient-bg text-white rounded-lg hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all min-h-[44px]"
                >
                  {addFormSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      {status === "failed" && error && (
        <div
          className="flex items-center gap-3 p-4 mb-6 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm"
          data-ocid="products.error_state"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Could not reach the server. Showing cached products.</span>
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <FilterSidebar filters={filters} onFilterChange={setFilters} />
          </div>
        </aside>

        {/* Mobile Filter Overlay */}
        {showMobileFilters && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
              onKeyDown={(e) =>
                e.key === "Escape" && setShowMobileFilters(false)
              }
              role="button"
              tabIndex={0}
              aria-label="Close filters"
            />
            <div className="fixed left-0 top-0 h-full w-80 bg-background z-50 lg:hidden overflow-y-auto p-4 animate-slide-in-right">
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onClose={() => setShowMobileFilters(false)}
              />
            </div>
          </>
        )}

        {/* Products Grid */}
        <div className="flex-1 min-w-0">
          {/* Loading state */}
          {status === "loading" && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              data-ocid="products.loading_state"
            >
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  /* biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder */
                  key={`skeleton-${i}`}
                  className="bg-card border border-border rounded-xl overflow-hidden animate-pulse"
                >
                  <div className="h-56 bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-1/4" />
                  </div>
                  <div className="px-4 pb-4">
                    <div className="h-10 bg-muted rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {status !== "loading" && paginated.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-20 text-center"
              data-ocid="products.empty_state"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No products found
              </h3>
              <p className="text-muted-foreground text-sm">
                Try adjusting your filters or search query
              </p>
            </div>
          )}

          {status !== "loading" && paginated.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginated.map((product, index) => (
                  <div
                    key={product.id}
                    data-ocid={`products.item.${index + 1}`}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    data-ocid="products.pagination_prev"
                    className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        type="button"
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? "brand-gradient-bg text-white"
                            : "border border-border hover:bg-accent"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    data-ocid="products.pagination_next"
                    className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
