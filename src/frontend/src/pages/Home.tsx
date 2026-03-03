import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowDown,
  BookOpen,
  ChevronRight,
  Clock,
  Cpu,
  Globe,
  Home as HomeIcon,
  Shirt,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ProductCard from "../components/products/ProductCard";
import { categories, featuredProducts, products } from "../utils/productsData";

function useCounter(target: number, duration = 2000, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let current = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, started]);
  return count;
}

const categoryIcons: Record<string, React.ReactNode> = {
  Electronics: <Cpu className="w-7 h-7" />,
  Clothing: <Shirt className="w-7 h-7" />,
  Books: <BookOpen className="w-7 h-7" />,
  "Home & Garden": <HomeIcon className="w-7 h-7" />,
};

interface StatCardProps {
  icon: React.ReactNode;
  target: number;
  suffix: string;
  label: string;
  display: string;
  started: boolean;
}

function StatCard({
  icon,
  target,
  suffix,
  label,
  display,
  started,
}: StatCardProps) {
  const count = useCounter(target, 2000, started);
  const formatted =
    target >= 1000 ? `${Math.floor(count / 1000)}K` : count.toString();
  return (
    <div className="text-center p-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <div className="text-3xl font-bold text-foreground mb-1">
        {started
          ? target >= 1000
            ? `${formatted}${suffix}`
            : `${count}${suffix}`
          : display}
      </div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

const statsData = [
  {
    icon: <Zap className="w-8 h-8" />,
    target: 10000,
    suffix: "+",
    label: "Products",
    display: "10K+",
  },
  {
    icon: <Users className="w-8 h-8" />,
    target: 5000,
    suffix: "+",
    label: "Happy Customers",
    display: "5K+",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    target: 100,
    suffix: "+",
    label: "Countries",
    display: "100+",
  },
  {
    icon: <Clock className="w-8 h-8" />,
    target: 24,
    suffix: "/7",
    label: "Support",
    display: "24/7",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsStarted, setStatsStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-white animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
                <Zap className="w-4 h-4 text-yellow-300" />
                New arrivals every week
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Discover
                <br />
                <span className="text-yellow-300">Amazing</span>
                <br />
                Products
              </h1>

              <p className="text-lg text-white/80 mb-8 max-w-md">
                Shop the latest electronics, fashion, books, and home goods.
                Quality products at unbeatable prices.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => navigate({ to: "/products" })}
                  className="px-8 py-3.5 bg-white text-purple-700 font-semibold rounded-xl hover:bg-white/90 transition-all hover:shadow-lg hover:scale-105 min-h-[44px]"
                >
                  Shop Now
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/products" })}
                  className="px-8 py-3.5 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all min-h-[44px]"
                >
                  Browse Categories
                </button>
              </div>
            </div>

            {/* Right - Floating product */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-white/10 blur-2xl scale-110" />
                <div className="relative animate-float">
                  <img
                    src="/assets/generated/hero-product-float.dim_400x400.png"
                    alt="Featured product"
                    className="w-80 h-80 object-contain drop-shadow-2xl"
                  />
                </div>
                <div className="absolute -top-4 -left-8 bg-white rounded-xl px-3 py-2 shadow-lg animate-bounce-subtle">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs font-semibold text-gray-800">
                      Free Shipping
                    </span>
                  </div>
                </div>
                <div
                  className="absolute -bottom-4 -right-8 bg-white rounded-xl px-3 py-2 shadow-lg animate-bounce-subtle"
                  style={{ animationDelay: "0.5s" }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-xs font-semibold text-gray-800">
                      4.9 Rating
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <ArrowDown className="w-6 h-6" />
        </div>
      </section>

      {/* Featured Products Slider */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Featured Products
              </h2>
              <p className="text-muted-foreground mt-1">
                Handpicked favorites just for you
              </p>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {featuredProducts.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Shop by Category
            </h2>
            <p className="text-muted-foreground mt-2">
              Find exactly what you're looking for
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to="/products"
                search={{ category: cat.name } as never}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-36 overflow-hidden bg-muted">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                      {categoryIcons[cat.name]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {cat.count} products
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section ref={statsRef} className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Why Choose ShopifyHub?
            </h2>
            <p className="text-muted-foreground mt-2">
              Trusted by thousands of customers worldwide
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statsData.map((stat) => (
              <StatCard key={stat.label} {...stat} started={statsStarted} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Products */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                New Arrivals
              </h2>
              <p className="text-muted-foreground mt-1">
                Fresh products added this week
              </p>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
