import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { type MarketplaceItem, type ItemCondition } from '@/types';

interface MarketplaceScrollerProps {
  items?: MarketplaceItem[];
  title?: string;
}

// Mock data for demonstration
const mockItems: Partial<MarketplaceItem>[] = [
  {
    id: '1',
    title: 'MacBook Pro 2021',
    price: 450000,
    images: ['/api/placeholder/200/200'],
    condition: 'Used',
    category: 'Electronics',
  },
  {
    id: '2',
    title: 'Study Desk & Chair Set',
    price: 35000,
    images: ['/api/placeholder/200/200'],
    condition: 'New',
    category: 'Furniture',
  },
  {
    id: '3',
    title: 'Textbooks Bundle',
    price: 12000,
    images: ['/api/placeholder/200/200'],
    condition: 'Used',
    category: 'Books',
  },
  {
    id: '4',
    title: 'Mini Refrigerator',
    price: 65000,
    images: ['/api/placeholder/200/200'],
    condition: 'Refurbished',
    category: 'Appliances',
  },
  {
    id: '5',
    title: 'Study Lamp LED',
    price: 8500,
    images: ['/api/placeholder/200/200'],
    condition: 'New',
    category: 'Electronics',
  },
];

const conditionColors: Record<ItemCondition, string> = {
  New: 'bg-emerald-100 text-emerald-700',
  Used: 'bg-amber-100 text-amber-700',
  Refurbished: 'bg-blue-100 text-blue-700',
};

/**
 * MarketplaceScroller displays a horizontal list of marketplace items
 * based on saved_categories in buyer sub-profiles.
 */
export function MarketplaceScroller({ 
  items = mockItems as MarketplaceItem[], 
  title = 'Recommended for You' 
}: MarketplaceScrollerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Add 12% commission to display price
  const getDisplayPrice = (basePrice: number) => {
    return Math.round(basePrice * 1.12);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 280;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Link
          to="/marketplace"
          className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Scroll buttons */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 translate-y-2 z-10 p-2 bg-white shadow-lg rounded-full 
                     hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
      )}

      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 translate-y-2 z-10 p-2 bg-white shadow-lg rounded-full 
                     hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={`/marketplace/${item.id}`}
              className="flex-shrink-0 w-56 bg-white rounded-xl border border-gray-200 
                         overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Image */}
              <div className="relative h-36 bg-gray-100">
                <img
                  src={item.images?.[0] || '/api/placeholder/200/200'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Condition tag */}
                <span
                  className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium
                             ${conditionColors[item.condition as ItemCondition] || 'bg-gray-100 text-gray-700'}`}
                >
                  {item.condition}
                </span>
              </div>

              {/* Content */}
              <div className="p-3">
                <h4 className="font-medium text-gray-900 text-sm truncate mb-1">
                  {item.title}
                </h4>
                <div className="flex items-center justify-between">
                  <p className="text-teal-600 font-bold">
                    {formatPrice(getDisplayPrice(item.price))}
                  </p>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Tag className="h-3 w-3" />
                    {item.category}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
