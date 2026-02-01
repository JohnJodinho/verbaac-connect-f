import { useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, ImagePlus, Check, Loader2 } from 'lucide-react';
import { step2Schema, type Step2Data, ItemCondition } from '../schemas/listing.schema';
import { useListingWizard } from '../stores/useListingWizard';
import { cn } from '@/lib/utils';

interface Step2MediaProps {
  onNext: () => void;
  onBack: () => void;
}

const CONDITION_OPTIONS = [
  { 
    value: ItemCondition.NEW, 
    label: 'Brand New', 
    description: 'Unopened, unused, original packaging',
    emoji: '✨'
  },
  { 
    value: ItemCondition.REFURBISHED, 
    label: 'Refurbished', 
    description: 'Restored to working condition',
    emoji: '🔧'
  },
  { 
    value: ItemCondition.USED, 
    label: 'Used', 
    description: 'Previously owned, functional',
    emoji: '📦'
  },
] as const;

export default function Step2Media({ onNext, onBack }: Step2MediaProps) {
  const { step2Data, updateStep2, addMediaUrl, removeMediaUrl, uploadingMedia, setUploadingMedia } = useListingWizard();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      media_urls: step2Data.media_urls || [],
      condition: step2Data.condition,
      quantity: step2Data.quantity || 1,
    },
    mode: 'onChange',
  });

  const mediaUrls = watch('media_urls');

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setUploadingMedia(true);
    
    // Mock upload - in production, upload to Cloudinary/S3
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      
      // Create local preview URL for demo
      const url = URL.createObjectURL(file);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const currentUrls = watch('media_urls') || [];
      if (currentUrls.length < 10) {
        setValue('media_urls', [...currentUrls, url]);
        addMediaUrl(url);
      }
    }
    
    setUploadingMedia(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemoveImage = (url: string) => {
    const newUrls = (mediaUrls || []).filter(u => u !== url);
    setValue('media_urls', newUrls);
    removeMediaUrl(url);
  };

  const onSubmit = (data: Step2Data) => {
    updateStep2(data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Photo Upload */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-foreground">
            Photos <span className="text-destructive">*</span>
          </label>
          <span className={cn(
            'text-xs',
            (mediaUrls?.length || 0) >= 3 ? 'text-emerald-600' : 'text-muted-foreground'
          )}>
            {mediaUrls?.length || 0} / 10 (min 3)
          </span>
        </div>

        {/* Drop zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'relative border-2 border-dashed rounded-xl p-6 md:p-8 text-center cursor-pointer transition-all',
            'hover:border-role-seller/50 active:bg-role-seller/5',
            dragActive ? 'border-role-seller bg-role-seller/5' : 'border-border',
            errors.media_urls && 'border-destructive'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
          
          {uploadingMedia ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-role-seller animate-spin" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-role-seller/10 flex items-center justify-center">
                <ImagePlus className="w-6 h-6 text-role-seller" />
              </div>
              <div>
                <p className="font-medium text-foreground">Add photos</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Tap to select or drag and drop
                </p>
              </div>
            </div>
          )}
        </div>

        {errors.media_urls && (
          <p className="text-sm text-destructive">{errors.media_urls.message}</p>
        )}

        {/* Photo previews */}
        {mediaUrls && mediaUrls.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            <AnimatePresence>
              {mediaUrls.map((url, index) => (
                <motion.div
                  key={url}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative aspect-square rounded-lg overflow-hidden bg-muted group"
                >
                  <img
                    src={url}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 0 && (
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-role-seller text-white text-[10px] font-medium rounded">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(url)}
                    className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity touch-target"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
              
              {/* Add more button */}
              {mediaUrls.length < 10 && (
                <motion.button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-role-seller/50 active:bg-muted transition-all touch-target"
                >
                  <Plus className="w-6 h-6 text-muted-foreground" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Condition */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <label className="block text-sm font-medium text-foreground">
          Item Condition <span className="text-destructive">*</span>
        </label>
        <Controller
          name="condition"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {CONDITION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => field.onChange(opt.value)}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-xl border transition-all touch-target',
                    field.value === opt.value
                      ? 'border-role-seller bg-role-seller/10'
                      : 'border-border hover:border-role-seller/50 active:bg-muted'
                  )}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <div className="text-left flex-1">
                    <p className={cn(
                      'font-medium',
                      field.value === opt.value ? 'text-role-seller' : 'text-foreground'
                    )}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{opt.description}</p>
                  </div>
                  {field.value === opt.value && (
                    <Check className="w-5 h-5 text-role-seller shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        />
        {errors.condition && (
          <p className="text-sm text-destructive">{errors.condition.message}</p>
        )}
      </motion.div>

      {/* Quantity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-2"
      >
        <label className="block text-sm font-medium text-foreground">
          Quantity Available
        </label>
        <Controller
          name="quantity"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => field.onChange(Math.max(1, field.value - 1))}
                className="w-12 h-12 rounded-xl border border-border flex items-center justify-center text-lg font-medium hover:bg-muted active:bg-muted/80 transition-colors touch-target"
              >
                −
              </button>
              <span className="text-2xl font-bold text-foreground min-w-12 text-center">
                {field.value}
              </span>
              <button
                type="button"
                onClick={() => field.onChange(Math.min(99, field.value + 1))}
                className="w-12 h-12 rounded-xl border border-border flex items-center justify-center text-lg font-medium hover:bg-muted active:bg-muted/80 transition-colors touch-target"
              >
                +
              </button>
            </div>
          )}
        />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="pt-4 flex gap-3"
      >
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-4 md:py-3 rounded-xl font-semibold border border-border hover:bg-muted active:bg-muted/80 transition-colors touch-target"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className={cn(
            'flex-1 py-4 md:py-3 rounded-xl font-semibold text-base transition-all touch-target',
            isValid
              ? 'bg-role-seller text-white hover:bg-role-seller/90 active:bg-role-seller/80'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
        >
          Continue
        </button>
      </motion.div>
    </form>
  );
}
