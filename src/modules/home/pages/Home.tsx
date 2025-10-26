import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AnimatedButton, PageWrapper, StaggeredContainer } from '../../../components/animated';
import { cardVariants } from '../../../lib/animations';

export default function Home() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      {/* Hero Section */}
      {/* MODIFICATION: Replaced blue gradient with theme's brand gradient and text-white with text-primary-foreground */}
      <section className="bg-[linear-gradient(135deg,var(--primary)_0%,var(--secondary)_100%)] text-primary-foreground overflow-hidden relative">
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
              {/* MODIFICATION: Removed text-yellow-400, inherits foreground color */}
              <motion.span
                className="text-primary-foreground"
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
              {/* MODIFICATION: Removed all hardcoded classNames, whileHover, and whileTap.
                  The 'AnimatedButton' component now handles all styling and animations via variants.
              */}
              <AnimatedButton
                variant="primary"
                size="lg"
                onClick={() => navigate('/auth/register')}
              >
                Get Started
              </AnimatedButton>

              {/* MODIFICATION: Changed to 'secondary' variant and removed all hardcoded styles. */}
              <AnimatedButton
                variant="secondary"
                size="lg"
                onClick={() => navigate('/marketplace')}
              >
                Learn More
              </AnimatedButton>
            </motion.div>
          </div>
        </div>

        {/* Floating Background Elements */}
        {/* MODIFICATION: Used theme-aware colors */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-primary-foreground/10 rounded-full"
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
          className="absolute top-40 right-20 w-16 h-16 bg-secondary/20 rounded-full"
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
      {/* MODIFICATION: Replaced bg-white with bg-background */}
      <section className="py-24 bg-background">
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
            {/* MODIFICATION: Replaced text-gray-900 with text-foreground */}
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need for University Life
            </h2>
            {/* MODIFICATION: Replaced text-gray-600 with text-muted-foreground */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
                /* MODIFICATION: 
                   - Replaced bg-white with bg-card
                   - Replaced border-gray-100 with border-border
                   - Added shadow-sm for default state
                   - Added themed hover shadow: hover:shadow-xl hover:shadow-primary/20
                */
                className="text-center p-6 rounded-lg transition-shadow bg-card border border-border cursor-pointer shadow-sm hover:shadow-xl hover:shadow-primary/20"
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  // MODIFICATION: Removed hardcoded boxShadow, now handled by Tailwind classes
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
                {/* MODIFICATION: Replaced text-gray-900 with text-foreground */}
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                {/* MODIFICATION: Replaced text-gray-600 with text-muted-foreground */}
                <p className="text-muted-foreground">
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