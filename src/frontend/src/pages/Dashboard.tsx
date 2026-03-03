import { Link, useNavigate } from "@tanstack/react-router";
import {
  DollarSign,
  Edit,
  Heart,
  LogOut,
  Package,
  ShoppingBag,
  User,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";

const MOCK_ORDERS = [
  {
    id: "SH-20250115",
    date: "Jan 15, 2026",
    status: "Delivered",
    total: 349.99,
    items: 2,
  },
  {
    id: "SH-20250108",
    date: "Jan 8, 2026",
    status: "Processing",
    total: 89.99,
    items: 1,
  },
  {
    id: "SH-20241228",
    date: "Dec 28, 2025",
    status: "Shipped",
    total: 229.0,
    items: 3,
  },
  {
    id: "SH-20241215",
    date: "Dec 15, 2025",
    status: "Delivered",
    total: 154.0,
    items: 1,
  },
];

const STATUS_STYLES: Record<string, string> = {
  Delivered: "status-delivered",
  Processing: "status-processing",
  Shipped: "status-shipped",
  Cancelled: "status-cancelled",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const cartItems = useCartStore((s) => s.items);
  const wishlistItems = useWishlistStore((s) => s.items);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <User className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Please log in to view your dashboard
        </h2>
        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-6 py-2.5 brand-gradient-bg text-white rounded-lg font-medium"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-6 py-2.5 border border-border rounded-lg font-medium hover:bg-accent transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  const totalSpent = MOCK_ORDERS.filter((o) => o.status === "Delivered").reduce(
    (s, o) => s + o.total,
    0,
  );

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-8">My Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Profile Card */}
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-primary/20"
            />
            <h2 className="text-lg font-bold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground mb-1">{user.email}</p>
            <p className="text-xs text-muted-foreground">
              {user.ordersCount} orders placed
            </p>

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium border border-border rounded-lg hover:bg-accent transition-colors min-h-[36px]"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit Profile
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/10 transition-colors min-h-[36px]"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Quick Links
            </h3>
            <div className="space-y-1">
              {[
                {
                  to: "/products",
                  label: "Browse Products",
                  icon: <ShoppingBag className="w-4 h-4" />,
                },
                {
                  to: "/cart",
                  label: "View Cart",
                  icon: <Package className="w-4 h-4" />,
                },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Total Spent",
                value: `$${totalSpent.toFixed(2)}`,
                icon: <DollarSign className="w-6 h-6" />,
                color: "text-green-600 dark:text-green-400",
                bg: "bg-green-100 dark:bg-green-900/30",
              },
              {
                label: "Total Orders",
                value: MOCK_ORDERS.length.toString(),
                icon: <Package className="w-6 h-6" />,
                color: "text-blue-600 dark:text-blue-400",
                bg: "bg-blue-100 dark:bg-blue-900/30",
              },
              {
                label: "Wishlist Items",
                value: wishlistItems.length.toString(),
                icon: <Heart className="w-6 h-6" />,
                color: "text-red-600 dark:text-red-400",
                bg: "bg-red-100 dark:bg-red-900/30",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-card rounded-xl border border-border p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>
                  <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Recent Orders</h3>
              <span className="text-xs text-muted-foreground">
                {MOCK_ORDERS.length} orders
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Order #
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                      Date
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Total
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_ORDERS.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <span className="text-sm font-mono font-medium text-foreground">
                          {order.id}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {order.items} item{order.items > 1 ? "s" : ""}
                        </p>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {order.date}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[order.status] || ""}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-sm font-semibold text-foreground">
                          ${order.total.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cart Summary */}
          {cartItems.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">
                  Cart ({cartItems.length} items)
                </h3>
                <Link
                  to="/cart"
                  className="text-sm text-primary hover:underline"
                >
                  View Cart
                </Link>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {cartItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex-shrink-0 w-16">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {item.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
