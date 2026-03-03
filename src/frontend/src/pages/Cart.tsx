import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "../store/cartStore";

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity } = useCartStore();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 0 ? (subtotal >= 50 ? 0 : 9.99) : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center text-center py-12">
          <img
            src="/assets/generated/empty-cart.dim_400x300.png"
            alt="Empty cart"
            className="w-64 h-48 object-contain mb-8 opacity-80"
          />
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-8 max-w-sm">
            Looks like you haven't added anything to your cart yet. Start
            shopping to fill it up!
          </p>
          <Link
            to="/products"
            className="flex items-center gap-2 px-8 py-3.5 brand-gradient-bg text-white font-semibold rounded-xl hover:opacity-90 transition-opacity min-h-[44px]"
          >
            <ShoppingBag className="w-5 h-5" />
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-8">
        Shopping Cart{" "}
        <span className="text-muted-foreground font-normal text-lg">
          ({items.length} {items.length === 1 ? "item" : "items"})
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/products/$id"
                params={{ id: String(item.id) }}
                className="flex-shrink-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-lg bg-muted"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      to="/products/$id"
                      params={{ id: String(item.id) }}
                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.category}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="p-2 hover:bg-accent transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 py-1 text-sm font-semibold border-x border-border min-w-[2.5rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="p-2 hover:bg-accent transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ${item.price.toFixed(2)} each
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                </span>
                <span className="font-medium text-foreground">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span
                  className={`font-medium ${shipping === 0 ? "text-green-600 dark:text-green-400" : "text-foreground"}`}
                >
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {subtotal > 0 && subtotal < 50 && (
                <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
            </div>

            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-foreground">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate({ to: "/checkout" })}
              className="w-full flex items-center justify-center gap-2 py-3.5 brand-gradient-bg text-white font-semibold rounded-xl hover:opacity-90 transition-opacity min-h-[44px]"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/products"
              className="block text-center mt-3 text-sm text-primary hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
