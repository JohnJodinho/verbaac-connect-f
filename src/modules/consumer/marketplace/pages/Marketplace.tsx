import { useState, useMemo, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AnimatedButton,
  PageWrapper,
  StaggeredContainer,
  AnimatedItem,
  FloatingButton,
} from "@/components/animated";
import { marketItems } from "@/data/mock-marketplace";
import { MarketItemCard } from "../components/MarketItemCard";

const CATEGORIES = [
    "All Categories",
    "Electronics",
    "Books",
    "Furniture",
    "Clothing",
    "Appliances",
    "Sports Equipment",
];

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "All Categories");
  const [isFilterOpen, setIsFilterOpen] = useState(false); // For mobile/advanced filter toggle

  // --- Search Params Sync ---
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchQuery) params.set("q", searchQuery);
    else params.delete("q");

    if (activeCategory && activeCategory !== "All Categories") params.set("category", activeCategory);
    else params.delete("category");

    setSearchParams(params, { replace: true });
  }, [searchQuery, activeCategory]);

  // --- Filtering Logic ---
  const filteredItems = useMemo(() => {
    return marketItems.filter((item) => {
      // 1. Text Search
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchLower));

      // 2. Category
      const matchesCategory =
        activeCategory === "All Categories" || item.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <PageWrapper className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Student Marketplace
          </h1>
          <p className="text-muted-foreground">
            Buy and sell second-hand items within the UNIJOS community securely.
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
        <div className="bg-card border border-border rounded-xl p-4 mb-8 shadow-sm">
           <div className="flex flex-col md:flex-row gap-4">
               {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search notebooks, phones, furniture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              
              {/* Category Pills (Desktop) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                 {CATEGORIES.map(cat => (
                     <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            activeCategory === cat 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                     >
                        {cat}
                     </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Results Grid */}
        <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredItems.length} items
        </div>

        <StaggeredContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          stagger={0.05}
        >
          {filteredItems.length === 0 ? (
             <div className="col-span-full py-20 text-center">
                 <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                 </div>
                 <h3 className="text-lg font-semibold mb-2">No items found</h3>
                 <p className="text-muted-foreground mb-4">Try adjusting your search or category.</p>
                 <AnimatedButton variant="outline" onClick={() => { setSearchQuery(''); setActiveCategory('All Categories'); }}>
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

        {/* Floating Sell Button */}
        <FloatingButton onClick={() => console.log('Open sell modal')}>
          <span className="text-2xl">+</span>
        </FloatingButton>
      </div>
    </PageWrapper>
  );
}
