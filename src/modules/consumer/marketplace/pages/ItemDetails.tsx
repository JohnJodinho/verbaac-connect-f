import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ChevronLeft, Share2, Heart, Flag, ShieldCheck, MapPin, 
    MessageCircle, Check, Lock, Star, CheckCircle 
} from 'lucide-react';
import { PageWrapper, AnimatedButton } from '@/components/animated';
import { GuestLock } from '@/components/shared/GuestLock';
import { marketItems } from '@/data/mock-marketplace';


export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [hasPaidIntoEscrow, setHasPaidIntoEscrow] = useState(false); // Simulate escrow state
  
  const item = marketItems.find(i => i.id === id);

  if (!item) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
              <AnimatedButton variant="primary" onClick={() => navigate('/marketplace')}>
                  Back to Marketplace
              </AnimatedButton>
          </div>
      );
  }

  // --- Commission & Price Logic ---
  // const platformFee = item.price * 0.12; 
  // const feeDisplay = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(platformFee);
  
  const formattedPrice = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(item.price);

  // --- Handlers ---
  const handleSimulatePayment = () => {
      // In real app, this triggers payment modal
      alert("Opening Verbaac Secure Pay... (Simulated)");
      setTimeout(() => {
          setHasPaidIntoEscrow(true);
      }, 1500);
  };

  return (
    <PageWrapper className="min-h-screen bg-background pb-20">
      
      {/* 1. Nav/Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40 px-4 py-3 flex items-center justify-between shadow-sm">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-2">
              <button className="p-2 hover:bg-muted rounded-full">
                  <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-muted rounded-full">
                  <Heart className="w-5 h-5 text-muted-foreground hover:text-red-500" />
              </button>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              
              {/* 2. Media Gallery */}
              <div className="space-y-4">
                  <motion.div 
                    layoutId={`image-${item.id}`}
                    className="relative aspect-square md:aspect-4/3 bg-muted rounded-2xl overflow-hidden border border-border"
                  >
                      <img 
                        src={item.images[selectedImage]} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 text-sm font-bold rounded-full shadow-sm bg-white/90 text-foreground`}>
                              {item.condition}
                          </span>
                      </div>
                  </motion.div>
                  
                  {/* Thumbnails */}
                  {(item.images.length > 1) && (
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                          {item.images.map((img, idx) => (
                              <button
                                key={idx}
                                onClick={() => setSelectedImage(idx)}
                                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                                    selectedImage === idx ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
                                }`}
                              >
                                  <img src={img} alt="" className="w-full h-full object-cover" />
                              </button>
                          ))}
                      </div>
                  )}
              </div>

              {/* 3. Product Info & Actions */}
              <div className="space-y-6">
                  <div>
                      <div className="flex items-start justify-between">
                          <div>
                              <div className="text-sm text-primary font-medium mb-1">{item.category}</div>
                              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{item.title}</h1>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>Posted in {item.university}</span>
                                  <span>•</span>
                                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-xl border border-border flex items-baseline justify-between">
                       <div>
                           <div className="text-3xl font-bold text-primary">{formattedPrice}</div>
                           <div className="text-xs text-muted-foreground mt-1">Includes Verbaac Protection Fee</div>
                       </div>
                       {!item.isAvailable && (
                           <div className="px-3 py-1 bg-destructive/10 text-destructive text-sm font-bold rounded-full">
                               Sold
                           </div>
                       )}
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                      <h3 className="font-semibold text-lg">Description</h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {item.description}
                      </p>
                  </div>

                  {/* Seller Profile */}
                  <div className="p-4 bg-card border border-border rounded-xl">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">Sold By</h3>
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                              {item.seller.firstName[0]}
                          </div>
                          <div className="flex-1">
                              <div className="flex items-center gap-2">
                                  <span className="font-bold">{item.seller.firstName} {item.seller.lastName}</span>
                                  {item.seller.isVerified && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                              </div>
                              <div className="text-sm text-muted-foreground">Joined {new Date(item.seller.createdAt).getFullYear()}</div>
                          </div>
                          <div>
                               <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-600 px-2 py-1 rounded text-sm font-medium">
                                   <Star className="w-3.5 h-3.5 fill-current" />
                                   4.8
                               </div>
                          </div>
                      </div>
                  </div>

                  {/* ESCROW GATE / Location Reveal */}
                  <div className="space-y-4 pt-4 border-t border-border">
                       <h3 className="font-semibold text-lg flex items-center gap-2">
                           <MapPin className="w-5 h-5 text-primary" />
                           Pickup Location
                       </h3>
                       
                       { hasPaidIntoEscrow ? (
                           <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg"
                           >
                               <div className="flex items-start gap-3">
                                   <div className="p-2 bg-emerald-100 rounded-full">
                                       <Check className="w-4 h-4 text-emerald-700" />
                                   </div>
                                    <div>
                                        <h4 className="font-bold text-emerald-900">Payment Secured!</h4>
                                        <p className="text-emerald-800 text-sm mt-1">
                                            Meet at: <strong>University Main Gate, Security Post 2</strong>
                                        </p>
                                        <div className="mt-3">
                                            <AnimatedButton size="sm" variant="outline" className="border-emerald-300 text-emerald-900 hover:bg-emerald-100 w-full">
                                                <MessageCircle className="w-4 h-4 mr-2" />
                                                Chat with {item.seller.firstName}
                                            </AnimatedButton>
                                        </div>
                                    </div>
                               </div>
                           </motion.div>
                       ) : (
                           <div className="bg-muted p-4 rounded-lg border border-border text-center relative overflow-hidden group">
                                <MapPin className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                                <p className="text-muted-foreground font-medium blur-[2px]">
                                    University Main Gate, Security Post 2
                                </p>
                                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                                    <div className="bg-card shadow-sm border border-border px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                                        <Lock className="w-3 h-3" />
                                        Hidden until payment
                                    </div>
                                </div>
                           </div>
                       )}
                  </div>

                  {/* Trust Badge */}
                  <div className="flex items-center gap-3 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
                      <ShieldCheck className="w-5 h-5 shrink-0" />
                      <div>
                          <span className="font-bold">Verbaac Money Back Guarantee.</span>
                          <span className="opacity-80 ml-1">Your funds are held in escrow until you verify the item in person.</span>
                      </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2">
                      <GuestLock fallbackText="Sign in to Buy" blur={true}>
                           {!hasPaidIntoEscrow ? (
                                <AnimatedButton 
                                    size="lg" 
                                    variant="primary" 
                                    className="w-full text-lg shadow-xl shadow-primary/20"
                                    onClick={handleSimulatePayment}
                                >
                                    Buy Now Securely
                                </AnimatedButton>
                           ) : (
                                <AnimatedButton 
                                    size="lg" 
                                    variant="secondary" 
                                    className="w-full"
                                    disabled
                                >
                                    Payment in Escrow
                                </AnimatedButton>
                           )}
                      </GuestLock>
                      
                      <div className="flex gap-4 mt-4 justify-center">
                           <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                               <Flag className="w-3 h-3" /> Report Item
                           </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </PageWrapper>
  );
}
