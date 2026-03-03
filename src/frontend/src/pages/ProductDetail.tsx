import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Shield,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useState } from "react";
import StarRating from "../components/common/StarRating";
import ProductCard from "../components/products/ProductCard";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { products } from "../utils/productsData";

export default function ProductDetail() {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));

  const addToCart = useCartStore((s) => s.addToCart);
  const wishlistItems = useWishlistStore((s) => s.items);
  const addToWishlist = useWishlistStore((s) => s.addToWishlist);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "details" | "shipping" | "reviews"
  >("details");
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold text-foreground">
          Product not found
        </h2>
        <Link
          to="/products"
          className="px-6 py-2.5 brand-gradient-bg text-white rounded-lg font-medium"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlistItems.some((i) => i.id === product.id);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity,
    });
    navigate({ to: "/checkout" });
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      });
    }
  };

  const mockReviews = [
    {
      id: 1,
      author: "Alex M.",
      rating: 5,
      date: "Jan 15, 2026",
      comment:
        "Absolutely love this product! Exceeded all my expectations. Build quality is superb.",
    },
    {
      id: 2,
      author: "Sarah K.",
      rating: 4,
      date: "Jan 8, 2026",
      comment:
        "Great product overall. Shipping was fast and packaging was excellent. Would recommend.",
    },
    {
      id: 3,
      author: "James R.",
      rating: 5,
      date: "Dec 28, 2025",
      comment:
        "Best purchase I've made this year. Works exactly as described. Very happy!",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-2 text-sm text-muted-foreground mb-8 flex-wrap"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 flex-shrink-0" />
        <Link to="/products" className="hover:text-primary transition-colors">
          Products
        </Link>
        <ChevronRight className="w-4 h-4 flex-shrink-0" />
        <Link
          to="/products"
          search={{ category: product.category } as never}
          className="hover:text-primary transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-4 h-4 flex-shrink-0" />
        <span className="text-foreground font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div className="flex gap-4">
          {/* Thumbnails */}
          <div className="hidden sm:flex flex-col gap-3 w-20 flex-shrink-0">
            {(product.images as string[]).map((img, i) => (
              <button
                // biome-ignore lint/suspicious/noArrayIndexKey: image thumbnails have no stable IDs
                key={i}
                type="button"
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === i
                    ? "border-primary"
                    : "border-border hover:border-primary/50"
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <img
                  src={img}
                  alt={`${product.name} view ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main image */}
          <div className="flex-1 aspect-square rounded-2xl overflow-hidden bg-muted border border-border">
            <img
              src={(product.images as string[])[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
              {product.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-3 mb-4">
            {product.name}
          </h1>

          <StarRating
            rating={product.rating}
            reviewCount={product.reviewCount}
            size="md"
          />

          <div className="mt-4 mb-6">
            <span className="text-3xl font-bold text-foreground">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-foreground">
              Quantity:
            </span>
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="p-3 hover:bg-accent transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 text-sm font-semibold min-w-[3rem] text-center border-x border-border">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="p-3 hover:bg-accent transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mb-8">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
                added
                  ? "bg-green-500 text-white"
                  : "brand-gradient-bg text-white hover:opacity-90 hover:shadow-brand"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {added ? "Added to Cart!" : "Add to Cart"}
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 border-primary text-primary hover:bg-primary/10 transition-all min-h-[44px]"
            >
              Buy Now
            </button>
            <button
              type="button"
              onClick={handleWishlist}
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
              className="p-3 rounded-xl border border-border hover:bg-accent transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Heart
                className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
              />
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-muted/50 rounded-xl">
            <div className="flex flex-col items-center gap-1 text-center">
              <Truck className="w-5 h-5 text-primary" />
              <span className="text-xs text-muted-foreground">
                Free Shipping
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-xs text-muted-foreground">
                2 Year Warranty
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <RotateCcw className="w-5 h-5 text-primary" />
              <span className="text-xs text-muted-foreground">
                30-Day Returns
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-16">
        <div className="flex border-b border-border mb-6">
          {(["details", "shipping", "reviews"] as const).map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "reviews"
                ? `Reviews (${product.reviewCount.toLocaleString()})`
                : tab}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          {activeTab === "details" && (
            <div>
              <h3 className="font-semibold text-foreground mb-3">
                Product Details
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.details as string}
              </p>
            </div>
          )}
          {activeTab === "shipping" && (
            <div>
              <h3 className="font-semibold text-foreground mb-3">
                Shipping Information
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.shipping as string}
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">
                      Standard Shipping
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    5-7 business days • Free
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">
                      Express Shipping
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    2-3 business days • From $7.99
                  </p>
                </div>
              </div>
            </div>
          )}
          {activeTab === "reviews" && (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-foreground">
                    {product.rating.toFixed(1)}
                  </div>
                  <StarRating rating={product.rating} size="sm" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {product.reviewCount.toLocaleString()} reviews
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <div key={review.id} className="p-4 bg-muted/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full brand-gradient-bg flex items-center justify-center text-white text-xs font-bold">
                          {review.author[0]}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {review.author}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-foreground mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Need Zap for shipping tab
function Zap({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  );
}
