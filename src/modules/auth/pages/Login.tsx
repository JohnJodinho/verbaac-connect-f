import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { consumerService } from '@/modules/consumer/api/consumer.service';
import { Loader2, ArrowRight, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAuthStore } from '@/store/useAuthStore';
import { AnimatedButton, AnimatedCard } from '@/components/animated';

interface LoginData {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>();

  const onSubmit = async (data: LoginData) => {
    setIsSubmitting(true);
    setError('');

    // Use ConsumerService for login
    try {
      const response = await consumerService.signIn(data);
      
      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        navigate('/dashboard');
      } else {
        setError(response.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError('An error occurred during sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mobile-first input classes with larger touch targets
  const inputClasses = "w-full pl-10 rounded-lg border border-input bg-background px-3 py-3 md:py-2.5 text-base md:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary transition-all duration-200";

  return (
    <AnimatedCard className="bg-card w-full shadow-xl shadow-black/5 rounded-2xl border border-border overflow-hidden">
      {/* Form Area - Responsive padding */}
      <div className="p-5 md:p-8">
        
        <div className="mb-5 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1.5 md:mt-2">
            Welcome back to Verbaac Connect
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-5">
           
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg font-medium"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground/80">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="email" 
                {...register('email', { required: "Email is required" })} 
                className={inputClasses} 
                placeholder="name@example.com" 
              />
            </div>
            {errors.email && <p className="text-[0.8rem] font-medium text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-foreground/80">Password</label>
              <Link 
                to="/forgot-password" 
                className="text-xs text-primary font-medium hover:underline active:text-primary/80 touch-target py-1"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="password" 
                {...register('password', { required: "Password is required" })} 
                className={inputClasses} 
                placeholder="••••••••" 
              />
            </div>
            {errors.password && <p className="text-[0.8rem] font-medium text-destructive">{errors.password.message}</p>}
          </div>

          {/* Full-width button with larger touch target */}
          <AnimatedButton 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="w-full justify-center text-base md:text-lg mt-2 py-3.5 md:py-3 touch-target" 
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : (
              <span className="flex items-center">
                Sign In <ArrowRight className="ml-2 w-4 h-4" />
              </span>
            )}
          </AnimatedButton>
        </form>
      </div>

      {/* Footer - Register link */}
      <div className="bg-muted/30 p-4 text-center border-t border-border">
        <span className="text-sm text-muted-foreground">Don't have an account? </span>
        <Link 
          to="/register" 
          className="text-sm font-semibold text-primary hover:underline active:text-primary/80 underline-offset-4"
        >
          Create an account
        </Link>
      </div>
    </AnimatedCard>
  );
}
