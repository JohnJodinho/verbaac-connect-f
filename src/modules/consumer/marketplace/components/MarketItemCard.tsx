import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, CheckCircle, MapPin } from 'lucide-react';
import { type MarketplaceItem } from '@/types/index';
import { AnimatedCard, AnimatedButton, AnimatedIcon } from '@/components/animated';
import { GuestLock } from '@/components/shared/GuestLock';
import { useAuthStore } from '@/store/useAuthStore';

interface MarketItemCardProps {
  item: MarketplaceItem;
}

export function MarketItemCard({ item }: MarketItemCardProps) {
  const navigate = useNavigate();
  const { activeRole } = useAuthStore();
  const isGuest = activeRole === 'guest';

  // Calculate price with 12% fee overlay text (simplified for display)
  // The price in DB/Mock is usually the listed price.
  // We should clarify if 'price' includes commission. 
  // For now, we display the raw price and formatted currency.
  const formattedPrice = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(item.price);

  const conditionColors = {
    New: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Used: 'bg-amber-100 text-amber-800 border-amber-200',
    Refurbished: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <AnimatedCard className="overflow-hidden bg-card border border-border group h-full flex flex-col hover:border-primary/50 transition-colors">
      <div className="relative">
        <motion.img
          src={item.images[0]}
          alt={item.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => (e.currentTarget.src = `https://placehold.co/400x400/3ABEFF/FFFFFF?text=${encodeURIComponent(item.category)}`)}
        />
        
        {/* Favorite Button */}
        <motion.button
          className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-full shadow-sm border border-border/50 hover:bg-background"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatedIcon>
            <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500 transition-colors" />
          </AnimatedIcon>
        </motion.button>

        {/* Condition Tag */}
        <div className="absolute top-2 left-2">
           <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${conditionColors[item.condition]}`}>
             {item.condition}
           </span>
        </div>

        {/* Availability Overlay if not available */}
        {!item.isAvailable && (
             <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center">
                 <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg transform -rotate-12 uppercase tracking-wide border border-white/20">
                     Sold Out
                 </span>
             </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {/* Title & Price */}
        <div className="mb-2">
            <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors" title={item.title}>
                {item.title}
            </h3>
             <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-primary">
                    {formattedPrice}
                </span>
             </div>
        </div>
        
        {/* Location (Masked for Guests) & Seller */}
        <div className="space-y-2 mb-4 text-sm text-muted-foreground">
             <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span className="line-clamp-1">
                    {isGuest ? 'UNIJOS Campus Area' : item.university} 
                    {/* Simplified masking logic: Guest sees generic zone, User sees Uni/Zone */}
                </span>
             </div>

             <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-2">
                 <div className="flex items-center gap-1.5">
                    <span className="text-xs">by {item.seller.firstName}</span>
                    {item.seller.isVerified && <CheckCircle className="w-3 h-3 text-primary" />}
                 </div>
                 <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-medium">4.5</span>
                 </div>
             </div>
        </div>

        <div className="mt-auto flex gap-2 pt-3">
             <AnimatedButton 
                size="sm" 
                variant="outline"
                className="flex-1"
                onClick={() => navigate(`/marketplace/${item.id}`)}
             >
                Details
             </AnimatedButton>
              <GuestLock fallbackText="Login to Chat" blur={false} className="flex-1">
                  <AnimatedButton variant="primary" size="sm" className="w-full">
                      Chat
                  </AnimatedButton>
              </GuestLock>
        </div>
      </div>
    </AnimatedCard>
  );
}
