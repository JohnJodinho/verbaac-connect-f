import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { DollarSign, Tag, FileText, Percent, Info } from 'lucide-react';
import { 
  step1Schema, 
  type Step1Data, 
  MARKETPLACE_CATEGORIES,
  calculateFinalPrice,
  calculatePlatformFee,
  MIN_PRICE_NGN,
} from '../schemas/listing.schema';
import { useListingWizard } from '../stores/useListingWizard';
import { cn } from '@/lib/utils';

interface Step1IdentityProps {
  onNext: () => void;
}

export default function Step1Identity({ onNext }: Step1IdentityProps) {
  const { step1Data, updateStep1 } = useListingWizard();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      title: step1Data.title || '',
      category_id: step1Data.category_id || '',
      description: step1Data.description || '',
      base_price: step1Data.base_price || undefined,
      price_type: step1Data.price_type || 'fixed',
    },
    mode: 'onChange',
  });

  const basePrice = watch('base_price');

  // Auto-save to store on change
  const formValues = watch();
  useEffect(() => {
    const subscription = watch((data) => {
      updateStep1(data as Partial<Step1Data>);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateStep1]);

  const onSubmit = (data: Step1Data) => {
    updateStep1(data);
    onNext();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <label className="block text-sm font-medium text-foreground">
          Item Title <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            {...register('title')}
            type="text"
            placeholder="e.g., iPhone 13 Pro 256GB"
            className={cn(
              'w-full pl-11 pr-4 py-3 md:py-2.5 rounded-xl border bg-background text-base md:text-sm',
              'focus:outline-none focus:ring-2 focus:ring-role-seller/30 focus:border-role-seller',
              'transition-colors touch-target',
              errors.title ? 'border-destructive' : 'border-input'
            )}
          />
        </div>
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </motion.div>

      {/* Category */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="space-y-2"
      >
        <label className="block text-sm font-medium text-foreground">
          Category <span className="text-destructive">*</span>
        </label>
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {MARKETPLACE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => field.onChange(cat.id)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all touch-target',
                    'text-center text-xs md:text-sm',
                    field.value === cat.id
                      ? 'border-role-seller bg-role-seller/10 text-role-seller'
                      : 'border-border hover:border-role-seller/50 active:bg-muted'
                  )}
                >
                  <span className="text-lg">
                    {cat.id === 'electronics' && '📱'}
                    {cat.id === 'appliances' && '🔌'}
                    {cat.id === 'furniture' && '🪑'}
                    {cat.id === 'books' && '📚'}
                    {cat.id === 'clothing' && '👕'}
                    {cat.id === 'kitchen' && '🍳'}
                    {cat.id === 'sports' && '🏋️'}
                    {cat.id === 'beauty' && '✨'}
                    {cat.id === 'other' && '📦'}
                  </span>
                  <span className="font-medium truncate w-full">{cat.label}</span>
                </button>
              ))}
            </div>
          )}
        />
        {errors.category_id && (
          <p className="text-sm text-destructive">{errors.category_id.message}</p>
        )}
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        <label className="block text-sm font-medium text-foreground">
          Description <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <textarea
            {...register('description')}
            rows={4}
            placeholder="Describe your item in detail. Include brand, model, age, any defects, etc."
            className={cn(
              'w-full pl-11 pr-4 py-3 md:py-2.5 rounded-xl border bg-background text-base md:text-sm',
              'focus:outline-none focus:ring-2 focus:ring-role-seller/30 focus:border-role-seller',
              'resize-none transition-colors',
              errors.description ? 'border-destructive' : 'border-input'
            )}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formValues.description?.length || 0} / 2000</span>
          {errors.description && (
            <span className="text-destructive">{errors.description.message}</span>
          )}
        </div>
      </motion.div>

      {/* Price */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-2"
      >
        <label className="block text-sm font-medium text-foreground">
          Your Price (₦) <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            {...register('base_price', { valueAsNumber: true })}
            type="number"
            min={MIN_PRICE_NGN}
            step={100}
            placeholder="100,000"
            className={cn(
              'w-full pl-11 pr-4 py-3 md:py-2.5 rounded-xl border bg-background text-base md:text-sm',
              'focus:outline-none focus:ring-2 focus:ring-role-seller/30 focus:border-role-seller',
              'transition-colors touch-target',
              errors.base_price ? 'border-destructive' : 'border-input'
            )}
          />
        </div>
        {errors.base_price && (
          <p className="text-sm text-destructive">{errors.base_price.message}</p>
        )}
      </motion.div>

      {/* Price Type Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <label className="block text-sm font-medium text-foreground">
          Pricing Type
        </label>
        <Controller
          name="price_type"
          control={control}
          render={({ field }) => (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => field.onChange('fixed')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-medium transition-all touch-target',
                  field.value === 'fixed'
                    ? 'border-role-seller bg-role-seller/10 text-role-seller'
                    : 'border-border text-muted-foreground hover:border-role-seller/50 active:bg-muted'
                )}
              >
                <Tag className="w-4 h-4" />
                Fixed Price
              </button>
              <button
                type="button"
                onClick={() => field.onChange('negotiable')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-medium transition-all touch-target',
                  field.value === 'negotiable'
                    ? 'border-role-seller bg-role-seller/10 text-role-seller'
                    : 'border-border text-muted-foreground hover:border-role-seller/50 active:bg-muted'
                )}
              >
                <Percent className="w-4 h-4" />
                Negotiable
              </button>
            </div>
          )}
        />
      </motion.div>

      {/* Commission Preview */}
      {basePrice && basePrice >= MIN_PRICE_NGN && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-linear-to-br from-role-seller/5 to-purple-50 rounded-xl border border-role-seller/20 p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-role-seller" />
            <span className="text-sm font-medium text-foreground">Commission Preview</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Your Price</span>
              <span className="font-medium">{formatCurrency(basePrice)}</span>
            </div>
            <div className="flex justify-between text-role-seller">
              <span>Platform Fee (12%)</span>
              <span>+ {formatCurrency(calculatePlatformFee(basePrice))}</span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-foreground">Buyer Pays</span>
                <span className="text-emerald-600">{formatCurrency(calculateFinalPrice(basePrice))}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>You Receive (88%)</span>
                <span>{formatCurrency(basePrice)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="pt-4"
      >
        <button
          type="submit"
          disabled={!isValid}
          className={cn(
            'w-full py-4 md:py-3 rounded-xl font-semibold text-base transition-all touch-target',
            isValid
              ? 'bg-role-seller text-white hover:bg-role-seller/90 active:bg-role-seller/80'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
        >
          Continue to Photos
        </button>
      </motion.div>
    </form>
  );
}
