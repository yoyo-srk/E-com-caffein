import { Link } from "@tanstack/react-router";
import { Heart, PackageSearch, ShoppingCart, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCartStore } from "../store/cartStore";
import { useAppDispatch, useAppSelector } from "../store/redux/hooks";
import {
  clearWishlist,
  removeFromWishlist,
  selectWishlistItems,
} from "../store/redux/wishlistSlice";

export default function Wishlist() {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector(selectWishlistItems);
  const addToCart = useCartStore((s) => s.addToCart);
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set());

  const handleAddToCart = (item: (typeof wishlistItems)[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
    });
    setAddedItems((prev) => {
      const next = new Set(prev);
      next.add(item.id);
      return next;
    });
    setTimeout(() => {
      setAddedItems((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 1500);
  };

  const handleRemove = (id: number) => {
    dispatch(removeFromWishlist(id));
  };

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      data-ocid="wishlist.page"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl brand-gradient-bg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              My Wishlist
              {wishlistItems.length > 0 && (
                <span className="inline-flex items-center justify-center w-7 h-7 text-xs font-bold brand-gradient-bg text-white rounded-full">
                  {wishlistItems.length}
                </span>
              )}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {wishlistItems.length === 0
                ? "No items saved yet"
                : `${wishlistItems.length} item${wishlistItems.length !== 1 ? "s" : ""} saved`}
            </p>
          </div>
        </div>

        {wishlistItems.length > 0 && (
          <button
            type="button"
            onClick={() => dispatch(clearWishlist())}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/10 transition-colors min-h-[44px]"
            data-ocid="wishlist.delete_button"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Empty State */}
      {wishlistItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center py-24 text-center"
          data-ocid="wishlist.empty_state"
        >
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-muted/80 flex items-center justify-center">
              <PackageSearch className="w-12 h-12 text-muted-foreground/50" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
              <Heart className="w-4 h-4 text-rose-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs">
            Save items you love by clicking the heart icon on any product.
          </p>
          <Link
            to="/products"
            data-ocid="wishlist.primary_button"
            className="inline-flex items-center gap-2 px-6 py-3 brand-gradient-bg text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity min-h-[44px]"
          >
            <ShoppingCart className="w-4 h-4" />
            Browse Products
          </Link>
        </motion.div>
      )}

      {/* Wishlist Grid */}
      {wishlistItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                data-ocid={`wishlist.item.${index + 1}`}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Product Image */}
                <Link
                  to="/products/$id"
                  params={{ id: String(item.id) }}
                  className="block relative overflow-hidden bg-muted h-52"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Remove button overlay */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove(item.id);
                    }}
                    aria-label={`Remove ${item.name} from wishlist`}
                    data-ocid={`wishlist.remove_button.${index + 1}`}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-card/90 shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-110 transition-all"
                  >
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  </button>

                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 text-xs font-semibold bg-white/90 dark:bg-card/90 text-foreground rounded-full shadow-sm">
                      {item.category}
                    </span>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link
                    to="/products/$id"
                    params={{ id: String(item.id) }}
                    className="block"
                  >
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-foreground">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-full">
                      {item.category}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      data-ocid={`wishlist.add_to_cart_button.${index + 1}`}
                      aria-label={`Add ${item.name} to cart`}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] ${
                        addedItems.has(item.id)
                          ? "bg-green-500 text-white"
                          : "brand-gradient-bg text-white hover:opacity-90"
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {addedItems.has(item.id) ? "Added!" : "Add to Cart"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      aria-label={`Remove ${item.name} from wishlist`}
                      data-ocid={`wishlist.remove_button.${index + 1}`}
                      className="p-2.5 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Browse more CTA */}
      {wishlistItems.length > 0 && (
        <div className="mt-10 text-center">
          <Link
            to="/products"
            data-ocid="wishlist.primary_button"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border border-border rounded-xl hover:bg-accent transition-colors min-h-[44px]"
          >
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
