import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
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

    // Simulate API login
    setTimeout(() => {
        // Mock successful login for any input for now
        if (data.email) {
            const mockUser = {
                id: 'mock-user-id',
                email: data.email,
                firstName: 'Test',
                lastName: 'User',
                phoneNumber: '+2348000000000',
                gender: 'male' as const, 
                dateOfBirth: '2000-01-01',
                activeRole: 'consumer' as const,
                role: 'consumer' as const,
                isVerified: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                // Add new optional profile fields if necessary for mocking
            };
            
            login(mockUser, 'mock-jwt-token-xyz');
            console.log("Navigating to dashboard...")
            navigate('/dashboard');
        } else {
            setError('Invalid credentials');
        }
        setIsSubmitting(false);
    }, 1200);
  };

  const inputClasses = "w-full pl-10 rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary transition-all duration-200";

  return (
    <AnimatedCard className="bg-card w-full shadow-xl shadow-black/5 rounded-2xl border border-border overflow-hidden">
      <div className="p-8">
        
        <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
            <p className="text-sm text-muted-foreground mt-2">
                Welcome back to Verbaac Connect
            </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
           
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
                   <Link to="/forgot-password" className="text-xs text-primary font-medium hover:underline">Forgot password?</Link>
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

           <AnimatedButton type="submit" variant="primary" size="lg" className="w-full justify-center text-lg mt-2" disabled={isSubmitting}>
               {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : (
                   <span className="flex items-center">
                       Sign In <ArrowRight className="ml-2 w-4 h-4" />
                   </span>
               )}
           </AnimatedButton>
        </form>
      </div>

      <div className="bg-muted/30 p-4 text-center border-t border-border">
          <span className="text-sm text-muted-foreground">Don't have an account? </span>
          <Link to="/register" className="text-sm font-semibold text-primary hover:underline underline-offset-4">
              Create an account
          </Link>
      </div>
    </AnimatedCard>
  );
}
