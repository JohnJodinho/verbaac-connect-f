import { motion } from 'framer-motion';
import { Users, Lock, GraduationCap, Heart, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVisibilityGate } from '@/hooks/useVisibilityGate';
import { useAuthStore } from '@/store/useAuthStore';

// Mock roommate matches for demonstration
const mockMatches = [
  {
    id: '1',
    name: 'Amina Ibrahim',
    level: '300 Level',
    department: 'Computer Science',
    compatibilityScore: 92,
    matchedPrefs: ['Non-smoker', 'Early riser', 'Quiet environment'],
    avatar: '/api/placeholder/100/100',
    zone: 'Naraguta',
  },
  {
    id: '2',
    name: 'Fatima Yusuf',
    level: '200 Level',
    department: 'Accounting',
    compatibilityScore: 87,
    matchedPrefs: ['Non-smoker', 'Clean', 'Studious'],
    avatar: '/api/placeholder/100/100',
    zone: 'Lamingo',
  },
  {
    id: '3',
    name: 'Grace Okonkwo',
    level: '300 Level',
    department: 'Medicine',
    compatibilityScore: 84,
    matchedPrefs: ['Quiet hours', 'Organized', 'Early riser'],
    avatar: '/api/placeholder/100/100',
    zone: 'Angwan Rogo',
  },
];

/**
 * Roommates - Student-only matching interface with restrictions.
 * Locked for non-students; requires valid tenant_sub_profile.
 * Matching based on global_prefs (e.g., non-smoker, same level).
 */
export default function Roommates() {
  const { canAccessRoommates, isGuest, isStudent, needsStudentVerification } = useVisibilityGate();
  const { user } = useAuthStore();

  // Locked state for non-students
  if (!canAccessRoommates) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Marketing Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-8 py-12 text-white text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6"
              >
                <Users className="h-10 w-10" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-3">Find Your Perfect Roommate</h1>
              <p className="text-lg text-white/90 max-w-md mx-auto">
                Connect with compatible students who share your lifestyle preferences
              </p>
            </div>

            {/* Lock Message */}
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                <Lock className="h-8 w-8 text-amber-600" />
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {isGuest ? 'Sign In Required' : 'Student Verification Required'}
              </h2>

              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {isGuest
                  ? 'Create an account and verify your student status to access roommate matching.'
                  : 'Verify your student status to unlock the roommate matching feature. This ensures a safe community of verified students.'}
              </p>

              {/* Features Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <FeatureCard
                  icon={Sparkles}
                  title="Smart Matching"
                  description="AI-powered compatibility scoring"
                />
                <FeatureCard
                  icon={Heart}
                  title="Lifestyle Prefs"
                  description="Match by habits & preferences"
                />
                <FeatureCard
                  icon={MapPin}
                  title="Zone-Based"
                  description="Find roommates in your area"
                />
              </div>

              {/* CTA Button */}
              <Link
                to={isGuest ? '/login' : '/dashboard/profile/verify-student'}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 
                         text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                <GraduationCap className="h-5 w-5" />
                {isGuest ? 'Sign In to Get Started' : 'Verify Student Status'}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Full access view for verified students
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Roommate Matching
              </h1>
              <p className="text-gray-600">
                Find compatible roommates based on your lifestyle preferences
              </p>
            </div>

            {/* Student Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 
                          text-white rounded-full">
              <GraduationCap className="h-4 w-4" />
              <span className="font-medium text-sm">
                {user?.studentProfile?.institution || 'Verified Student'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Update Preferences CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 
                   rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Improve Your Matches</h3>
                <p className="text-sm text-gray-600">
                  Update your preferences to get better roommate suggestions
                </p>
              </div>
            </div>
            <Link
              to="/dashboard/profile/roommate-preferences"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium 
                       text-sm rounded-lg transition-colors"
            >
              Update Preferences
            </Link>
          </div>
        </motion.div>

        {/* Matches Grid */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Your Top Matches
          </h2>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {mockMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// Helper Components
function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl text-center">
      <Icon className="h-6 w-6 text-purple-500 mx-auto mb-2" />
      <h4 className="font-medium text-gray-900 text-sm">{title}</h4>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  );
}

function MatchCard({ match }: { match: typeof mockMatches[0] }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Compatibility Score Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-4 py-3 flex items-center justify-between">
        <span className="text-white text-sm font-medium">Compatibility</span>
        <span className="text-white text-xl font-bold">{match.compatibilityScore}%</span>
      </div>

      <div className="p-5">
        {/* Profile */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={match.avatar}
            alt={match.name}
            className="w-14 h-14 rounded-full object-cover bg-gray-200"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{match.name}</h3>
            <p className="text-sm text-gray-600">{match.level} • {match.department}</p>
          </div>
        </div>

        {/* Zone */}
        <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-4">
          <MapPin className="h-4 w-4 text-teal-500" />
          <span>Looking in {match.zone}</span>
        </div>

        {/* Matched Preferences */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Matched Preferences:</p>
          <div className="flex flex-wrap gap-1.5">
            {match.matchedPrefs.map((pref) => (
              <span
                key={pref}
                className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full"
              >
                {pref}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium 
                         rounded-lg transition-colors flex items-center justify-center gap-2">
          <Heart className="h-4 w-4" />
          Send Interest
        </button>
      </div>
    </motion.div>
  );
}
