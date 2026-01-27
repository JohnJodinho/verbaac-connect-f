import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { AnimatedButton } from '../animated';
import { useAuthStore } from '@/store/useAuthStore';

interface GuestLockProps {
  children: React.ReactNode;
  fallbackText?: string;
  blur?: boolean;
  className?: string;
}

export function GuestLock({ 
  children, 
  fallbackText = "Sign in to view details", 
  blur = true,
  className = "" 
}: GuestLockProps) {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className={`relative overflow-hidden group ${className}`}>
        {/* Blurred Content Placeholder */}
      <div className={`transition-all duration-300 ${blur ? 'blur-sm select-none opacity-50' : 'opacity-0'}`}>
        {children}
      </div>

      {/* Lock Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/10 backdrop-blur-[1px] z-10 p-4 text-center">
        <div className="bg-background/80 p-4 rounded-lg shadow-lg border border-border backdrop-blur-md flex flex-col items-center max-w-[90%]">
             <div className="p-2 bg-primary/10 rounded-full mb-2">
                <Lock className="w-5 h-5 text-primary" />
             </div>
             <p className="text-xs font-semibold text-foreground mb-3">{fallbackText}</p>
             <AnimatedButton 
                variant="primary" 
                size="sm" 
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    navigate('/register');
                }}
            >
                Sign Up
             </AnimatedButton>
        </div>
      </div>
    </div>
  );
}
