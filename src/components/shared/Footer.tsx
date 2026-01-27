import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <motion.footer 
      className="bg-gray-50 border-t border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        type: 'spring',
        stiffness: 100,
        damping: 15 
      }}
    >
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            type: 'spring',
            stiffness: 100,
            damping: 15,
            staggerChildren: 0.1 
          }}
        >
          {/* Company Info */}
          <motion.div 
            className="col-span-1 md:col-span-2"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <div className="hidden sm:flex items-baseline text-2xl">
                <span className="font-bold text-primary">verbacc</span>
                <span className="font-medium opacity-90 ml-1">connect</span>
              </div>
            </motion.div>
            <p className="mt-4 text-gray-600 max-w-md">
              Connecting Nigerian students with housing, roommates, and marketplace opportunities. 
              Building communities, one connection at a time.
            </p>
          </motion.div>

          {/* Product Links */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Product
            </h3>
            <ul className="mt-4 space-y-4">
              {[
                { to: "/housing", label: "Housing" },
                { to: "/marketplace", label: "Marketplace" },
                { to: "/roommates", label: "Roommates" },
                { to: "/agreements", label: "Agreements" }
              ].map((link) => (
                <motion.li 
                  key={link.to}
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Link 
                    to={link.to} 
                    className="text-base text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Support
            </h3>
            <ul className="mt-4 space-y-4">
              {[
                { to: "/about", label: "About" },
                { to: "/faq", label: "FAQ" },
                { to: "/terms", label: "Terms" },
                { to: "/privacy", label: "Privacy" }
              ].map((link) => (
                <motion.li 
                  key={link.to}
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Link 
                    to={link.to} 
                    className="text-base text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-8 border-t border-gray-200 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-base text-gray-400 text-center">
            &copy; 2025 Verbaac Connect. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
