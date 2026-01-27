import { useNavigate } from 'react-router-dom';
import { PageWrapper, AnimatedButton, AnimatedCard } from '@/components/animated';
import { FileText, Shield, PenTool, CheckCircle } from 'lucide-react';

export default function AgreementsTeaser() {
  const navigate = useNavigate();

  return (
    <PageWrapper className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl mx-auto w-full space-y-8 text-center">
        
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
            <FileText className="w-10 h-10" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Secure Digital Contracts
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Protect your tenancy and payments with legally binding, digital agreements signed directly on Verbaac.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6 pt-8 text-left">
          <AnimatedCard className="p-6 bg-card border border-border hover:border-primary/50 transition-colors">
            <Shield className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fraud Protection</h3>
            <p className="text-muted-foreground">Every agreement is backed by our escrow system. Funds are only released when you confirm your move-in.</p>
          </AnimatedCard>

          <AnimatedCard className="p-6 bg-card border border-border hover:border-primary/50 transition-colors">
            <PenTool className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Digital Signing</h3>
            <p className="text-muted-foreground">Sign from your phone. No printing, no paperwork, no lost files.</p>
          </AnimatedCard>

          <AnimatedCard className="p-6 bg-card border border-border hover:border-primary/50 transition-colors">
            <CheckCircle className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Verified Landlords</h3>
            <p className="text-muted-foreground">Contracts are generated only by verified landlords and agents.</p>
          </AnimatedCard>
        </div>

        {/* Call to Action */}
        <div className="pt-12 pb-8">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-foreground mb-4">Ready to secure your stay?</h2>
                <p className="text-muted-foreground mb-6">Create your student account to access the Agreements Portal and start signing.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <AnimatedButton 
                        size="lg" 
                        variant="primary" 
                        onClick={() => navigate('/register')}
                        className="w-full sm:w-auto px-8"
                    >
                        Get Started
                    </AnimatedButton>
                    <AnimatedButton 
                        size="lg" 
                        variant="outline" 
                        onClick={() => navigate('/housing')}
                        className="w-full sm:w-auto px-8"
                    >
                        Browse Housing First
                    </AnimatedButton>
                </div>
            </div>
        </div>

      </div>
    </PageWrapper>
  );
}
