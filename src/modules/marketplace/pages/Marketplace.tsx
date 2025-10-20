import { useState } from "react";
import { Search, Filter, Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import {
  AnimatedCard,
  AnimatedButton,
  AnimatedIcon,
  PageWrapper,
  StaggeredContainer,
  AnimatedItem,
  FloatingButton,
} from "../../../components/animated";

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockItems = [
    {
      id: "1",
      title: 'MacBook Pro 13" (2020)',
      description: "Excellent condition, barely used. Perfect for students.",
      price: 450000,
      originalPrice: 650000,
      images: ["/api/placeholder/300/300"],
      condition: "like-new" as const,
      category: "Electronics",
      seller: "Chidi Okonkwo",
      university: "University of Lagos",
      rating: 4.8,
      location: "Yaba, Lagos",
      postedAt: "2 days ago",
      tags: ["laptop", "apple", "macbook"],
    },
    {
      id: "2",
      title: "Textbook Bundle - Engineering",
      description:
        "Complete set of engineering textbooks for 200-300 level.",
      price: 25000,
      images: ["/api/placeholder/300/300"],
      condition: "good" as const,
      category: "Books",
      seller: "Amina Hassan",
      university: "University of Nigeria, Nsukka",
      rating: 4.5,
      location: "Nsukka, Enugu",
      postedAt: "1 week ago",
      tags: ["textbooks", "engineering", "academics"],
    },
  ];

  const categories = [
    "All Categories",
    "Electronics",
    "Books",
    "Furniture",
    "Clothing",
    "Kitchen Items",
    "Sports Equipment",
  ];

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
            Buy and sell second-hand items with fellow students
          </p>
        </motion.div>

        {/* Search and Categories */}
        <AnimatedCard className="p-6 mb-8 bg-card border border-border">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <AnimatedIcon>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                </AnimatedIcon>
                <motion.input
                  type="text"
                  placeholder="Search for items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              </div>
            </div>
            <AnimatedButton variant="secondary" className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </AnimatedButton>
          </div>

          {/* Categories */}
          <motion.div
            className="flex flex-wrap gap-2"
            initial="initial"
            animate="animate"
            variants={{
              initial: {},
              animate: {
                transition: { staggerChildren: 0.05 },
              },
            }}
          >
            {categories.map((category) => (
              <motion.div
                key={category}
                variants={{
                  initial: { opacity: 0, scale: 0.8 },
                  animate: { opacity: 1, scale: 1 },
                }}
              >
                <AnimatedButton
                  variant="ghost"
                  size="sm"
                  className="px-4 py-2 text-sm border border-border rounded-full hover:bg-muted hover:text-primary transition-colors"
                >
                  {category}
                </AnimatedButton>
              </motion.div>
            ))}
          </motion.div>
        </AnimatedCard>

        {/* Items Grid */}
        <StaggeredContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          stagger={0.1}
        >
          {mockItems.map((item) => (
            <AnimatedItem key={item.id}>
              <AnimatedCard className="overflow-hidden bg-card border border-border">
                <div className="relative">
                  <motion.img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.button
                    className="absolute top-2 right-2 p-2 bg-background rounded-full shadow-sm border border-border"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <AnimatedIcon>
                      <Heart className="h-4 w-4 text-muted-foreground" />
                    </AnimatedIcon>
                  </motion.button>
                  <motion.div
                    className="absolute bottom-2 left-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                      {item.condition}
                    </span>
                  </motion.div>
                </div>

                <div className="p-4">
                  <motion.h3
                    className="font-semibold text-foreground mb-2 line-clamp-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {item.title}
                  </motion.h3>

                  <motion.div
                    className="flex items-center gap-2 mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="text-lg font-bold text-primary">
                      ₦{item.price.toLocaleString()}
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₦{item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </motion.div>

                  <motion.p
                    className="text-sm text-muted-foreground mb-3 line-clamp-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {item.description}
                  </motion.p>

                  <motion.div
                    className="flex items-center justify-between text-xs text-muted-foreground mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span>{item.seller}</span>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-warning fill-current mr-1" />
                      {item.rating}
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <AnimatedButton size="sm" className="flex-1">
                      View Details
                    </AnimatedButton>
                    <AnimatedButton variant="secondary" size="sm">
                      Chat
                    </AnimatedButton>
                  </motion.div>
                </div>
              </AnimatedCard>
            </AnimatedItem>
          ))}
        </StaggeredContainer>

        {/* Floating Action Button */}
        <FloatingButton>
          <span className="text-2xl text-foreground">+</span>
        </FloatingButton>
      </div>
    </PageWrapper>
  );
}
