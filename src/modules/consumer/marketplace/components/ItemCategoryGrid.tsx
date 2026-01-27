import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Laptop,
  Sofa,
  BookOpen,
  Shirt,
  Utensils,
  Smartphone,
  Dumbbell,
  Music,
  MoreHorizontal,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  count?: number;
}

const categories: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: Laptop,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
  },
  {
    id: 'furniture',
    name: 'Furniture',
    icon: Sofa,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 hover:bg-amber-100',
  },
  {
    id: 'books',
    name: 'Books',
    icon: BookOpen,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100',
  },
  {
    id: 'clothing',
    name: 'Clothing',
    icon: Shirt,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 hover:bg-pink-100',
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    icon: Utensils,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 hover:bg-orange-100',
  },
  {
    id: 'phones',
    name: 'Phones',
    icon: Smartphone,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100',
  },
  {
    id: 'fitness',
    name: 'Fitness',
    icon: Dumbbell,
    color: 'text-red-600',
    bgColor: 'bg-red-50 hover:bg-red-100',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: Music,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 hover:bg-indigo-100',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

interface ItemCategoryGridProps {
  onCategorySelect?: (categoryId: string) => void;
  selectedCategory?: string;
  showCounts?: boolean;
  categoryCounts?: Record<string, number>;
}

/**
 * ItemCategoryGrid - Category grid for browsing marketplace items.
 * Displays icon + label for each category with responsive grid layout.
 */
export function ItemCategoryGrid({
  onCategorySelect,
  selectedCategory,
  showCounts = false,
  categoryCounts = {},
}: ItemCategoryGridProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h3>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3"
      >
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          const count = categoryCounts[category.id] || category.count;

          return (
            <motion.div key={category.id} variants={itemVariants}>
              <Link
                to={`/marketplace?category=${category.id}`}
                onClick={(e) => {
                  if (onCategorySelect) {
                    e.preventDefault();
                    onCategorySelect(category.id);
                  }
                }}
                className={`flex flex-col items-center p-4 rounded-xl transition-all duration-200
                           ${category.bgColor}
                           ${isSelected 
                             ? 'ring-2 ring-teal-500 ring-offset-2' 
                             : 'hover:shadow-md'}`}
              >
                <div className={`p-3 rounded-full bg-white shadow-sm mb-2 ${category.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-gray-900 text-center">
                  {category.name}
                </span>
                {showCounts && count !== undefined && (
                  <span className="text-xs text-gray-500 mt-1">{count} items</span>
                )}
              </Link>
            </motion.div>
          );
        })}

        {/* More Categories */}
        <motion.div variants={itemVariants}>
          <Link
            to="/marketplace/categories"
            className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 
                       transition-all duration-200 hover:shadow-md"
          >
            <div className="p-3 rounded-full bg-white shadow-sm mb-2 text-gray-600">
              <MoreHorizontal className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-gray-900 text-center">
              More
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
