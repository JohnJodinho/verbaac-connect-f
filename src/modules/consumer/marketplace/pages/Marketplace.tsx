import { useState, useMemo, useEffect } from "react";
import { Search, X, ShoppingBag, Plus } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AnimatedButton,
  PageWrapper,
  StaggeredContainer,
  AnimatedItem,
} from "@/components/animated";
import { marketItems } from "@/data/mock-marketplace";
import { MarketItemCard } from "../components/MarketItemCard";

const CATEGORIES = [
  "All",
  "Electronics",
  "Books",
  "Furniture",
  "Clothing",
  "Appliances",
  "Sports",
];

export default function Marketplace() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "All");

  // --- Search Params Sync ---
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchQuery) params.set("q", searchQuery);
    else params.delete("q");

    if (activeCategory && activeCategory !== "All") params.set("category", activeCategory);
    else params.delete("category");

    setSearchParams(params, { replace: true });
  }, [searchQuery, activeCategory]);

  // --- Filtering Logic ---
  const filteredItems = useMemo(() => {
    return marketItems.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchLower));

      // Map short category names to full names
      const categoryMap: Record<string, string> = {
        "All": "All Categories",
        "Sports": "Sports Equipment"
      };
      const fullCategory = categoryMap[activeCategory] || activeCategory;
      
      const matchesCategory =
        fullCategory === "All Categories" || item.category === fullCategory || item.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <PageWrapper className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-8">
        
        {/* Header - Compact on mobile */}
        <motion.div
          className="mb-4 md:mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:hidden rounded-xl bg-role-seller/10 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-role-seller" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-foreground">
                Marketplace
              </h1>
              <p className="text-sm md:text-base text-muted-foreground hidden md:block">
                Buy and sell second-hand items within the UNIJOS community securely.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search & Category Bar - Sticky */}
        <div className="bg-card border border-border rounded-xl p-3 md:p-4 mb-4 md:mb-8 shadow-sm sticky top-14 md:top-20 z-30">
          {/* Search Input */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-10 py-2.5 md:py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground active:text-foreground/80 touch-target"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Category Pills - Horizontal scroll */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-3 md:px-4 py-2 rounded-full text-sm font-medium transition-colors touch-target ${
                  activeCategory === cat 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 active:bg-muted/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-3 md:mb-4 text-sm text-muted-foreground px-1">
          {filteredItems.length} items found
        </div>

        {/* Results Grid - 2 columns on mobile, 4 on desktop */}
        <StaggeredContainer
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
          stagger={0.05}
        >
          {filteredItems.length === 0 ? (
            <div className="col-span-full py-16 md:py-20 text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 md:w-8 md:h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No items found</h3>
              <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or category.</p>
              <AnimatedButton 
                variant="outline" 
                className="touch-target"
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              >
                Clear Filters
              </AnimatedButton>
            </div>
          ) : (
            filteredItems.map((item) => (
              <AnimatedItem key={item.id} className="h-full">
                <MarketItemCard item={item} />
              </AnimatedItem>
            ))
          )}
        </StaggeredContainer>

        {/* Floating Sell Button - Mobile optimized */}
        <button
          onClick={() => navigate('/seller/onboarding')}
          className="fixed bottom-20 md:bottom-8 right-4 md:right-8 w-14 h-14 bg-role-seller text-white rounded-full shadow-lg shadow-role-seller/30 flex items-center justify-center hover:bg-role-seller/90 active:bg-role-seller/80 transition-colors touch-target-lg z-40"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </PageWrapper>
  );
}
