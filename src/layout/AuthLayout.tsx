import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decor - Subtle Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/5 blur-[100px]" />
      </div>

      <div className="w-full max-w-md z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
                {/* Logo Icon */}
                <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-6 h-6"
                    >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                </div>
                <div className="flex flex-col items-start -space-y-1">
                    <span className="text-xl font-bold tracking-tight text-foreground">Verbaac</span>
                    <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase text-[10px]">Connect</span>
                </div>
            </Link>
            <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
        </div>

        {/* Card Content (Offset by page routing) */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4 }}
           className="w-full"
        >
            <Outlet />
        </motion.div>

        {/* Footer Links */}
        <div className="mt-8 text-center text-sm text-muted-foreground space-x-4">
             <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
             <span>•</span>
             <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
             <span>•</span>
             <Link to="/help" className="hover:text-primary transition-colors">Help</Link>
        </div>
      </div>
    </div>
  );
}
