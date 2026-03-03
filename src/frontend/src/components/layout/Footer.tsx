import { Link } from "@tanstack/react-router";
import { Heart, Mail } from "lucide-react";
import { useState } from "react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const appId =
    typeof window !== "undefined" ? window.location.hostname : "shopifyhub";

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-base font-semibold text-foreground mb-4">
              About ShopifyHub
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Your one-stop destination for amazing products across electronics,
              clothing, books, and home goods.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter/X"
                className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
              >
                <SiX className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
              >
                <SiInstagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
              >
                <SiFacebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-base font-semibold text-foreground mb-4">
              Categories
            </h3>
            <ul className="space-y-2">
              {["Electronics", "Clothing", "Books", "Home & Garden"].map(
                (cat) => (
                  <li key={cat}>
                    <Link
                      to="/products"
                      search={{ category: cat } as never}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {cat}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-base font-semibold text-foreground mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Help Center", to: "/" as const },
                { label: "Track Order", to: "/dashboard" as const },
                { label: "Returns", to: "/" as const },
                { label: "Contact Us", to: "/" as const },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-base font-semibold text-foreground mb-4">
              Newsletter
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Get the latest deals and updates delivered to your inbox.
            </p>
            {subscribed ? (
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                ✓ Thanks for subscribing!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 brand-gradient-bg text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity min-h-[44px]"
                >
                  Join
                </button>
              </form>
            )}

            {/* Payment methods */}
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">We accept</p>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 bg-muted rounded text-xs font-bold text-foreground">
                  VISA
                </div>
                <div className="px-2 py-1 bg-muted rounded text-xs font-bold text-foreground">
                  MC
                </div>
                <div className="px-2 py-1 bg-muted rounded text-xs font-bold text-blue-600">
                  PayPal
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 ShopifyHub. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Built with{" "}
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(appId)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
