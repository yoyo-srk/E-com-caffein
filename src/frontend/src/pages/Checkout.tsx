import { Link, useNavigate } from "@tanstack/react-router";
import {
  Check,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Truck,
  X,
} from "lucide-react";
import { useState } from "react";
import Spinner from "../components/common/Spinner";
import { useCartStore } from "../store/cartStore";

type Step = "shipping" | "payment" | "review";

interface ShippingData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  method: "standard" | "express";
}

interface PaymentData {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
  method: "card" | "paypal";
}

const STEPS: { key: Step; label: string; icon: React.ReactNode }[] = [
  { key: "shipping", label: "Shipping", icon: <Truck className="w-4 h-4" /> },
  {
    key: "payment",
    label: "Payment",
    icon: <CreditCard className="w-4 h-4" />,
  },
  {
    key: "review",
    label: "Review",
    icon: <ClipboardList className="w-4 h-4" />,
  },
];

function StepIndicator({ current }: { current: Step }) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);
  return (
    <div className="flex items-center justify-center mb-10">
      {STEPS.map((step, i) => (
        <div key={step.key} className="flex items-center">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              i < currentIdx
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : i === currentIdx
                  ? "brand-gradient-bg text-white shadow-brand"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {i < currentIdx ? <Check className="w-4 h-4" /> : step.icon}
            <span className="hidden sm:inline">{step.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`w-8 sm:w-16 h-0.5 mx-1 transition-all ${i < currentIdx ? "bg-green-400" : "bg-border"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>("shipping");
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [shipping, setShipping] = useState<ShippingData>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    country: "US",
    method: "standard",
  });
  const [payment, setPayment] = useState<PaymentData>({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    method: "card",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingCost =
    shipping.method === "express" ? 14.99 : subtotal >= 50 ? 0 : 9.99;
  const total = subtotal + shippingCost;

  const validateShipping = () => {
    const errs: Record<string, string> = {};
    if (!shipping.firstName.trim()) errs.firstName = "First name is required";
    if (!shipping.lastName.trim()) errs.lastName = "Last name is required";
    if (!shipping.address.trim()) errs.address = "Address is required";
    if (!shipping.city.trim()) errs.city = "City is required";
    if (!shipping.zip.trim()) errs.zip = "ZIP code is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePayment = () => {
    if (payment.method === "paypal") return true;
    const errs: Record<string, string> = {};
    if (
      !payment.cardNumber.trim() ||
      payment.cardNumber.replace(/\s/g, "").length < 16
    )
      errs.cardNumber = "Valid card number required";
    if (!payment.cardName.trim()) errs.cardName = "Cardholder name is required";
    if (!payment.expiry.trim()) errs.expiry = "Expiry date is required";
    if (!payment.cvv.trim() || payment.cvv.length < 3)
      errs.cvv = "Valid CVV required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    setErrors({});
    if (step === "shipping" && validateShipping()) setStep("payment");
    else if (step === "payment" && validatePayment()) setStep("review");
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const num = `SH-${Date.now().toString().slice(-8).toUpperCase()}`;
    setOrderNumber(num);
    clearCart();
    setLoading(false);
    setShowSuccess(true);
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  if (items.length === 0 && !showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-xl font-bold text-foreground">
          Your cart is empty
        </h2>
        <Link
          to="/products"
          className="px-6 py-2.5 brand-gradient-bg text-white rounded-lg font-medium"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6 text-center">
        Checkout
      </h1>
      <StepIndicator current={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main form */}
        <div className="lg:col-span-2">
          {/* Shipping Step */}
          {step === "shipping" && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" /> Shipping Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    key: "firstName",
                    label: "First Name",
                    placeholder: "John",
                    id: "checkout-first-name",
                  },
                  {
                    key: "lastName",
                    label: "Last Name",
                    placeholder: "Doe",
                    id: "checkout-last-name",
                  },
                ].map((field) => (
                  <div key={field.key}>
                    <label
                      htmlFor={field.id}
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type="text"
                      value={
                        shipping[field.key as keyof ShippingData] as string
                      }
                      onChange={(e) =>
                        setShipping((s) => ({
                          ...s,
                          [field.key]: e.target.value,
                        }))
                      }
                      placeholder={field.placeholder}
                      className={`w-full px-3 py-2.5 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px] ${errors[field.key] ? "border-destructive" : "border-border"}`}
                    />
                    {errors[field.key] && (
                      <p className="text-xs text-destructive mt-1">
                        {errors[field.key]}
                      </p>
                    )}
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="checkout-address"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    Street Address
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    value={shipping.address}
                    onChange={(e) =>
                      setShipping((s) => ({ ...s, address: e.target.value }))
                    }
                    placeholder="123 Main Street"
                    className={`w-full px-3 py-2.5 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px] ${errors.address ? "border-destructive" : "border-border"}`}
                  />
                  {errors.address && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="checkout-city"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    City
                  </label>
                  <input
                    id="checkout-city"
                    type="text"
                    value={shipping.city}
                    onChange={(e) =>
                      setShipping((s) => ({ ...s, city: e.target.value }))
                    }
                    placeholder="New York"
                    className={`w-full px-3 py-2.5 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px] ${errors.city ? "border-destructive" : "border-border"}`}
                  />
                  {errors.city && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.city}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="checkout-zip"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    ZIP Code
                  </label>
                  <input
                    id="checkout-zip"
                    type="text"
                    value={shipping.zip}
                    onChange={(e) =>
                      setShipping((s) => ({ ...s, zip: e.target.value }))
                    }
                    placeholder="10001"
                    className={`w-full px-3 py-2.5 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px] ${errors.zip ? "border-destructive" : "border-border"}`}
                  />
                  {errors.zip && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.zip}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="checkout-country"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    Country
                  </label>
                  <select
                    id="checkout-country"
                    value={shipping.country}
                    onChange={(e) =>
                      setShipping((s) => ({ ...s, country: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                  </select>
                </div>
              </div>

              {/* Delivery method */}
              <div className="mt-6">
                <p className="block text-sm font-medium text-foreground mb-3">
                  Delivery Method
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      key: "standard",
                      label: "Standard Shipping",
                      desc: "5-7 business days",
                      price: subtotal >= 50 ? "Free" : "$9.99",
                    },
                    {
                      key: "express",
                      label: "Express Shipping",
                      desc: "2-3 business days",
                      price: "$14.99",
                    },
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.key}
                      onClick={() =>
                        setShipping((s) => ({
                          ...s,
                          method: opt.key as "standard" | "express",
                        }))
                      }
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        shipping.method === opt.key
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {opt.label}
                        </span>
                        <span className="text-sm font-bold text-primary">
                          {opt.price}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {opt.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 brand-gradient-bg text-white font-semibold rounded-xl hover:opacity-90 transition-opacity min-h-[44px]"
              >
                Continue to Payment <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Payment Step */}
          {step === "payment" && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" /> Payment Method
              </h2>

              {/* Method selector */}
              <div className="flex gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setPayment((p) => ({ ...p, method: "card" }))}
                  className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${payment.method === "card" ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50"}`}
                >
                  Credit / Debit Card
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPayment((p) => ({ ...p, method: "paypal" }))
                  }
                  className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${payment.method === "paypal" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "border-border hover:border-blue-300"}`}
                >
                  PayPal
                </button>
              </div>

              {payment.method === "card" ? (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="checkout-card-number"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      Card Number
                    </label>
                    <input
                      id="checkout-card-number"
                      type="text"
                      value={payment.cardNumber}
                      onChange={(e) =>
                        setPayment((p) => ({
                          ...p,
                          cardNumber: formatCardNumber(e.target.value),
                        }))
                      }
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className={`w-full px-3 py-2.5 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px] font-mono ${errors.cardNumber ? "border-destructive" : "border-border"}`}
                    />
                    {errors.cardNumber && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="checkout-card-name"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      Cardholder Name
                    </label>
                    <input
                      id="checkout-card-name"
                      type="text"
                      value={payment.cardName}
                      onChange={(e) =>
                        setPayment((p) => ({ ...p, cardName: e.target.value }))
                      }
                      placeholder="John Doe"
                      className={`w-full px-3 py-2.5 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px] ${errors.cardName ? "border-destructive" : "border-border"}`}
                    />
                    {errors.cardName && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.cardName}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="checkout-expiry"
                        className="block text-sm font-medium text-foreground mb-1"
                      >
                        Expiry Date
                      </label>
                      <input
                        id="checkout-expiry"
                        type="text"
                        value={payment.expiry}
                        onChange={(e) => {
                          let val = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4);
                          if (val.length >= 2)
                            val = `${val.slice(0, 2)}/${val.slice(2)}`;
                          setPayment((p) => ({ ...p, expiry: val }));
                        }}
                        placeholder="MM/YY"
                        maxLength={5}
                        className={`w-full px-3 py-2.5 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px] font-mono ${errors.expiry ? "border-destructive" : "border-border"}`}
                      />
                      {errors.expiry && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.expiry}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="checkout-cvv"
                        className="block text-sm font-medium text-foreground mb-1"
                      >
                        CVV
                      </label>
                      <input
                        id="checkout-cvv"
                        type="password"
                        value={payment.cvv}
                        onChange={(e) =>
                          setPayment((p) => ({
                            ...p,
                            cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                          }))
                        }
                        placeholder="•••"
                        maxLength={4}
                        className={`w-full px-3 py-2.5 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px] font-mono ${errors.cvv ? "border-destructive" : "border-border"}`}
                      />
                      {errors.cvv && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.cvv}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">P</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    You'll be redirected to PayPal to complete your payment
                    securely.
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep("shipping")}
                  className="flex-1 py-3.5 border border-border rounded-xl text-sm font-medium hover:bg-accent transition-colors min-h-[44px]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 brand-gradient-bg text-white font-semibold rounded-xl hover:opacity-90 transition-opacity min-h-[44px]"
                >
                  Review Order <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Review Step */}
          {step === "review" && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" /> Review Your
                Order
              </h2>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-muted/50 rounded-xl">
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Shipping Address
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {shipping.firstName} {shipping.lastName}
                    <br />
                    {shipping.address}
                    <br />
                    {shipping.city}, {shipping.zip} {shipping.country}
                  </p>
                  <p className="text-xs text-primary mt-1 capitalize">
                    {shipping.method} shipping
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Payment Method
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {payment.method === "paypal"
                      ? "PayPal"
                      : `Card ending in ${payment.cardNumber.slice(-4)}`}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("payment")}
                  className="flex-1 py-3.5 border border-border rounded-xl text-sm font-medium hover:bg-accent transition-colors min-h-[44px]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 brand-gradient-bg text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-70 min-h-[44px]"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="text-white" /> Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border p-5 sticky top-24">
            <h3 className="font-semibold text-foreground mb-4">
              Order Summary
            </h3>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-muted flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-xs font-semibold text-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span
                  className={`font-medium ${shippingCost === 0 ? "text-green-600 dark:text-green-400" : ""}`}
                >
                  {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-foreground pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-lg">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border p-8 max-w-md w-full text-center animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Order Placed!
            </h2>
            <p className="text-muted-foreground mb-4">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            <div className="bg-muted/50 rounded-xl p-4 mb-6">
              <p className="text-xs text-muted-foreground mb-1">Order Number</p>
              <p className="text-lg font-bold text-primary font-mono">
                {orderNumber}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate({ to: "/" })}
                className="flex-1 py-3 border border-border rounded-xl text-sm font-medium hover:bg-accent transition-colors"
              >
                Go Home
              </button>
              <button
                type="button"
                onClick={() => navigate({ to: "/dashboard" })}
                className="flex-1 py-3 brand-gradient-bg text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                View Orders
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
