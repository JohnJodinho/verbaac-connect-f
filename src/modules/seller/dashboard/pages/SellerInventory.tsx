import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Search, Filter, MoreVertical, Eye, Edit, Trash2, ChevronDown, Check, AlertCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedCard, AnimatedButton } from '@/components/animated';
import { cn } from '@/lib/utils';

/**
 * SellerInventory Page
 * 
 * Mobile-first inventory manager with:
 * - Condition overlays on thumbnails
 * - Status toggle (Available/Sold/Reserved)
 * - Verification badges
 * - Single-column card layout on mobile
 */

type ItemStatusType = 'available' | 'sold' | 'reserved';

interface InventoryItem {
  id: string;
  name: string;
  price: number;
  status: ItemStatusType;
  condition: 'new' | 'used' | 'refurbished';
  stock: number;
  views: number;
  imageUrl: string | null;
  isVerified: boolean;
}

export default function SellerInventory() {
  const [items, setItems] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'MacBook Pro M3 2024',
      price: 850000,
      status: 'available',
      condition: 'used',
      stock: 2,
      views: 145,
      imageUrl: null,
      isVerified: true,
    },
    {
      id: '2',
      name: 'iPhone 15 Pro Max',
      price: 650000,
      status: 'available',
      condition: 'new',
      stock: 5,
      views: 312,
      imageUrl: null,
      isVerified: true,
    },
    {
      id: '3',
      name: 'Samsung Galaxy S24 Ultra',
      price: 520000,
      status: 'sold',
      condition: 'refurbished',
      stock: 0,
      views: 89,
      imageUrl: null,
      isVerified: false,
    },
  ]);

  const [expandedStatus, setExpandedStatus] = useState<string | null>(null);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statusConfig: Record<ItemStatusType, { label: string; color: string; bgColor: string }> = {
    available: { label: 'Available', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    sold: { label: 'Sold', color: 'text-gray-600', bgColor: 'bg-gray-100' },
    reserved: { label: 'Reserved', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  };

  const conditionConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    new: { label: 'New', color: 'text-emerald-700', bgColor: 'bg-emerald-500' },
    used: { label: 'Used', color: 'text-amber-700', bgColor: 'bg-amber-500' },
    refurbished: { label: 'Refurb', color: 'text-blue-700', bgColor: 'bg-blue-500' },
  };

  const handleStatusChange = (itemId: string, newStatus: ItemStatusType) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: newStatus } : item
    ));
    setExpandedStatus(null);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - Compact on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:hidden rounded-xl bg-role-seller/10 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-role-seller" />
          </div>
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl md:text-2xl font-bold text-foreground"
            >
              Inventory
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-muted-foreground hidden md:block"
            >
              Manage your marketplace listings
            </motion.p>
          </div>
        </div>
        
        <AnimatedButton variant="primary" size="md" className="hidden sm:flex touch-target">
          <Link to="/dashboard/seller/inventory/new" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Item
          </Link>
        </AnimatedButton>
      </div>

      {/* Search and Filters - Sticky on mobile */}
      <div className="sticky top-14 md:top-0 z-30 bg-background -mx-4 px-4 py-3 md:py-0 md:mx-0 md:px-0 md:relative border-b md:border-0 border-border">
        <AnimatedCard className="bg-card p-3 md:p-4 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search items..."
                className="w-full pl-10 pr-4 py-2.5 md:py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-role-seller/30 focus:border-role-seller touch-target"
              />
            </div>
            <button className="flex items-center gap-2 px-3 md:px-4 py-2.5 md:py-2 rounded-lg border border-border hover:bg-muted active:bg-muted/80 transition-colors touch-target">
              <Filter className="w-4 h-4" />
              <span className="text-sm hidden md:inline">Filter</span>
            </button>
          </div>
        </AnimatedCard>
      </div>

      {/* Inventory List - Cards on mobile, table-like on desktop */}
      <div className="space-y-3 md:space-y-0">
        {/* Desktop view */}
        <AnimatedCard className="hidden md:block bg-card rounded-xl border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 hover:bg-muted/30 active:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Item Image with Condition Overlay */}
                  <div className="relative w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-6 h-6 text-muted-foreground" />
                    )}
                    {/* Condition Overlay */}
                    <span className={cn(
                      'absolute bottom-0 left-0 right-0 text-[10px] font-medium text-white text-center py-0.5',
                      conditionConfig[item.condition].bgColor
                    )}>
                      {conditionConfig[item.condition].label}
                    </span>
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                      {item.isVerified && (
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-lg font-semibold text-role-seller">{formatCurrency(item.price)}</p>
                  </div>

                  {/* Status Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setExpandedStatus(expandedStatus === item.id ? null : item.id)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors touch-target',
                        statusConfig[item.status].bgColor,
                        statusConfig[item.status].color
                      )}
                    >
                      {statusConfig[item.status].label}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    
                    <AnimatePresence>
                      {expandedStatus === item.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute top-full right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-10 min-w-[140px]"
                        >
                          {(Object.keys(statusConfig) as ItemStatusType[]).map((status) => (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(item.id, status)}
                              className={cn(
                                'w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors',
                                item.status === status && 'bg-muted'
                              )}
                            >
                              <span className={cn(
                                'w-2 h-2 rounded-full',
                                statusConfig[status].bgColor.replace('bg-', 'bg-').replace('-100', '-500')
                              )} />
                              {statusConfig[status].label}
                              {item.status === status && <Check className="w-4 h-4 ml-auto" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Stock & Views */}
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">{item.stock} in stock</p>
                    <div className="flex items-center gap-1 text-muted-foreground mt-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span className="text-xs">{item.views}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-lg hover:bg-muted active:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground touch-target">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-destructive/10 active:bg-destructive/20 transition-colors text-muted-foreground hover:text-destructive touch-target">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedCard>

        {/* Mobile view - Cards */}
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="md:hidden bg-card rounded-xl border border-border p-4"
          >
            <div className="flex gap-3">
              {/* Image with Condition Overlay */}
              <div className="relative w-20 h-20 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-8 h-8 text-muted-foreground" />
                )}
                <span className={cn(
                  'absolute bottom-0 left-0 right-0 text-[10px] font-medium text-white text-center py-0.5',
                  conditionConfig[item.condition].bgColor
                )}>
                  {conditionConfig[item.condition].label}
                </span>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                      {item.isVerified && (
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-lg font-bold text-role-seller">{formatCurrency(item.price)}</p>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{item.stock} in stock</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {item.views} views
                  </span>
                  {!item.isVerified && (
                    <span className="flex items-center gap-1 text-amber-600">
                      <AlertCircle className="w-3 h-3" />
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Status Toggle */}
            <div className="mt-3 pt-3 border-t border-border flex gap-2">
              {(Object.keys(statusConfig) as ItemStatusType[]).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(item.id, status)}
                  className={cn(
                    'flex-1 py-2 rounded-lg text-sm font-medium transition-all touch-target',
                    item.status === status
                      ? `${statusConfig[status].bgColor} ${statusConfig[status].color}`
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 active:bg-muted/60'
                  )}
                >
                  {statusConfig[status].label}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <AnimatedCard className="bg-muted/30 p-8 md:p-12 rounded-xl border border-dashed border-border text-center">
          <Package className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">No items yet</h3>
          <p className="text-sm text-muted-foreground mb-6">
            List your first item to start selling on the marketplace.
          </p>
          <AnimatedButton variant="primary" size="md" className="touch-target">
            <Link to="/dashboard/seller/inventory/new" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Item
            </Link>
          </AnimatedButton>
        </AnimatedCard>
      )}

      {/* Mobile FAB */}
      <Link
        to="/dashboard/seller/inventory/new"
        className="sm:hidden fixed bottom-20 right-4 w-14 h-14 bg-role-seller text-white rounded-full shadow-lg shadow-role-seller/30 flex items-center justify-center hover:bg-role-seller/90 active:bg-role-seller/80 transition-colors touch-target-lg z-40"
      >
        <Plus className="w-6 h-6" />
      </Link>
    </div>
  );
}
