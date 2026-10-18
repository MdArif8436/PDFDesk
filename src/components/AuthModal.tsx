import React, { useState } from 'react';
import { X, Fingerprint, Mail, Shield, CheckCircle2, Lock } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (email: string, authMethod: 'password' | 'biometric') => void;
  currentUserEmail?: string;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onLoginSuccess,
  currentUserEmail,
  onLogout
}) => {
  const [email, setEmail] = useState('');
  const [isBiometricPending, setIsBiometricPending] = useState(false);

  const handleBiometricLogin = () => {
    setIsBiometricPending(true);
    // Simulate biometric / WebAuthn passkey touch
    setTimeout(() => {
      setIsBiometricPending(false);
      onLoginSuccess('user.biometric@fileforge.internal', 'biometric');
      onClose();
    }, 1200);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) {
      onLoginSuccess(email, 'password');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        {currentUserEmail ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Account</h3>
              <p className="text-xs text-slate-500 font-mono mt-1">{currentUserEmail}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Plan Tier:</span>
                <span className="font-bold text-rose-600">Enterprise Pro</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">AI Tokens Remaining:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">5,000 Credits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Processing Region:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">US-Central (Fastest)</span>
              </div>
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl border border-red-200 dark:border-red-900 text-red-600 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 mx-auto flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Sign In to FileForge
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Access unlimited multi-file batch processing and AI credits.
              </p>
            </div>

            {/* Biometric / Passkey One-Tap Option */}
            <div>
              <button
                onClick={handleBiometricLogin}
                disabled={isBiometricPending}
                className="w-full py-3 px-4 rounded-xl border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 hover:bg-rose-100/60 dark:hover:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-sm"
              >
                <Fingerprint className={`w-5 h-5 ${isBiometricPending ? 'animate-pulse text-rose-600' : ''}`} />
                <span>{isBiometricPending ? 'Touch sensor or scan Face ID...' : 'Sign in with Biometrics / Touch ID'}</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-white dark:bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold absolute">
                or continue with email
              </span>
            </div>

            {/* Email form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                Continue with Passwordless Email
              </button>
            </form>

            <div className="text-center text-[10px] text-slate-400">
              By signing in, you agree to the 2-hour ephemeral document retention policy.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
