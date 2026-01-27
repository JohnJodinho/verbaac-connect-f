import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  MapPin, 
  Clock, 
  LogOut, 
  Shield,
  MoreHorizontal,
  AlertTriangle
} from 'lucide-react';
import type { UserSession } from '@/types';

// Mock data for demonstration
const mockSessions: UserSession[] = [
  {
    id: '1',
    deviceName: 'Chrome on Windows',
    deviceType: 'desktop',
    location: 'Jos, Nigeria',
    ipAddress: '102.89.xx.xxx',
    browser: 'Chrome 120',
    loginAt: new Date().toISOString(),
    isCurrent: true,
  },
  {
    id: '2',
    deviceName: 'Safari on iPhone',
    deviceType: 'mobile',
    location: 'Lagos, Nigeria',
    ipAddress: '105.113.xx.xxx',
    browser: 'Safari 17',
    loginAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    isCurrent: false,
  },
  {
    id: '3',
    deviceName: 'Firefox on MacBook',
    deviceType: 'desktop',
    location: 'Abuja, Nigeria',
    ipAddress: '41.190.xx.xxx',
    browser: 'Firefox 121',
    loginAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    isCurrent: false,
  },
];

const getDeviceIcon = (type: UserSession['deviceType']) => {
  switch (type) {
    case 'mobile':
      return Smartphone;
    case 'tablet':
      return Tablet;
    default:
      return Monitor;
  }
};

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

/**
 * Session List Component
 * Displays active sessions with device info, location, and revoke actions.
 */
export function SessionList() {
  const [sessions, setSessions] = useState<UserSession[]>(mockSessions);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [showRevokeAllConfirm, setShowRevokeAllConfirm] = useState(false);

  const handleRevokeSession = async (id: string) => {
    setRevokingId(id);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeAll = async () => {
    setRevokingId('all');
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSessions((prev) => prev.filter((s) => s.isCurrent));
      setShowRevokeAllConfirm(false);
    } finally {
      setRevokingId(null);
    }
  };

  const otherSessions = sessions.filter((s) => !s.isCurrent);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card rounded-xl border border-border p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Active Sessions</h3>
            <p className="text-sm text-muted-foreground">
              {sessions.length} device{sessions.length > 1 ? 's' : ''} logged in
            </p>
          </div>
        </div>

        {otherSessions.length > 0 && (
          <button
            onClick={() => setShowRevokeAllConfirm(true)}
            className="text-sm text-destructive hover:text-destructive/80 font-medium transition-colors"
          >
            Revoke All Others
          </button>
        )}
      </div>

      {/* Session List */}
      <div className="space-y-3">
        {sessions.map((session) => {
          const DeviceIcon = getDeviceIcon(session.deviceType);
          const isExpanded = expandedSession === session.id;

          return (
            <motion.div
              key={session.id}
              layout
              className={`border rounded-lg overflow-hidden transition-colors ${
                session.isCurrent 
                  ? 'border-primary/30 bg-primary/5' 
                  : 'border-border hover:border-border/80'
              }`}
            >
              <div
                className="p-4 flex items-center gap-4 cursor-pointer"
                onClick={() => setExpandedSession(isExpanded ? null : session.id)}
              >
                {/* Device Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  session.isCurrent ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  <DeviceIcon className={`w-5 h-5 ${
                    session.isCurrent ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                </div>

                {/* Session Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground truncate">
                      {session.deviceName}
                    </span>
                    {session.isCurrent && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {session.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(session.loginAt)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border"
                  >
                    <div className="p-4 space-y-3 bg-muted/30">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">IP Address</span>
                          <p className="font-medium text-foreground">{session.ipAddress}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Browser</span>
                          <p className="font-medium text-foreground">{session.browser}</p>
                        </div>
                      </div>

                      {!session.isCurrent && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRevokeSession(session.id);
                          }}
                          disabled={revokingId === session.id}
                          className="w-full py-2 px-4 bg-destructive/10 text-destructive font-medium 
                                     rounded-lg hover:bg-destructive/20 disabled:opacity-50 
                                     transition-colors flex items-center justify-center gap-2"
                        >
                          {revokingId === session.id ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-4 h-4 border-2 border-destructive/30 border-t-destructive rounded-full"
                              />
                              Revoking...
                            </>
                          ) : (
                            <>
                              <LogOut className="w-4 h-4" />
                              Revoke Session
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Revoke All Confirmation Modal */}
      <AnimatePresence>
        {showRevokeAllConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRevokeAllConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-xl border border-border p-6 shadow-2xl max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Revoke All Sessions?</h3>
                  <p className="text-sm text-muted-foreground">
                    {otherSessions.length} other session{otherSessions.length > 1 ? 's' : ''} will be logged out
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                This will immediately log out all devices except your current one. 
                They'll need to sign in again.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRevokeAllConfirm(false)}
                  className="flex-1 py-2.5 px-4 bg-muted text-foreground font-medium rounded-lg 
                             hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRevokeAll}
                  disabled={revokingId === 'all'}
                  className="flex-1 py-2.5 px-4 bg-destructive text-destructive-foreground font-medium 
                             rounded-lg hover:bg-destructive/90 disabled:opacity-50 transition-colors
                             flex items-center justify-center gap-2"
                >
                  {revokingId === 'all' ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Revoking...
                    </>
                  ) : (
                    'Revoke All'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
