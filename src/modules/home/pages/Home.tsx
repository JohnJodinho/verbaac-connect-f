import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AnimatedButton, PageWrapper, StaggeredContainer } from '../../../components/animated';
import { cardVariants } from '../../../lib/animations';

export default function Home() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: 'spring',
                stiffness: 100,
                damping: 15,
                delay: 0.2 
              }}
            >
              Your University Life, 
              <motion.span 
                className="text-yellow-400"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                  delay: 0.6 
                }}
              >
                {' '}Simplified
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: 'spring',
                stiffness: 100,
                damping: 15,
                delay: 0.4 
              }}
            >
              Find housing, connect with roommates, buy and sell items, and create secure rental agreements - all in one platform designed for Nigerian students.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: 'spring',
                stiffness: 100,
                damping: 15,
                delay: 0.8 
              }}
            >
              <AnimatedButton
                variant="primary"
                size="lg"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)',
                  backgroundColor: '#1d4ed8'
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/auth/register')}
              >
                Get Started
              </AnimatedButton>
              
              <AnimatedButton
                variant="secondary"
                size="lg"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: 'white',
                  color: '#2563eb'
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/marketplace')}
              >
                Learn More
              </AnimatedButton>
            </motion.div>
          </div>
        </div>
        
        {/* Floating Background Elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-yellow-400/20 rounded-full"
          animate={{
            y: [0, 20, 0],
            x: [0, -10, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              type: 'spring',
              stiffness: 100,
              damping: 15 
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for University Life
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From finding the perfect accommodation to connecting with like-minded roommates, we've got you covered.
            </p>
          </motion.div>

          <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Student Housing',
                description: 'Find verified off-campus accommodation with detailed listings and reviews.',
                icon: '🏠',
                route: '/housing'
              },
              {
                title: 'Roommate Matching',
                description: 'Connect with compatible roommates based on lifestyle preferences.',
                icon: '👥',
                route: '/roommates'
              },
              {
                title: 'Marketplace',
                description: 'Buy and sell second-hand items with secure escrow payments.',
                icon: '🛍️',
                route: '/marketplace'
              },
              {
                title: 'Digital Agreements',
                description: 'Create and sign rental agreements with built-in escrow protection.',
                icon: '📄',
                route: '/agreements'
              }
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow bg-white border border-gray-100 cursor-pointer"
                variants={cardVariants}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}
                transition={{ 
                  type: 'spring',
                  stiffness: 300,
                  damping: 20 
                }}
                onClick={() => navigate(feature.route)}
              >
                <motion.div 
                  className="text-4xl mb-4"
                  whileHover={{ 
                    scale: 1.2,
                    rotate: 5 
                  }}
                  transition={{ 
                    type: 'spring',
                    stiffness: 400,
                    damping: 10 
                  }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </StaggeredContainer>
        </div>
      </section>
    </PageWrapper>
  );
}
