import { X } from "lucide-react";

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  minRating: number;
  sortBy: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClose?: () => void;
}

const CATEGORIES = ["Electronics", "Clothing", "Books", "Home & Garden"];
const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviews" },
];

export default function FilterSidebar({
  filters,
  onFilterChange,
  onClose,
}: FilterSidebarProps) {
  const toggleCategory = (cat: string) => {
    const updated = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onFilterChange({ ...filters, categories: updated });
  };

  const clearFilters = () => {
    onFilterChange({
      categories: [],
      priceRange: [0, 500],
      minRating: 0,
      sortBy: "default",
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 500 ||
    filters.minRating > 0 ||
    filters.sortBy !== "default";

  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filters</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-primary hover:underline"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="p-1 rounded hover:bg-accent"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label
          htmlFor="filter-sort-by"
          className="text-sm font-medium text-foreground mb-2 block"
        >
          Sort By
        </label>
        <select
          id="filter-sort-by"
          value={filters.sortBy}
          onChange={(e) =>
            onFilterChange({ ...filters, sortBy: e.target.value })
          }
          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div>
        <p className="text-sm font-medium text-foreground mb-3">Categories</p>
        <div className="space-y-2.5">
          {CATEGORIES.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="text-sm font-medium text-foreground mb-3">
          Price Range:{" "}
          <span className="text-primary">
            ${filters.priceRange[0]} – ${filters.priceRange[1]}
          </span>
        </p>
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={500}
            step={10}
            value={filters.priceRange[1]}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                priceRange: [filters.priceRange[0], Number(e.target.value)],
              })
            }
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>$500</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <p className="text-sm font-medium text-foreground mb-3">
          Minimum Rating
        </p>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((r) => (
            <button
              type="button"
              key={r}
              onClick={() =>
                onFilterChange({
                  ...filters,
                  minRating: filters.minRating === r ? 0 : r,
                })
              }
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                filters.minRating === r
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-accent text-muted-foreground"
              }`}
            >
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    aria-hidden="true"
                    className={`w-3.5 h-3.5 ${s <= r ? "star-filled" : "star-empty"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span>& up</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
