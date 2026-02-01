import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { MapPin, Truck, Package, Check, AlertCircle } from 'lucide-react';
import { step3Schema, type Step3Data, DeliveryType } from '../schemas/listing.schema';
import { useListingWizard } from '../stores/useListingWizard';
import { cn } from '@/lib/utils';

interface Step3FulfillmentProps {
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function Step3Fulfillment({ onSubmit: onFormSubmit, onBack, isSubmitting }: Step3FulfillmentProps) {
  const { step3Data, updateStep3 } = useListingWizard();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      pickup_landmark: step3Data.pickup_landmark || '',
      allow_pickup: Boolean(step3Data.allow_pickup ?? true),
      allow_delivery: Boolean(step3Data.allow_delivery ?? false),
      delivery_fee_type: step3Data.delivery_fee_type,
      base_delivery_fee: step3Data.base_delivery_fee,
    } as Step3Data,
    mode: 'onChange',
  });

  const allowPickup = watch('allow_pickup');
  const allowDelivery = watch('allow_delivery');
  const deliveryFeeType = watch('delivery_fee_type');

  const onSubmit: SubmitHandler<Step3Data> = (data) => {
    updateStep3(data);
    onFormSubmit();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
      {/* Fulfillment Options */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <label className="block text-sm font-medium text-foreground">
          How can buyers receive this item?
        </label>
        
        <Controller
          name="allow_pickup"
          control={control}
          render={({ field }) => (
            <button
              type="button"
              onClick={() => field.onChange(!field.value)}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-xl border transition-all touch-target',
                field.value
                  ? 'border-role-seller bg-role-seller/10'
                  : 'border-border hover:border-role-seller/50 active:bg-muted'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                field.value ? 'bg-role-seller/20' : 'bg-muted'
              )}>
                <Package className={cn(
                  'w-5 h-5',
                  field.value ? 'text-role-seller' : 'text-muted-foreground'
                )} />
              </div>
              <div className="flex-1 text-left">
                <p className={cn(
                  'font-medium',
                  field.value ? 'text-role-seller' : 'text-foreground'
                )}>
                  Pickup
                </p>
                <p className="text-xs text-muted-foreground">
                  Buyer collects from your location
                </p>
              </div>
              <div className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0',
                field.value
                  ? 'border-role-seller bg-role-seller'
                  : 'border-border'
              )}>
                {field.value && <Check className="w-4 h-4 text-white" />}
              </div>
            </button>
          )}
        />

        <Controller
          name="allow_delivery"
          control={control}
          render={({ field }) => (
            <button
              type="button"
              onClick={() => field.onChange(!field.value)}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-xl border transition-all touch-target',
                field.value
                  ? 'border-role-seller bg-role-seller/10'
                  : 'border-border hover:border-role-seller/50 active:bg-muted'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                field.value ? 'bg-role-seller/20' : 'bg-muted'
              )}>
                <Truck className={cn(
                  'w-5 h-5',
                  field.value ? 'text-role-seller' : 'text-muted-foreground'
                )} />
              </div>
              <div className="flex-1 text-left">
                <p className={cn(
                  'font-medium',
                  field.value ? 'text-role-seller' : 'text-foreground'
                )}>
                  Delivery
                </p>
                <p className="text-xs text-muted-foreground">
                  You arrange delivery to buyer
                </p>
              </div>
              <div className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0',
                field.value
                  ? 'border-role-seller bg-role-seller'
                  : 'border-border'
              )}>
                {field.value && <Check className="w-4 h-4 text-white" />}
              </div>
            </button>
          )}
        />

        {!allowPickup && !allowDelivery && (
          <div className="flex items-center gap-2 text-amber-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Select at least one fulfillment option</span>
          </div>
        )}
      </motion.div>

      {/* Pickup Location */}
      {allowPickup && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2"
        >
          <label className="block text-sm font-medium text-foreground">
            Pickup Location <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <textarea
              {...register('pickup_landmark')}
              rows={2}
              placeholder="e.g., Lobby of Naraguta Luxury Lodge, opposite the main gate"
              className={cn(
                'w-full pl-11 pr-4 py-3 md:py-2.5 rounded-xl border bg-background text-base md:text-sm',
                'focus:outline-none focus:ring-2 focus:ring-role-seller/30 focus:border-role-seller',
                'resize-none transition-colors',
                errors.pickup_landmark ? 'border-destructive' : 'border-input'
              )}
            />
          </div>
          {errors.pickup_landmark && (
            <p className="text-sm text-destructive">{errors.pickup_landmark.message}</p>
          )}
        </motion.div>
      )}

      {/* Delivery Options */}
      {allowDelivery && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3"
        >
          <label className="block text-sm font-medium text-foreground">
            Delivery Fee
          </label>
          <Controller
            name="delivery_fee_type"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: DeliveryType.FREE, label: 'Free', desc: 'No charge' },
                  { value: DeliveryType.FIXED, label: 'Fixed', desc: 'Set amount' },
                  { value: DeliveryType.CALCULATED, label: 'Variable', desc: 'By distance' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => field.onChange(opt.value)}
                    className={cn(
                      'p-3 rounded-xl border text-center transition-all touch-target',
                      field.value === opt.value
                        ? 'border-role-seller bg-role-seller/10'
                        : 'border-border hover:border-role-seller/50 active:bg-muted'
                    )}
                  >
                    <p className={cn(
                      'text-sm font-medium',
                      field.value === opt.value ? 'text-role-seller' : 'text-foreground'
                    )}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </button>
                ))}
              </div>
            )}
          />

          {deliveryFeeType === DeliveryType.FIXED && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <label className="block text-sm font-medium text-foreground">
                Delivery Fee (₦)
              </label>
              <input
                {...register('base_delivery_fee', { valueAsNumber: true })}
                type="number"
                min={0}
                step={100}
                placeholder="e.g., 1000"
                className={cn(
                  'w-full px-4 py-3 md:py-2.5 rounded-xl border bg-background text-base md:text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-role-seller/30 focus:border-role-seller',
                  'transition-colors touch-target',
                  'border-input'
                )}
              />
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Submit Button with Safe Area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="pt-4 pb-[env(safe-area-inset-bottom)] flex gap-3"
      >
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 py-4 md:py-3 rounded-xl font-semibold border border-border hover:bg-muted active:bg-muted/80 transition-colors touch-target disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!isValid || isSubmitting || (!allowPickup && !allowDelivery)}
          className={cn(
            'flex-1 py-4 md:py-3 rounded-xl font-semibold text-base transition-all touch-target flex items-center justify-center gap-2',
            isValid && (allowPickup || allowDelivery) && !isSubmitting
              ? 'bg-role-seller text-white hover:bg-role-seller/90 active:bg-role-seller/80'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
        >
          {isSubmitting ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Publishing...
            </>
          ) : (
            'Publish Listing'
          )}
        </button>
      </motion.div>
    </form>
  );
}
