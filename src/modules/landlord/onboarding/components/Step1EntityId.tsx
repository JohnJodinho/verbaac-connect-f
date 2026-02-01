import { motion } from 'framer-motion';
import { User, Users, Building2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLandlordOnboardingStore } from '../../store/useLandlordOnboardingStore';

const ENTITIES = [
  {
    id: 'individual',
    title: 'Individual Owner',
    description: 'Private landlord managing personal property',
    icon: User,
  },
  {
    id: 'agent',
    title: 'Professional Agent',
    description: 'Authorized representative for property owners',
    icon: Users,
  },
  {
    id: 'company',
    title: 'Property Company',
    description: 'Corporate real estate or management firm',
    icon: Building2,
  },
];

export default function Step1EntityId() {
  const { data, updateData, setStep } = useLandlordOnboardingStore();
  const selectedType = data.landlordType;

  const handleSelect = (type: any) => {
    updateData({ landlordType: type });
  };

  const handleContinue = () => {
    if (selectedType) {
      setStep(2);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Entity Identification</h2>
        <p className="text-sm text-gray-500">Choose how you will be registered on Verbacc.</p>
      </div>

      <div className="space-y-4">
        {ENTITIES.map((entity) => {
          const isSelected = selectedType === entity.id;
          return (
            <button
              key={entity.id}
              onClick={() => handleSelect(entity.id)}
              className={cn(
                "w-full p-5 rounded-2xl border-2 text-left transition-all duration-300 relative overflow-hidden group",
                isSelected 
                  ? "border-role-landlord bg-role-landlord/5 shadow-md shadow-role-landlord/5" 
                  : "border-gray-100 bg-white hover:border-gray-200"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  isSelected ? "bg-role-landlord text-white" : "bg-gray-50 text-gray-400 group-hover:text-gray-500"
                )}>
                  <entity.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className={cn(
                    "font-bold transition-colors",
                    isSelected ? "text-role-landlord" : "text-gray-900"
                  )}>
                    {entity.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{entity.description}</p>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 text-role-landlord"
                  >
                    <CheckCircle2 className="w-6 h-6 fill-role-landlord text-white" />
                  </motion.div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleContinue}
        disabled={!selectedType}
        className={cn(
          "w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg",
          selectedType 
            ? "bg-role-landlord text-white shadow-role-landlord/25 active:scale-[0.98]" 
            : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
        )}
      >
        Continue to Verification
      </button>

      <p className="text-center text-[10px] text-gray-400 font-medium">
        Your entity type determines the required verification documents.
      </p>
    </div>
  );
}
