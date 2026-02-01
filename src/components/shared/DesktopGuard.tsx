import { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';

export default function DesktopGuard({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    // Initial check
    checkScreen();
    
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  if (!isDesktop) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8 text-center text-zinc-100">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
          <ShieldAlert className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
        <p className="text-zinc-400 max-w-md">
          Administrative Terminal: Desktop Environment Required (1024px+). 
          Please access this portal from a secure workstation.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
