import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AnimatedButton, PageWrapper, StaggeredContainer, AnimatedCard } from '@/components/animated';
import { Home as HomeIcon, ShoppingBag, ShieldCheck, Users } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      {/* Hero Section - Responsive padding and typography */}
      <section className="bg-[linear-gradient(135deg,var(--primary)_0%,var(--secondary)_100%)] text-primary-foreground relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              className="text-3xl md:text-5xl lg:text-7xl font-extrabold mb-4 md:mb-6 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            >
              Your University Life,
              <br />
              <span className="text-white/90">Simplified.</span>
            </motion.h1>

            <motion.p
              className="text-base md:text-xl lg:text-2xl mb-6 md:mb-10 opacity-90 max-w-2xl mx-auto px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              The trusted platform for student housing, secure marketplace deals, and roommate connections in Jos.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <AnimatedButton
                variant="primary"
                size="lg"
                className="bg-black text-white hover:bg-white/90 active:bg-white/80 font-bold px-6 md:px-8 shadow-xl w-full sm:w-auto touch-target"
                onClick={() => navigate('/housing')}
              >
                <div className="flex items-center justify-center gap-2">
                  <HomeIcon className="w-5 h-5" />
                  Find Housing
                </div>
              </AnimatedButton>

              <AnimatedButton
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 active:bg-white/20 font-bold px-6 md:px-8 w-full sm:w-auto touch-target"
                onClick={() => navigate('/marketplace')}
              >
                 <div className="flex items-center justify-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Browse Market
                </div>
              </AnimatedButton>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dual Ecosystem Section - Mobile stack */}
      <section className="py-12 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Housing Section */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-16 items-center mb-12 md:mb-24">
            <div className="flex-1 space-y-4 md:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">
                <HomeIcon className="w-4 h-4" />
                Student Housing
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Discover Verified Lodges & Apartments
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                Say goodbye to scams. Every listing is verified by our student Ambassadors.
                View photos, 360° tours, and pay securely via escrow.
              </p>
              <AnimatedButton 
                variant="outline" 
                onClick={() => navigate('/housing')}
                className="touch-target"
              >
                Explore Properties
              </AnimatedButton>
            </div>
            <div className="flex-1 w-full bg-muted/50 rounded-2xl md:rounded-3xl p-4 md:p-8 border border-border">
              {/* Abstract placeholder */}
              <div className="bg-card rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 space-y-3 md:space-y-4">
                <div className="flex justify-between items-start">
                  <div className="h-10 w-10 md:h-12 md:w-12 bg-primary/20 rounded-lg"></div>
                  <div className="h-5 w-16 md:h-6 md:w-20 bg-muted rounded"></div>
                </div>
                <div className="h-3 md:h-4 w-3/4 bg-muted rounded"></div>
                <div className="h-3 md:h-4 w-1/2 bg-muted rounded"></div>
              </div>
              <div className="bg-card rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 space-y-4 mt-3 md:mt-4 translate-x-2 md:translate-x-4 opacity-80">
                <div className="h-3 md:h-4 w-full bg-muted rounded"></div>
              </div>
            </div>
          </div>

          {/* Marketplace Section */}
          <div className="flex flex-col lg:flex-row-reverse gap-6 lg:gap-16 items-center">
            <div className="flex-1 space-y-4 md:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-white font-medium text-sm">
                <ShoppingBag className="w-4 h-4" />
                Student Marketplace
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Buy & Sell with Confidence
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                Turn your used items into cash or find affordable deals on textbooks, gadgets, and furniture.
                Funds are held in escrow until you verify the item.
              </p>
              <AnimatedButton 
                variant="outline" 
                onClick={() => navigate('/marketplace')}
                className="touch-target"
              >
                Visit Marketplace
              </AnimatedButton>
            </div>
            <div className="flex-1 w-full bg-muted/50 rounded-2xl md:rounded-3xl p-4 md:p-8 border border-border">
              {/* Abstract placeholder - 2x2 grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="aspect-square bg-card rounded-lg md:rounded-xl shadow-sm"></div>
                <div className="aspect-square bg-card rounded-lg md:rounded-xl shadow-sm"></div>
                <div className="aspect-square bg-card rounded-lg md:rounded-xl shadow-sm"></div>
                <div className="aspect-square bg-card rounded-lg md:rounded-xl shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Features - Horizontal scroll on mobile */}
      <section className="py-12 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 md:mb-4">Why Students Trust Us</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">We've built safety into every step of the process.</p>
          </div>
          
          {/* Mobile: Horizontal scroll, Desktop: 3-col grid */}
          <div className="md:hidden">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-4 scroll-x">
              {[
                { icon: ShieldCheck, title: 'Secure Pay Escrow', desc: 'We hold your payment until you confirm the property or item is exactly as described.' },
                { icon: Users, title: 'Verified Identities', desc: 'Every landlord, agent, and seller verifies their identity before listing.' },
                { icon: HomeIcon, title: 'Ambassador Verified', desc: 'Our student ambassadors physically inspect properties to ensure photos match.' },
              ].map((feature) => (
                <div 
                  key={feature.title}
                  className="shrink-0 w-[280px] bg-card p-6 rounded-2xl border border-border"
                >
                  <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Desktop: Grid */}
          <StaggeredContainer className="hidden md:grid md:grid-cols-3 gap-8">
            <AnimatedCard className="bg-card p-8 rounded-2xl border border-border hover:shadow-lg active:shadow-md transition-all">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Pay Escrow</h3>
              <p className="text-muted-foreground">
                We hold your payment until you confirm the property or item is exactly as described.
              </p>
            </AnimatedCard>

            <AnimatedCard className="bg-card p-8 rounded-2xl border border-border hover:shadow-lg active:shadow-md transition-all">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Identities</h3>
              <p className="text-muted-foreground">
                Every landlord, agent, and seller verifies their identity before they can list on the platform.
              </p>
            </AnimatedCard>

            <AnimatedCard className="bg-card p-8 rounded-2xl border border-border hover:shadow-lg active:shadow-md transition-all">
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
      <section className="py-12 md:py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8">Ready to get started?</h2>
          <AnimatedButton 
            variant="primary" 
            size="lg" 
            className="px-8 md:px-12 w-full sm:w-auto touch-target"
            onClick={() => navigate('/register')}
          >
            Create Free Account
          </AnimatedButton>
        </div>
      </section>
    </PageWrapper>
  );
}