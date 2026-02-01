import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      
      {/* Background Decor - Responsive gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Smaller on mobile, original size on desktop */}
        <div className="absolute top-[-10%] left-[-20%] md:top-[-20%] md:left-[-10%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-primary/5 blur-[80px] md:blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-20%] md:bottom-[-20%] md:right-[-10%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-secondary/5 blur-[80px] md:blur-[100px]" />
      </div>

      <div className="w-full max-w-md z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-6 md:mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            {/* Logo Icon */}
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 group-active:scale-95 transition-transform duration-300">
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
              <span className="text-xl font-bold tracking-tight text-foreground">Verbacc</span>
              <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase text-[10px]">Connect</span>
            </div>
          </Link>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Welcome Back</h2>
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

        {/* Footer Links - Larger touch targets */}
        <div className="mt-6 md:mt-8 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-1 md:gap-2 flex-wrap">
            <Link 
              to="/terms" 
              className="px-2 py-1 hover:text-primary active:text-primary/80 transition-colors touch-target rounded-md"
            >
              Terms
            </Link>
            <span className="text-muted-foreground/50">•</span>
            <Link 
              to="/privacy" 
              className="px-2 py-1 hover:text-primary active:text-primary/80 transition-colors touch-target rounded-md"
            >
              Privacy
            </Link>
            <span className="text-muted-foreground/50">•</span>
            <Link 
              to="/help" 
              className="px-2 py-1 hover:text-primary active:text-primary/80 transition-colors touch-target rounded-md"
            >
              Help
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
