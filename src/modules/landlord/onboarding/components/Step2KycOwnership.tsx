import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Upload, 
  FileCheck, 
  X, 
  Building,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLandlordOnboardingStore } from '../../store/useLandlordOnboardingStore';

export default function Step2KycOwnership() {
  const { data, updateData, setStep } = useLandlordOnboardingStore();
  
  // Local state for UI feedback (simulating uploads)
  const [uploading, setUploading] = useState<string | null>(null);

  const handleFileUpload = (field: 'idUrl' | 'propertyProofUrl') => {
    setUploading(field);
    
    // Simulate upload delay
    setTimeout(() => {
      updateData({ [field]: `https://verbaac.storage/${field}_dummy.pdf` });
      setUploading(null);
    }, 1500);
  };

  const removeFile = (field: 'idUrl' | 'propertyProofUrl') => {
    updateData({ [field]: '' });
  };

  const canContinue = data.idUrl && data.propertyProofUrl;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">KYC & Verification</h2>
        <p className="text-sm text-gray-500">Securely upload your identity and ownership documents.</p>
      </div>

      <div className="space-y-6">
        {/* Government ID Section */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Government Issued ID</label>
          <div className={cn(
            "relative border-2 border-dashed rounded-2xl p-6 transition-all",
            data.idUrl ? "border-emerald-200 bg-emerald-50/30" : "border-gray-200 bg-gray-50 hover:bg-gray-100"
          )}>
            <AnimatePresence mode="wait">
              {data.idUrl ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">identity_document.pdf</p>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase">Ready for review</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFile('idUrl')}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-4 space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400">
                    {uploading === 'idUrl' ? (
                      <div className="w-6 h-6 border-2 border-role-landlord border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ImageIcon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-900">
                      {uploading === 'idUrl' ? "Uploading document..." : "Click to upload ID"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">NIN, Voter's Card, or Passport (Max 5MB)</p>
                  </div>
                  <button 
                    onClick={() => handleFileUpload('idUrl')}
                    disabled={!!uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Property Proof Section */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Proof of Ownership</label>
          <div className={cn(
            "relative border-2 border-dashed rounded-2xl p-6 transition-all",
            data.propertyProofUrl ? "border-emerald-200 bg-emerald-50/30" : "border-gray-200 bg-gray-50 hover:bg-gray-100"
          )}>
            <AnimatePresence mode="wait">
              {data.propertyProofUrl ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">ownership_deed.pdf</p>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase">Ready for review</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFile('propertyProofUrl')}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-4 space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400">
                    {uploading === 'propertyProofUrl' ? (
                      <div className="w-6 h-6 border-2 border-role-landlord border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-900">
                      {uploading === 'propertyProofUrl' ? "Uploading roof..." : "Proof of Ownership"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">C of O, Deed of Assignment, or Allocation</p>
                  </div>
                  <button 
                    onClick={() => handleFileUpload('propertyProofUrl')}
                    disabled={!!uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Security Note */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800 leading-relaxed font-medium">
            Your documents are encrypted and only accessible by verified Verbacc compliance officers.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => setStep(3)}
          disabled={!canContinue}
          className={cn(
            "w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg",
            canContinue 
              ? "bg-role-landlord text-white shadow-role-landlord/25 active:scale-[0.98]" 
              : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
          )}
        >
          Setup Financials
        </button>
        <button 
          onClick={() => setStep(1)}
          className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
        >
          Change Entity Type
        </button>
      </div>
    </div>
  );
}
