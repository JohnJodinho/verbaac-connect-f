import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2, AlertTriangle } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { useAuthStore } from '@/store/useAuthStore';
import DesktopGuard from '@/components/shared/DesktopGuard';

export default function Admin2FAGate() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const navigate = useNavigate();
  const { setActiveRole, unlockRole } = useAuthStore();

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Allow only last entered char
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto Advance
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Trigger verify if full
    if (index === 5 && value) {
       // Combine properly including the just entered value
       const finalCode = newOtp.join("");
       handleVerify(finalCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (code: string) => {
    if (code.length !== 6) return;
    
    setIsLoading(true);
    setError('');

    try {
      const result = await adminService.loginWith2FA(code);
      if (result.success && result.profile) {
        unlockRole('admin'); // Critical: Unlock the role first!
        setActiveRole('admin'); 
        navigate('/dashboard/admin');
      } else {
        setError('Invalid authentication code.');
        setIsLoading(false);
        setOtp(new Array(6).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError('System authentication error.');
      setIsLoading(false);
    }
  };

  // Auto focus first input
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);


  return (
    <DesktopGuard>
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
           {/* Logo / Header */}
           <div className="text-center mb-10">
              <div className="w-20 h-20 bg-red-500/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-2xl shadow-red-900/20">
                 <ShieldCheck className="w-10 h-10 text-red-500" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight mb-2">Command Center</h1>
              <p className="text-zinc-500 text-sm font-medium tracking-wide uppercase">Restricted Access • Superadmin Tier</p>
           </div>
  
           {/* 2FA Card */}
           <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-8 shadow-2xl">
              <div className="space-y-8">
                 <div className="text-center">
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
                      Security Code (Time-Base OTP)
                    </label>
                    <div className="flex gap-3 justify-center">
                       {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-12 h-16 bg-zinc-950 border border-zinc-800 rounded-xl text-2xl font-mono text-center text-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all caret-red-500"
                            disabled={isLoading}
                          />
                       ))}
                    </div>
                 </div>
  
                 {error && (
                   <div className="flex items-center justify-center gap-2 text-red-400 text-xs bg-red-500/10 p-4 rounded-xl border border-red-500/20 animate-in fade-in slide-in-from-top-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      {error}
                   </div>
                 )}
  
                 {isLoading && (
                    <div className="flex justify-center text-red-500 animate-pulse">
                       <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                 )}
              </div>
  
              <div className="mt-8 pt-6 border-t border-zinc-800/50 text-center">
                 <p className="text-[10px] text-zinc-600 font-mono">
                    SESSION ID: ADM-{new Date().getFullYear()}-{Math.floor(Math.random() * 1000)} • SECURE CONNECTION
                 </p>
              </div>
           </div>
        </div>
      </div>
    </DesktopGuard>
  );
}
