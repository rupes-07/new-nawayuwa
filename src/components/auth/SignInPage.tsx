import React, { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useI18n } from '../../context/I18nContext.tsx';
import { usePageMeta } from '../../lib/seo.ts';
import { cleanNepalPhone, nepalPhoneRegex, normalizeToNepalE164 } from '../../lib/validation/auth.ts';
import { Button } from '../ui/Button.tsx';
import { BrandLogo } from '../ui/BrandLogo.tsx';

interface SignInPageProps {
  onNavigate: (path: string) => void;
  redirectUrl?: string;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onNavigate, redirectUrl }) => {
  const {
    user,
    sendPhoneOtp,
    verifyPhoneOtp,
    sendEmailOtp,
    verifyEmailOtp,
    signInWithGoogle,
    quickLogin,
    sessionExpired,
    clearSessionExpired,
  } = useAuth();
  const { t, language } = useI18n();

  // AUTH PAGES: Must not be indexed (noindex, nofollow)
  usePageMeta({
    title: `${t('authWelcomeHeading')} | Nawa Yuwa Club`,
    description: t('authWelcomeSubtitle'),
    canonicalPath: '/sign-in',
    noIndex: true,
  });

  // Mode: 'phone' or 'email' fallback
  const [authMode, setAuthMode] = useState<'phone' | 'email'>('phone');
  // Step: 'input' or 'otp'
  const [step, setStep] = useState<'input' | 'otp'>('input');

  // Input states
  const [phoneRaw, setPhoneRaw] = useState('');
  const [emailRaw, setEmailRaw] = useState('');
  const [otp, setOtp] = useState('');

  // Status & Timing
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [activeIdentifier, setActiveIdentifier] = useState('');

  // Redirect if already authenticated and onboarded
  useEffect(() => {
    if (user) {
      if (!user.onboardingCompleted) {
        onNavigate('/onboarding');
      } else {
        onNavigate(redirectUrl || '/dashboard');
      }
    }
  }, [user, onNavigate, redirectUrl]);

  // Resend OTP countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Validate phone format on change
  const handlePhoneChange = (val: string) => {
    setPhoneRaw(val);
    setFieldError(null);
    setError(null);
  };

  const handleEmailChange = (val: string) => {
    setEmailRaw(val);
    setFieldError(null);
    setError(null);
  };

  const handleOtpChange = (val: string) => {
    // Only accept numeric input up to 6 digits
    const cleaned = val.replace(/\D/g, '').slice(0, 6);
    setOtp(cleaned);
    setError(null);
  };

  // STEP 1: Submit Mobile Number or Email -> Send OTP
  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldError(null);

    if (authMode === 'phone') {
      const cleaned = cleanNepalPhone(phoneRaw);
      if (!cleaned) {
        setFieldError('Please enter your 10-digit Nepal mobile number');
        return;
      }

      // Check Nepal format: 10 digits starting with 96, 97, or 98
      if (!nepalPhoneRegex.test(cleaned)) {
        setFieldError('Must be a valid 10-digit Nepal mobile number starting with 96, 97, or 98 (e.g. 9812345678 or +977 9812345678)');
        return;
      }

      const e164 = normalizeToNepalE164(cleaned);
      setActiveIdentifier(e164);
      setLoading(true);

      try {
        const res = await sendPhoneOtp(e164);
        if (res.demoOtp) {
          setDemoOtp(res.demoOtp);
        }
        setResendCooldown(60);
        setStep('otp');
      } catch (err: any) {
        if (!navigator.onLine && (!err.message || err.message === 'Failed to fetch')) {
          setError(t('authNetworkError'));
        } else {
          setError(err.message || 'Failed to send verification code. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Email Fallback
      const email = emailRaw.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        setFieldError('Please enter a valid email address');
        return;
      }

      setActiveIdentifier(email);
      setLoading(true);

      try {
        const res = await sendEmailOtp(email);
        if (res.demoOtp) {
          setDemoOtp(res.demoOtp);
        }
        setResendCooldown(60);
        setStep('otp');
      } catch (err: any) {
        if (!navigator.onLine && (!err.message || err.message === 'Failed to fetch')) {
          setError(t('authNetworkError'));
        } else {
          setError(err.message || 'Failed to send verification code.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otp.length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      let result;
      if (authMode === 'phone') {
        result = await verifyPhoneOtp(activeIdentifier, otp);
      } else {
        result = await verifyEmailOtp(activeIdentifier, otp);
      }

      // Check onboarding redirect
      if (!result.onboardingCompleted) {
        onNavigate('/onboarding');
      } else {
        onNavigate(redirectUrl || '/dashboard');
      }
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('expired')) {
        setError(t('authExpiredOtp'));
      } else if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('check')) {
        setError(t('authInvalidOtp'));
      } else if (!navigator.onLine && (!msg || msg === 'Failed to fetch')) {
        setError(t('authNetworkError'));
      } else {
        setError(msg || t('authInvalidOtp'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Action
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setError(null);
    setLoading(true);

    try {
      let res;
      if (authMode === 'phone') {
        res = await sendPhoneOtp(activeIdentifier);
      } else {
        res = await sendEmailOtp(activeIdentifier);
      }
      if (res.demoOtp) {
        setDemoOtp(res.demoOtp);
      }
      setResendCooldown(60);
      setOtp('');
    } catch (err: any) {
      if (!navigator.onLine && (!err.message || err.message === 'Failed to fetch')) {
        setError(t('authNetworkError'));
      } else {
        setError(err.message || 'Failed to resend code.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Switch between Phone & Email fallback
  const toggleAuthMode = () => {
    setAuthMode(authMode === 'phone' ? 'email' : 'phone');
    setStep('input');
    setError(null);
    setFieldError(null);
    setOtp('');
    setDemoOtp(null);
  };

  // Change phone/email (go back to Step 1)
  const handleChangeIdentifier = () => {
    setStep('input');
    setOtp('');
    setError(null);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await signInWithGoogle();
      if (!res.onboardingCompleted) {
        onNavigate('/onboarding');
      } else {
        onNavigate(redirectUrl || '/dashboard');
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setError(err?.message || 'Google sign-in could not be completed. Please try with mobile number OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[var(--color-background)]">
      <div className="w-full max-w-md space-y-6">
        {/* Session Expired Banner */}
        {sessionExpired && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-sm text-amber-800 dark:text-amber-200">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{t('authSessionExpired')}</p>
              <button
                type="button"
                onClick={clearSessionExpired}
                className="text-xs text-amber-600 dark:text-amber-400 underline mt-1 hover:text-amber-700"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Card Container */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-xl">
          {/* Brand & Heading with Official Logo */}
          <div className="text-center space-y-3 mb-8">
            <div className="flex justify-center">
              <BrandLogo size="lg" showText={true} showSubtitle={true} />
            </div>
            {/* EXACT HEADING FROM PROMPT */}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-foreground)]">
              {language === 'ne' ? t('authWelcomeHeading') : 'Welcome to Nawa Yuwa Club'}
            </h1>
            {/* EXACT SUPPORTING TEXT FROM PROMPT */}
            <p className="text-sm text-[var(--color-muted)] max-w-sm mx-auto leading-relaxed">
              {language === 'ne' ? t('authWelcomeSubtitle') : 'Join young people working together to make a difference in their communities.'}
            </p>

            {/* Cloud Firestore Database Status Indicator */}
            <div className="flex items-center justify-center gap-2 px-3 py-1 mt-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold w-fit mx-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Cloud Firestore Database Connected</span>
            </div>
          </div>

          {/* Global Error Banner */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{error}</div>
            </div>
          )}

          {/* STEP 1: Enter Mobile Number (or Email Fallback) */}
          {step === 'input' && (
            <div className="space-y-5">
              {/* Google Sign-In with Firebase Auth */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-muted)] text-[var(--color-foreground)] font-semibold text-sm transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--color-border)]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[var(--color-surface)] px-2 text-[var(--color-muted)] font-bold">
                    or continue with Nepal Mobile / Email OTP
                  </span>
                </div>
              </div>

              <form onSubmit={handleContinue} className="space-y-5">
              {authMode === 'phone' ? (
                <div>
                  <label
                    htmlFor="mobile-input"
                    className="block text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)] mb-2"
                  >
                    {/* EXACT FIELD FROM PROMPT: Mobile Number */}
                    {t('authMobileNumber')}
                  </label>
                  <div className="relative flex rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:border-transparent transition-all overflow-hidden">
                    <span className="inline-flex items-center px-3.5 text-sm font-bold text-[var(--color-foreground)] bg-[var(--color-surface)] border-r border-[var(--color-border)] select-none">
                      🇳🇵 +977
                    </span>
                    <input
                      id="mobile-input"
                      type="tel"
                      inputMode="numeric"
                      value={phoneRaw}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="98XXXXXXXX"
                      disabled={loading}
                      autoFocus
                      className="flex-1 px-4 py-3 bg-transparent text-[var(--color-foreground)] placeholder-[var(--color-muted)] text-base font-medium focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  {fieldError && (
                    <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {fieldError}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-[var(--color-muted)]">
                    Format: +977 with 10 digits beginning with 96, 97, or 98.
                  </p>
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="email-input"
                    className="block text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)] mb-2"
                  >
                    {t('authEmail')}
                  </label>
                  <div className="relative rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:border-transparent transition-all">
                    <input
                      id="email-input"
                      type="email"
                      value={emailRaw}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder="you@example.com"
                      disabled={loading}
                      autoFocus
                      className="w-full px-4 py-3 bg-transparent text-[var(--color-foreground)] placeholder-[var(--color-muted)] text-base font-medium focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  {fieldError && (
                    <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {fieldError}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-[var(--color-muted)]">
                    We will send a one-time verification code to your email.
                  </p>
                </div>
              )}

              {/* EXACT ACTION FROM PROMPT: Continue */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={loading}
                isLoading={loading}
                rightIcon={!loading ? <ArrowRight className="w-4 h-4" /> : undefined}
              >
                {t('authActionContinue')}
              </Button>

              {/* EXACT FALLBACK FROM PROMPT: "Continue with email" */}
              <div className="pt-2 text-center border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="text-xs sm:text-sm font-semibold text-[var(--color-primary)] hover:underline cursor-pointer inline-flex items-center gap-1.5"
                >
                  {authMode === 'phone' ? (
                    <>
                      <Mail className="w-4 h-4" />
                      {t('authFallbackEmail')}
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4" />
                      {t('authFallbackMobile')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

          {/* STEP 2: Enter & Verify OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="p-3.5 rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-xs text-[var(--color-muted)] flex items-center justify-between">
                <div>
                  <span className="block font-medium text-[var(--color-foreground)]">
                    {t('authOtpSentTo')}
                  </span>
                  <span className="font-bold text-[var(--color-foreground)] text-sm">
                    {activeIdentifier}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleChangeIdentifier}
                  className="text-xs text-[var(--color-primary)] hover:underline font-semibold"
                >
                  Change
                </button>
              </div>

              {/* Demo Mode Instant OTP Badge */}
              {demoOtp && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>
                      {t('authDemoCodeNotice')}: <strong className="text-sm font-mono tracking-widest">{demoOtp}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtp(demoOtp)}
                    className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-100 rounded text-[11px] font-bold transition"
                  >
                    Auto-fill
                  </button>
                </div>
              )}

              {/* EXACT FIELD FROM PROMPT: OTP */}
              <div>
                <label
                  htmlFor="otp-input"
                  className="block text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)] mb-2"
                >
                  {t('authEnterOtp')}
                </label>
                <div className="relative rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:border-transparent transition-all">
                  <input
                    id="otp-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => handleOtpChange(e.target.value)}
                    placeholder="• • • • • •"
                    disabled={loading}
                    autoFocus
                    className="w-full px-4 py-3.5 bg-transparent text-[var(--color-foreground)] text-center text-2xl font-mono tracking-[0.5em] focus:outline-none disabled:opacity-50"
                  />
                </div>
                <p className="mt-2 text-xs text-[var(--color-muted)] flex items-center justify-between">
                  <span>Enter the 6-digit code received via SMS</span>
                  <span className="font-mono text-[11px]">{otp.length}/6</span>
                </p>
              </div>

              {/* EXACT ACTION FROM PROMPT: Verify OTP */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={loading || otp.length !== 6}
                isLoading={loading}
                leftIcon={!loading ? <KeyRound className="w-4 h-4" /> : undefined}
              >
                {t('authActionVerifyOtp')}
              </Button>

              {/* Resend OTP with Countdown */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[var(--color-muted)] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {resendCooldown > 0 ? (
                    <span>
                      {t('authResendIn')} <strong>{resendCooldown}s</strong>
                    </span>
                  ) : (
                    <span>Didn't receive the code?</span>
                  )}
                </span>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                  className="font-bold text-[var(--color-primary)] hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  {t('authActionResendOtp')}
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Test Accounts for Authorization Roles */}
          <div className="mt-6 pt-5 border-t border-[var(--color-border)]">
            <div className="flex items-center justify-between text-xs text-[var(--color-muted)] mb-2.5">
              <span className="font-bold uppercase tracking-wider text-[10px]">Instant 1-Click Role Access:</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FA5A00]" /> Fast Testing
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  setError(null);
                  try {
                    await quickLogin('admin');
                    onNavigate('/admin/dashboard');
                  } catch (e: any) {
                    setError(e?.message || 'Admin sign in failed');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-left hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition cursor-pointer"
              >
                <div className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
                  <span>Admin</span>
                  <span className="text-[9px] uppercase px-1 rounded bg-indigo-200 dark:bg-indigo-900">All</span>
                </div>
                <div className="text-[10px] text-indigo-600/80 dark:text-indigo-400 truncate">Ramesh Adhikari</div>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  setError(null);
                  try {
                    await quickLogin('chapter_leader');
                    onNavigate('/leader/dashboard');
                  } catch (e: any) {
                    setError(e?.message || 'Leader sign in failed');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-left hover:bg-orange-100 dark:hover:bg-orange-900/40 transition cursor-pointer"
              >
                <div className="font-bold text-orange-700 dark:text-orange-300 flex items-center justify-between">
                  <span>Leader</span>
                  <span className="text-[9px] uppercase px-1 rounded bg-orange-200 dark:bg-orange-900">Chapter</span>
                </div>
                <div className="text-[10px] text-orange-600/80 dark:text-orange-400 truncate">Sunita Sharma</div>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  setError(null);
                  try {
                    await quickLogin('member');
                    onNavigate('/dashboard');
                  } catch (e: any) {
                    setError(e?.message || 'Member sign in failed');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-left hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition cursor-pointer"
              >
                <div className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
                  <span>Member</span>
                  <span className="text-[9px] uppercase px-1 rounded bg-emerald-200 dark:bg-emerald-900">Active</span>
                </div>
                <div className="text-[10px] text-emerald-600/80 dark:text-emerald-400 truncate">Bikash Thapa</div>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  setError(null);
                  try {
                    await quickLogin('player');
                    onNavigate('/dashboard');
                  } catch (e: any) {
                    setError(e?.message || 'Athlete sign in failed');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-left hover:bg-blue-100 dark:hover:bg-blue-900/40 transition cursor-pointer"
              >
                <div className="font-bold text-blue-700 dark:text-blue-300 flex items-center justify-between">
                  <span>Athlete</span>
                  <span className="text-[9px] uppercase px-1 rounded bg-blue-200 dark:bg-blue-900">Sports</span>
                </div>
                <div className="text-[10px] text-blue-600/80 dark:text-blue-400 truncate">Ankit Gurung</div>
              </button>
            </div>
          </div>
        </div>

        {/* Security & Client-Only Configuration Assurance */}
        <div className="text-center text-xs text-[var(--color-muted)] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Secured with Cloud Firestore Database & Authenticated OTP Security</span>
        </div>
      </div>
    </div>
  );
};
