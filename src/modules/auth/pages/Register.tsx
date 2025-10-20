import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AnimatedButton, 
  PageWrapper, 
  StaggeredContainer, 
  AnimatedItem 
} from '../../../components/animated';
import { fieldVariants } from '../../../lib/animations';
import { useAuth } from '../../../hooks/useAuth';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    studentId: '',
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    try {
      const registerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        university: formData.university,
        studentId: formData.studentId,
      };
      
      await register(registerData);
      navigate('/dashboard'); // Redirect to dashboard on successful registration
    } catch (error) {
      console.error('Registration failed:', error);
      // Error is already handled in the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in here
          </Link>
        </p>
      </motion.div>

      <StaggeredContainer className="mt-8" stagger={0.1}>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <AnimatedItem>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <motion.label 
                  htmlFor="firstName" 
                  className="block text-sm font-medium text-gray-700"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  First name
                </motion.label>
                <div className="mt-1">
                  <motion.input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    variants={fieldVariants}
                    initial="initial"
                    whileFocus="focus"
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                </div>
              </div>

              <div>
                <motion.label 
                  htmlFor="lastName" 
                  className="block text-sm font-medium text-gray-700"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  Last name
                </motion.label>
                <div className="mt-1">
                  <motion.input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    variants={fieldVariants}
                    initial="initial"
                    whileFocus="focus"
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                </div>
              </div>
            </div>
          </AnimatedItem>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              University email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@university.edu.ng"
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                University
              </label>
              <div className="mt-1">
                <select
                  id="university"
                  name="university"
                  required
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select your university</option>
                  <option value="University of Nigeria, Nsukka">University of Nigeria, Nsukka</option>
                  <option value="University of Ibadan">University of Ibadan</option>
                  <option value="University of Lagos">University of Lagos</option>
                  <option value="Ahmadu Bello University">Ahmadu Bello University</option>
                  <option value="University of Benin">University of Benin</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                Student ID
              </label>
              <div className="mt-1">
                <input
                  id="studentId"
                  name="studentId"
                  type="text"
                  required
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm password
            </label>
            <div className="mt-1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <AnimatedItem>
            <div>
              <AnimatedButton
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent py-3 px-4 text-sm font-medium"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </AnimatedButton>
            </div>
          </AnimatedItem>
        </form>
      </StaggeredContainer>
    </PageWrapper>
  );
}
