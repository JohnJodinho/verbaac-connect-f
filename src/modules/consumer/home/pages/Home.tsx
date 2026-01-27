import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AnimatedButton, PageWrapper, StaggeredContainer, AnimatedCard } from '@/components/animated';
import { Home as HomeIcon, ShoppingBag, ShieldCheck, Users } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="bg-[linear-gradient(135deg,var(--primary)_0%,var(--secondary)_100%)] text-primary-foreground relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              className="text-4xl md:text-7xl font-extrabold mb-6 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            >
              Your University Life,
              <br />
              <span className="text-white/90">Simplified.</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl mb-10 opacity-90 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              The trusted platform for student housing, secure marketplace deals, and roommate connections in Jos.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <AnimatedButton
                variant="primary"
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-bold px-8 shadow-xl"
                onClick={() => navigate('/housing')}
              >
                <div className="flex items-center gap-2">
                  <HomeIcon className="w-5 h-5" />
                  Find Housing
                </div>
              </AnimatedButton>

              <AnimatedButton
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 font-bold px-8"
                onClick={() => navigate('/marketplace')}
              >
                 <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Browse Market
                </div>
              </AnimatedButton>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dual Ecosystem Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-center mb-24">
              <div className="flex-1 space-y-6">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">
                    <HomeIcon className="w-4 h-4" />
                    Student Housing
                 </div>
                 <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                    Discover Verified Lodges & Apartments
                 </h2>
                 <p className="text-lg text-muted-foreground leading-relaxed">
                    Say goodbye to scams and fake agents. 
                    Every listing on Verbaac Connect is verified by our student Ambassadors.
                    View photos, 360° tours, and pay securely via escrow.
                 </p>
                 <AnimatedButton variant="outline" onClick={() => navigate('/housing')}>
                    Explore Properties
                 </AnimatedButton>
              </div>
              <div className="flex-1 w-full bg-muted/50 rounded-3xl p-8 border border-border">
                  {/* Abstract placeholder for UI graphic */}
                  <div className="bg-card rounded-2xl shadow-lg p-6 space-y-4">
                      <div className="flex justify-between items-start">
                          <div className="h-12 w-12 bg-primary/20 rounded-lg"></div>
                          <div className="h-6 w-20 bg-muted rounded"></div>
                      </div>
                      <div className="h-4 w-3/4 bg-muted rounded"></div>
                      <div className="h-4 w-1/2 bg-muted rounded"></div>
                  </div>
                   <div className="bg-card rounded-2xl shadow-lg p-6 space-y-4 mt-4 translate-x-4 opacity-80">
                      <div className="h-4 w-full bg-muted rounded"></div>
                  </div>
              </div>
           </div>

           <div className="flex flex-col md:flex-row-reverse gap-8 lg:gap-16 items-center">
              <div className="flex-1 space-y-6">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-white font-medium text-sm">
                    <ShoppingBag className="w-4 h-4" />
                    Student Marketplace
                 </div>
                 <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                    Buy & Sell with Confidence
                 </h2>
                 <p className="text-lg text-muted-foreground leading-relaxed">
                    Turn your used items into cash or find affordable deals on textbooks, gadgets, and furniture.
                    Funds are held in escrow until you verify the item.
                 </p>
                 <AnimatedButton variant="outline" onClick={() => navigate('/marketplace')}>
                    Visit Marketplace
                 </AnimatedButton>
              </div>
              <div className="flex-1 w-full bg-muted/50 rounded-3xl p-8 border border-border">
                   {/* Abstract placeholder for UI graphic */}
                   <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-square bg-card rounded-xl shadow-sm"></div>
                        <div className="aspect-square bg-card rounded-xl shadow-sm"></div>
                        <div className="aspect-square bg-card rounded-xl shadow-sm"></div>
                        <div className="aspect-square bg-card rounded-xl shadow-sm"></div>
                   </div>
              </div>
           </div>
        </div>
      </section>

      {/* Trust & Safety Features */}
       <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                 <h2 className="text-3xl font-bold text-foreground mb-4">Why Students Trust Us</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">We've built safety into every step of the process.</p>
            </div>
            
            <StaggeredContainer className="grid md:grid-cols-3 gap-8">
                <AnimatedCard className="bg-card p-8 rounded-2xl border border-border hover:shadow-lg transition-all">
                    <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Secure Pay Escrow</h3>
                    <p className="text-muted-foreground">
                        We hold your payment until you confirm the property or item is exactly as described.
                    </p>
                </AnimatedCard>

                <AnimatedCard className="bg-card p-8 rounded-2xl border border-border hover:shadow-lg transition-all">
                    <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                        <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Verified Identities</h3>
                    <p className="text-muted-foreground">
                        Every landlord, agent, and seller verifies their identity before they can list on the platform.
                    </p>
                </AnimatedCard>

                <AnimatedCard className="bg-card p-8 rounded-2xl border border-border hover:shadow-lg transition-all">
                     <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                        <HomeIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Ambassador Verified</h3>
                    <p className="text-muted-foreground">
                        Our student ambassadors physically inspect properties to ensure photos match reality.
                    </p>
                </AnimatedCard>
            </StaggeredContainer>
        </div>
       </section>

       {/* Final CTA */}
       <section className="py-24">
           <div className="max-w-5xl mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to get started?</h2>
                <AnimatedButton 
                    variant="primary" 
                    size="lg" 
                    className="px-12"
                    onClick={() => navigate('/register')}
                >
                    Create Free Account
                </AnimatedButton>
           </div>
       </section>
    </PageWrapper>
  );
}