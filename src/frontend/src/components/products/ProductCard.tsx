import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "../../store/cartStore";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import {
  addToWishlist,
  removeFromWishlist,
  selectIsWishlisted,
} from "../../store/redux/wishlistSlice";
import StarRating from "../common/StarRating";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((s) => s.addToCart);

  const dispatch = useAppDispatch();
  const isWishlisted = useAppSelector(selectIsWishlisted(product.id));

  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(
        addToWishlist({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
        }),
      );
    }
  };

  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-border shadow-xs hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      <Link
        to="/products/$id"
        params={{ id: String(product.id) }}
        className="block"
      >
        <div className="relative overflow-hidden bg-muted h-56">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {/* Wishlist button */}
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-card/90 shadow-sm hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
            />
          </button>
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-xs font-medium bg-white/90 dark:bg-card/90 text-foreground rounded-full shadow-sm">
              {product.category}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-1.5 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <StarRating
            rating={product.rating}
            reviewCount={product.reviewCount}
            size="sm"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-foreground">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </Link>

      {/* Add to cart */}
      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] ${
            added
              ? "bg-green-500 text-white"
              : "brand-gradient-bg text-white hover:opacity-90 hover:shadow-brand"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {added ? "Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
