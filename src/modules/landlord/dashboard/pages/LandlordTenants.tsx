import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  getBookings, 
  confirmMoveIn, 
  type Booking 
} from '../../api/landlord.service';

export default function LandlordTenants() {
  const [activeTab, setActiveTab] = useState<'pending' | 'active'>('pending');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await getBookings();
      if (response.success) {
        setBookings(response.data);
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmMoveIn = async (bookingId: string) => {
    setProcessingId(bookingId);
    try {
      const response = await confirmMoveIn(bookingId);
      if (response.success) {
        // Refresh data to show updated status
        await loadBookings();
      }
    } catch (error) {
      console.error('Failed to confirm move-in:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'pending') return b.escrowStatus === 'held' || b.escrowStatus === 'pending';
    return b.escrowStatus === 'released';
  });

  return (
    <div className="space-y-6 pb-20"> {/* pb-20 for fixed mobile tabs */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Tenants & Bookings</h1>
          <p className="text-sm text-gray-500">Manage incoming students and active residents.</p>
        </div>

        {/* Search Bar - Mobile Optimized */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or booking ID..." 
            className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-role-landlord/20 focus:border-role-landlord transition-all"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100/80 rounded-2xl">
        <button
          onClick={() => setActiveTab('pending')}
          className={cn(
            "flex-1 py-2.5 text-sm font-bold rounded-xl transition-all",
            activeTab === 'pending' 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Pending Move-In
          <span className={cn(
            "ml-2 px-1.5 py-0.5 text-[10px] rounded-md",
            activeTab === 'pending' ? "bg-amber-100 text-amber-700" : "bg-gray-200 text-gray-600"
          )}>
            {bookings.filter(b => b.escrowStatus === 'held').length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={cn(
            "flex-1 py-2.5 text-sm font-bold rounded-xl transition-all",
            activeTab === 'active' 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Active Residents
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p className="text-xs font-medium">Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No {activeTab} bookings</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
            {activeTab === 'pending' 
              ? "Units awaiting student move-in will appear here." 
              : "Confirmed residents will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div 
              key={booking.id}
              className="bg-white border boundary-card rounded-2xl p-5 shadow-sm space-y-4"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-role-landlord/10 flex items-center justify-center text-role-landlord font-bold text-sm">
                    {booking.tenant.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{booking.tenant.name}</h3>
                    <p className="text-xs text-gray-500 font-medium">
                      {booking.tenant.university} • {booking.tenant.level}
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                  booking.escrowStatus === 'held' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                )}>
                  {booking.escrowStatus === 'held' ? 'Escrow Held' : 'Active'}
                </div>
              </div>

              {/* Property Details */}
              <div className="bg-gray-50 rounded-xl p-3 text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-700">{booking.listingName}</span>
                </div>
                <p className="text-xs text-gray-500 ml-6">{booking.buildingName}</p>
                <div className="flex items-center gap-2 mt-2 ml-6 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
                </div>
              </div>

              {/* Contact Info (Privacy Gate) */}
              <div className="border-t border-gray-100 pt-4">
                {booking.escrowStatus === 'released' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <a href={`tel:${booking.tenant.phoneNumber}`} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 text-gray-700 text-xs font-bold hover:bg-gray-100 transition-colors">
                      <Phone className="w-3.5 h-3.5" />
                      Call
                    </a>
                    <a href={`mailto:${booking.tenant.email}`} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 text-gray-700 text-xs font-bold hover:bg-gray-100 transition-colors">
                      <Mail className="w-3.5 h-3.5" />
                      Email
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                    <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
                    <p className="text-xs text-blue-800 font-medium leading-snug">
                      Contact details are hidden for privacy until move-in is confirmed.
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {booking.escrowStatus === 'held' && (
                <div className="pt-2">
                  <button
                    onClick={() => handleConfirmMoveIn(booking.id)}
                    disabled={!!processingId}
                    className="w-full h-12 bg-role-landlord text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-role-landlord/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {processingId === booking.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    {processingId === booking.id ? 'Releasing Funds...' : 'Confirm Move-In & Release Funds'}
                  </button>
                  <p className="text-[10px] text-center text-gray-400 mt-2">
                    Action cannot be undone. Funds will be moved to your wallet.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
