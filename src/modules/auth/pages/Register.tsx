import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Loader2, User,  GraduationCap, School, Hash, Layers, AlertCircle } from 'lucide-react';

import { useAuthStore } from '@/store/useAuthStore';
import { useRegistrationStore } from '@/modules/auth/store/useRegistrationStore';
import { step1Schema, step2Schema, type Step1Data, type Step2Data } from '@/modules/auth/schemas/registration';
import { authApi } from '@/modules/auth/api/auth.api';
import { AnimatedButton, AnimatedCard } from '@/components/animated';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { step, setStep, data: formData, updateData, reset } = useRegistrationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ error, setError] = useState<string | null>(null);

  // --- Step 1 Form ---
  const form1 = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      middleName: formData.middleName || '',
      email: formData.email || '',
      phoneNumber: formData.phoneNumber || '',
      password: formData.password || '',
      confirmPassword: formData.confirmPassword || '',
    },
    mode: 'onBlur',
  });

  // --- Step 2 Form ---
  const form2 = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      gender: formData.gender as 'male' | 'female' || undefined,
      dateOfBirth: formData.dateOfBirth || '',
      userName: formData.userName || '',
      isStudent: formData.isStudent || false,
      institution: formData.institution || '',
      matricNo: formData.matricNo || '',
      level: formData.level || '',
    },
    mode: 'onChange',
  });
  
  const isStudent = form2.watch('isStudent');

  // --- Handlers ---
  const onStep1Submit = (data: Step1Data) => {
    updateData(data);
    setStep(2);
  };

  const onStep2Submit = async (data: Step2Data) => {
    setIsSubmitting(true);
    setError(null);
    updateData(data);
    
    try {
        // Combine stored step 1 data with current step 2 data
        // Log full request payload
        console.log('Full Request Payload:', { ...formData, ...data });
        const fullData = { ...formData, ...data } as import('../api/auth.api').RegistrationData;
        
        const response = await authApi.registerConsumer(fullData);
        
        if (response.data.success && response.data.data) {
             const { user, token } = response.data.data;
             login(user, token);
             reset(); // Clear wizard state
             navigate('/dashboard');
        } else {
             setError(response.data.message || 'Registration failed');
        }
    } catch (err) {
        console.error('Registration Error:', err);
        const error = err as import('axios').AxiosError<{ message: string }>;
        setError(error.response?.data?.message || ' an error occurred during registration.');
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- UI Helpers ---
  const InputGroup = ({ label, error, children, icon: Icon }: { label: string, error?: string, children: React.ReactNode, icon?: React.ElementType }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
            {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground" />}
            {label}
        </label>
        <div className="relative group">
            {children}
            {error && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                </div>
            )}
        </div>
        {error && <p className="text-[0.8rem] font-medium text-destructive">{error}</p>}
    </div>
  );

  const inputClasses = "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary transition-all duration-200";

  return (
      <AnimatedCard className="bg-card w-full shadow-xl shadow-black/5 rounded-2xl border border-border overflow-hidden">
        
        {/* Step Indicator Header */}
        <div className="bg-muted/30 p-6 border-b border-border">
             <div className="flex items-center justify-between mb-4">
                 <h2 className="text-xl font-bold tracking-tight">Create Account</h2>
                 <span className="text-sm font-medium text-muted-foreground">Step {step} of 2</span>
             </div>
             {/* Progress Bar */}
             <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: step === 1 ? "50%" : "100%" }}
                    className="h-full bg-primary rounded-full"
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                 />
             </div>
        </div>

        <div className="p-6 md:p-8">
           {error && (
             <motion.div 
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive"
             >
               <AlertCircle className="w-5 h-5 shrink-0" />
               <p className="text-sm font-medium">{error}</p>
             </motion.div>
           )}

           <AnimatePresence mode='wait'>
             
             {/* --- STEP 1 UI --- */}
             {step === 1 && (
                 <motion.form
                    key="step1"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="space-y-5"
                    onSubmit={form1.handleSubmit(onStep1Submit)}
                 >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputGroup label="First Name" error={form1.formState.errors.firstName?.message}>
                            <input {...form1.register('firstName')} className={inputClasses} placeholder="e.g. John" />
                        </InputGroup>
                        <InputGroup label="Middle Name (Optional)" error={form1.formState.errors.middleName?.message}>
                            <input {...form1.register('middleName')} className={inputClasses} placeholder="e.g. David" />
                        </InputGroup>
                        <InputGroup label="Last Name" error={form1.formState.errors.lastName?.message}>
                            <input {...form1.register('lastName')} className={inputClasses} placeholder="e.g. Doe" />
                        </InputGroup>
                    </div>

                    <InputGroup label="Email Address" error={form1.formState.errors.email?.message}>
                        <input type="email" {...form1.register('email')} className={inputClasses} placeholder="john@example.com" />
                    </InputGroup>

                    <InputGroup label="WhatsApp Number" error={form1.formState.errors.phoneNumber?.message}>
                         <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">🇳🇬</span>
                            <input type="tel" {...form1.register('phoneNumber')} className={`${inputClasses} pl-9`} placeholder="+234 80..." />
                         </div>
                    </InputGroup>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputGroup label="Password" error={form1.formState.errors.password?.message}>
                            <input type="password" {...form1.register('password')} className={inputClasses} placeholder="••••••••" />
                        </InputGroup>
                        <InputGroup label="Confirm" error={form1.formState.errors.confirmPassword?.message}>
                            <input type="password" {...form1.register('confirmPassword')} className={inputClasses} placeholder="••••••••" />
                        </InputGroup>
                    </div>

                    <AnimatedButton type="submit" variant="primary" size="lg" className="w-full justify-center mt-6">
                        Continue <ChevronRight className="ml-2 w-4 h-4" />
                    </AnimatedButton>
                 </motion.form>
             )}

             {/* --- STEP 2 UI --- */}
             {step === 2 && (
                 <motion.form
                    key="step2"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    className="space-y-6"
                    onSubmit={form2.handleSubmit(onStep2Submit)}
                 >
                    <div className="grid grid-cols-2 gap-4">
                         <InputGroup label="I Identify As" error={form2.formState.errors.gender?.message}>
                            <select {...form2.register('gender')} className={inputClasses}>
                                <option value="">Select...</option>
                                <option value="male">male</option>
                                <option value="female">female</option>
                            </select>
                         </InputGroup>
                         
                         <InputGroup label="Date of Birth" error={form2.formState.errors.dateOfBirth?.message}>
                            <input type="date" {...form2.register('dateOfBirth')} className={inputClasses} />
                         </InputGroup>
                    </div>

                    <InputGroup label="Username" icon={User} error={form2.formState.errors.userName?.message}>
                         <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                            <input {...form2.register('userName')} className={`${inputClasses} pl-7`} placeholder="student_dev" />
                         </div>
                    </InputGroup>

                    {/* Student Toggle Card */}
                    <div className={`rounded-xl border transition-all duration-300 ${isStudent ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-card hover:border-gray-300'}`}>
                         <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => form2.setValue('isStudent', !isStudent)}>
                             <div className="flex items-center gap-3">
                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isStudent ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                                     <GraduationCap className="w-5 h-5" />
                                 </div>
                                 <div className="select-none">
                                     <h3 className={`font-semibold text-sm ${isStudent ? 'text-primary' : 'text-foreground'}`}>Student Account</h3>
                                     <p className="text-xs text-muted-foreground">Unlock roommate matching & campus housing</p>
                                 </div>
                             </div>
                             
                             {/* Custom Switch UI */}
                             <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${isStudent ? 'bg-primary' : 'bg-input'}`}>
                                 <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${isStudent ? 'translate-x-[20px]' : 'translate-x-0'}`} />
                             </div>
                             {/* Hidden real checkbox for form binding */}
                             <input type="checkbox" {...form2.register('isStudent')} className="hidden" />
                         </div>

                        {/* Expandable Student Fields */}
                        <AnimatePresence>
                            {isStudent && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-4 pt-0 space-y-4">
                                        <div className="h-px w-full bg-border/50 mb-4" />
                                        
                                        <InputGroup label="Institution" icon={School} error={form2.formState.errors.institution?.message}>
                                            <select {...form2.register('institution')} className={inputClasses}>
                                                <option value="">Select University...</option>
                                                <option value="UNIJOS">University of Jos</option>
                                                <option value="PLATEAU_STATE_POLY">Plateau State Polytechnic</option>
                                            </select>
                                        </InputGroup>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputGroup label="Matric No" icon={Hash} error={form2.formState.errors.matricNo?.message}>
                                                <input {...form2.register('matricNo')} className={inputClasses} placeholder="UJ/..." />
                                            </InputGroup>
                                            <InputGroup label="Level" icon={Layers} error={form2.formState.errors.level?.message}>
                                                <select {...form2.register('level')} className={inputClasses}>
                                                    <option value="">Year...</option>
                                                    <option value="100">100 Lvl</option>
                                                    <option value="200">200 Lvl</option>
                                                    <option value="300">300 Lvl</option>
                                                    <option value="400">400 Lvl</option>
                                                    <option value="500">500 Lvl</option>
                                                </select>
                                            </InputGroup>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <AnimatedButton type="button" variant="outline" size="lg" onClick={() => setStep(1)} className="flex-1 bg-background">
                            <ChevronLeft className="mr-2 w-4 h-4" /> Back
                        </AnimatedButton>
                        <AnimatedButton type="submit" variant="primary" size="lg" className="flex-[2]" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : `Complete Setup`}
                        </AnimatedButton>
                    </div>
                 </motion.form>
             )}

           </AnimatePresence>
        </div>

        {/* Footer Link */}
        <div className="bg-muted/30 p-4 text-center border-t border-border">
            <span className="text-sm text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-sm font-semibold text-primary hover:underline underline-offset-4">
                Sign in
            </Link>
        </div>
      </AnimatedCard>
  );
}
